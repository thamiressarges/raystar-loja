import { Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <nav className="w-full h-auto bg-white border-b border-gray-200 md:h-20">
      
      <div className="container mx-auto px-4 h-full flex flex-wrap items-center justify-between gap-x-6
                    py-4 md:flex-nowrap md:py-0">
        
        {/* Logo */}
        <Link href="/">
          <span className="font-logo text-3xl font-bold text-black">
            RayStar
          </span>
        </Link>

        {/* Barra de pesquisa */}
        <div className="relative w-full order-3 mt-4 
                        md:w-auto md:order-2 md:mt-0 md:flex-1 md:max-w-xl">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full h-12 rounded-full border border-gray-300 bg-gray-100/80
                       py-2 pl-12 pr-4
                       focus:outline-none focus:border-black focus:bg-white"
          />
        </div>

        {/* Ícones */}
        <div className="flex items-center gap-5 order-2 md:order-3">
          <button className="text-gray-600 hover:text-black cursor-pointer">
            <ShoppingCart size={24} />
          </button>
          <button className="text-gray-600 hover:text-black cursor-pointer">
            <User size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}