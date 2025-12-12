import { createSupabaseServerClient } from '@/lib/server';
import { UserDetails, Order } from '@/types';
import { notFound } from 'next/navigation';

export async function getUserDetails(): Promise<UserDetails> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data } = await supabase.from('users').select('*').eq('uid', user.id).single();
  if (!data) notFound();

  return {
    uid: data.uid,
    name: data.name,
    email: user.email!,
    cpf: data.cpf,
    phone: data.phone,
    birth_date: data.birth_date,
    address: data.address 
  };
}

export async function getUserOrders(page: number = 1, limit: number = 10) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: [], totalPages: 0 };

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  
  const { data: rawOrders, count, error } = await supabase
    .from('orders')
    .select(`
      id, created_at, status, total_amount,
      payments!payments_order_id_fkey ( id, status, value, form, installments, payload ),
      deliveries!deliveries_order_id_fkey ( id, status, cost, deadline_days, tracking_code, type, address ),
      order_items ( id, quantity, unit_price, total_price, variation_id, products ( title, photos ) ),
      users!orders_client_id_fkey ( address )
    `, { count: 'exact' })
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Erro ao buscar pedidos:", error.message);
    return { data: [], totalPages: 0 };
  }

  if (!rawOrders) return { data: [], totalPages: 0 };

  const formattedOrders: Order[] = rawOrders.map((o: any) => {
    const payment = Array.isArray(o.payments) ? o.payments[0] : o.payments;
    const delivery = Array.isArray(o.deliveries) ? o.deliveries[0] : o.deliveries;
    const clientData = Array.isArray(o.users) ? o.users[0] : o.users; 
    
    const finalAddress = delivery?.address || clientData?.address;

    return {
      id: o.id,
      client_id: user.id,
      status: o.status,
      created_at: o.created_at,
      total_amount: o.total_amount ?? payment?.value ?? 0,
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        method: payment.form,
        value: payment.value,
        installments: payment.installments,
        payload: payment.payload
      } : undefined,
      delivery: delivery ? {
        id: delivery.id,
        status: delivery.status,
        cost: delivery.cost,
        tracking_code: delivery.tracking_code,
        type: delivery.type,
        deadline_days: delivery.deadline_days,
        address: finalAddress 
      } : undefined,
      items: (o.order_items || []).map((item: any) => ({
        id: item.id,
        order_id: o.id,
        product_id: item.products?.id, 
        variation_id: item.variation_id, 
        name: item.products?.title || 'Produto Removido',
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        image: item.products?.photos?.[0]
      }))
    };
  });

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return { data: formattedOrders, totalPages };
}