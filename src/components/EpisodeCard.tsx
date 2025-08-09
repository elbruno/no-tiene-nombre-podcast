import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Brain, ShareFat } from "@phosphor-icons/react";
import useShare from "@/hooks/useShare";
import { Episode } from "@/lib/types";

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

export function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100 + index * 80);
    return () => clearTimeout(timeout);
  }, [index]);
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
  <Card className={`group hover-lift glass-effect [border-color:var(--border)] hover:[border-color:var(--primary)] relative overflow-hidden perspective-1000 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}> 
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
          <div className="w-full aspect-square relative">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
      )}
      {/* Main content */}
      <div className="relative z-10 p-6 space-y-4">
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
                <Play size={16} weight="fill" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Compartir episodio"
                onClick={handleShare}
                className="text-accent hover:text-primary border border-accent/30 hover:border-primary transition-all duration-300"
              >
                <ShareFat size={16} weight="bold" />
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
              Escuchar episodio
            </Button>
          </div>
        )}
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />
    </Card>
  );
}