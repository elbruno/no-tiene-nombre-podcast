export interface Episode {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  duration?: string;
  audioUrl?: string;
  link?: string;
  imageUrl?: string;
}

export interface PodcastData {
  title: string;
  description: string;
  imageUrl?: string;
  episodes: Episode[];
}