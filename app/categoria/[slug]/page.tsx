import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const categoryName = decodeURIComponent(slug);

  return (
    <div className="container mx-auto px-4 py-10">
      
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 capitalize">
        {categoryName}
      </h1>

      <ProductGrid>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </ProductGrid>

      <div className="flex justify-center items-center gap-4 mt-10">
        <button className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition">
          Anterior
        </button>

        <span className="text-black font-medium">
          Página 1 de 5
        </span>

        <button className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition">
          Próxima
        </button>
      </div>

    </div>
  );
}
