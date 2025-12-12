'use client';

import { Package, User, LogOut, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/client';
import { useRouter } from 'next/navigation';

type Tab = 'pedidos' | 'dados';

interface AccountSidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  hasPendingData: boolean;
}

export default function AccountSidebar({ activeTab, setActiveTab, hasPendingData }: AccountSidebarProps) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getButtonClass = (tab: Tab) => {
    const isActive = activeTab === tab;
    return `
      flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium
      transition-colors cursor-pointer relative
      ${isActive
        ? 'bg-black text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-200/60'
      }
    `;
  };
  
  const logoutButtonClass = `
    flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium
    text-red-600 hover:bg-red-50 cursor-pointer
  `;

  return (
    <div className="flex flex-col gap-2"> 
      <button onClick={() => setActiveTab('pedidos')} className={getButtonClass('pedidos')}>
        <Package size={20} />
        Meus Pedidos
      </button>

      <button onClick={() => setActiveTab('dados')} className={getButtonClass('dados')}>
        <div className="relative flex items-center justify-center">
            <User size={20} />
            {hasPendingData && activeTab !== 'dados' && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-yellow-500 ring-2 ring-white"></span>
            )}
        </div>
        <span className="flex-1">Meus Dados</span>
        {hasPendingData && <AlertCircle size={18} className="text-yellow-500" />}
      </button>
      
      <hr className="my-1 border-gray-100" />

      <button onClick={handleSignOut} className={logoutButtonClass}>
        <LogOut size={20} />
        Sair
      </button>
    </div>
  );
}