'use client';

import Image from "next/image";
import RatingStars from "./RatingStars";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition">
      
      {/* imagem */}
      <div className="relative h-56 w-full">
        <Image
          src="/roupa.jpg"
          alt="Produto"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />

        <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs text-white">
          Novo
        </span>
      </div>

      {/* conteúdo */}
      <div className="p-4 flex flex-col gap-3">
        
        <h3 className="text-base font-medium text-black line-clamp-2">
          Roupa
        </h3>

        <div className="flex items-center gap-2">
          <RatingStars />
          <span className="text-xs text-gray-500">(4.8)</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-semibold text-black">
            R$ 99,90
          </span>

          <AddToCartButton />
        </div>
      </div>

    </div>
  );
}
