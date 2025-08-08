import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "@phosphor-icons/react";
import { Episode } from "@/lib/types";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
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

  return (
    <Card className="group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden border-accent/30 hover:border-accent/60 bg-card/80 backdrop-blur-sm glow-border">
      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-accent group-hover:glow-text transition-all duration-200 font-display">
            {episode.title}
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handlePlay}
              className="bg-accent/80 hover:bg-accent text-accent-foreground transition-all duration-200 hover:glow-border"
            >
              <Play size={16} weight="fill" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlay}
              className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 hover:text-accent"
            >
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs border-accent/30">
            {formatDate(episode.pubDate)}
          </Badge>
          {episode.duration && (
            <Badge variant="secondary" className="text-xs border-accent/30">
              {episode.duration}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 leading-relaxed group-hover:text-foreground/90 transition-colors duration-200">
          {episode.description}
        </CardDescription>
        {episode.link && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 p-0 h-auto text-accent hover:text-accent/80 hover:glow-text opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={() => window.open(episode.link, '_blank')}
          >
            <ExternalLink size={14} className="mr-1" />
            Ver episodio completo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}