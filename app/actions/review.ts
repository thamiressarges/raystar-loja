'use server';

import { createSupabaseServerClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { reviewSchema } from '@/lib/schemas';

export interface FormState {
  status: 'success' | 'error' | 'idle';
  message: string;
}

export async function submitReview(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { status: 'error', message: 'Faça login para avaliar.' };
  }

  const rawData = {
    productId: formData.get('productId'),
    rating: formData.get('rating'),
    title: formData.get('title'),
    text: formData.get('text'),
  };

  const parsed = reviewSchema.safeParse(rawData);

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const { productId, rating, title, text } = parsed.data;

  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('client_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    return { status: 'error', message: 'Você já avaliou este produto.' };
  }

  const { error } = await supabase.from('reviews').insert({
    client_id: user.id,
    product_id: productId,
    rating,
    title,
    text,
  });

  if (error) {
    console.error(error);
    return { status: 'error', message: 'Erro ao salvar avaliação.' };
  }

  revalidatePath(`/produto/${productId}`);
  return { status: 'success', message: 'Avaliação enviada!' };
}

export async function deleteReview(reviewId: string, productId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Não autorizado" };

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('client_id', user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/produto/${productId}`);
  return { success: true, message: "Avaliação excluída." };
}

export async function updateReview(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { status: 'error', message: "Não autorizado" };

  const reviewId = formData.get('reviewId') as string;
  
  const rawData = {
    productId: formData.get('productId'),
    rating: formData.get('rating'),
    title: formData.get('title'),
    text: formData.get('text'),
  };

  const parsed = reviewSchema.safeParse(rawData);

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const { productId, rating, title, text } = parsed.data;

  const { error } = await supabase
    .from('reviews')
    .update({ rating, title, text, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .eq('client_id', user.id);

  if (error) return { status: 'error', message: "Erro ao atualizar." };

  revalidatePath(`/produto/${productId}`);
  return { status: 'success', message: "Avaliação atualizada!" };
}