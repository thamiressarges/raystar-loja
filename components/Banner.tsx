'use client';

import Image from "next/image";
import Link from "next/link";

export function Banner() {
  return (
    <section className="w-full py-10">
      <div className="container mx-auto px-4">

        <div className="flex flex-col md:flex-row items-center gap-10 bg-white">
          
          {/* TEXTO */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <h1 className="text-5xl font-bold tracking-tight">
              Estilo que inspira.
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              Peças modernas, confortáveis e com a identidade RayStar.
            </p>

            <Link
              href="/produtos"
              className="px-8 py-3 bg-black text-white rounded-full w-max hover:opacity-90 transition"
            >
              Comprar
            </Link>
          </div>

          {/* IMAGEM */}
          <div className="relative w-full md:w-1/2 h-72 md:h-[420px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/banner/banner.jpg"
              alt="RayStar Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

        </div>

      </div>
    </section>
  );
}
