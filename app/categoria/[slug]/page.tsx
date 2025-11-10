import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/Pagination";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const categoryName = decodeURIComponent(slug);

  return (
    <div className="container mx-auto px-4 py-10">
      
      <h1 className="text-3xl md:text-3xl font-semibold text-black mb-6 capitalize">
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

      < Pagination />

    </div>
  );
}
