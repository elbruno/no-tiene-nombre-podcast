# No Tiene Nombre – Modernization Plan (2025)

> Goal: Make the site feel fun and irreverent, yet technically sharp. Think “cosmic nerd energy”: neon cyberpunk accents, microinteractions with restraint, and super-solid performance, SEO, and accessibility.

This plan is phased, evidence-based (links included), and actionable with checklists and acceptance criteria. It maps improvements to files in this repo and keeps the podcast’s funny, informal tone front and center.

---

## Quick baseline

- Stack: Vite + React 19, Tailwind CSS v4, Radix UI, vite-plugin-pwa, Framer Motion. Removed unused heavy deps (Recharts, d3, Three.js, TanStack Query, Heroicons, Octokit) to slim bundle.
- Content: Single-page with Hero, Platforms, Episodes (RSS from iVoox), About, Stats, Testimonials, CTA.
- Style: Dark “neon” theme with glass effects and a neural/star field background.
- PWA: Manifest + autoUpdate SW configured.
- Analytics: GA4 snippet present (placeholder ID).

References used:

- Tailwind CSS v4 capabilities (performance, gradients, container queries, 3D transforms): [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4)
- Vite PWA setup and strategies: [vite-pwa-org.netlify.app/guide](https://vite-pwa-org.netlify.app/guide/)
- Lighthouse CI for perf/accessibility monitoring: [web.dev/articles/lighthouse-ci](https://web.dev/articles/lighthouse-ci)
- Schema.org PodcastSeries markup: [schema.org/PodcastSeries](https://schema.org/PodcastSeries)
- Framer Motion for microinteractions: [framer.com/motion](https://www.framer.com/motion/)
- Bundle analysis: rollup-plugin-visualizer [npmjs.com/package/rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)

---

## Phase 0 – Strategy and guardrails

- [ ] Define brand tone and microcopy guardrails
  - Voice: cheeky, optimistic, curious. Avoid inside-jargon; add playful asides (sparingly). Examples in this doc.
  - Acceptance: All user-facing strings pass a “fun but clear” check; no slang that blocks comprehension.
- [ ] Respect reduced motion and color contrast
  - Enforce prefers-reduced-motion and minimum contrast ratios on primary/accent colors.
  - Acceptance: axe/lighthouse shows no motion/contrast violations; animations pause/soften with reduced motion.
- [ ] Set perf/UX budgets and CI
  - Perf TTI < 2.5s on 4G, LCP < 2.5s, CLS < 0.1; Accessibility ≥ 95; Best Practices ≥ 95; SEO ≥ 95.
  - Add Lighthouse CI workflow with thresholds (see Phase 6).

Files: `src/styles/theme.css`, `src/main.css`, new `.github/workflows/lighthouse-ci.yml` (later), `lighthouserc.js` (later).

---

## Phase 1 – Visual identity refresh (lightweight)

- [ ] Color tokens tidy-up and accessibility pass
  - Keep “electric cyan + neon purple” accents; ensure WCAG AA on text-on-background.
  - Acceptance: Contrast ≥ AA via tooling; theme CSS variables documented.
- [ ] Typography and consistency
  - Use Space Grotesk for display, Inter for text; refine sizes/leading; consistent spacing scale.
  - Acceptance: Heading hierarchy consistent; no orphaned font stacks.
- [ ] Hero polish
  - Subtle 3D/parallax on hero icon; glow text refined; CTA buttons with bouncy hover.
  - Acceptance: 60fps on mid devices; no layout shift.

Files: `src/styles/theme.css`, `src/index.css`, `src/App.tsx`.

---

## Phase 2 – Motion and microinteractions (Framer Motion)

- [ ] Intro transitions with `prefers-reduced-motion` fallback
  - Animate Hero, sections fade/slide on view; Episodes cards stagger.
  - Acceptance: Motion disabled when user prefers reduced motion.
- [ ] Card microinteractions
  - Tilt-on-hover with subtle depth; play/share buttons with springy tap.
  - Acceptance: Hover/tap feel responsive; no pointer traps; keyboard focus visible.
- [ ] Playful, unobtrusive effects
  - Cursor-follow sparkles for header only (reduced-motion aware), animated badges.

Files: `src/App.tsx`, `src/components/EpisodeCard.tsx`, new tiny `src/lib/motion.ts` utilities.

---

## Phase 3 – Episodes UX and content improvements

- [ ] Smarter search and filters
  - Add fuzzy search (title/description) and simple tag chips if available.
  - Acceptance: Typo-tolerant; renders under 50ms on 500 items.
- [ ] Episode detail modal (optional)
  - Quick view with description, duration, platforms, share; keep page context.
  - Acceptance: Accessible dialog semantics; Escape/overlay close; focus trap.
- [ ] Image handling
  - Responsive images with `srcset` and `loading="lazy"`; fixed aspect ratios.
  - Acceptance: No CLS on images; correct sizing across breakpoints.

Files: `src/components/EpisodeCard.tsx`, `src/components/ui/dialog.tsx` (existing), maybe `src/lib/utils.ts`.

---

## Phase 4 – SEO, social and structured data

- [ ] JSON-LD for PodcastSeries and Episodes (basic)
  - Add static PodcastSeries JSON-LD and dynamic per-episode ItemList on home.
  - Acceptance: validator.schema.org passes; Rich Results Test shows valid (even if no special features are surfaced).
- [ ] Open Graph/Twitter meta consistency
  - Generate OG images per release; default fallback.
  - Acceptance: card validator preview correct on X/FB/LinkedIn.
- [ ] Sitemap and robots
  - Add `sitemap.xml` and `robots.txt` (static); canonical URL meta.

Files: `index.html` (JSON-LD block), new `public/sitemap.xml`, `public/robots.txt`, optional OG generator script later.

---

## Phase 5 – PWA upgrades and offline strategy

- [ ] Service worker strategy tuning (Vite PWA)
  - Cache-first for static assets; stale-while-revalidate for RSS -> cached JSON (see next task).
  - Acceptance: App usable offline (shell + last episodes snapshot); update prompt on new version.
- [ ] Build-time RSS snapshot
  - GitHub Action (scheduled) fetches RSS and writes `public/episodes.json`; client uses it with SW updates.
  - Acceptance: No CORS/runtime RSS failures; content loads instantly, then refreshes.
- [ ] Install experience and maskable icons
  - Add maskable icons; add install hint banner (non-intrusive).

Files: `vite.config.ts` (PWA options), new `.github/workflows/rss-snapshot.yml`, new `scripts/fetch-rss.ts`, `public/manifest.json` icons.

---

## Phase 6 – Performance, CI, and observability

- [ ] Lighthouse CI
  - Add `.github/workflows/lighthouse-ci.yml` with `@lhci/cli` and thresholds.
  - Acceptance: PR status shows scores; warns on regressions.
- [ ] Bundle analysis
  - Integrate `rollup-plugin-visualizer` in Vite (dev-only) to keep bundles lean.
  - Acceptance: `stats.html` generated on build; document largest deps; remove unused heavy libs (Three.js/d3) if not used.
- [ ] Image and font optimizations
  - Preconnect to Google Fonts; font-display: swap; consider self-host critical fonts.
  - Acceptance: LCP image responsive and cached; Fonts not blocking render.

Files: `vite.config.ts`, `index.html`, `package.json` scripts.

---

## Phase 7 – Accessibility sweep

- [ ] Keyboard and focus
  - Ensure all interactive elements reachable in logical order; visible focus states.
- [ ] Landmarks and semantics
  - header/main/nav/section/footer; aria-labels for icon-only buttons; alt text.
- [ ] Motion/flash safety
  - Reduce intensity on flashing effects; avoid seizure-triggering combos.

Acceptance: Lighthouse a11y ≥ 95; axe-core passes.

Files: `src/App.tsx`, `src/components/*`, `index.html`.

---

## Phase 8 – Analytics and feedback

- [ ] GA4 production ID and consent
  - Replace placeholder; basic events (subscribe click, play click, share click, install PWA).
- [ ] Lightweight feedback hook
  - CTA modal or link to open a suggestion issue/form (humorous copy).

Files: `index.html`, small `src/lib/analytics.ts` and event calls.

---

## Concrete task checklists

Use these to track progress. Keep ticks up-to-date in this doc.

### 1) Motion foundation

- [x] Add `framer-motion` primitives to Hero and sections
- [x] Add reduced motion guards
- [x] Stagger Episodes grid on view

### 2) Episode cards polish

- [ ] Add responsive image attrs + lazy
- [ ] Hover tilt + spring interactions
- [ ] Accessible play/share buttons (labels, titles)

### 3) SEO & social

- [x] Inject PodcastSeries JSON-LD in `index.html`
- [x] Add per-episode `ItemList` JSON-LD
- [x] Add `public/sitemap.xml` and `public/robots.txt`
- [x] Polish OG/Twitter meta defaults and per-episode overrides (defaults updated to local `/og-image-1200x630.png`)

### 4) PWA & data

- [ ] Prompt-for-update UI with vite-plugin-pwa
- [ ] SW strategies: precache app shell, cache RSS JSON
- [x] GH Action to snapshot RSS into `public/episodes.json`

### 5) CI & performance

- [x] Add Lighthouse CI workflow + thresholds
- [x] Add bundle visualizer (dev) and document largest modules (visualizer integrated; documenting largest modules pending)
- [x] Remove unused heavy deps if not used (removed: recharts, d3, three, @tanstack/react-query, @heroicons/react, @octokit/core, octokit)

### 6) Accessibility

- [ ] Focus styles and keyboard order verified
- [ ] ARIA labels/roles for icons, dialogs, menus
- [ ] Contrast and motion checks pass

---

## Acceptance criteria summary (done when…)

- Pages score ≥ 95 on Lighthouse (Perf/A11y/Best/SEO) on CI.
- App works offline with last episodes list; update prompt appears on release.
- Episode cards are fast, accessible, and delightful with subtle motion.
- Valid JSON-LD for series and episodes; OG cards render correctly on social.
- Bundle size audited; no obviously unused heavyweight libs.

---

## Implementation notes (file map)

- SEO/JSON-LD: `index.html` (script type="application/ld+json").
- Motion utils: `src/lib/motion.ts` (variants, easing, guards for reduced motion).
- Episodes data: prefer `public/episodes.json` at runtime; keep `fetchPodcastRSS()` as fallback/manual refresh.
- PWA config: `vite.config.ts` (workbox routes, update prompts), `public/manifest.json` (maskable icons, theme).
- CI: `.github/workflows/lighthouse-ci.yml`, `lighthouserc.js`.
- Bundle analysis: `vite.config.ts` add `visualizer()` plugin in dev.

---

## Copy style examples (Spanish, playful)

- Hero badge: “IA para humanos (y algún robot curioso)”
- CTA primary: “Suscríbete gratis (sin vender tu alma)”
- Episodes empty state: “Ups, sin resultados. ¡Prueba con ‘robots’ o ‘apocalipsis’!”
- Install PWA prompt: “Instala la app — funciona hasta sin Wi‑Fi (magia negra).”

Keep it short, friendly, and self-aware. One joke per block max.

---

## Risks and rollbacks

- Too much motion → dizziness. Mitigate via reduced-motion and softer defaults.
- Offline caching of stale episodes → Confusion. Show “Actualizado hace X min” and a refresh button.
- Bundle bloat → Audit and tree-shake; remove unused deps.

Rollback: Feature flags per phase; keep changes small and reversible.

---

## Next 3 “quick wins”

- [x] Inject PodcastSeries JSON-LD and OG meta tidy in `index.html`. (JSON-LD + canonical added; OG fine-tuning pending)
- [x] Add reduced-motion guards to existing animations; tone down glow.
- [x] Add bundle visualizer (dev-only) to identify easy savings.

---

## Appendix – References

- Tailwind v4 highlights and APIs: [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4)
- Vite PWA guide and strategies: [vite-pwa-org.netlify.app/guide](https://vite-pwa-org.netlify.app/guide/)
- Lighthouse CI setup: [web.dev/articles/lighthouse-ci](https://web.dev/articles/lighthouse-ci)
- Schema.org PodcastSeries: [schema.org/PodcastSeries](https://schema.org/PodcastSeries)
- Framer Motion examples: [motion.dev/examples](https://motion.dev/examples) and [framer.com/motion](https://www.framer.com/motion/)
- Bundle visualizer: [npmjs.com/package/rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)
