import { PodcastData, Episode } from './types';

export async function fetchPodcastRSS(): Promise<PodcastData> {
  try {
    const response = await fetch('https://www.ivoox.com/feed_fg_f1277993_filtro_1.xml');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
      throw new Error('Invalid RSS feed structure');
    }
    
    const title = channel.querySelector('title')?.textContent || 'No Tiene Nombre';
    const description = channel.querySelector('description')?.textContent || 'Podcast sobre IA en español';
    
    const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 10);
    
    const episodes: Episode[] = items.map((item, index) => {
      const titleElement = item.querySelector('title');
      const descriptionElement = item.querySelector('description');
      const pubDateElement = item.querySelector('pubDate');
      const linkElement = item.querySelector('link');
      const enclosureElement = item.querySelector('enclosure');
      const durationElement = item.querySelector('duration') || item.querySelector('itunes\\:duration');
      
      return {
        id: `episode-${index}`,
        title: titleElement?.textContent?.trim() || `Episodio ${index + 1}`,
        description: descriptionElement?.textContent?.replace(/<[^>]*>/g, '').trim() || 'Sin descripción disponible',
        pubDate: pubDateElement?.textContent || new Date().toISOString(),
        duration: durationElement?.textContent || undefined,
        audioUrl: enclosureElement?.getAttribute('url') || undefined,
        link: linkElement?.textContent || undefined,
      };
    });
    
    return { title, description, episodes };
  } catch (error) {
    console.error('Error fetching podcast RSS:', error);
    throw error;
  }
}