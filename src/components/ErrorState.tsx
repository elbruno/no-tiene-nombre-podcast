import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-md mx-auto">
      <Alert variant="destructive">
        <WarningCircle size={16} />
        <AlertTitle>Error al cargar episodios</AlertTitle>
        <AlertDescription className="mt-2">
          No pudimos cargar los últimos episodios del podcast. Verifica tu conexión a internet e intenta de nuevo.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 text-center">
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <ArrowClockwise size={16} />
          Intentar de nuevo
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2">
          Mientras tanto, puedes escuchar en:
        </h4>
        <div className="space-y-2 text-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto"
            onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
          >
            → iVoox (plataforma principal)
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto"
            onClick={() => window.open("https://open.spotify.com/show/2kCHrwupmLhQs5aFOBJ2z6", '_blank')}
          >
            → Spotify
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start p-0 h-auto"
            onClick={() => window.open("https://lnns.co/Ytoh4vIkAjq", '_blank')}
          >
            → Listen Notes
          </Button>
        </div>
      </div>
    </div>
  );
}