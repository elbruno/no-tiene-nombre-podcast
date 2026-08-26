import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Brain, Share2 } from "lucide-react";
import useShare from "@/hooks/useShare";
import { Episode } from "@/lib/types";
import { EpisodeEmbeddedPlayer } from "@/components/EpisodeEmbeddedPlayer";

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

export function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const [showImage, setShowImage] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = imageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowImage(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px 600px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const handlePlay = () => {
    if (episode.audioUrl) {
      window.open(episode.audioUrl, '_blank');
    } else if (episode.link) {
      window.open(episode.link, '_blank');
    }
  };

  const { share } = useShare();
  const handleShare = () => {
    share(
      episode.link || episode.audioUrl || window.location.href,
      episode.title,
      episode.description
    );
  };

  // Helper to check if episode is new (published in last 14 days)
  const isNew = (() => {
    const now = new Date();
    const pub = new Date(episode.pubDate);
    const diffDays = (now.getTime() - pub.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 14;
  })();

  return (
  <Card
    role="article"
    aria-label={`Episodio: ${episode.title}`}
    tabIndex={0}
    className="group hover-lift glass-effect [border-color:var(--border)] hover:[border-color:var(--primary)] relative overflow-hidden transition-all duration-300 ease-out max-w-xs mx-auto md:max-w-sm shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 py-0 gap-0"
  > 
      {/* Neural glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Episode number indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="w-8 h-8 rounded-full glass-effect flex items-center justify-center text-xs font-bold text-primary">
          {index + 1}
        </div>
      </div>

      {/* Episode image (if present) */}
      {episode.imageUrl && (
        <div ref={imageRef} className="w-full aspect-square relative overflow-hidden bg-muted">
          {showImage && (
            <img
              src={episode.imageUrl}
              alt={episode.title}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable={false}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      {/* Main content */}
  <div className="relative z-10 p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 font-display">
                {episode.title}
              </CardTitle>
              {isNew && (
                <Badge variant="default" className="ml-2 animate-pulse bg-accent text-accent-foreground shadow-lg font-bold px-2 py-0.5 rounded-full">
                  Nuevo
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handlePlay}
                aria-label="Escuchar episodio"
                className="bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/40 hover:border-primary transition-all duration-300"
              >
                <Play size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-label={`Compartir episodio: ${episode.title}`}
                onClick={handleShare}
                className="text-accent hover:text-primary border border-accent/30 hover:border-primary transition-all duration-300"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="outline" className="text-xs bg-card/50 border-primary/30 text-primary">
              <Brain size={12} className="mr-1" />
              {formatDate(episode.pubDate)}
            </Badge>
            {episode.duration && (
              <Badge variant="secondary" className="text-xs bg-accent/20 border-accent/30 text-accent">
                {episode.duration}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <CardDescription className="line-clamp-3 leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
          {episode.description}
        </CardDescription>

        {/* Embedded Player */}
        <EpisodeEmbeddedPlayer
          audioUrl={episode.audioUrl}
          embedUrl={episode.embedUrl}
          title={episode.title}
        />

        {/* Action button */}
    {episode.link && (
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-accent hover:text-primary transition-colors duration-300 p-0 h-auto opacity-60 group-hover:opacity-100"
              onClick={() => window.open(episode.link, '_blank')}
            >
              {/* ExternalLink icon removed */}
              Escuchar episodio en iVoox
            </Button>
          </div>
        )}
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />
    </Card>
  );
}