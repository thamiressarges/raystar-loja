'use server';

import { createSupabaseServerClient } from "@/lib/server";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type AuthState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const data = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: "E-mail ou senha incorretos." };
  }

  revalidatePath('/');
  return { success: true, message: "Login realizado com sucesso!" };
}

export async function registerAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const data = Object.fromEntries(formData);
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password, name } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, permissions: ['cliente'] }
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Conta criada! Verifique seu e-mail para confirmar." };
}

export async function resetPasswordAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const supabase = await createSupabaseServerClient();
  const origin = (await headers()).get("origin");

  if (!email || !email.includes("@")) {
    return { success: false, message: "Digite um e-mail válido." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/conta`,
  });

  if (error) {
    if (error.message.includes("Rate limit")) {
         return { success: false, message: "Muitas tentativas. Aguarde um pouco." };
    }
  }

  return {
    success: true,
    message: "Se o e-mail existir, você receberá um link de recuperação em instantes."
  };
}