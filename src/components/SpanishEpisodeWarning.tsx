import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SpanishEpisodeWarning() {
  return (
    <Alert className="glass-effect border-accent/40">
      <Info className="h-4 w-4" />
      <AlertTitle>Note about Episode Language</AlertTitle>
      <AlertDescription>
        All podcast episodes are recorded in Spanish (🇪🇸). This website interface is available in English for your convenience, but the audio content remains in Spanish.
      </AlertDescription>
    </Alert>
  );
}
