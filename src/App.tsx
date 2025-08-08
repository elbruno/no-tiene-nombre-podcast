import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Microphone, Rss, Sparkle } from "@phosphor-icons/react";
import { EpisodeCard } from "@/components/EpisodeCard";
import { PlatformLinks } from "@/components/PlatformLinks";
import { EpisodeListSkeleton } from "@/components/LoadingSkeletons";
import { ErrorState } from "@/components/ErrorState";
import { WarpStars } from "@/components/WarpStars";
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
    <div className="min-h-screen bg-background starfield relative">
      <WarpStars />
      
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-accent/20 z-10">
        {/* Hero Background Image */}
        {!loading && !error && podcastData?.episodes[0]?.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${podcastData.episodes[0].imageUrl})` }}
          />
        )}
        
        {/* Cosmic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
        
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-accent/20 border border-accent/40 backdrop-blur-sm glow-border">
                <Microphone size={32} className="text-accent glow-text" weight="duotone" />
              </div>
              <Badge variant="secondary" className="text-sm font-medium backdrop-blur-sm bg-secondary/80 border-accent/30">
                <Sparkle size={14} className="mr-1 text-accent" weight="fill" />
                Podcast sobre IA
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight font-display glow-text">
              NO TIENE NOMBRE
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Descubre las últimas tendencias y desarrollos en inteligencia artificial 
              a través de conversaciones profundas en español.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 backdrop-blur-sm glow-border hover:shadow-lg hover:shadow-accent/30 transition-all duration-300"
                onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
              >
                <Rss size={20} className="mr-2" />
                Suscríbete gratis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="backdrop-blur-sm bg-background/50 hover:bg-background/70 border-accent/40 hover:border-accent/60 text-foreground hover:text-accent transition-all duration-300"
              >
                Ver últimos episodios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Platform Links */}
        <PlatformLinks className="mb-16" />

        {/* Episodes Section */}
        <section id="episodes" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-foreground font-display glow-text">
              ÚLTIMOS EPISODIOS
            </h2>
            <Badge variant="outline" className="text-sm border-accent/40 bg-card/50 backdrop-blur-sm">
              {loading ? "Cargando..." : `${podcastData?.episodes.length || 0} episodios`}
            </Badge>
          </div>

          {loading && <EpisodeListSkeleton />}
          
          {error && <ErrorState onRetry={loadPodcastData} />}
          
          {!loading && !error && podcastData && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {podcastData.episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="mt-20 py-16 bg-card/30 rounded-2xl border border-accent/20 backdrop-blur-sm glow-border">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-display glow-text">
              SOBRE EL PODCAST
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              "No Tiene Nombre" es un podcast que explora el fascinante mundo de la 
              inteligencia artificial desde una perspectiva hispana. Cada episodio 
              profundiza en temas actuales, entrevistas con expertos y análisis 
              de las últimas innovaciones en IA.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-card/50 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent mb-2 glow-text">+50</div>
                <div className="text-sm text-muted-foreground">Episodios publicados</div>
              </div>
              <div className="p-4 bg-card/50 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent mb-2">🇪🇸</div>
                <div className="text-sm text-muted-foreground">Contenido en español</div>
              </div>
              <div className="p-4 bg-card/50 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent mb-2">🤖</div>
                <div className="text-sm text-muted-foreground">Enfoque en IA</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-accent/20 bg-card/20 mt-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Microphone size={20} className="text-accent glow-text" />
              <span className="font-medium text-foreground font-display">NO TIENE NOMBRE</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Un podcast sobre inteligencia artificial en español
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;