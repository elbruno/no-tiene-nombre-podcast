import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/LanguageContext";
// Spark import removed

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Register SW with update prompt
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      const updateSW = registerSW({
        onNeedRefresh() {
          // Nicer toast prompt with action
          toast.info('Nueva versión disponible', {
            description: 'Actualiza para obtener las últimas mejoras.',
            action: {
              label: 'Actualizar',
              onClick: () => updateSW(),
            },
            duration: 8000,
          });
        },
        onOfflineReady() {
          toast.success('Listo para usar sin conexión');
        },
      });
    }).catch((err) => {
      // Silently fail if PWA module not available (production build issue)
      console.warn('PWA registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <App />
        <Toaster position="bottom-right" richColors closeButton />
      </LanguageProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
