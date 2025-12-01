#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const configPath = path.join(__dirname, '..', 'src', 'lib', 'podcast-config.json');
  const publicDir = path.join(__dirname, '..', 'public');
  const outputPath = path.join(publicDir, 'episodes.json');

  const configRaw = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(configRaw);
  const rssUrl = config.rssFeedUrl;
  if (!rssUrl) {
    console.error('Missing rssFeedUrl in src/lib/podcast-config.json');
    process.exit(1);
  }

  console.log('[fetch-rss] Fetching', rssUrl);
  const res = await fetch(rssUrl);
  if (!res.ok) {
    console.error('[fetch-rss] HTTP error', res.status, res.statusText);
    process.exit(2);
  }
  const xml = await res.text();
  // Save raw XML (optional)
  const rawXmlPath = path.join(publicDir, 'episodes.xml');
  await fs.writeFile(rawXmlPath, xml, 'utf-8');

  // Minimal parse to JSON using a tiny regex-based approach (no external deps)
  // Note: This is a lightweight snapshot, the app still parses on client for full fidelity.
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>([\s\S]*?)<\/title>/;
  const descRegex = /<description>([\s\S]*?)<\/description>/;
  const pubRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
  const linkRegex = /<link>([\s\S]*?)<\/link>/;
  const enclosureRegex = /<enclosure[^>]*url="([^"]+)"[^>]*>/;
  const itunesImgRegex = /<itunes:image[^>]*href="([^"]+)"[^>]*\/?>(?:<\/itunes:image>)?/;

  // Helper function to extract content from CDATA or regular text
  const extractContent = (rawContent) => {
    if (!rawContent) return '';
    // Check if content is wrapped in CDATA
    const cdataMatch = rawContent.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    if (cdataMatch) {
      return cdataMatch[1].trim();
    }
    // Otherwise, strip HTML tags and return
    return rawContent.replace(/<[^>]*>/g, '').trim();
  };

  // Helper function to extract embedId from Ivoox URLs
  const extractEmbedId = (url) => {
    if (!url) return null;
    // Pattern: /(rf_|mf_)(\d+)/ - matches rf_ (link) or mf_ (audio) followed by digits
    const match = url.match(/(rf_|mf_)(\d+)/);
    return match ? match[2] : null;
  };

  // Helper function to generate Ivoox embed URL from embedId
  const generateEmbedUrl = (embedId) => {
    if (!embedId) return null;
    return `https://www.ivoox.com/player_ej_${embedId}_6_1.html?c1=d69776`;
  };

  const items = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const titleRaw = itemXml.match(titleRegex)?.[1] || '';
    const descRaw = itemXml.match(descRegex)?.[1] || '';
    const title = extractContent(titleRaw);
    const description = extractContent(descRaw);
    const pubDate = (itemXml.match(pubRegex)?.[1] || '').trim();
    const link = (itemXml.match(linkRegex)?.[1] || '').trim();
    const audioUrl = itemXml.match(enclosureRegex)?.[1];
    const imageUrl = itemXml.match(itunesImgRegex)?.[1];
    
    // Extract embedId from link or audioUrl
    const embedId = extractEmbedId(link) || extractEmbedId(audioUrl);
    const embedUrl = generateEmbedUrl(embedId);
    
    items.push({ title, description, pubDate, link, audioUrl, imageUrl, embedId, embedUrl });
    if (items.length >= 20) break;
  }

  const snapshot = { generatedAt: new Date().toISOString(), items };
  await fs.writeFile(outputPath, JSON.stringify(snapshot, null, 2), 'utf-8');
  console.log('[fetch-rss] Wrote', outputPath, 'with', items.length, 'items');
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
