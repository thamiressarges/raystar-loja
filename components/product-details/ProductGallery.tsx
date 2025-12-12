'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProductDetails } from '@/lib/contexts/ProductDetailsContext';

interface ProductGalleryProps {
  photos: string[];
}

export default function ProductGallery({ photos }: ProductGalleryProps) {
  const imageList = photos && photos.length > 0 ? photos : ["/placeholder.jpg"];
  const [activeImage, setActiveImage] = useState(imageList[0]);
  const { selectedVariation } = useProductDetails();

  useEffect(() => {
    if (selectedVariation?.cor) {
      const normalizedColor = selectedVariation.cor.toLowerCase().split(' ')[0];
      const matchingPhoto = imageList.find(photo =>
        photo.toLowerCase().includes(normalizedColor)
      );
      if (matchingPhoto) setActiveImage(matchingPhoto);
    }
  }, [selectedVariation, imageList]);

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        <Image
          src={activeImage}
          alt="Foto Principal do Produto"
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-start">
        {imageList.map((photoUrl, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(photoUrl)}
            className={`
              relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all
              ${activeImage === photoUrl 
                ? 'border-black opacity-100 ring-2 ring-offset-1 ring-gray-200' 
                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
              }
            `}
          >
            <Image
              src={photoUrl}
              alt={`Miniatura ${index + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}