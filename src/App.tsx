import { useState, useEffect, useRef } from 'react';
function useSectionFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return [ref, visible] as const;
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Rss, Sparkles, TrendingUp, Users, Clock, Github } from "lucide-react";
import { EpisodeCard } from "@/components/EpisodeCard";
import { EpisodeListItem } from "@/components/EpisodeListItem";
import { PlatformLinks } from "@/components/PlatformLinks";
import { EpisodeListSkeleton } from "@/components/LoadingSkeletons";
import { ErrorState } from "@/components/ErrorState";
import { NeuralBackground } from "@/components/NeuralBackground";
import { SocialLinks } from "@/components/SocialLinks";
import { fetchPodcastRSS } from "@/lib/podcast-api";
import { PodcastData } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { HostBioCard } from "@/components/HostBioCard";
import { CTABanner } from "@/components/CTABanner";
import { JsonLd } from "@/components/JsonLd";
import { motion, useReducedMotion } from "framer-motion";
import { LatestEpisodePromo } from "@/components/LatestEpisodePromo";
import { EpisodesToolbar } from "@/components/EpisodesToolbar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SpanishEpisodeWarning } from "@/components/SpanishEpisodeWarning";
import { Switch } from "@/components/ui/switch";
import { VisitorStatsDialog } from "@/components/VisitorStatsDialog";


