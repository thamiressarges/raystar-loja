import { getProductBySlugOrId } from "@/services/product";
import { getStoreInfo } from "@/services/store"; 
import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/server";
import { Metadata } from "next";

import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import ProductVariationSelector from "@/components/product-details/ProductVariationSelector";
import ReviewList from "@/components/product-details/ReviewList";
import WriteReview from "@/components/product-details/WriteReview";
import { ProductDetailsProvider } from "@/lib/contexts/ProductDetailsContext";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { product } = await getProductBySlugOrId(id);
    if (!product) return { title: "Produto não encontrado" };

    return {
      title: `${product.title} | Raystar`,
      description: product.description?.substring(0, 160) || "Confira este produto incrível na Raystar.",
      openGraph: {
        title: product.title,
        description: product.description?.substring(0, 160),
        images: product.photos?.[0] ? [{ url: product.photos[0] }] : [],
      },
    };
  } catch (error) {
    return { title: "Raystar Store" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  if (!id) notFound();

  
  const [productData, storeInfo] = await Promise.all([
    getProductBySlugOrId(id),
    getStoreInfo()
  ]);

  const { product, variations, reviews } = productData;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  if (!product) notFound();

  const reviewCount = product.total_reviews || 0;
  const avgRating = product.rating || 0;

  return (
    <ProductDetailsProvider
      product={product}
      variations={variations}
      reviews={reviews}
      reviewCount={reviewCount}
      avgRating={avgRating}
    >
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <span>← Voltar</span>
        </Link>

        <main className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <section className="lg:w-1/2">
            <ProductGallery photos={product.photos} />
          </section>

          <section className="lg:w-1/2">
            <ProductInfo product={product} isLoggedIn={isLoggedIn} />
          </section>
        </main>

        <footer className="mt-10 lg:mt-12 w-full flex flex-col gap-8">
          <ProductVariationSelector />
          <ReviewList reviews={reviews} currentUserId={user?.id} />
          
          <WriteReview
            productId={product.id}
            storeId={storeInfo?.id || "loja-padrao"} 
            isLoggedIn={isLoggedIn}
          />
        </footer>
      </div>
    </ProductDetailsProvider>
  );
}