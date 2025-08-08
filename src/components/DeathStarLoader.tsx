import { useEffect, useState } from 'react';

interface DeathStarLoaderProps {
  size?: number;
  className?: string;
}

export function DeathStarLoader({ size = 80, className = "" }: DeathStarLoaderProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Death Star main sphere */}
      <div 
        className="relative w-full h-full rounded-full bg-gradient-to-br from-muted-foreground/40 to-muted-foreground/20 border border-muted-foreground/30 shadow-2xl"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.3) 0%, transparent 40%),
            linear-gradient(135deg, 
              rgba(156, 163, 175, 0.4) 0%, 
              rgba(107, 114, 128, 0.3) 50%, 
              rgba(75, 85, 99, 0.2) 100%
            )
          `,
          boxShadow: `
            inset -${size * 0.1}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.5),
            inset ${size * 0.05}px ${size * 0.05}px ${size * 0.1}px rgba(255,255,255,0.1),
            0 0 ${size * 0.5}px rgba(var(--accent), 0.2)
          `
        }}
      >
        {/* Surface details */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* Superlaser dish */}
          <div 
            className="absolute bg-muted-foreground/60 rounded-full border border-muted-foreground/40"
            style={{
              width: size * 0.25,
              height: size * 0.25,
              top: size * 0.2,
              right: size * 0.25,
              background: `
                radial-gradient(circle at center, 
                  rgba(var(--accent), 0.6) 0%,
                  rgba(var(--accent), 0.3) 30%,
                  rgba(107, 114, 128, 0.8) 70%,
                  rgba(75, 85, 99, 0.9) 100%
                )
              `,
              boxShadow: `
                inset 0 0 ${size * 0.05}px rgba(0,0,0,0.8),
                0 0 ${size * 0.1}px rgba(var(--accent), 0.4)
              `
            }}
          >
            {/* Superlaser inner ring */}
            <div 
              className="absolute inset-1 rounded-full border border-accent/60"
              style={{
                background: `radial-gradient(circle at center, 
                  rgba(var(--accent), 0.8) 0%,
                  rgba(var(--accent), 0.2) 60%,
                  transparent 100%
                )`
              }}
            />
          </div>

          {/* Surface trenches */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent 0px,
                  transparent ${size * 0.08}px,
                  rgba(0,0,0,0.1) ${size * 0.08}px,
                  rgba(0,0,0,0.1) ${size * 0.1}px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent 0px,
                  transparent ${size * 0.12}px,
                  rgba(0,0,0,0.05) ${size * 0.12}px,
                  rgba(0,0,0,0.05) ${size * 0.14}px
                )
              `
            }}
          />

          {/* Additional surface details */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-muted-foreground/20 rounded-sm"
              style={{
                width: size * (0.02 + Math.random() * 0.03),
                height: size * (0.01 + Math.random() * 0.02),
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>

        {/* Rotating energy rings */}
        <div 
          className="absolute inset-0 rounded-full border border-accent/30"
          style={{ 
            transform: `rotate(${rotation * 1.5}deg)`,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute inset-2 rounded-full border border-accent/20"
          style={{ 
            transform: `rotate(${-rotation * 0.8}deg)`,
            animation: 'pulse 3s ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* Orbital energy particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `
              translate(-50%, -50%) 
              rotate(${rotation * 2 + i * 60}deg) 
              translateX(${size * 0.65}px)
            `,
            animation: `pulse 1.5s ease-in-out infinite ${i * 0.25}s`,
            boxShadow: `0 0 ${size * 0.05}px currentColor`
          }}
        />
      ))}

      {/* Central glow effect */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, 
            rgba(var(--accent), 0.1) 0%,
            transparent 70%
          )`,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Cargando...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <DeathStarLoader size={120} className="mb-6" />
      <p className="text-lg text-muted-foreground font-medium tracking-wide">
        {message}
      </p>
      <div className="mt-4 flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-accent rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}