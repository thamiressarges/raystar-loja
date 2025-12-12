interface RatingStarsProps {
  rating: number;
}

export default function RatingStars({ rating }: RatingStarsProps) {
  const roundedRating = Math.round(rating * 2) / 2;
  const maxStars = 5;

  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[...Array(maxStars)].map((_, i) => {
        const value = i + 1;

        return (
          <span key={i}>
            {roundedRating >= value ? (
              "★"
            ) : roundedRating >= value - 0.5 ? (
              "☆" 
            ) : (
              <span className="text-gray-300">★</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
