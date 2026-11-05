# AI Orbit — Evoke Technologies

A second design direction ("MockA") for **AI Orbit**, Evoke's AI services page. The concept is the orbit, as in orbital mechanics. One core holds the four service lines in their orbits, a WebGL particle system behaves like a Keplerian belt, and the cursor acts as a gravity well. The page leads with content: no stock imagery, and every visual is generated in code.

- **Figma:** [Office-Works › Orbit page › MockA section](https://www.figma.com/design/rtVghJdEHvX6yc7YDkSRUm/Office-Works?node-id=249-3691)
- **Site:** static HTML/CSS/JS in this repo. Open `index.html` through any static server, or publish with GitHub Pages from the repo root.

```bash
python3 -m http.server 8000
```

## Pages

| Page | File | Figma frame (MockA) |
|---|---|---|
| Home | `index.html` | Home — Dark / Light |
| Enterprise Agent Solutions | `services/enterprise-agents.html` | Service — Enterprise Agent Solutions |
| AI-First Software Engineering | `services/ai-first-engineering.html` | Service — AI-First Software Engineering |
| AI Governance | `services/ai-governance.html` | Service — AI Governance |
| AI Advisory | `services/ai-advisory.html` | Service — AI Advisory |
| Case study (lift-truck) | `case-studies/lift-truck-self-service.html` | Case Study — Lift-truck |

The four service pages are generated from one template: edit `tools/build_pages.py`, then run `python3 tools/build_pages.py`.

## Structure

```
assets/css/tokens.css   design tokens (mirror of the Figma variables)
assets/css/main.css     layout, components, motion
assets/js/site.js       header/footer, theme, cursor, reveals, counters, tabs, orbit sync, card art
assets/js/orbit-gl.js   three.js WebGL orbit system (hero + page heroes)
assets/vendor/          three.js r160 (MIT), vendored so there's no CDN dependency
design/figma/           Plugin API scripts used to build and maintain the Figma file
```

## Design tokens

Figma variables are in the collections **AI Orbit / Color · Dark**, **AI Orbit / Color · Light** and **AI Orbit / Dimension**. Each colour variable carries its CSS name in Code Syntax (WEB), for example `var(--accent)`.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#07080B` | `#F3F2EE` |
| `--bg-elev` | `#0C0E12` | `#ECEBE6` |
| `--surface` | `#111419` | `#FFFFFF` |
| `--fg` | `#ECEFF4` | `#0C0E12` |
| `--fg-muted` | `#9AA1AD` | `#555C67` |
| `--accent` | `#7B93FF` | `#2F4FE0` |
| `--signal` | `#FF7A45` | `#E2581F` |
| `--line` / `--line-strong` | fg @ 9% / 18% | ink @ 10% / 20% |

- **Type:** Geist (UI), Geist Mono (labels, uppercase +8% tracking), Instrument Serif Italic (single accent words). Text styles are `Orbit/*` in Figma.
- **Grid:** 1440 frame, 64px gutters, 1312 container. Sections have a 280px label column and fluid content, with 144px vertical rhythm.
- **Radii:** 6 / 12 / 20 / pill. **Spacing:** 4pt scale (`--s-1` … `--s-10`).

## Interaction and motion spec

| Element | Behaviour | Timing |
|---|---|---|
| Hero WebGL | 9k particles on Keplerian orbits; the pointer pushes and lights particles within about 2.2 units; the scene parallax-tilts toward the pointer and pitches on scroll | continuous; pauses off-screen |
| Hero headline | lines rise from a mask, 80ms stagger | 1.1s `cubic-bezier(.16,1,.3,1)` |
| Telemetry θ | live pointer angle around the viewport centre | per pointermove |
| Cursor | ring with an orbiting satellite; grows to 64px over interactive elements | 320ms |
| Buttons | magnetic follow; the orb satellite does a 360° orbit on hover; primary fill changes to accent | 720ms ease-orbit |
| Nav | sliding pill follows the hovered link; mega menu rises 6px and fades | 320ms / 160ms |
| About statement | word-by-word opacity tied to scroll progress | scroll-linked |
| Services | list row ⇄ orbit ring and planet sync on hover/focus; planets travel their rings | 720ms sweep |
| Stats | count up on enter; a satellite orbits a dashed arc | 1.6s easeOutQuart / 14s |
| Pipeline | accent track and satellite advance with scroll; stages switch on as passed | scroll-linked |
| Case cards | lift 4px; conic accent light orbits the border; generative canvas orbits speed up | 2.6s loop |
| Theme toggle | moon slides off the planet; WebGL colours and blending update live | 720ms |

`prefers-reduced-motion` turns off every loop, parallax and count-up. Content stays fully visible.

## Accessibility

- Skip link, landmark roles, `aria-current` on nav, ARIA tabs with arrow-key support, and visible focus rings in the accent colour.
- The WebGL and decorative SVG/canvas elements are `aria-hidden`. Every animated element has a static fallback.
- Muted text on `--bg` is at least 4.5:1 in both themes. `--fg-subtle` is used only for meta labels.

## Content notes

- Home, Agentic SDLC and case-study copy comes from the "Main" design in Figma.
- The live evoketechnologies.com page couldn't be reached from the build environment.
- Capability lists and meta values on the **Agents, Governance and Advisory** pages are draft copy written from the one-line service descriptions. Please validate them with the content team before launch.
- Partner names are typeset as text wordmarks. Swap in the official SVG logos according to each partner's brand guidelines.

## Version 2 — "Orbital Horizon" (`mockb/`)

A second design direction, kept alongside Version 1. Version 1 is not modified. A **Version** dropdown at the right edge of every page header switches between the two designs and keeps the visitor on the same page and section (`assets/js/version-switch.js`).

- **Look:** bold, confident and futuristic, with generous white space. A three.js planet horizon rises behind the hero, and inclined orbits carry satellites with light trails. Moving the pointer sends a signal ripple across the planet and parallax-tilts the camera.
- **Brand colours:** Primary `#3D1766`, Secondary `#6F1AB6`, Accent `#FF0032`. Pure red is used for graphics and large display type only. Red buttons use `#D1002A` (white label 5.6:1) and red text uses `#FF3355` (dark theme) or `#D1002A` (light theme).
- **Type:** Manrope (display) and Inter (text), both Google Fonts. Body text is 18px, and the smallest text anywhere is 14px. These sizes suit both personas (ages 25–30 and 50–55).
- **Photography:** the Services, Client stories, Industries and Knowledge hub cards use real, royalty-free photos from Pexels (Pexels License, free for commercial use), cropped and compressed to WebP in `mockb/assets/img/photos/`. Sources are listed in `CREDITS.md` there.
- **Imagery:** the remaining abstract HD artwork in `mockb/assets/img/` is rendered from original shaders in the brand palette, with no stock or AI-generated images. To regenerate it:
  ```bash
  node tools/art/render_art.js && python3 tools/art/to_webp.py
  ```
- **Pages:** home, four service pages and the case study. The service pages and case study are generated from the same content as Version 1 with `python3 tools/build_pages_v2.py`.
- **Micro-interactions:**
  - headline words rise in with a blur
  - counting metrics, and progress dials that fill as they scroll into view
  - an orbit pipeline that auto-advances, or acts as keyboard-accessible tabs when you take control
  - an orbit-trace arrow on card hover, plus image zoom and parallax
  - a case-study carousel with previous/next buttons
  - a theme switch whose knob slides between moon and sun
  - a header that hides on scroll down and returns on scroll up
- **Accessibility:**
  - axe-core WCAG 2.1 AA audit: 0 violations on home, service and case-study pages in both themes
  - visible focus rings and 44px+ touch targets
  - a skip link and ARIA tabs and menus
  - live-region form errors
  - `prefers-reduced-motion` support
  - no sideways scrolling from 320px to 1440px

## Version 3 — "Neural Aurora" (`v3/`)

The third design direction. It is selectable from the **Version** dropdown at the right edge of every header; Versions 1 and 2 are unchanged.

**Content**
- All copy comes from the live page at https://www.evoketechnologies.com/ai-orbit/:
  - hero, services with their taglines ("Build What Thinks", "Move Fast. Sleep Well" and so on)
  - 4 case studies
  - 6 industries
  - 8 knowledge-hub items
  - offices and contact details
- Case-study cards link to the corresponding pages on evoketechnologies.com.

**Design reference**
- Colour, gradient and interaction patterns follow https://www.colejames.io/:
  - ink `#100F15`, surfaces `#1B1924`, text `#F6F6F9`, lavender body copy `#B2AFCA`, electric blue `#4D65FF`
  - violet → blue → cyan aurora glows
  - a pixel-dot matrix
  - light-weight display type and mono labels
  - Lenis smooth scrolling, scroll-scrubbed word reveals, character-roll buttons, and cards that dim their siblings on hover
- These patterns are rebuilt for AI Orbit, not copied.

**Type**
- Sora 300/400 for display, DM Sans for body text (17px base), JetBrains Mono for labels. All are Google Fonts.

**WebGL (`v3/assets/js/neural-gl.js`, three.js)**
- An aurora and pixel-dot field that follows the cursor.
- A neural globe: about 700 neurons and 2,000 synapses carrying travelling signals.
  - Neurons near the pointer activate.
  - A click or tap sends a shockwave across the network.
  - The globe turns toward the pointer.
- Three inclined agent orbits with light trails.
- Scroll parallax.
- An "aurora" mode is reused for the CTA and the sub-page heroes.

**Interactions**
- A pinned horizontal services track driven by vertical scroll, with a progress bar.
- A cursor spotlight on card borders.
- An industries explorer: an accordion with a cross-fading sticky photo.
- Knowledge-hub filters and "Load more".
- A live neural-activity readout in the hero.
- Live local clocks for each office.
- A gradient footer wordmark that follows the cursor.
- A floating glass nav that hides on scroll down.

**Pages**
- Home, four service pages and the lift-truck case study. The sub-pages are generated with `python3 tools/build_pages_v3.py`.

**Accessibility**
- axe-core WCAG 2.1 AA: 0 violations on the home, service and case-study pages in both themes.
- No horizontal overflow from 320px to 1440px.
- `prefers-reduced-motion` disables smooth scrolling, the pinned track, parallax and all WebGL motion.

**Assets**
- Photos are listed in `v3/assets/img/CREDITS.md`.
- Lenis 1.1.20 (MIT) is vendored in `assets/vendor/`.

## Version 4 — "Monolith" (`v4/`)

Inspired by https://trionn.com/ and re-interpreted for AI Orbit: a monochrome editorial layout with alternating dark and light bands, oversized tightly tracked display type, and scroll storytelling. It keeps Version 3's fonts (Sora, DM Sans, JetBrains Mono) and its violet → blue → cyan text gradient.

**WebGL (`v4/assets/js/shards-gl.js`, three.js)**
- **Hero:** crystalline AI data shards with iridescent gradient rims. They drift, move aside from the pointer, and charge while you press and hold; releasing launches them outward.
- **Services:** an AI-core crystal with a wire shell and a tick ring. It flies in, turns and glows as you scroll through the section.
- **Text safe zone:** every material fades fully behind copy.

**Motion (`v4/assets/js/fx.js`)**
- preloader counter
- custom cursor with a hold-to-charge ring and "View" / "Hold" labels
- marquee that speeds up with scroll velocity
- striped wipe into the light band
- 3D tilt fact cards with count-up numbers
- pinned horizontal case-study rail with image parallax, and a text-scramble heading
- giant service words that scatter letter by letter while four glass service cards orbit the core
- industries list with a cursor-following photo peek
- magnetic buttons

**Pages**
- Home, four service pages and the case study. The sub-pages are generated by `tools/build_pages_v4.py` from the shared V3 page structure and copy.
- Version 4 reuses the Version 3 nav, footer, smooth scroll and forms (`v3/assets/js/app.js`) and the V3 photos.

**Accessibility**
- axe-core WCAG 2.1 AA: 0 violations on the home, service and case-study pages in both themes.
- Hero text contrast, measured against the live WebGL background: at least 9.1:1 on phone and desktop.
- No horizontal overflow from 320px to 1440px.
- Reduced motion turns off the preloader, pinning, scatter, scramble and all WebGL motion.

## Figma file status

The MockA section has the component board (Button, Tag, Eyebrow, Header/Nav, Mega menu, Service Row, Stat, Pipeline Stage, Case Card, Knowledge Row, Capability, Footer) and all six **Dark** screens. Hover and active states are built as variants.

The Light screens and prototype links are scripted in `design/figma/04-light-themes.js` and `design/figma/05-prototype.js`. Run them in order with the Figma MCP `use_figma` tool, or paste the `*.scripter.js` versions into the Scripter plugin (Plugins → Scripter → new script → Run). Both are safe to re-run.
