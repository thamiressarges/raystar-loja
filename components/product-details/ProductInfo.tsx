'use client';

import { Product } from '@/types';
import { useProductDetails } from '@/lib/contexts/ProductDetailsContext';
import { useUI } from '@/lib/contexts/UiContext';
import { formatPrice } from '@/lib/utils'; 

interface ProductInfoProps {
  product: Product;
  isLoggedIn: boolean;
}

export default function ProductInfo({ product, isLoggedIn }: ProductInfoProps) {
  
  const { selectedVariation, addToCart, hasVariations } = useProductDetails();
  const { openAuthMenu } = useUI();

  const isButtonDisabled = hasVariations && !selectedVariation;

  
  
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;

  
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(currentPrice);

  return (
    <div className="flex flex-col gap-5">

      <div>
        <span className="text-sm font-medium text-gray-500">
          {product.category?.name ?? "Categoria"}
        </span>
        <h1 className="text-3xl font-bold text-black">{product.title}</h1>
      </div>

      <span className="text-4xl font-semibold text-black mt-2 transition-all duration-300">
        {formattedPrice}
      </span>

      <div className="mt-4 max-w-sm">
        {isLoggedIn ? (
          <button 
            onClick={addToCart}
            disabled={isButtonDisabled}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-base font-bold text-white hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isButtonDisabled ? 'Selecione uma opção' : 'Adicionar ao Carrinho'}
          </button>
        ) : (
          <>
            <button
              onClick={openAuthMenu}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-base font-bold text-white hover:bg-gray-800 transition"
            >
              Faça login para comprar
            </button>

            <p className="text-sm text-gray-500 text-center mt-2 cursor-pointer">
              Você precisa criar uma conta para comprar este produto.
            </p>
          </>
        )}
      </div>

    </div>
  );
}