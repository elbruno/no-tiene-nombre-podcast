# Contributing to notienenombre.com

Thanks for your interest in contributing! This short guide gets you set up and ready to open great pull requests.

Please read and follow our Code of Conduct: CODE_OF_CONDUCT.md.

## Quick start

- Node.js >= 18.17 and npm >= 9 (see engines in package.json)
- Fork and clone the repo
- Install deps and run the dev server

```powershell
npm install
npm run dev
```

Open <http://localhost:5173> in your browser.

Optional (one-time for screenshots):

```powershell
npm run screenshots:install
```

## Useful scripts

- `npm run dev` — Start the Vite dev server
- `npm run build` — Type-check and build for production (runs RSS prebuild)
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint
- `npm run rss:snapshot` — Refresh `public/episodes.json` and `public/episodes.xml`
- `npm run screenshots` — Generate UI screenshots with Playwright

Notes:

- At runtime, the app fetches the live RSS feed with `cache: 'no-store'`; if it fails, it falls back to `/episodes.json`.
- A scheduled GitHub Action refreshes the snapshot daily at 03:00 UTC.

## Branching and commits

- Branch from `main` (e.g., `feat/improve-episode-card`)
- Keep commits focused; prefer Conventional Commits (e.g., `feat: add episode search`, `fix: date parsing`)

## Coding guidelines

- TypeScript: clear types for public APIs and props
- React: functional components and hooks
- Styling: Tailwind CSS utilities; small, composable components
- Accessibility: semantic HTML, keyboard navigation, ARIA where needed
- Performance: avoid unnecessary re-renders; lazy-load heavy UI

## Validate before PR

```powershell
npm run lint
npm run build
npm run preview
```

Smoke-test locally and update screenshots if the UI changed:

```powershell
npm run screenshots
```

## Submitting a pull request

- Keep diffs minimal and focused; avoid unrelated formatting churn
- Use the PR template; link issues; include screenshots for UI changes
- Ensure CI checks pass

PR checklist:

- [ ] Linted and built locally
- [ ] Manually smoke-tested via `npm run preview`
- [ ] Updated docs (README/ARCHITECTURE) if applicable
- [ ] Included screenshots for UI changes (if applicable)

## Docs and references

- Architecture: ARCHITECTURE.md
- README: project usage and scripts
- Security policy: SECURITY.md
- Code of Conduct: CODE_OF_CONDUCT.md

## Security

If you discover a security issue, follow SECURITY.md and avoid filing a public issue for sensitive reports.

## License

By contributing, you agree your contributions are licensed under the MIT License in LICENSE.
