import { createSupabaseServerClient } from '@/lib/server';
import { StoreInfo } from '@/types';

export async function getStoreInfo(): Promise<StoreInfo | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("stores")
    .select("id, email, phones, address, social_media") 
    .limit(1); 

  if (error || !data || data.length === 0) return null;
  
  const rawData = data[0]; 
  const rawAddr = rawData.address || {}; 

  
  let city = rawAddr.city || rawAddr.cidade || "";
  let state = rawAddr.state || rawAddr.uf || rawAddr.UF || rawAddr.estado || "";
  const zip = rawAddr.zip || rawAddr.cep || rawAddr.zipCode || "";
  let street = rawAddr.street || rawAddr.rua || "";
  let neighborhood = rawAddr.neighborhood || rawAddr.bairro || "";
  const number = rawAddr.number || rawAddr.numero || "";

  
  if ((!city || !state) && zip) {
    try {
      const cleanCep = zip.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        
        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`, { 
            next: { revalidate: 3600 } 
        });

        if (response.ok) {
            const addressData = await response.json();
            
            
            if (!city) city = addressData.city;
            if (!state) state = addressData.state;
            if (!street) street = addressData.street;
            if (!neighborhood) neighborhood = addressData.neighborhood;
        }
      }
    } catch (err) {
      console.error("Erro ao buscar CEP na BrasilAPI:", err);
      
    }
  }

  const normalizedAddress = {
    street,
    number,
    neighborhood,
    city, 
    state,
    zip
  };

  if (rawData.social_media && 'Instagram' in rawData.social_media) {
    rawData.social_media.instagram = rawData.social_media.Instagram;
  }

  return {
    ...rawData,
    address: normalizedAddress
  } as StoreInfo;
}