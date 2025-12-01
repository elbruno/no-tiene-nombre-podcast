# Embedded Player Implementation Plan

Goal
----

Add an inline embedded player to each episode in the podcast list so users can play episodes directly on the site. Use Ivoox iframe embeds when available, with a native <audio> fallback and lazy-loading to preserve performance.

Scope
-----

- Persist embed information in the RSS snapshot (`public/episodes.json`) and derive at runtime for live fetches.
- Add a reusable React component `EpisodeEmbeddedPlayer` to manage toggling, lazy iframe injection and fallback audio.
- Integrate the player into `src/components/EpisodeCard.tsx` and `src/components/EpisodeListItem.tsx`.
- Keep players collapsed by default (click-to-expand) to avoid rendering many iframes.
- Provide a short-term minimal path (native audio toggle) and an enhanced path (lazy iframe + IntersectionObserver + fallback).

Implementation steps
--------------------

1. Update types
   - File: `src/lib/types.ts`
   - Add optional fields: `embedId?: string` and `embedUrl?: string` to the Episode type.

2. Snapshot generation
   - File: `scripts/fetch-rss.mjs`
   - Extract numeric episode id using regex on the `link` or `audioUrl` (pattern `/[rm]f_(\d+)/`).
   - Compute `embedUrl` using the Ivoox player URL pattern: `https://www.ivoox.com/player_ej_{embedId}_6_1.html?c1=d69776` (validate with sample episodes).
   - Persist fields into `public/episodes.json`.

3. Runtime derivation
   - File: `src/lib/podcast-api.ts`
   - When reading live RSS items, derive `embedId` and `embedUrl` if not present in the item.

4. Player component
   - File: `src/components/EpisodeEmbeddedPlayer.tsx`
   - Props: `audioUrl: string`, `embedUrl?: string`, `title: string`.
   - Behavior:
     - Collapsed by default; a `Play` button toggles expanded state.
     - On expand: if `embedUrl` present, render an iframe with `loading="lazy"` and fixed height; start a timeout (5s) — if iframe doesn't load, show `<audio controls src={audioUrl} />`.
     - If no `embedUrl`, render `<audio controls src={audioUrl} />` directly.
     - Use `aria-expanded` on the toggle and provide accessible titles for iframe.

5. Integrate in UI
   - Files: `src/components/EpisodeCard.tsx`, `src/components/EpisodeListItem.tsx`
   - Add the player below meta (title, date). Use consistent Tailwind classes to match existing styles.
   - Consider adding logic to ensure only one player is expanded at a time (optional enhancement).

6. Styling & accessibility
   - Keep iframe height constrained (e.g., `h-48` / `h-[200px]`) and `w-full`.
   - Provide loading skeleton using `LoadingSkeletons.tsx` or simple Tailwind shimmer.
   - Ensure keyboard accessibility and screen reader labels.

7. Tests & verification
   - Run `npm run rss:snapshot` to regenerate `public/episodes.json` and verify `embedId` and `embedUrl` exist for sample episodes.
   - Start dev server: `npm run dev` and interact with the player UI on the homepage.
   - Manual checks for mobile layout, single-expanded behavior, and fallback audio.

8. Documentation & PR
   - Add this plan to `docs/embedded-player-plan.md` (this file).
   - Open a PR with changes and testing notes.

Risks & mitigations
-------------------

- Ivoox embed URL correctness: Verify with sample episodes (446, 445). If different, make `embedUrl` generation configurable or stored in snapshot.
- Performance: Use click-to-expand and optional IntersectionObserver to limit iframe count.
- Cross-origin/CSP issues: If iframe blocked, fallback to native audio.

Notes
-----

- Minimal approach: Implement native `<audio>` toggle first (fastest, smallest change). If the user prefers iframe embeds specifically, proceed with the iframe component and lazy-load logic.
- This plan assumes current repo uses TypeScript + React + Tailwind as seen in file structure.

Created-by: Copilot
Created-on: 2025-12-01
