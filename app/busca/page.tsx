import { searchProducts } from "@/services/product";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import { Search, Frown } from "lucide-react";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Search className="text-black" />
          Resultados para: <span className="text-gray-500">&quot;{query}&quot;</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Frown size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Nenhum produto encontrado</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Não encontramos nada com o termo &quot;{query}&quot;. Tente usar palavras mais genéricas ou navegue pelas categorias.
          </p>
          <Link 
            href="/" 
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-bold hover:opacity-80 transition"
          >
            Voltar para Loja
          </Link>
        </div>
      )}
    </div>
  );
}