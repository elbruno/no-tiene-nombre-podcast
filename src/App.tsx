import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Rss, Sparkle, TrendUp, Users, Clock } from "@phosphor-icons/react";
import { EpisodeCard } from "@/components/EpisodeCard";
import { PlatformLinks } from "@/components/PlatformLinks";
import { EpisodeListSkeleton } from "@/components/LoadingSkeletons";
import { ErrorState } from "@/components/ErrorState";
import { NeuralBackground } from "@/components/NeuralBackground";
import { SocialLinks } from "@/components/SocialLinks";
import { fetchPodcastRSS } from "@/lib/podcast-api";
import { PodcastData } from "@/lib/types";

function App() {
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPodcastData = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchPodcastRSS();
      setPodcastData(data);
    } catch (err) {
      console.error('Failed to load podcast data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPodcastData();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NeuralBackground />
      
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 gradient-bg opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Quick Social Access */}
          <div className="flex justify-center mb-8">
            <SocialLinks variant="header" />
          </div>
          
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Icon and Badge */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 rounded-2xl glass-effect">
                <Brain size={48} className="text-primary" weight="duotone" />
              </div>
              <Badge variant="outline" className="text-sm font-medium glass-effect border-primary/30 text-primary">
                <Sparkle size={14} className="mr-2" weight="fill" />
                Podcast sobre Inteligencia Artificial
              </Badge>
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground tracking-tight font-display">
                NO TIENE
                <br />
                <span className="text-primary glow-text">NOMBRE</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Charlas de IA tan profundas que hasta los robots se ríen. ¡En español y sin miedo al futuro!
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
              >
                <Rss size={24} className="mr-3" />
                Suscríbete gratis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass-effect hover:bg-accent/10 border-accent/40 hover:border-accent text-accent hover:text-accent px-8 py-4 text-lg font-semibold transition-all duration-300"
                onClick={() => document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorar episodios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 relative z-10 space-y-24">
        {/* Platform Links */}
        <PlatformLinks />

        {/* Episodes Section */}
        <section id="episodes" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground font-display mb-4">
              Últimos Episodios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              
            </p>
            <Badge variant="outline" className="mt-4 glass-effect border-primary/30 text-primary">
              {loading ? "Cargando..." : `${podcastData?.episodes.length || 0} episodios disponibles`}
            </Badge>
          </div>

          {loading && <EpisodeListSkeleton />}
          
          {error && <ErrorState onRetry={loadPodcastData} />}
          
          {!loading && !error && podcastData && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {podcastData.episodes.map((episode, index) => (
                <EpisodeCard key={episode.id} episode={episode} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 glass-effect rounded-3xl space-y-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/20">
                  <Brain size={48} className="text-primary" weight="duotone" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-foreground font-display">
                Sobre el Podcast
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                "No Tiene Nombre": el podcast donde la IA y el humor se encuentran. Aquí hablamos de robots, dilemas y cosas que ni ChatGPT entiende. Corto, divertido y en español.
              </p>
              
              <div className="pt-6">
                <Button 
                  size="lg"
                  variant="outline"
                  className="glass-effect border-primary/40 hover:border-primary text-primary hover:text-primary"
                  onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
                >
                  Conoce más sobre nosotros
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-12 font-display">
              El podcast de IA más escuchado... por mi abuela 🧓
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 glass-effect rounded-2xl hover-lift">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <TrendUp size={32} className="text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary mb-2 font-display">+400</div>
                <div className="text-muted-foreground">Episodios publicados</div>
                <div className="text-muted-foreground">Episodios (y algún chiste malo)</div>
              </div>
              <div className="p-8 glass-effect rounded-2xl hover-lift">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <Users size={32} className="text-accent" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-accent mb-2 font-display">🇪🇸</div>
                <div className="text-muted-foreground">Contenido en español</div>
              </div>
              <div className="p-8 glass-effect rounded-2xl hover-lift">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Clock size={32} className="text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary mb-2 font-display">🤖</div>
                <div className="text-muted-foreground">Enfoque en IA</div>
                <div className="text-muted-foreground">IA y humanos confundidos</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 glass-effect mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col gap-12">
            {/* Social Media Links */}
            <SocialLinks />
            
            {/* Footer Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/20">
              <div className="flex items-center gap-3">
                <Brain size={24} className="text-primary" weight="duotone" />
                <span className="font-bold text-foreground font-display text-lg">NO TIENE NOMBRE</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                © 2024 - Podcast de IA en español. Si entiendes, eres más listo que un bot.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;