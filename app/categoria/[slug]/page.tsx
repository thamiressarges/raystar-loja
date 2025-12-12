import { getPaginatedCategoryData } from "@/services/product";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `${title} | Raystar`,
    description: `Confira os melhores produtos da categoria ${title} na Raystar.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;

  
  const { category, products, totalPages } = await getPaginatedCategoryData(slug, currentPage);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black capitalize">
          {category.name}
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          {products.length} produto(s)
        </p>
      </div>
      
      {products.length > 0 ? (
        <>
            <ProductGrid>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </ProductGrid>
            
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
        </>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}