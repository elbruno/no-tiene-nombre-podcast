# No Tiene Nombre - Podcast Engagement Page

A dynamic engagement page to invite listeners to subscribe and discover "No Tiene Nombre", a Spanish podcast about AI, featuring the latest episodes and multiple listening platforms.

**Experience Qualities**:
1. **Inviting** - Warm, welcoming design that draws visitors to explore the podcast content
2. **Professional** - Clean, modern aesthetic that reflects the tech-forward nature of AI content
3. **Accessible** - Clear navigation and multiple subscription options for diverse audiences

**Complexity Level**: Light Application (multiple features with basic state)
- Fetches and displays dynamic podcast episode data from RSS feed, manages loading states, and provides multiple platform integrations

## Essential Features

**Episode List Display**
- Functionality: Fetches and displays the latest 10 episodes from iVoox RSS feed
- Purpose: Showcase recent content to encourage subscription and engagement
- Trigger: Page load automatically fetches RSS data
- Progression: Loading state → RSS fetch → Parse episodes → Display episode cards with titles, dates, and descriptions
- Success criteria: All 10 episodes display with accurate metadata and functional play/listen links

**Multi-Platform Subscription**
- Functionality: Prominent links to iVoox, Spotify, and Listen Notes platforms
- Purpose: Maximize accessibility by offering multiple listening options
- Trigger: User clicks platform-specific subscription buttons
- Progression: Button click → Open platform link in new tab → User subscribes on their preferred platform
- Success criteria: All platform links work correctly and open in new tabs

**Podcast Branding & Introduction**
- Functionality: Hero section with podcast name, description, and value proposition
- Purpose: Communicate the podcast's focus on AI topics in Spanish to attract target audience
- Trigger: Immediate visibility on page load
- Progression: Page load → Display hero content → User reads description → Encouraged to explore episodes
- Success criteria: Clear messaging about AI content in Spanish with compelling call-to-action

## Edge Case Handling

- **RSS Feed Failure**: Display friendly error message with manual platform links if feed is unavailable
- **Slow Network**: Show loading skeletons during RSS fetch to maintain engagement
- **Empty Episode Data**: Handle missing episode metadata gracefully with fallback text
- **Mobile Responsiveness**: Ensure episode cards and platform buttons work well on all screen sizes

## Design Direction

The design should feel modern, tech-forward, and approachable - balancing the sophistication of AI content with the warmth of Spanish-language community podcasting.

## Color Selection

Triadic color scheme using technology-inspired colors that feel both professional and engaging.

- **Primary Color**: Deep Tech Blue (oklch(0.45 0.15 250)) - Communicates technology, trust, and professionalism
- **Secondary Colors**: Warm Charcoal (oklch(0.25 0.02 260)) for text and subtle backgrounds
- **Accent Color**: Vibrant Orange (oklch(0.72 0.18 45)) - Attention-grabbing highlight for CTAs and subscribe buttons
- **Foreground/Background Pairings**: 
  - Background White (oklch(0.98 0.005 260)): Dark Charcoal text (oklch(0.25 0.02 260)) - Ratio 15.2:1 ✓
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(0.98 0.005 260)) - Ratio 8.1:1 ✓
  - Accent Orange (oklch(0.72 0.18 45)): White text (oklch(0.98 0.005 260)) - Ratio 4.8:1 ✓
  - Card backgrounds (oklch(0.96 0.01 260)): Dark Charcoal text (oklch(0.25 0.02 260)) - Ratio 14.1:1 ✓

## Font Selection

Clean, modern sans-serif typography that works well in both Spanish and English, emphasizing readability and tech-forward aesthetic.

- **Typographic Hierarchy**:
  - H1 (Podcast Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing  
  - H3 (Episode Titles): Inter Medium/18px/normal spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Small Text (Dates/Meta): Inter Regular/14px/normal spacing

## Animations

Subtle, purposeful animations that enhance usability without feeling excessive - maintaining focus on content discovery and engagement.

- **Purposeful Meaning**: Smooth transitions communicate polish and attention to detail, while hover states provide clear interaction feedback
- **Hierarchy of Movement**: Episode cards receive subtle hover elevation, platform buttons get gentle scale feedback, and loading states use smooth fade transitions

## Component Selection

- **Components**: 
  - Card components for episode display with hover states
  - Button components for platform links with distinct styling for primary CTA
  - Badge components for episode metadata (date, duration)
  - Skeleton components for loading states
  - Alert components for error handling
- **Customizations**: Custom episode card layout with play/listen integration, branded platform button styling
- **States**: Hover effects on episode cards, loading states for RSS fetch, error states for failed requests
- **Icon Selection**: Play icons for episodes, platform logos/icons for subscription buttons, RSS/podcast icons for branding
- **Spacing**: Consistent 4-unit spacing scale (16px, 24px, 32px) with generous padding for readability
- **Mobile**: Responsive grid layout that stacks episode cards vertically on mobile, with touch-friendly button sizing for platform links