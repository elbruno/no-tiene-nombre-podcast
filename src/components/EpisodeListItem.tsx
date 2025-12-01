import { Button } from "@/components/ui/button";
import type { Episode } from "@/lib/types";
import { Headphones, ExternalLink } from "lucide-react";
import { EpisodeEmbeddedPlayer } from "@/components/EpisodeEmbeddedPlayer";

interface Props {
  episode: Episode;
  index?: number;
}

export function EpisodeListItem({ episode }: Props) {
  const openListen = () => {
    const target = episode.audioUrl || episode.link;
    if (target) window.open(target, "_blank");
  };

  const openLink = () => {
    const target = episode.link || episode.audioUrl;
    if (target) window.open(target, "_blank");
  };

  return (
    <div className="p-4 glass-effect rounded-xl border [border-color:var(--border)] hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center gap-4">
        {episode.imageUrl ? (
          <img
            src={episode.imageUrl}
            alt={episode.title}
            className="h-16 w-16 rounded-lg object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
            <Headphones className="text-primary" size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground truncate">{episode.title}</h3>
          <div className="text-xs text-muted-foreground truncate">{new Date(episode.pubDate).toLocaleDateString()}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openListen}>
            <Headphones size={16} className="mr-2" /> Escuchar
          </Button>
          {(episode.link || episode.audioUrl) && (
            <Button size="sm" variant="outline" className="glass-effect" onClick={openLink}>
              <ExternalLink size={16} className="mr-2" /> Ver
            </Button>
          )}
        </div>
      </div>
      <div className="mt-2">
        <EpisodeEmbeddedPlayer
          audioUrl={episode.audioUrl}
          embedUrl={episode.embedUrl}
          title={episode.title}
        />
      </div>
    </div>
  );
}
