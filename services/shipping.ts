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
    const viaCep = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await viaCep.json();

    if (data.erro) return null;

    const address = {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
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
      throw new Error("Não entregamos nesse bairro ainda.");
    }

    return {
      address,
      price: Number(rule.price)
    };

  } catch (error) {
    console.error(error);
    throw error;
  }
}