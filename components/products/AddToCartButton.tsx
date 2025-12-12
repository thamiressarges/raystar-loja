'use client';

import { useRouter } from 'next/navigation';

interface Props {
    productId: string;
}

export default function AddToCartButton({ productId }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/produto/${productId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 rounded-full border border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all duration-300"
    >
      Comprar
    </button>
  );
}