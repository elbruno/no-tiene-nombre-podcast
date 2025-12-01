export interface Episode {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  duration?: string;
  audioUrl?: string;
  link?: string;
  imageUrl?: string;
  embedId?: string;
  embedUrl?: string;
}

export interface PodcastData {
  title: string;
  description: string;
  imageUrl?: string;
  episodes: Episode[];
}

export interface FetchPodcastResult {
  data: PodcastData;
  source: 'snapshot' | 'live';
  reason?: string;
}