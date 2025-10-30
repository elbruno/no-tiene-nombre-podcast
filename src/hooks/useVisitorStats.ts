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
const SESSION_VISIT_KEY = 'session_visit_count';
const PAGE_LOADED_KEY = 'page_loaded';

interface AggregatedVisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  locations: Record<string, number>;
  lastUpdated: string;
}

// Generate a simple session ID (not for security purposes)
// This is used only for visitor analytics tracking, not authentication
const generateSessionId = () => {
  const randomBytes = new Uint8Array(12);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomBytes);
    // Use base64 for compactness; remove non-alphanumerics if desired
    const randomStr = Array.from(randomBytes).map(b => b.toString(36)).join('');
    return `${Date.now()}-${randomStr}`;
  } else {
    // Fallback to Math.random(), but warn (should never happen in modern browsers)
    console.warn('window.crypto.getRandomValues not available. Using Math.random() fallback.');
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
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

// Get visitor location using IP geolocation service
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
    
    if (!response.ok) {
      console.warn('Geolocation API returned error:', response.status);
      return 'Unknown';
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.warn('Invalid geolocation response structure');
      return 'Unknown';
    }
    
    const city = data.city || 'Unknown';
    const country = data.country_name || 'Unknown';
    const location = `${city}, ${country}`;
    
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
    const updateSessionVisitCount = () => {
      const currentSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!currentSessionId) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, getSessionId());
      }

      let sessionVisits = parseInt(sessionStorage.getItem(SESSION_VISIT_KEY) || '0', 10);

      if (!sessionStorage.getItem(PAGE_LOADED_KEY)) {
        sessionVisits += 1;
        sessionStorage.setItem(SESSION_VISIT_KEY, sessionVisits.toString());
        sessionStorage.setItem(PAGE_LOADED_KEY, 'true');
      }

      return sessionVisits;
    };

    const fetchAggregatedStats = async (location: string | undefined): Promise<AggregatedVisitorStats> => {
      const response = await fetch('/api/visitor-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to record visit: ${response.status}`);
      }

      return response.json();
    };

    const trackVisit = async () => {
      setIsLoading(true);

      // Ensure session exists and get unique visitor status
      getSessionId();
      const isUnique = isUniqueVisitor();
      const location = await getVisitorLocation();
      const sessionVisits = updateSessionVisitCount();

      let updatedStats: VisitorStats;

      try {
        const aggregated = await fetchAggregatedStats(location);
        updatedStats = {
          totalVisits: aggregated.totalVisits,
          uniqueVisitors: aggregated.uniqueVisitors,
          currentSessionVisits: sessionVisits,
          locations: aggregated.locations,
          userLocation: location,
          lastUpdated: aggregated.lastUpdated,
        };
      } catch (error) {
        console.warn('Failed to reach visitor stats API. Falling back to local counters.', error);
        const localStats = loadLocalStats();
        updatedStats = {
          totalVisits: localStats.totalVisits + 1,
          uniqueVisitors: isUnique ? localStats.uniqueVisitors + 1 : localStats.uniqueVisitors,
          currentSessionVisits: sessionVisits,
          locations: {
            ...localStats.locations,
            [location]: (localStats.locations[location] || 0) + 1,
          },
          userLocation: location,
          lastUpdated: new Date().toISOString(),
        };
      }

      saveLocalStats(updatedStats);
      setStats(updatedStats);
      setIsLoading(false);
    };

    trackVisit();
  }, []);

  return { stats, isLoading };
};
