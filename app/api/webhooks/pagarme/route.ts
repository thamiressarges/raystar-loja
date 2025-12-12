import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendPaymentConfirmedEmail } from "@/services/email";

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

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    const signature = request.headers.get('pagarme-signature');
    if (signature) {
      const secret = process.env.PAGARME_SECRET_KEY!;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
         return NextResponse.json({ message: "Assinatura inválida" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);

    if (body.type === 'order.paid' || body.type === 'charge.paid') {
      const pagarmeOrder = body.data;
      const orderId = pagarmeOrder.code; 

      if (orderId) {
        const { data: currentOrder } = await supabaseAdmin
          .from('orders')
          .select('status, client_id')
          .eq('id', orderId)
          .single();

        if (currentOrder && currentOrder.status !== 'pagamento_confirmado' && currentOrder.status !== 'pago') {
            const { error: orderError } = await supabaseAdmin
            .from('orders')
            .update({ status: 'pagamento_confirmado' }) 
            .eq('id', orderId);

            if (orderError) {
                return NextResponse.json({ message: "Erro ao atualizar pedido" }, { status: 500 });
            }

            await supabaseAdmin
            .from('payments')
            .update({ status: 'pago' }) 
            .eq('order_id', orderId);

            if (currentOrder.client_id) {
                const { data: user } = await supabaseAdmin
                    .from('users')
                    .select('name, email')
                    .eq('uid', currentOrder.client_id)
                    .single();
                
                if (user && user.email) {
                    await sendPaymentConfirmedEmail(user.email, user.name || 'Cliente', orderId);
                }
            }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}