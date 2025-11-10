'use client';

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryList() {
  const categories = [
    "Blusas",
    "Saias",
    "Bermudas",
    "Shorts",
    "Casacos",
    "Acessórios",
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2 w-full py-6">

      {/* Seta esquerda */}
      <button
        onClick={scrollLeft}
        className="bg-white border border-black rounded-full p-2 shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>

      {/* WRAPPER DO SCROLL */}
      <div 
        ref={scrollRef}
        className="
          flex-1
          overflow-x-auto
          whitespace-nowrap
          no-scrollbar
        "
      >
        {/* CONTEÚDO INTERNO (CENTRALIZA NO DESKTOP) */}
        <div
          className="
            flex gap-3
            w-max
            mx-auto
            md:justify-center
          "
        >
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/categoria/${cat.toLowerCase()}`}
              className="
                px-4 py-2
                rounded-full
                border border-black
                text-black text-sm
                hover:bg-black hover:text-white
                transition
              "
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Seta direita */}
      <button
        onClick={scrollRight}
        className="bg-white border border-black rounded-full p-2 shadow-sm"
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
}
