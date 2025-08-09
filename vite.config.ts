import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// Spark plugins removed
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
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
