import { PodcastData, Episode, FetchPodcastResult } from './types';
import config from './podcast-config.json';

// Timeout (ms) for remote RSS fetch to avoid long hangs in the browser
const REMOTE_FETCH_TIMEOUT = 3000;

export type FetchPodcastOptions = { preferSnapshot?: boolean };

// Helper to extract embedId from Ivoox URLs
function extractEmbedId(url?: string): string | undefined {
  if (!url) return undefined;
  // Pattern: /(rf_|mf_)(\d+)/ - matches rf_ (link) or mf_ (audio) followed by digits
  const match = url.match(/(rf_|mf_)(\d+)/);
  return match ? match[2] : undefined;
}

// Helper to generate Ivoox embed URL from embedId
function generateEmbedUrl(embedId?: string): string | undefined {
  if (!embedId) return undefined;
  return `https://www.ivoox.com/player_ej_${embedId}_6_1.html?c1=d69776`;
}

export async function fetchPodcastRSS(options: FetchPodcastOptions = {}): Promise<FetchPodcastResult> {
  try {
    // If caller explicitly requests preferSnapshot, or we detect Vite dev mode
    // and the caller didn't opt out, prefer the local snapshot for speed.
    const preferSnapshot = options.preferSnapshot === true;
    try {
      // Determine dev mode safely - import.meta.env is replaced at build time
      const isDev = (() => {
        try {
          return import.meta.env.DEV === true;
        } catch (e) {
          return false;
        }
      })();
      if (preferSnapshot || isDev) {
        console.log('[PodcastAPI] preferSnapshot/dev mode: attempting local snapshot /episodes.json for speed');
        const snapshotRes = await fetch('/episodes.json', { cache: 'no-store' });
        if (snapshotRes.ok) {
          const snapshot = await snapshotRes.json();
          const episodes = (snapshot.items || []).map((it: any, index: number) => ({
            id: `snapshot-${index}`,
            title: it.title || `Episodio ${index + 1}`,
            description: (it.description || '').trim(),
            pubDate: it.pubDate || new Date().toISOString(),
            duration: undefined,
            audioUrl: it.audioUrl,
            link: it.link,
            imageUrl: it.imageUrl,
            embedId: it.embedId,
            embedUrl: it.embedUrl,
          }));
          return {
            data: {
              title: snapshot.title || 'No Tiene Nombre',
              description: snapshot.description || 'Podcast sobre IA en español',
              imageUrl: episodes[0]?.imageUrl,
              episodes,
            },
            source: 'snapshot',
            reason: 'requested-snapshot',
          };
        }
        console.log('[PodcastAPI] DEV snapshot not available, falling back to remote RSS');
      }
    } catch (devErr) {
      // Non-fatal — continue to attempt remote fetch
      console.warn('[PodcastAPI] Dev snapshot check failed, will try remote RSS:', devErr);
    }

    console.log('[PodcastAPI] Fetching RSS feed from:', config.rssFeedUrl);
    // Helper to attempt fetch with timeout
    const tryFetchText = async (url: string, timeout = REMOTE_FETCH_TIMEOUT) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.text();
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    let xmlText: string | undefined;
    try {
      // First try a direct fetch. This may fail in-browser due to CORS on some hosts.
      xmlText = await tryFetchText(config.rssFeedUrl);
    } catch (err) {
      console.warn('[PodcastAPI] Direct RSS fetch failed (possible CORS/network). Will try proxy fallback:', err);
      // Try a public CORS proxy fallback (allorigins) as a best-effort to work around CORS.
      // Note: using third-party proxies has trade-offs; it's preferable to serve the RSS from your own server-side snapshot.
      try {
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(config.rssFeedUrl)}`;
        xmlText = await tryFetchText(proxy, REMOTE_FETCH_TIMEOUT * 2);
        console.log('[PodcastAPI] Successfully fetched RSS via allorigins proxy');
      } catch (proxyErr) {
        console.warn('[PodcastAPI] allorigins proxy failed, trying jina.ai reader as last resort:', proxyErr);
        try {
          // jina.ai reader works over http; if the feed is https, try with https -> jina supports https prefix too
          const jina = `https://r.jina.ai/http://${config.rssFeedUrl.replace(/^https?:\/\//, '')}`;
          xmlText = await tryFetchText(jina, REMOTE_FETCH_TIMEOUT * 2);
          console.log('[PodcastAPI] Successfully fetched RSS via jina.ai reader proxy');
        } catch (lastErr) {
          console.error('[PodcastAPI] All remote fetch attempts failed');
          throw lastErr;
        }
      }
    }
    if (!xmlText) throw new Error('Failed to obtain RSS XML text');
    console.log('[PodcastAPI] RSS XML text length:', xmlText.length);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    console.log('[PodcastAPI] Parsed XML:', xmlDoc);
    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
      console.error('[PodcastAPI] Invalid RSS feed structure, missing <channel>');
      throw new Error('Invalid RSS feed structure');
    }
    const title = channel.querySelector('title')?.textContent || 'No Tiene Nombre';
    const description = channel.querySelector('description')?.textContent || 'Podcast sobre IA en español';
    // Extract podcast image from channel (handle itunes namespace and fallback)
    let podcastImage: string | undefined = undefined;
    // Try <itunes:image href="..."/>
    const itunesImageEls = channel.getElementsByTagName('itunes:image');
    if (itunesImageEls.length > 0 && itunesImageEls[0].getAttribute('href')) {
      podcastImage = itunesImageEls[0].getAttribute('href') || undefined;
    } else {
      // Try <image><url>...</url></image>
      const imageUrlEl = channel.querySelector('image url');
      if (imageUrlEl && imageUrlEl.textContent) {
        podcastImage = imageUrlEl.textContent;
      }
    }
    console.log('[PodcastAPI] Podcast image:', podcastImage);
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    console.log('[PodcastAPI] Found episode items:', items.length);
    // Cap at 100 to keep memory reasonable while supporting UI page size options
    const episodes: Episode[] = items.slice(0, 100).map((item, index) => {
      const titleElement = item.querySelector('title');
      const descriptionElement = item.querySelector('description');
      const pubDateElement = item.querySelector('pubDate');
      const linkElement = item.querySelector('link');
      const enclosureElement = item.querySelector('enclosure');
      const durationElement = item.querySelector('duration') || item.querySelector('itunes:duration');
      // Robust extraction of episode image
      let episodeImage: string | undefined = undefined;
      const epItunesImageEls = item.getElementsByTagName('itunes:image');
      if (epItunesImageEls.length > 0 && epItunesImageEls[0].getAttribute('href')) {
        episodeImage = epItunesImageEls[0].getAttribute('href') || undefined;
      } else {
        const epImageEl = item.querySelector('image');
        if (epImageEl && epImageEl.textContent) {
          episodeImage = epImageEl.textContent;
        } else {
          episodeImage = podcastImage;
        }
      }
      console.log(`[PodcastAPI] Episode ${index}:`, {
        title: titleElement?.textContent,
        imageUrl: episodeImage,
        audioUrl: enclosureElement?.getAttribute('url'),
      });
      const link = linkElement?.textContent || undefined;
      const audioUrl = enclosureElement?.getAttribute('url') || undefined;
      const embedId = extractEmbedId(link) || extractEmbedId(audioUrl);
      const embedUrl = generateEmbedUrl(embedId);
      return {
        id: `episode-${index}`,
        title: titleElement?.textContent?.trim() || `Episodio ${index + 1}`,
        description: descriptionElement?.textContent?.replace(/<[^>]*>/g, '').trim() || 'Sin descripción disponible',
        pubDate: pubDateElement?.textContent || new Date().toISOString(),
        duration: durationElement?.textContent || undefined,
        audioUrl,
        link,
        imageUrl: episodeImage,
        embedId,
        embedUrl,
      };
    });
    console.log('[PodcastAPI] Returning podcast data:', { title, description, imageUrl: podcastImage, episodes });
    return { data: { title, description, imageUrl: podcastImage, episodes }, source: 'live', reason: 'remote-success' };
  } catch (error) {
    console.error('Error fetching podcast RSS:', error);
    // Attempt offline fallback to public/episodes.json
    try {
      console.log('[PodcastAPI] Trying offline snapshot fallback /episodes.json');
      const fallbackRes = await fetch('/episodes.json', { cache: 'no-store' });
      if (!fallbackRes.ok) throw new Error(`Fallback HTTP ${fallbackRes.status}`);
      const snapshot = await fallbackRes.json();
      const episodes = (snapshot.items || []).map((it: any, index: number) => ({
        id: `snapshot-${index}`,
        title: it.title || `Episodio ${index + 1}`,
        description: (it.description || '').trim(),
        pubDate: it.pubDate || new Date().toISOString(),
        duration: undefined,
        audioUrl: it.audioUrl,
        link: it.link,
        imageUrl: it.imageUrl,
        embedId: it.embedId,
        embedUrl: it.embedUrl,
      }));
      return { data: {
        title: snapshot.title || 'No Tiene Nombre',
        description: snapshot.description || 'Podcast sobre IA en español',
        imageUrl: episodes[0]?.imageUrl,
        episodes,
      }, source: 'snapshot', reason: 'fallback-snapshot' };
    } catch (fallbackErr) {
      console.error('[PodcastAPI] Offline fallback also failed:', fallbackErr);
      // annotate the original error with a reason and rethrow
      (error as any).reason = 'remote-error';
      throw error;
    }
  }
}