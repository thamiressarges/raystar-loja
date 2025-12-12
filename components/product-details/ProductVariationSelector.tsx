'use client';

import { useMemo } from 'react';
import { Variation } from '@/types'; 
import { useProductDetails } from '@/lib/contexts/ProductDetailsContext';
import RatingStars from '@/components/products/RatingStars';


function groupVariationsByColor(variations: Variation[]) {
  const map = new Map<string, Variation[]>();
  variations.forEach(v => {
    
    if (!v.color || !v.size) return; 
    
    if (!map.has(v.color)) map.set(v.color, []);
    map.get(v.color)!.push(v);
  });
  return Array.from(map.entries());
}

export default function ProductVariationSelector() {

  const {
    product,
    variations,
    avgRating,
    reviewCount,
    selectedVariation,
    setSelectedVariation,
    
  } = useProductDetails();

  const availableVariations = useMemo(
    () => groupVariationsByColor(variations),
    [variations]
  );

  return (
    <section className="w-full rounded-lg border border-gray-200 bg-white p-6 md:p-8">

      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-black">
          Detalhes
        </h2>
        <div className="flex flex-col items-end">
           <RatingStars rating={avgRating} />
           <span className="text-xs text-gray-500 mt-1">
             ({reviewCount} avaliações)
           </span>
        </div>
      </div>

      {product.description && (
        <p className="text-base text-gray-700 leading-relaxed mb-8">
          {product.description}
        </p>
      )}

      {availableVariations.length > 0 ? (
        <div className="flex flex-col gap-8">
          <h3 className="text-lg font-bold text-black uppercase tracking-wider">
            Escolha o Modelo e Tamanho
          </h3>

          {availableVariations.map(([nomeModelo, sizes]) => (
            <div key={nomeModelo} className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-900">
                {nomeModelo}
              </span>

              <div className="flex flex-wrap gap-3">
                {sizes.map(v => {
                  const qtd = v.stock ?? 0;
                  const hasStock = Number(qtd) > 0;
                  const isSelected = selectedVariation?.id === v.id;

                  return (
                    <button
                      key={v.id}
                      onClick={() => hasStock && setSelectedVariation(v)}
                      disabled={!hasStock}
                      className={`
                        min-w-[3.5rem] h-12 px-4 rounded-md border text-sm font-medium transition-all relative
                        ${isSelected
                          ? 'bg-black text-white border-black ring-2 ring-offset-2 ring-gray-200'
                          : hasStock 
                            ? 'bg-white text-gray-900 border-gray-300 hover:border-black'
                            : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                        }
                      `}
                    >
                      {v.size} 
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
         <p className="text-gray-500 italic">Sem opções disponíveis no momento.</p>
      )}

    </section>
  );
}