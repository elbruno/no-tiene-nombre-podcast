import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, Users, TrendingUp, Eye } from 'lucide-react';
import { useVisitorStats } from '@/hooks/useVisitorStats';
import { motion } from 'framer-motion';

export function VisitorStatsDialog() {
  const [open, setOpen] = useState(false);
  const { stats, isLoading } = useVisitorStats();

  // Get top locations
  const topLocations = Object.entries(stats.locations || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="glass-effect hover:bg-accent/10 border-accent/40 hover:border-accent text-accent hover:text-accent"
        >
          <BarChart3 size={16} className="mr-2" />
          <span className="hidden sm:inline">Stats</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BarChart3 className="text-primary" />
            Visitor Statistics
          </DialogTitle>
          <DialogDescription>
            Real-time analytics about visitors to this podcast website
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 glass-effect rounded-xl hover-lift"
              >
                <div className="flex items-center justify-between mb-2">
                  <Eye className="text-primary" size={24} />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stats.totalVisits}
                </div>
                <div className="text-sm text-muted-foreground">Total Visits</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 glass-effect rounded-xl hover-lift"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-accent" size={24} />
                </div>
                <div className="text-3xl font-bold text-accent mb-1">
                  {stats.uniqueVisitors}
                </div>
                <div className="text-sm text-muted-foreground">Unique Visitors</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 glass-effect rounded-xl hover-lift"
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="text-primary" size={24} />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stats.currentSessionVisits}
                </div>
                <div className="text-sm text-muted-foreground">This Session</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 glass-effect rounded-xl hover-lift"
              >
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="text-accent" size={24} />
                </div>
                <div className="text-lg font-bold text-accent mb-1 truncate">
                  {stats.userLocation || 'Unknown'}
                </div>
                <div className="text-sm text-muted-foreground">Your Location</div>
              </motion.div>
            </div>

            {/* Top Locations */}
            {topLocations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Top Visitor Locations
                </h3>
                <div className="space-y-2">
                  {topLocations.map(([location, count], index) => (
                    <div
                      key={location}
                      className="flex items-center justify-between p-3 glass-effect rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{location}</span>
                      </div>
                      <span className="text-muted-foreground font-semibold">
                        {count} visit{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer Note */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Statistics are tracked locally in your browser and updated in real-time.
                <br />
                Last updated: {new Date(stats.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
