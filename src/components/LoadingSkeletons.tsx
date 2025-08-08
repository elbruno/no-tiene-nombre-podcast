import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingState } from "@/components/DeathStarLoader";

export function EpisodeCardSkeleton() {
  return (
    <Card className="border-accent/30 bg-card/80 backdrop-blur-sm">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-t-lg" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md shrink-0" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-32 mt-3" />
      </CardContent>
    </Card>
  );
}

export function EpisodeListSkeleton() {
  return (
    <LoadingState 
      message="Descargando datos del imperio..." 
      className="min-h-[400px]" 
    />
  );
}