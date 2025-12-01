import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface EpisodeEmbeddedPlayerProps {
  audioUrl?: string;
  embedUrl?: string;
  title: string;
}

export function EpisodeEmbeddedPlayer({ audioUrl, embedUrl, title }: EpisodeEmbeddedPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle iframe load timeout - fallback to audio if iframe doesn't load
  useEffect(() => {
    if (isExpanded && embedUrl && !showFallback) {
      // Set a timeout to show fallback if iframe doesn't load within 5 seconds
      timeoutRef.current = setTimeout(() => {
        setShowFallback(true);
      }, 5000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [isExpanded, embedUrl, showFallback]);

  // Clear timeout when iframe loads successfully
  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const togglePlayer = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setShowFallback(false); // Reset fallback when expanding
    }
  };

  // If no audio source available, don't render anything
  if (!audioUrl && !embedUrl) {
    return null;
  }

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlayer}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Cerrar reproductor' : 'Abrir reproductor'}
        className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 hover:border-primary/50 transition-all duration-300"
      >
        {isExpanded ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
        {isExpanded ? 'Cerrar reproductor' : 'Reproducir aquí'}
      </Button>

      {isExpanded && (
        <div className="mt-3 rounded-lg overflow-hidden border border-primary/20 bg-card/50 backdrop-blur-sm">
          {embedUrl && !showFallback ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={`Reproductor de ${title}`}
              loading="lazy"
              onLoad={handleIframeLoad}
              className="w-full h-48"
              style={{ border: 'none' }}
            />
          ) : audioUrl ? (
            <div className="p-4">
              <audio
                controls
                src={audioUrl}
                className="w-full"
                preload="none"
                aria-label={`Audio de ${title}`}
              >
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Reproductor no disponible
            </div>
          )}
        </div>
      )}
    </div>
  );
}
