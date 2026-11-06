# Version 6 "Signal" in Figma (MockD)

File: [Office-Works › Orbit page › MockD](https://www.figma.com/design/rtVghJdEHvX6yc7YDkSRUm/Office-Works?node-id=1562-2202)

| Frame | Node |
|---|---|
| V6 · Home · Dark 1440 | `1577:3378` |
| V6 · Home · Light 1440 | `1581:3338` |

## What it contains
- **Variables:** collection **AI Orbit V6 / Color** (Dark and Light modes), mirroring `v6/tokens.json`: bg 1–3, panel, line 1–3, fg 1–3, mint, mint-text, ember, ember-text, cta-bg/fg/ring/run, glass, glass-line, surface. The Light frame is a clone with the Light mode set.
- **Text styles:** `V6 / *` — display styles (Hero 120, H2 62, Lead L 33, H3 26, Title M 20, Prompt 22, Body 17, Small 15, CTA 15, Ticker 176, Wordmark 300) and Jura SemiBold (Label, Idx, Big 112, Num 56, Stat 40).
  - **Font fallback:** PP Neue Montreal is not installed in the Figma workspace, so the display styles use **Inter** and note this in their description. Swap the family on the `V6 / *` styles once the licensed font is available.
- **Sections:**
  - Header with indexed menu.
  - Neural-network hero render with meta columns, a mint second headline line, the aside copy, a black CTA with an outline-run segment, a glass CTA, and the stats strip.
  - Giant ticker (outline words).
  - Partner logo rail.
  - Signal log.
  - About with numbered columns.
  - Service rows.
  - How-it-works staircase.
  - Key facts with bar marks.
  - Case stack with crosshair marks.
  - Industries matrix.
  - Editorial knowledge hub.
  - FAQ.
  - Horizon CTA render.
  - Contact with underline fields.
  - Footer with shortcuts, motion switch and outline wordmark.
- **Logos:** the original-colour SVGs (from `assets/partners/`) are imported as editable vectors in 180px cells, with no plates. The wordmark ink (Microsoft grey, AWS navy, ServiceNow black) is bound to the `fg` variable, so it reads in both themes. The coloured marks keep their brand colours.
- **Renders:** `capture-renders.js` captures the hero and horizon WebGL backgrounds (text hidden) in both themes.
