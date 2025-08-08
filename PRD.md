# No Tiene Nombre - Podcast Engagement Page

A dynamic engagement page to invite listeners to subscribe and discover "No Tiene Nombre", a Spanish podcast about AI, featuring the latest episodes and multiple listening platforms.


1. **Inviting** - Warm, welcoming design that draws visitors to explore the podcast content
2. **Professional** - Clean, modern aesthetic that reflects the tech-forward nature of AI content
3. **Accessible** - Clear navigation and multiple subscription options for diverse audiences

- Progression: Loading state → RSS fetch → Parse episodes → Display episode 


- Trigger: User click

**Podcast Branding & Int
- Purpose: Communicate the podcast's focus on AI topics in Spanish to attract ta
- Progression: Page load → Display hero content → User reads description → 

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

- **Empty Episode Data**: Handle missing episode metadata gracefully with fallback text
- **Mobile Responsiveness**: Ensure episode cards and platform buttons work well on all screen sizes

  - Alert component

The design should feel modern, tech-forward, and approachable - balancing the sophistication of AI content with the warmth of Spanish-language community podcasting.



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

  - H2 (Section Headers): Inter Semibold/24px/normal spacing  

  - Body Text: Inter Regular/16px/relaxed line height
  - Small Text (Dates/Meta): Inter Regular/14px/normal spacing



Subtle, purposeful animations that enhance usability without feeling excessive - maintaining focus on content discovery and engagement.
















