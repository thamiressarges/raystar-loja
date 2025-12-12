"use client";

import WriteReviewForm from "./WriteReviewForm";
import { useUI } from '@/lib/contexts/UiContext';

interface WriteReviewProps {
  productId: string;
  storeId: string;
  isLoggedIn: boolean;
}

export default function WriteReview({ productId, storeId, isLoggedIn }: WriteReviewProps) {
  const { openAuthMenu } = useUI();

  if (!isLoggedIn) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 md:p-8 text-center cursor-pointer">
        <h2 className="text-xl font-semibold text-black cursor-pointer">Escreva uma avaliação</h2>
        <p className="mt-2 text-gray-600 cursor-pointer">
          Você precisa estar logado para deixar uma avaliação.
        </p>

        <button
          onClick={openAuthMenu} 
          className="mt-4 inline-block rounded-lg bg-black px-6 py-3 text-base font-bold text-white hover:opacity-80 transition cursor-pointer"
        >
          Entrar ou Criar Conta
        </button>
      </div>
    );
  }

  return <WriteReviewForm productId={productId} storeId={storeId} />;
}
