'use server'; 

import { createSupabaseServerClient } from '@/lib/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateProfileSchema, updatePasswordSchema } from '@/lib/schemas';

export async function updateUserDetails(formData: any) { 
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const parsed = updateProfileSchema.safeParse(formData);
  
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  
  const updates = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('uid', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/conta');
  return { success: true, message: "Dados atualizados!" };
}

export async function updateUserPassword(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = updatePasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { newPassword } = parsed.data;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Senha alterada com sucesso!" };
}

export async function deleteAccountAction(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Não autenticado." };

    const passwordConfirm = formData.get('passwordConfirm') as string;
    if (!passwordConfirm) return { success: false, error: "Senha necessária para confirmação." };

    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: passwordConfirm
    });

    if (loginError) {
        return { success: false, error: "Senha incorreta." };
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
        return { success: false, error: "Erro ao excluir conta. Tente novamente." };
    }

    await supabase.auth.signOut();
    redirect('/');
}