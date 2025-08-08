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
    <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {episode.title}
          </CardTitle>
          <Button
            size="sm"
            onClick={handlePlay}
            className="shrink-0 bg-accent hover:bg-accent/90"
          >
            <Play size={16} weight="fill" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {formatDate(episode.pubDate)}
          </Badge>
          {episode.duration && (
            <Badge variant="outline" className="text-xs">
              {episode.duration}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 leading-relaxed">
          {episode.description}
        </CardDescription>
        {episode.link && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 p-0 h-auto text-primary hover:text-primary/80"
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