import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderDispatchedEmail } from "@/services/email";

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
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID obrigatório" }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id, 
        client_id,
        users (name, email),
        deliveries (tracking_code)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order || !order.users) {
      return NextResponse.json({ message: "Pedido ou cliente não encontrado" }, { status: 404 });
    }

    const client = order.users as any;
    const delivery = Array.isArray(order.deliveries) ? order.deliveries[0] : order.deliveries;
    const trackingCode = delivery?.tracking_code;

    await sendOrderDispatchedEmail(client.email, client.name, order.id, trackingCode);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}