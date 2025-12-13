import { createSupabaseServerClient } from "@/lib/server";

interface ShippingResult {
  price: number;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export async function calculateShippingService(cep: string): Promise<ShippingResult | null> {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    const address = {
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: cleanCep
    };

    const supabase = await createSupabaseServerClient();
    
    const { data: rule } = await supabase
      .from("shipping_rules")
      .select("price")
      .eq("neighborhood", address.neighborhood)
      .eq("active", true)
      .single();

    if (!rule) {
      throw new Error(`Não entregamos no bairro ${address.neighborhood} ainda.`);
    }

    return {
      address,
      price: Number(rule.price)
    };

  } catch (error) {
    throw error;
  }
}