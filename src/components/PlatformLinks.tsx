import { Button } from "@/components/ui/button";
import { Headphones, MusicNotes, DeviceMobile, Globe } from "@phosphor-icons/react";

interface PlatformLinksProps {
  className?: string;
}

const platforms = [
  {
    name: "iVoox",
    url: "https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html",
    icon: Headphones,
    primary: true,
    description: "Plataforma principal del podcast",
    color: "bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary text-primary"
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/show/2kCHrwupmLhQs5aFOBJ2z6?si=872e9b3efaa34649",
    icon: MusicNotes,
    primary: false,
    description: "Escucha en la plataforma más popular",
    color: "bg-accent/10 hover:bg-accent/20 border-accent/30 hover:border-accent text-accent"
  },
  {
    name: "Apple Podcasts",
    url: "https://podcasts.apple.com/us/podcast/no-tiene-nombre/id1682861526",
    icon: DeviceMobile,
    primary: false,
    description: "Disponible en dispositivos Apple",
    color: "bg-muted/50 hover:bg-muted border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground"
  },
  {
    name: "Listen Notes",
    url: "https://lnns.co/Ytoh4vIkAjq",
    icon: Globe,
    primary: false,
    description: "Directorio mundial de podcasts",
    color: "bg-muted/50 hover:bg-muted border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground"
  }
];

export function PlatformLinks({ className }: PlatformLinksProps) {
  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-3 font-display">
          Escúchanos en todas las plataformas
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Elige tu plataforma favorita y nunca te pierdas un episodio de nuestro podcast sobre inteligencia artificial
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <Button
            key={platform.name}
            variant="ghost"
            className={`h-auto p-6 flex flex-col items-center gap-4 glass-effect hover-lift border transition-all duration-300 ${platform.color}`}
            onClick={() => window.open(platform.url, '_blank')}
          >
            <div className="p-3 rounded-xl glass-effect">
              <platform.icon size={32} weight="duotone" />
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <span className="font-semibold font-display">{platform.name}</span>
                {/* ExternalLink icon removed */}
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                {platform.description}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}