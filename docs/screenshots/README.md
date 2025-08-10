# Screenshots

This directory contains automatically generated screenshots of the notienenombre.com website using Playwright.

## Available Screenshots

### Homepage
- `home.png` - Full homepage view with episode listings
- `home-mobile.png` - Mobile responsive view of homepage
- `home-dark.png` - Dark mode homepage view

### Episodes
- `episode-list.png` - Episode listing page
- `episode-detail.png` - Individual episode detail view
- `episode-player.png` - Audio player interface

### Components
- `navigation.png` - Main navigation component
- `footer.png` - Site footer component

## Generating Screenshots

Screenshots are automatically generated using Playwright with the following command:

```bash
npm run screenshots
```

This script:
1. Starts the development server (or uses preview build)
2. Launches headless browser instances
3. Captures screenshots of key routes and components
4. Saves images to this directory with consistent naming

## Screenshot Specifications

- **Format**: PNG with lossless compression
- **Desktop Resolution**: 1920x1080 (Full HD)
- **Mobile Resolution**: 375x812 (iPhone X)
- **Tablet Resolution**: 768x1024 (iPad)
- **Quality**: High quality for documentation purposes

## Automated Generation

Screenshots are automatically generated in the following scenarios:

1. **Development**: Manual execution via npm script
2. **CI/CD**: GitHub Actions workflow (optional)
3. **Pre-deployment**: Before production releases
4. **Documentation Updates**: When visual changes are made

## Usage in Documentation

These screenshots are referenced in:
- [README.md](../README.md) - Project overview and features
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Visual component examples
- Pull request reviews - Visual change validation
- Issue reports - Bug reproduction and feature requests

## File Naming Convention

```
{page|component}-{variant}.png

Examples:
- home.png (default desktop view)
- home-mobile.png (mobile responsive view)
- home-dark.png (dark mode view)
- episode-detail.png (episode page)
- navigation-expanded.png (mobile menu expanded)
```

## Maintenance

- Screenshots are updated automatically when significant visual changes are made
- Old screenshots are archived when features are deprecated
- File sizes are optimized for web display while maintaining quality
- Screenshots include realistic content (not placeholder text)

## Browser Coverage

Screenshots are captured using:
- **Chromium** (primary browser engine)
- **Firefox** (cross-browser validation)
- **WebKit** (Safari engine testing)

## Accessibility

Screenshots include:
- High contrast mode views
- Focus states for interactive elements
- Screen reader testing visualization
- Keyboard navigation states

---

*Screenshots are automatically generated and should not be manually edited. To update screenshots, modify the source code and regenerate using the npm script.*