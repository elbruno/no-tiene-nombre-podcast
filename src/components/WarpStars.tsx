import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function WarpStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Create initial stars
    const createStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: Math.random() * 3 + 1, // 1-4px
          delay: Math.random() * 3, // 0-3s delay
        });
      }
      setStars(newStars);
    };

    createStars();

    // Recreate stars periodically to maintain the effect
    const interval = setInterval(createStars, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="warp-stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="warp-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}