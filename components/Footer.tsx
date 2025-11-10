'use client';

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-10">
      <div className="container mx-auto px-4">

        <div className="grid gap-10 md:grid-cols-3">

          <div>
            <h2 className="text-2xl font-bold mb-3">RAYSTAR</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Sua loja de moda com as últimas tendências e melhor qualidade.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contato</h3>

            <ul className="text-sm text-gray-300 space-y-2">
              <li>contato@raystar.com.br</li>
              <li>(11) 98765-4321</li>
              <li>Manaus, AM</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Siga-nos</h3>

            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                <Facebook size={18} />
              </Link>

              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                <Instagram size={18} />
              </Link>

            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-4 text-center text-sm text-gray-400">
          © 2025 Raystar. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
