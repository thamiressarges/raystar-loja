'use server';

import { calculateShippingService } from "@/services/shipping";

export async function calculateShipping(cep: string) {
  try {
    const result = await calculateShippingService(cep);
    if (!result) {
      return { success: false, error: "CEP não encontrado ou fora da área." };
    }
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}