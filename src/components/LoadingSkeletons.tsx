import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function EpisodeCardSkeleton() {
  return (
    <Card className="glass-effect border-border/20 relative overflow-hidden perspective-1000 p-6 space-y-4">
      {/* Episode number indicator */}
      <div className="absolute top-4 left-4">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      {/* Header */}
      <div className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md shrink-0" />
        </div>
        
        {/* Metadata */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Action button */}
      <div className="pt-2">
        <Skeleton className="h-4 w-32" />
      </div>
    </Card>
  );
}

export function EpisodeListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Loading message */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg text-muted-foreground font-display">
          Cargando episodios...
        </p>
        <p className="text-sm text-muted-foreground/60 mt-2">
          Conectando con la red neural del podcast
        </p>
      </div>
      
      {/* Skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <EpisodeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}