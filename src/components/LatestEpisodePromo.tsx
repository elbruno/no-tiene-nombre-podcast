import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Episode } from "@/lib/types";
import { Headphones, X } from "lucide-react";

type Variant = "floating" | "banner";

interface LatestEpisodePromoProps {
  episode?: Episode | null;
  loading?: boolean;
  variant?: Variant;
  dismissible?: boolean;
  storageKey?: string; // sessionStorage key to remember dismissal
}

export function LatestEpisodePromo({
  episode,
  loading = false,
  variant = "floating",
  dismissible = true,
  storageKey = "ntn-latest-ep-hidden",
}: LatestEpisodePromoProps) {
  const prefersReduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!dismissible) return;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === "1") setHidden(true);
    } catch {}
  }, [dismissible, storageKey]);

  const handleDismiss = () => {
    setHidden(true);
    try { sessionStorage.setItem(storageKey, "1"); } catch {}
  };

  const openTarget = () => {
    if (!episode) return;
    const target = episode.audioUrl || episode.link;
    if (target) window.open(target, "_blank");
  };

  if (hidden) return null;

  // Hide if nothing to show and not loading
  if (!loading && (!episode || (!episode.audioUrl && !episode.link))) return null;

  const content = (
    <div className="flex items-center gap-4">
      {episode?.imageUrl ? (
        <img
          src={episode.imageUrl}
          alt={episode.title}
          className={`rounded-lg object-cover ${variant === "banner" ? "h-10 w-10" : "h-12 w-12"}`}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className={`rounded-lg bg-muted flex items-center justify-center ${variant === "banner" ? "h-10 w-10" : "h-12 w-12"}`}>
          <Headphones className="text-primary" size={20} />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground mb-0.5">Último episodio</div>
        <div className="text-sm font-medium text-foreground truncate max-w-[52vw] sm:max-w-none">
          {loading ? "Cargando…" : episode?.title}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size={variant === "banner" ? "sm" : "default"}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={openTarget}
          disabled={loading}
        >
          Escuchar
        </Button>
        {dismissible && (
          <Button
            variant="ghost"
            size={variant === "banner" ? "icon" : "sm"}
            className="glass-effect"
            onClick={handleDismiss}
            aria-label="Cerrar"
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === "banner") {
    return (
      <motion.div
        initial={prefersReduced ? undefined : { y: -24, opacity: 0 }}
        animate={prefersReduced ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95vw] sm:w-auto max-w-3xl px-3 sm:px-4"
      >
        <div className="glass-effect border [border-color:var(--border)] rounded-xl px-3 sm:px-4 py-2 shadow-lg">
          {content}
        </div>
      </motion.div>
    );
  }

  // Floating card (default)
  return (
    <motion.div
      initial={prefersReduced ? undefined : { x: 24, y: 24, opacity: 0 }}
      animate={prefersReduced ? undefined : { x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-4 right-4 z-50 max-w-[90vw] sm:max-w-sm"
    >
      <div className="glass-effect border [border-color:var(--border)] rounded-2xl p-3 sm:p-4 shadow-xl">
        {content}
      </div>
    </motion.div>
  );
}
