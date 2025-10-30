import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// Spark plugins removed
import { resolve } from 'path'
import { visitorStatsPlugin } from './server/visitorStatsPlugin';

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    visitorStatsPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^\/episodes\.json$/,
            // Prefer network first so clients get fresh snapshot after a deployment;
            // fall back to cache when network is unavailable.
            handler: 'NetworkFirst',
            options: {
              cacheName: 'episodes-json',
              // Keep a small cache to reduce stale-wait — 1 hour
              expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 },
              fetchOptions: { cache: 'no-store' },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: "No Tiene Nombre Podcast",
        short_name: "NTN Podcast",
        description: "Podcast de tecnología y curiosidades, por El Bruno.",
        start_url: ".",
        display: "standalone",
        background_color: "#18181b",
        theme_color: "#18181b",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    // Dev-only bundle analysis: run `vite build --mode analyze` to generate stats.html
    ...(mode === 'analyze'
      ? [
          visualizer({
            filename: 'stats.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
            open: false,
          }) as PluginOption,
        ]
      : [])
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
}));
