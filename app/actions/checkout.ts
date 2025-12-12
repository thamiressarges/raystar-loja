'use server';

import { createSupabaseServerClient } from "@/lib/server";
import { createClient } from "@supabase/supabase-js";
import { createPagarmeTransaction, buildPagarmePayload } from "@/services/pagarme";
import { checkoutSchema } from "@/lib/schemas";
import { calculateShippingService } from "@/services/shipping";
import { CheckoutState } from "@/types";
import { sendOrderCreatedEmail } from "@/services/email";
import crypto from 'crypto';

export async function processCheckout(prevState: CheckoutState, formData: any): Promise<CheckoutState> {
  const supabase = await createSupabaseServerClient();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const parsed = checkoutSchema.safeParse(formData);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0].message;
      return { success: false, message: `Dados inválidos: ${firstError}` };
    }

    const { userId, items, shipping, paymentMethod, customer, card } = parsed.data;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) { return { success: false, message: "Usuário não autenticado." }; }

    const { data: userRow } = await supabaseAdmin.from("users").select("phone").eq("uid", userId).single();
    let phoneObject = null;
    if (userRow?.phone) {
      const raw = userRow.phone.replace(/\D/g, "");
      if (raw.length >= 10) {
        phoneObject = {
          country_code: "55",
          area_code: raw.substring(0, 2),
          number: raw.substring(2)
        };
      }
    }
    if (!phoneObject) { return { success: false, message: "Telefone inválido ou não cadastrado no perfil." }; }

    const variationIds = items.filter(i => i.id !== i.product_id && i.id).map(i => i.id);
    const productIds = items.map(i => i.product_id);
    const [{ data: dbProducts }, { data: dbVariations }] = await Promise.all([
      supabaseAdmin.from('products').select('id, price, title').in('id', productIds),
      variationIds.length > 0 ? supabaseAdmin.from('variations').select('id, price, product_id').in('id', variationIds) : Promise.resolve({ data: [] })
    ]);

    let calculatedTotalItems = 0;
    const validatedItems = items.map(item => {
      let realPrice = 0; let realTitle = item.name;
      const variation = dbVariations?.find((v: any) => v.id === item.id);
      if (variation) { realPrice = Number(variation.price); } else {
        const product = dbProducts?.find((p: any) => p.id === item.product_id);
        if (!product) throw new Error(`Produto não encontrado.`);
        realPrice = Number(product.price); realTitle = product.title;
      }
      calculatedTotalItems += realPrice * item.quantity;
      return { ...item, price: realPrice, name: realTitle };
    });

    let serverShippingCost = 0;
    const isPickup = shipping.isPickup === true || shipping.method === 'pickup';
    if (!isPickup) {
      if (!shipping.address?.zipCode) throw new Error("CEP obrigatório.");
      const shippingResult = await calculateShippingService(shipping.address.zipCode);
      if (!shippingResult) throw new Error("Erro ao calcular frete.");
      serverShippingCost = shippingResult.price;
    }
    const finalTotal = calculatedTotalItems + serverShippingCost;
    const validatedShipping = { ...shipping, cost: serverShippingCost };

    const rpcItems = validatedItems.map(item => ({
      id: item.id, quantity: item.quantity, is_variation: item.id !== item.product_id, name: item.name
    }));
    const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', { items: rpcItems });
    if (stockError) return { success: false, message: `Estoque indisponível: ${stockError.message}` };

    const generatedOrderId = crypto.randomUUID();

    try {
      const payload = buildPagarmePayload({
        orderId: generatedOrderId,
        customer: { ...customer, phoneObject },
        items: validatedItems,
        shipping: validatedShipping,
        paymentMethod,
        card
      });

      const transaction = await createPagarmeTransaction(payload);

      if (!transaction || !transaction.id) {
        throw new Error("Falha ao comunicar com gateway de pagamento.");
      }

      const charge = transaction.charges?.[0];
      const lastTrans = charge?.last_transaction;

      const { error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          id: generatedOrderId,
          client_id: userId,
          status: "aguardando_pagamento",
          total_amount: finalTotal
        });

      if (orderError) {
        throw new Error(`Erro ao salvar pedido: ${orderError.message}`);
      }

      const { data: deliveryData } = await supabaseAdmin
        .from("deliveries")
        .insert({
          order_id: generatedOrderId,
          status: "aguardando_confirmacao",
          cost: serverShippingCost,
          type: isPickup ? "pickup" : "delivery",
          address: isPickup ? null : validatedShipping.address
        })
        .select().single();

      let dbStatus = 'aguardando_pagamento';
      if (charge?.status === 'paid') dbStatus = 'pago';
      if (charge?.status === 'failed') dbStatus = 'falhou';
      let dbForm = paymentMethod === 'card' ? 'cartao' : paymentMethod;

      const { data: paymentData } = await supabaseAdmin
        .from("payments")
        .insert({
          order_id: generatedOrderId,
          form: dbForm,
          status: dbStatus,
          value: finalTotal,
          gateway_id: transaction.id,
          installments: paymentMethod === 'card' ? (Number(card?.installments) || 1) : 1,
          payload: {
            pix_qr_code: lastTrans?.qr_code,
            pix_qr_code_url: lastTrans?.qr_code_url,
            boleto_url: lastTrans?.url,
            boleto_barcode: lastTrans?.line
          }
        })
        .select().single();

      await supabaseAdmin.from("orders").update({
        delivery_id: deliveryData?.id,
        payment_id: paymentData?.id
      }).eq("id", generatedOrderId);

      const dbItemsPayload = validatedItems.map((item) => ({
        order_id: generatedOrderId,
        product_id: item.product_id,
        variation_id: item.id !== item.product_id ? item.id : null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      await supabaseAdmin.from("order_items").insert(dbItemsPayload);

      await sendOrderCreatedEmail({
        to: customer.email,
        name: customer.name,
        orderId: generatedOrderId,
        total: finalTotal,
        paymentMethod,
        pixCode: lastTrans?.qr_code,
        boletoUrl: lastTrans?.url
      });

      const { data: admins } = await supabaseAdmin
        .from('users')
        .select('email')
        .overlaps('permissions', ['admin', 'super_admin']);

      if (admins && admins.length > 0) {
        const adminEmails = admins.map(a => a.email).filter(Boolean);
        
        for (const email of adminEmails) {
            await sendOrderCreatedEmail({
                to: email,
                name: "Administrador",
                orderId: generatedOrderId,
                total: finalTotal,
                paymentMethod,
            });
        }
      }

      return {
        success: true,
        orderId: generatedOrderId,
        pix: paymentMethod === 'pix' ? { qr_code: lastTrans?.qr_code, qr_code_url: lastTrans?.qr_code_url } : undefined,
        boleto: paymentMethod === 'boleto' ? { url: lastTrans?.url, barcode: lastTrans?.line } : undefined
      };

    } catch (error: any) {
      await supabaseAdmin.rpc('increment_stock', { items: rpcItems });
      return { success: false, message: error.message || "Erro no pedido." };
    }

  } catch (error: any) {
    return { success: false, message: error.message || "Erro no processamento." };
  }
}