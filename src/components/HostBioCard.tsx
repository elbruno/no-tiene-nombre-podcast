import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function HostBioCard() {
  return (
    <Card className="glass-effect p-8 flex flex-col items-center text-center shadow-lg max-w-md mx-auto mb-12">
  <img src="https://avatars.githubusercontent.com/u/1199142?v=4" alt="Foto del host Bruno" loading="lazy" className="w-24 h-24 rounded-full mb-4 border-2 border-primary shadow-lg" />
      <CardHeader className="mb-2">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Brain size={20} className="text-primary" />
          Bruno Capuano
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-lg leading-relaxed">
        Ingeniero, speaker y podcaster. Me gusta hablar de IA, robots y cosas tech. Si no entiendes algo, ¡es culpa mía!
      </CardContent>
    </Card>
  );
}
