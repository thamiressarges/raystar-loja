"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category as CategoryType } from "@/types";

export default function Category({ categories }: { categories: CategoryType[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  
  if (!categories || categories.length === 0) return null;

  return (
    <div className="container mx-auto px-4 flex flex-col gap-3 w-full py-8 mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={scrollLeft}
          className="bg-white border border-gray-300 rounded-full p-2 shadow-sm hover:bg-gray-100 transition hidden md:block"
          aria-label="scroll-left"
        >
          <ChevronLeft size={18} />
        </button>

        <div 
          ref={scrollRef} 
          className="flex-1 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth"
        >
          <div className="flex gap-3 w-max md:mx-auto">
            {categories.map((cat) => {
              
              const urlSlug = cat.slug || 'slug-ausente'; 

              return (
                <Link
                  key={cat.id}
                  href={`/categoria/${urlSlug}`}
                  className="px-5 py-2 rounded-full border border-gray-300 bg-white text-black text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        <button
          onClick={scrollRight}
          className="bg-white border border-gray-300 rounded-full p-2 shadow-sm hover:bg-gray-100 transition hidden md:block"
          aria-label="scroll-right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}