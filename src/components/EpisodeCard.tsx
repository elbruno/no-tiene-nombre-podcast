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
    <Card className="group hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden border-border/50 hover:border-accent/30">
      {/* Episode Thumbnail */}
      {episode.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={episode.imageUrl}
            alt={`Thumbnail de ${episode.title}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="lg"
              onClick={handlePlay}
              className="bg-accent/90 hover:bg-accent backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200"
            >
              <Play size={24} weight="fill" className="ml-1" />
            </Button>
          </div>
          
          {/* Duration badge */}
          {episode.duration && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                {episode.duration}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      {/* Background pattern for episodes without images */}
      {!episode.imageUrl && (
        <div className="h-48 bg-gradient-to-br from-muted via-muted/80 to-muted/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_transparent_40%,_var(--accent)_100%)] opacity-5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
              <Play size={32} className="text-accent/60" weight="duotone" />
            </div>
          </div>
          {episode.duration && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="text-xs">
                {episode.duration}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-accent transition-colors duration-200">
            {episode.title}
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePlay}
            className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ExternalLink size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {formatDate(episode.pubDate)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 leading-relaxed group-hover:text-foreground/80 transition-colors duration-200">
          {episode.description}
        </CardDescription>
        {episode.link && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 p-0 h-auto text-accent hover:text-accent/80 opacity-0 group-hover:opacity-100 transition-all duration-200"
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