
'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface InteractiveRatingStarsProps {
  rating: number;
  setRating: (rating: number) => void;
}

export default function InteractiveRatingStars({
  rating,
  setRating,
}: InteractiveRatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((starIndex) => {
        const isFilled = (hoverRating || rating) >= starIndex;
        return (
          <button
            type="button" 
            key={starIndex}
            className="cursor-pointer"
            onClick={() => setRating(starIndex)}
            onMouseEnter={() => setHoverRating(starIndex)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Dar ${starIndex} estrela${starIndex > 1 ? 's' : ''}`}
          >
            <Star
              size={24}
              className={`
                transition-colors
                ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}