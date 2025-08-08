import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-md mx-auto">
      <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 backdrop-blur-sm">
        <WarningCircle size={16} />
        <AlertTitle className="font-display">ERROR AL CARGAR EPISODIOS</AlertTitle>
        <AlertDescription className="mt-2">
          No pudimos cargar los últimos episodios del podcast. Verifica tu conexión a internet e intenta de nuevo.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 text-center">
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="gap-2 border-accent/40 hover:border-accent/60 hover:text-accent hover:glow-text transition-all duration-300"
        >
          <ArrowClockwise size={16} />
          Intentar de nuevo
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-card/50 rounded-lg border border-accent/20 backdrop-blur-sm">
        <h4 className="font-medium text-foreground mb-2 font-display">
          MIENTRAS TANTO, PUEDES ESCUCHAR EN:
        </h4>
        <div className="space-y-2 text-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto hover:text-accent transition-colors duration-200"
            onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
          >
            → iVoox (plataforma principal)
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto hover:text-accent transition-colors duration-200"
            onClick={() => window.open("https://open.spotify.com/show/2kCHrwupmLhQs5aFOBJ2z6", '_blank')}
          >
            → Spotify
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto hover:text-accent transition-colors duration-200"
            onClick={() => window.open("https://podcasts.apple.com/us/podcast/no-tiene-nombre/id1682861526", '_blank')}
          >
            → Apple Podcasts
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto hover:text-accent transition-colors duration-200"
            onClick={() => window.open("https://lnns.co/Ytoh4vIkAjq", '_blank')}
          >
            → Listen Notes
          </Button>
        </div>
      </div>
    </div>
  );
}