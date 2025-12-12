'use client';

import { useState } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import { Product, Category } from "@/types";


interface CategorySectionListProps {
  categories: Category[];
}

export default function CategorySectionList({ categories }: CategorySectionListProps) {
  const [visibleCategories, setVisibleCategories] = useState(5);
  const [visibleProducts] = useState<Record<string, number>>(
    Object.fromEntries(categories.map((cat) => [cat.id, 4])) 
  );

  const showMoreCategories = () => {
    setVisibleCategories((prev) => prev + 5);
  };

  const categoriesSlice = categories.slice(0, visibleCategories);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {categoriesSlice.map((cat) => {
        const productsToShow = visibleProducts[cat.id] ?? 4;
        const products = cat.products || [];

        if (products.length === 0) return null;

        return (
          <section key={cat.id} className="container mx-auto px-4">
            <SectionHeader
              title={cat.name}
              href={`/categoria/${cat.slug ?? ""}`}
            />
            <ProductGrid>
              {products.slice(0, productsToShow).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </section>
        );
      })}

      {visibleCategories < categories.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={showMoreCategories}
            className="px-8 py-3 rounded-full border border-black text-black hover:bg-black hover:text-white transition font-medium"
          >
            Carregar mais categorias
          </button>
        </div>
      )}
    </div>
  );
}