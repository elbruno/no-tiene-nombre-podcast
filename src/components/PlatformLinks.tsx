import { Button } from "@/components/ui/button";
import { ExternalLink } from "@phosphor-icons/react";

interface PlatformLinksProps {
  className?: string;
}

const platforms = [
  {
    name: "iVoox",
    url: "https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html",
    primary: true,
    description: "Plataforma principal"
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/show/2kCHrwupmLhQs5aFOBJ2z6?si=872e9b3efaa34649",
    primary: false,
    description: "Escucha en Spotify"
  },
  {
    name: "Apple Podcasts",
    url: "https://podcasts.apple.com/us/podcast/no-tiene-nombre/id1682861526",
    primary: false,
    description: "Disponible en Apple"
  },
  {
    name: "Listen Notes",
    url: "https://lnns.co/Ytoh4vIkAjq",
    primary: false,
    description: "Directorio de podcasts"
  }
];

export function PlatformLinks({ className }: PlatformLinksProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Suscríbete y escucha
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {platforms.map((platform) => (
          <Button
            key={platform.name}
            variant={platform.primary ? "default" : "secondary"}
            className={`h-auto p-4 flex flex-col items-center gap-2 ${
              platform.primary ? "bg-accent hover:bg-accent/90" : ""
            }`}
            onClick={() => window.open(platform.url, '_blank')}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{platform.name}</span>
              <ExternalLink size={16} />
            </div>
            <span className="text-xs opacity-80 text-center">
              {platform.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}