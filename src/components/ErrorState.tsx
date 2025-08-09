import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Warning, ArrowClockwise, Brain } from "@phosphor-icons/react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-8">
      {/* Error Icon */}
      <div className="flex items-center justify-center mb-8">
        <div className="p-4 rounded-2xl glass-effect border border-destructive/30 bg-destructive/10">
          <Warning size={48} className="text-destructive" weight="duotone" />
        </div>
      </div>
      
      {/* Error Alert */}
      <Alert variant="destructive" className="glass-effect border-destructive/30 bg-destructive/5 text-left">
        <Brain size={16} />
        <AlertTitle className="font-display">Error de Conexión Neural</AlertTitle>
        <AlertDescription className="mt-2">
          No se puede establecer conexión con el servidor de podcast. 
          Verifica tu conexión a internet e intenta nuevamente.
        </AlertDescription>
      </Alert>
      
      {/* Retry Button */}
      <div>
        <Button 
          onClick={onRetry} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-3 px-8 py-3 transition-all duration-300 hover:scale-105"
        >
          <ArrowClockwise size={20} />
          Reintentar conexión
        </Button>
      </div>
      
      {/* Alternative Platforms */}
      <div className="p-6 glass-effect rounded-2xl border border-border/20 text-left space-y-4">
        <h4 className="font-semibold text-foreground text-center font-display">
          Plataformas Alternativas
        </h4>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Mientras solucionamos el problema, puedes acceder directamente:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-effect hover:bg-primary/10 border-primary/30 hover:border-primary text-primary justify-between"
            onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
          >
            iVoox
            {/* ExternalLink icon removed */}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-effect hover:bg-accent/10 border-accent/30 hover:border-accent text-accent justify-between"
            onClick={() => window.open("https://open.spotify.com/show/2kCHrwupmLhQs5aFOBJ2z6", '_blank')}
          >
            Spotify
            {/* ExternalLink icon removed */}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-effect hover:bg-muted border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground justify-between"
            onClick={() => window.open("https://podcasts.apple.com/us/podcast/no-tiene-nombre/id1682861526", '_blank')}
          >
            Apple Podcasts
            {/* ExternalLink icon removed */}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-effect hover:bg-muted border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground justify-between"
            onClick={() => window.open("https://lnns.co/Ytoh4vIkAjq", '_blank')}
          >
            Listen Notes
            {/* ExternalLink icon removed */}
          </Button>
        </div>
      </div>
    </div>
  );
}