function App() {
  const { language, texts: pageTexts } = useLanguage();
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  // Dev-only: prefer snapshot toggle for faster local development
  // Initialize from localStorage when available (browser-only)
  const [preferSnapshot, setPreferSnapshot] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return true;
      const raw = window.localStorage.getItem('preferSnapshot');
      return raw === null ? true : raw === 'true';
    } catch (e) {
      return true;
    }
  });

  // Safe development flag - avoid using import.meta directly without guards
  let isDev = false;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - import.meta is replaced by Vite
    isDev = typeof window !== 'undefined' && (import.meta as any)?.env?.DEV;
  } catch (e) {
    isDev = false;
  }

  // Track which data source was used last
  const [dataSource, setDataSource] = useState<'snapshot' | 'live' | null>(null);
  const [dataSourceReason, setDataSourceReason] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
  transition: { duration: 0.4 },
    },
  };

  const loadPodcastData = async (preferSnapshotOverride?: boolean) => {
    try {
      setLoading(true);
      setError(false);
      console.log('[App] Loading podcast data...');
  // decide whether to prefer snapshot: override if provided, otherwise use state
  const prefer = typeof preferSnapshotOverride === 'boolean' ? preferSnapshotOverride : preferSnapshot;
  const result = await fetchPodcastRSS(prefer ? { preferSnapshot: true } : {});
  // result contains { data, source }
  setDataSource(result.source);
  setDataSourceReason(result.reason || null);
  console.log('[App] Podcast data loaded:', result);
  setPodcastData(result.data);
    } catch (err) {
      console.error('[App] Failed to load podcast data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPodcastData();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Promote latest episode immediately */}
      {loading && <LatestEpisodePromo loading variant="banner" />}
      {!loading && !error && podcastData?.episodes?.[0] && (
        <LatestEpisodePromo episode={podcastData.episodes[0]} variant="floating" />
      )}
      <NeuralBackground />
      {podcastData && podcastData.episodes?.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": podcastData.episodes.map((ep, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "PodcastEpisode",
                name: ep.title,
                description: ep.description,
                datePublished: ep.pubDate,
                url: ep.link || "https://notienenombre.com/",
                image: ep.imageUrl,
                partOfSeries: {
                  "@type": "PodcastSeries",
                  name: podcastData.title || "No Tiene Nombre Podcast",
                },
                potentialAction: ep.audioUrl
                  ? {
                      "@type": "ListenAction",
                      target: [ep.audioUrl],
                    }
                  : undefined,
              },
            })),
          }}
        />
      )}
      
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center">
        <motion.div
          className="absolute inset-0 gradient-bg opacity-50"
          initial={prefersReduced ? undefined : { opacity: 0 }}
          animate={prefersReduced ? undefined : { opacity: 0.5 }}
          transition={{ duration: 0.8 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Theme and Language Switchers */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <VisitorStatsDialog />
            <ThemeSwitcher />
            <LanguageSwitcher />
            {/* Dev-only prefer-snapshot toggle + reload */}
            {isDev && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/10">
                <label className="text-xs text-muted-foreground mr-2">Dev snapshot</label>
                <Switch checked={preferSnapshot} onCheckedChange={(v: boolean) => { setPreferSnapshot(v); try { window.localStorage.setItem('preferSnapshot', String(!!v)); } catch {} }} />
                <Button size="sm" variant="outline" onClick={() => loadPodcastData()} className="ml-2">Reload</Button>
                {/* indicator of last used data source */}
                {dataSource && (
                  <span title={dataSourceReason || ''} className={`ml-2 text-xs font-medium px-2 py-1 rounded ${dataSource === 'snapshot' ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-800'}`}>
                    {dataSource === 'snapshot' ? 'Snapshot' : 'Live'}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Quick Social Access */}
          <div className="flex justify-center mb-8">
            <SocialLinks variant="header" />
          </div>
          
          <motion.div 
            className="max-w-5xl mx-auto text-center space-y-8"
            initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
            whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon and Badge */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 rounded-2xl glass-effect">
                <Brain size={48} className="text-primary" />
              </div>
              <Badge variant="outline" className="text-sm font-medium glass-effect border-primary/30 text-primary">
                <Sparkles size={14} className="mr-2" />
                {pageTexts.hero.badge}
              </Badge>
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground tracking-tight font-display">
                {pageTexts.hero.title.split(' ')[0]}
                <br />
                <span className="text-primary glow-text">{pageTexts.hero.title.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {pageTexts.hero.subtitle}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
              initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
              >
                <Rss size={24} className="mr-3" />
                {pageTexts.hero.cta_subscribe}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass-effect hover:bg-accent/10 border-accent/40 hover:border-accent text-accent hover:text-accent px-8 py-4 text-lg font-semibold transition-all duration-300"
                onClick={() => document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {pageTexts.hero.cta_explore}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass-effect hover:bg-secondary/10 border-secondary/40 hover:border-secondary text-secondary hover:text-secondary px-8 py-4 text-lg font-semibold transition-all duration-300"
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {pageTexts.hero.cta_testimonials}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 relative z-10 space-y-24">
        {/* Platform Links */}
        <PlatformLinks />

        {/* Episodes Section - render immediately on load */}
        {
          (
            <section id="episodes" className="scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground font-display mb-4">
                  {pageTexts.episodes.section_title}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  
                </p>
                {language === 'en' && (
                  <div className="mt-6 max-w-3xl mx-auto">
                    <SpanishEpisodeWarning />
                  </div>
                )}
                <div className="mt-4">
                  <EpisodesToolbar
                    total={podcastData?.episodes.length || 0}
                    search={search}
                    setSearch={setSearch}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                </div>
              </div>

              {loading && <EpisodeListSkeleton />}
              {error && <ErrorState onRetry={loadPodcastData} />}
              {!loading && !error && podcastData && (
                <>
                  {/* Search moved into EpisodesToolbar */}
                  {console.log('[App] Rendering episodes:', podcastData.episodes)}
                  {(() => {
                    const eps = podcastData.episodes
                      .filter(ep =>
                        ep.title.toLowerCase().includes(search.toLowerCase()) ||
                        ep.description.toLowerCase().includes(search.toLowerCase())
                      )
                      .slice(0, pageSize);
                    if (viewMode === 'list') {
                      return (
                        <motion.div
                          className="flex flex-col gap-4"
                          variants={container}
                          initial="hidden"
                          animate="show"
                        >
                          {eps.map((episode, index) => (
                            <motion.div key={episode.id} variants={item}>
                              <EpisodeListItem episode={episode} index={index} />
                            </motion.div>
                          ))}
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {eps.map((episode, index) => (
                          <motion.div key={episode.id} variants={item}>
                            <EpisodeCard episode={episode} index={index} />
                          </motion.div>
                        ))}
                      </motion.div>
                    );
                  })()}
                </>
              )}
            </section>
          )
        }

        {/* About Section */}
        {(() => {
          const [aboutRef, aboutVisible] = useSectionFadeIn();
          return (
            <section ref={aboutRef} className={`py-20 transition-all duration-700 ease-out ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="max-w-4xl mx-auto text-center">
                <div className="p-12 glass-effect rounded-3xl space-y-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 rounded-2xl bg-primary/20">
                      <Brain size={48} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground font-display">
                    {pageTexts.about.section_title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    {pageTexts.about.description}
                  </p>
                  {/* <HostBioCard /> Removed as requested */}
                  <div className="pt-6">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="glass-effect border-primary/40 hover:border-primary text-primary hover:text-primary"
                      onClick={() => window.open("https://www.ivoox.com/podcast-bruno-no-tiene-nombre_sq_f1277993_1.html", '_blank')}
                    >
                      {pageTexts.about.cta_about}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Stats Section */}
        {(() => {
          const [statsRef, statsVisible] = useSectionFadeIn();
          return (
            <section ref={statsRef} className={`py-16 transition-all duration-700 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-12 font-display">
                  {pageTexts.stats.section_title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 glass-effect rounded-2xl hover-lift">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <TrendingUp size={32} className="text-primary" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2 font-display">{pageTexts.stats.episodes}</div>
                    <div className="text-muted-foreground">{pageTexts.stats.episodes_label}</div>
                    <div className="text-muted-foreground">{pageTexts.stats.episodes_label_funny}</div>
                  </div>
                  <div className="p-8 glass-effect rounded-2xl hover-lift">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 rounded-xl bg-accent/20">
                        <Users size={32} className="text-accent" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-accent mb-2 font-display">{pageTexts.stats.spanish}</div>
                    <div className="text-muted-foreground">{pageTexts.stats.spanish_label}</div>
                  </div>
                  <div className="p-8 glass-effect rounded-2xl hover-lift">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <Clock size={32} className="text-primary" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2 font-display">{pageTexts.stats.focus}</div>
                    <div className="text-muted-foreground">{pageTexts.stats.focus_label}</div>
                    <div className="text-muted-foreground">{pageTexts.stats.focus_label_funny}</div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

  {/* Testimonials Section */}
  <TestimonialsSection />
  <CTABanner />
  </main>

      {/* Footer */}
  <footer className="border-t [border-color:var(--border)] glass-effect mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col gap-12">
            {/* Footer Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t [border-color:var(--border)]">
              <div className="flex items-center gap-3">
                <Brain size={24} className="text-primary" />
                <span className="font-bold text-foreground font-display text-lg">{pageTexts.footer.brand}</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  {pageTexts.footer.copyright}
                </p>
                <a
                  href="https://github.com/elbruno/no-tiene-nombre-podcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  title="Código fuente en GitHub"
                >
                  <Github size={16} />
                  <span>Código en GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;