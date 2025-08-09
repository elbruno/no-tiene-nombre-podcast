import { Button } from "@/components/ui/button";
import { Headphones, Music, Smartphone, Globe } from "lucide-react";
import subscriptions from "@/lib/subscriptions.json";

interface PlatformLinksProps {
  className?: string;
}

const iconMap = {
  Headphones,
  Music,
  DeviceMobile: Smartphone,
  Globe
};

const colorMap = {
  ivoox: "bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary text-primary",
  spotify: "bg-accent/10 hover:bg-accent/20 border-accent/30 hover:border-accent text-accent",
  apple: "bg-muted/50 hover:bg-muted [border-color:var(--border)] hover:[border-color:var(--muted-foreground)] text-muted-foreground hover:text-foreground",
  listenNotes: "bg-muted/50 hover:bg-muted [border-color:var(--border)] hover:[border-color:var(--muted-foreground)] text-muted-foreground hover:text-foreground"
};

export function PlatformLinks({ className }: PlatformLinksProps) {
  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-3 font-display">
          Escúchanos en todas las plataformas
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptions.map((sub) => {
          const Icon = iconMap[sub.icon] || Headphones;
          const color = colorMap[sub.key] || "bg-muted/50 hover:bg-muted [border-color:var(--border)] hover:[border-color:var(--muted-foreground)] text-muted-foreground hover:text-foreground";
          return (
            <Button
              key={sub.key}
              variant="ghost"
              className={`h-auto p-6 flex flex-col items-center gap-4 glass-effect hover-lift border transition-all duration-300 ${color}`}
              onClick={() => window.open(sub.url, '_blank')}
            >
              <div className="p-3 rounded-xl glass-effect">
                <Icon size={32} />
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center gap-2 justify-center">
                  <span className="font-semibold font-display">{sub.title}</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">
                  {sub.desc}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}