'use server';

export async function geocodeAddress(query: string) {
  if (!query) return { success: false, error: "Query vazia" };

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;
    
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RayStar-App/1.0"
      },
      next: { revalidate: 86400 } 
    });

    if (!res.ok) {
      return { success: false, error: "Falha ao buscar endereço" };
    }

    const data = await res.json();
    return { success: true, data };
    
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}