# Version 7 "Neural Ember" in Figma (MockE)

File: [Office-Works › Orbit page › MockE](https://www.figma.com/design/rtVghJdEHvX6yc7YDkSRUm/Office-Works?node-id=1597-2202)

| Frame | Node |
|---|---|
| V7 · Home · Dark 1440 | `1599:3373` |
| V7 · Home · Light 1440 | `1602:3338` |

### Internal pages
The Dark row is at the top of MockE, to the right of Home. The Light row sits directly below it.

| Page | Dark | Light |
|---|---|---|
| Service · Enterprise Agent Solutions | `1604:3338` | `1606:3338` |
| Service · AI-First Software Engineering | `1604:3601` | `1606:3580` |
| Service · AI Governance | `1604:3864` | `1606:3822` |
| Service · AI Advisory | `1604:4127` | `1606:4064` |
| Case study · Lift-truck self-service | `1604:4390` | `1606:4306` |

V7 sub-pages share Version 3's page structure, re-skinned with V4/V7 styles. They were made from the V3 MockC internal frames and converted:
- colours are rebound to **AI Orbit V7 / Color**;
- gradients are ember;
- the header is the V7 nav;
- the hero and CTA backgrounds use the calm neural-network renders (`sub-hero-*`, `sub-cta-*`).

Type still uses the `V3 / *` text styles. They use the same families (Sora, DM Sans, JetBrains Mono).

## What it contains
- **Variables:** collection **AI Orbit V7 / Color**, with Dark and Light modes.
  - Monochrome surfaces, as in V4.
  - Ember accents: `e1` `#FF5B42` and `e2` `#EB7F31`. In Light they are deepened to `#D9381F` and `#B85A12`.
  - Neural-network colours: `nn-violet` `#A485FF` and `nn-cyan` `#3FDCF2`.
- **Inverted bands:** the light bands in the dark page (Key facts, Case studies, Industries, Contact) are frames named `… · band-inv`. Each is pinned to the opposite variable mode, as on the site.
- **Text styles:** `V7 / *` — Sora Light (Mega 92, Big 64, Statement 54, Marquee 128, Row 40, Num 64, Wordmark 288), Sora Regular (H3 23, Words 128), DM Sans (Lead, Body, Small, Body Medium, Button), JetBrains Mono (Label, uppercase).
- **Hero:**
  - WebGL neural-network render with the readability veil;
  - nav with the Version 7 pill;
  - HUD chips (layers, neurons, charge);
  - copy with the ember gradient line, CTAs and the hold-to-charge hint;
  - the four-service strip.
- **Services:** cards carry their service photos. **Industries:** rows carry sector thumbnails.
- **CTA:** the calm network render.
- **Renders:** `capture-renders.js` captures the WebGL backgrounds with the text hidden.
