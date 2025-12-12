'use client';

import { useState, useEffect, useActionState } from 'react'; 
import { Mail, Lock, User, X, Loader2, ArrowLeft } from 'lucide-react';
import { useUI } from '@/lib/contexts/UiContext';
import { toast } from 'react-toastify';
import { useFormStatus } from 'react-dom'; 
import { loginAction, registerAction, resetPasswordAction } from '@/app/actions/auth';

const initialState = { success: false, message: '' };

type AuthView = 'login' | 'register' | 'forgot';

function SubmitButton({ view }: { view: AuthView }) {
  const { pending } = useFormStatus();

  let label = 'Entrar';
  if (view === 'register') label = 'Criar Conta';
  if (view === 'forgot') label = 'Enviar Link';

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 p-3 cursor-pointer flex h-12 w-full items-center justify-center rounded-full bg-black text-white font-bold hover:bg-gray-800 transition disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin" size={20} /> : label}
    </button>
  );
}

export default function LoginSideMenu() {
  const { isAuthMenuOpen, setIsAuthMenuOpen } = useUI();
  const [currentView, setCurrentView] = useState<AuthView>('login');

  
  const [loginState, loginDispatch] = useActionState(loginAction, initialState);
  const [registerState, registerDispatch] = useActionState(registerAction, initialState);
  const [resetState, resetDispatch] = useActionState(resetPasswordAction, initialState);

  let state = loginState;
  let dispatch = loginDispatch;

  if (currentView === 'register') {
    state = registerState;
    dispatch = registerDispatch;
  } else if (currentView === 'forgot') {
    state = resetState;
    dispatch = resetDispatch;
  }

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        if (currentView === 'login') setIsAuthMenuOpen(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, currentView, setIsAuthMenuOpen]);

  useEffect(() => {
    if (isAuthMenuOpen) setCurrentView('login');
  }, [isAuthMenuOpen]);

  const getTitle = () => {
    if (currentView === 'login') return 'Bem-vindo de volta!';
    if (currentView === 'register') return 'Crie sua conta';
    return 'Recuperar Senha';
  };

  const getSubtitle = () => {
    if (currentView === 'login') return 'Faça login para continuar';
    if (currentView === 'register') return 'Cadastre-se para começar';
    return 'Digite seu e-mail para receber um link de redefinição';
  };

  return (
    <div className={`fixed inset-0 z-50 ${isAuthMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

      <div onClick={() => setIsAuthMenuOpen(false)} className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${isAuthMenuOpen ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAuthMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>

        <div className="flex h-full flex-col">
          <div className="relative bg-black p-8 text-center text-white">
            <button onClick={() => setIsAuthMenuOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>

            {currentView !== 'login' && (
                <button onClick={() => setCurrentView('login')} className="absolute top-4 left-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm">
                    <ArrowLeft size={16} /> Voltar
                </button>
            )}

            <h1 className="text-2xl font-bold mt-2">{getTitle()}</h1>
            <p className="text-sm text-gray-300">{getSubtitle()}</p>
          </div>

          <form action={dispatch} className="flex-1 overflow-y-auto p-8 flex flex-col gap-5">

            {currentView === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><User size={18} className="text-gray-400" /></span>
                  <input name="name" type="text" placeholder="Seu nome" className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 focus:ring-black outline-none focus:border-black transition" />
                </div>
                {registerState.errors?.name && <p className="text-xs text-red-500 mt-1">{registerState.errors.name[0]}</p>}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Mail size={18} className="text-gray-400" /></span>
                <input name="email" type="email" placeholder="seu@email.com" className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 focus:ring-black outline-none focus:border-black transition" />
              </div>
              {state.errors?.email && <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>}
            </div>

            {currentView !== 'forgot' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Lock size={18} className="text-gray-400" /></span>
                  <input name="password" type="password" placeholder="••••••••" className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 focus:ring-black outline-none focus:border-black transition" />
                </div>
                {state.errors?.password && <p className="text-xs text-red-500 mt-1">{state.errors.password[0]}</p>}
              </div>
            )}

            {currentView === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Lock size={18} className="text-gray-400" /></span>
                  <input name="confirmPassword" type="password" placeholder="••••••••" className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 focus:ring-black outline-none focus:border-black transition" />
                </div>
                {registerState.errors?.confirmPassword && <p className="text-xs text-red-500 mt-1">{registerState.errors.confirmPassword[0]}</p>}
              </div>
            )}

            {currentView === 'login' && (
              <div className="text-right">
                <button
                    type="button"
                    
                    onClick={() => setCurrentView('forgot')}
                    className="cursor-pointer text-sm font-medium text-gray-600 hover:text-black"
                >
                    Esqueceu sua senha?
                </button>
              </div>
            )}

            <SubmitButton view={currentView} />
          </form>

          <div className="border-t border-gray-200 bg-gray-50 p-6 text-center">
            {currentView === 'login' && (
                <p className="text-sm text-gray-600">
                Não tem uma conta?
                <button onClick={() => setCurrentView('register')} className="cursor-pointer ml-1 font-bold text-black hover:underline">Cadastre-se</button>
                </p>
            )}
            {currentView === 'register' && (
                <p className="text-sm text-gray-600">
                Já tem uma conta?
                <button onClick={() => setCurrentView('login')} className="ml-1 font-bold text-black hover:underline">Faça login</button>
                </p>
            )}
            {currentView === 'forgot' && (
                 <p className="text-sm text-gray-600">
                 Lembrou sua senha?
                 <button onClick={() => setCurrentView('login')} className="ml-1 font-bold text-black hover:underline">Faça login</button>
                 </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}