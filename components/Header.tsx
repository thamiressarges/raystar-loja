"use client";

import { useState, useEffect, Suspense } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'; 
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 
import { useUI } from '@/lib/contexts/UiContext';
import { useCart } from '@/lib/contexts/CartContext';
import { createSupabaseBrowserClient } from '@/lib/client'; 
import { checkProfilePending } from '@/lib/utils'; 

interface HeaderProps {
  isLoggedIn: boolean;
}

function SearchBar({ mobile = false, onSearch }: { mobile?: boolean, onSearch?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  const [term, setTerm] = useState("");

  
  useEffect(() => {
    
    if (pathname === '/busca') {
        const query = searchParams.get('q');
        if (query) {
            setTerm(query);
        }
    } else {
        
        setTerm("");
    }
  }, [pathname, searchParams]); 

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && term.trim()) {
      if(onSearch) onSearch();
      router.push(`/busca?q=${encodeURIComponent(term)}`);
    }
  };

  const executeSearch = () => {
     if (term.trim()) {
        if(onSearch) onSearch();
        router.push(`/busca?q=${encodeURIComponent(term)}`);
     }
  }

  if (mobile) {
    return (
      <div className="relative w-full">
         <button onClick={executeSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
           <Search size={18} />
         </button>
         <input 
           type="text" 
           placeholder="Buscar..."
           value={term}
           onChange={(e) => setTerm(e.target.value)}
           onKeyDown={handleSearch}
           className="w-full h-10 rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 focus:border-black focus:outline-none"
         />
      </div>
    );
  }

  return (
    <div className="relative flex-1 max-w-xl mx-auto group">
        <button onClick={executeSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
          <Search size={20} />
        </button>
        <input 
          type="text" 
          placeholder="Buscar produtos..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full h-12 rounded-full border border-gray-300 bg-gray-100/80
                    py-2 pl-12 pr-4 focus:outline-none focus:border-black focus:bg-white transition-all"
        />
    </div>
  );
}

export function Header({ isLoggedIn }: HeaderProps) {
  const { setIsAuthMenuOpen } = useUI();
  const { setIsOpen: setCartOpen, items } = useCart();
  const supabase = createSupabaseBrowserClient();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasPendingData, setHasPendingData] = useState(false);

  const cartCount = items.length;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleOpenAuthMenu = () => {
    setIsMenuOpen(false); 
    setIsAuthMenuOpen(true); 
  }

  useEffect(() => {
    async function checkData() {
      if (!isLoggedIn) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('users')
        .select('cpf, phone, birth_date, address') 
        .eq('uid', user.id)
        .single();

      if (userProfile) {
        const isPending = checkProfilePending(userProfile);
        setHasPendingData(isPending);
      }
    }

    checkData();
  }, [isLoggedIn, supabase]);

  return (
    <nav className="relative w-full h-auto bg-white border-b border-gray-200 z-40">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <Link href="/">
          <span className="font-logo text-3xl font-bold text-black">
            RayStar
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 flex-1">
          <Suspense fallback={<div className="flex-1 max-w-xl mx-auto h-12 bg-gray-100 rounded-full animate-pulse" />}>
             <SearchBar />
          </Suspense>

          <div className="flex items-center gap-5">
            {isLoggedIn && (
              <button 
                onClick={() => setCartOpen(true)} 
                className="relative text-gray-600 hover:text-black cursor-pointer"
                aria-label="Abrir carrinho"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center 
                                   rounded-full bg-red-600 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            {isLoggedIn ? (
              <Link href="/conta" className="relative text-gray-600 hover:text-black cursor-pointer">
                <User size={24} />
                {hasPendingData && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white ring-2 ring-white">
                    !
                  </span>
                )}
              </Link>
            ) : (
              <button 
                onClick={() => setIsAuthMenuOpen(true)} 
                className="text-gray-600 hover:text-black cursor-pointer"
                aria-label="Abrir menu de login"
              >
                <User size={24} />
              </button>
            )}
          </div>
        </div>

         <div className="md:hidden flex items-center gap-4">
           <button onClick={toggleMenu} className="text-gray-600 hover:text-black">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
           </button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="absolute md:hidden top-full left-0 w-full bg-white shadow-lg border-t border-gray-200
                     p-4 flex flex-col gap-4 animate-in slide-in-from-top-2"
        >
          <Suspense>
            <SearchBar mobile onSearch={() => setIsMenuOpen(false)} />
          </Suspense>

          <hr className="border-gray-100"/>

          {isLoggedIn ? (
            <Link 
              href="/account" 
              onClick={toggleMenu} 
              className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              <div className="relative">
                <User size={22} />
                {hasPendingData && (
                   <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-white" />
                )}
              </div>
              Minha Conta
              {hasPendingData && <span className="text-xs text-yellow-600 font-bold">(Complete seu cadastro)</span>}
            </Link>
          ) : (
            <button
              onClick={handleOpenAuthMenu} 
              className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-left"
            >
              <User size={22} />
              Fazer Login / Criar Conta
            </button>
          )}

          {isLoggedIn && (
            <button 
              onClick={() => {
                setIsMenuOpen(false); 
                setCartOpen(true); 
              }}
              className="relative flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-left"
            >
              <ShoppingCart size={22} />
              Carrinho
              {cartCount > 0 && (
                  <span className="absolute top-2 left-6 flex h-4 w-4 items-center justify-center 
                                   rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}