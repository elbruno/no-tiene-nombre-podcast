import { useEffect, useState } from 'react';

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  currentSessionVisits: number;
  locations: Record<string, number>;
  userLocation?: string;
  lastUpdated: string;
}

const STATS_STORAGE_KEY = 'visitor_stats';
const SESSION_STORAGE_KEY = 'session_id';
const LOCATION_STORAGE_KEY = 'visitor_location';

// Generate a simple session ID
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};

// Track if this is a unique visitor (first visit ever)
const isUniqueVisitor = (): boolean => {
  const hasVisited = localStorage.getItem('has_visited');
  if (!hasVisited) {
    localStorage.setItem('has_visited', 'true');
    return true;
  }
  return false;
};

// Get visitor location using browser's geolocation API
const getVisitorLocation = async (): Promise<string> => {
  // Check if we already have location stored
  const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (storedLocation) {
    return storedLocation;
  }

  // Try to get approximate location using a free IP geolocation service
  try {
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'force-cache',
    });
    const data = await response.json();
    const location = `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`;
    localStorage.setItem(LOCATION_STORAGE_KEY, location);
    return location;
  } catch (error) {
    console.warn('Could not determine visitor location:', error);
    return 'Unknown';
  }
};

// Load stats from localStorage
const loadLocalStats = (): VisitorStats => {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading stats from localStorage:', error);
  }

  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    currentSessionVisits: 0,
    locations: {},
    lastUpdated: new Date().toISOString(),
  };
};

// Save stats to localStorage
const saveLocalStats = (stats: VisitorStats) => {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats to localStorage:', error);
  }
};

export const useVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>(loadLocalStats());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      setIsLoading(true);

      // Get session info
      getSessionId();
      const isUnique = isUniqueVisitor();
      const location = await getVisitorLocation();

      // Load current stats
      const currentStats = loadLocalStats();

      // Update stats
      const updatedStats: VisitorStats = {
        totalVisits: currentStats.totalVisits + 1,
        uniqueVisitors: isUnique
          ? currentStats.uniqueVisitors + 1
          : currentStats.uniqueVisitors,
        currentSessionVisits: (currentStats.currentSessionVisits || 0) + 1,
        locations: {
          ...currentStats.locations,
          [location]: (currentStats.locations[location] || 0) + 1,
        },
        userLocation: location,
        lastUpdated: new Date().toISOString(),
      };

      // Save and update state
      saveLocalStats(updatedStats);
      setStats(updatedStats);
      setIsLoading(false);
    };

    trackVisit();
  }, []);

  return { stats, isLoading };
};
