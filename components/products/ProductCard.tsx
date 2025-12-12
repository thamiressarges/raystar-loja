'use client';

import Image from "next/image";
import Link from "next/link";
import RatingStars from "./RatingStars";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.photos?.[0] || "/placeholder.png";
  const rating = product.rating ?? 0;
  const reviews = product.total_reviews ?? 0;

  return (
    <Link href={`/produto/${product.id}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg">
        
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="mb-2 text-base font-normal text-gray-900 line-clamp-1 font-serif">
            {product.title}
          </h3>

          <div className="mb-4 flex items-center gap-2">
            <RatingStars rating={rating} />
            <span className="text-xs text-gray-400">({reviews})</span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </Link>
  );
}