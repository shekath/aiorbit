# Version 3 "Neural Aurora" in Figma (MockC)

File: [Office-Works › Orbit page › MockC](https://www.figma.com/design/rtVghJdEHvX6yc7YDkSRUm/Office-Works?node-id=1550-2202)

| Frame | Node |
|---|---|
| V3 · Home · Dark 1440 | `1572:3370` |
| V3 · Home · Light 1440 | `1574:3338` |
| Partner logos · source SVG (editable vectors, also used by V6) | inside MockC |

### Internal pages
The Dark row is at the top of MockC, to the right of Home. The Light row sits directly below it.

| Page | Dark | Light |
|---|---|---|
| Service · Enterprise Agent Solutions | `1584:3338` | `1586:3338` |
| Service · AI-First Software Engineering | `1584:3580` | `1586:3580` |
| Service · AI Governance | `1584:3822` | `1586:3822` |
| Service · AI Advisory | `1584:4064` | `1586:4064` |
| Case study · Lift-truck self-service | `1585:3338` | `1586:4306` |

Each service page has these sections:
- hero: breadcrumb, gradient title, photo with aurora tint, and four facts;
- Approach (two paths);
- Capabilities (3×2 grid);
- Agentic pipeline timeline;
- Client story;
- CTA panel;
- Previous / next service;
- footer.

The case study has these sections:
- hero with photo and fact tiles;
- article with a sticky contents list, stat trios, challenge and approach lists, the before/after outcomes table, and strategic value;
- CTA panel;
- footer.

The nav, CTA panel and footer are cloned from Home, so they match it.

## What it contains
- **Variables:** collection **AI Orbit V3 / Color** with Dark and Light modes, mirroring `v3/assets/css/tokens.css` (bg, surface, line, fg, fg-muted, fg-subtle, accent-text, btn, glass, grad-1/2/3, tile). The Light frame is a clone with the Light mode set explicitly.
- **Text styles:** `V3 / *` — Sora Light (Hero 120, H1 76, H2 56, Statement 44, Accordion 26), Sora Regular H3 28, DM Sans (Lead, Body, Small, Body Medium, Button), JetBrains Mono (Mono, uppercase, +12%).
- **Sections:** floating glass nav, hero (HUD labels, pill, "AI That Powers / Your Trajectory" with the gradient line, lead, CTAs, scroll cue), partner tiles, scrubbed statement, pinned services rail, case grid, industries accordion and photo, knowledge hub, starfield CTA panel, offices and form, footer with the gradient wordmark.
- **Images:** the V3 photos (`v3/assets/img/*`, converted to JPEG) and WebGL renders of the hero globe and the CTA starfield, captured with text hidden by `capture-renders.js`.
- The hero headline has room for descenders, matching the fix in `v3/assets/css/main.css`.

Gradient text uses fixed gradient stops: the Dark stops are `#A485FF → #6C82FF → #3FDCF2` and the Light stops are `#6A3DF0 → #3D4FE6 → #0A7F9E`. Figma variables can't drive gradient stops in text ranges.
