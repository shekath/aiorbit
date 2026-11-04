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

## Figma file status

The MockA section has the component board (Button, Tag, Eyebrow, Header/Nav, Mega menu, Service Row, Stat, Pipeline Stage, Case Card, Knowledge Row, Capability, Footer) and all six **Dark** screens. Hover and active states are built as variants.

The Light screens and prototype links are scripted in `design/figma/04-light-themes.js` and `design/figma/05-prototype.js`. Run them in order with the Figma MCP `use_figma` tool or a scripting plugin. Both are safe to re-run.
