# Version 5 "Clarity" in Figma

Version 5 lives in the **MockB** section of the Orbit page, to the right of Version 4:
https://www.figma.com/design/rtVghJdEHvX6yc7YDkSRUm/Office-Works?node-id=249-3691

It is a content-first redesign that follows this feedback:
- Some text was hidden, cut off or overlapping.
- The hero had too much spacing.
- The WebGL background competed with the copy.
- The layout needed more structure and richer, clearer text.

## What changed from Version 4

| Problem in V4 | What V5 does |
|---|---|
| Text sat on top of WebGL and absolutely positioned layers | Every text layer is auto-height inside auto-layout. Nothing is absolutely positioned and no text box has a fixed size |
| Oversized display type with very tight tracking clipped descenders | Sora SemiBold with tracking between −0.5% and −2.5% and line heights of 108% or more |
| Tall hero, about 900px, with the copy at the bottom | A compact two-column hero (about 700px): the copy and proof points on the left, the AI agent console on the right |
| Shard animation behind the headline | Vector AI elements: an agent console, a neural node lattice, pipeline steps and a reference-architecture flow. The lattice sits only behind the right column, at 55% opacity or less |
| Cards of uneven height | Each card row is set to the height of its tallest card |

## Frames

- **V5 / Components:** Button (Primary / Secondary / Link), Eyebrow, Nav, Field, FAQ item (Closed / Open), and example service, case, industry and metric cards, plus the agent console and the lattice.
- **V5 · Home — Dark (1440)** and **V5 · Home — Light (1440)**, with these sections:
  1. Nav
  2. Hero
  3. Platforms
  4. About
  5. Services
  6. How it works
  7. Outcomes
  8. Case studies
  9. Industries
  10. Knowledge hub
  11. FAQ
  12. CTA
  13. Contact
  14. Footer
- **V5 · Service — Enterprise Agent Solutions — Dark (1440):**
  - a breadcrumb and an "at a glance" card;
  - a "what we build" section;
  - the reference-architecture flow;
  - delivery steps, outcomes, related case studies, FAQ, CTA and footer.
- **V5 · Mobile — Dark (390)** and **V5 · Mobile — Light (390)**.

All colours are bound to the **AI Orbit V5 / Color** collection, which has Dark and Light modes. All type uses the `V5/*` text styles.

The text gradient cannot be bound to a variable, so each frame stores literal stops:
- dark frames use `#A485FF → #6C82FF → #3FDCF2`;
- light frames use `#6A3DF0 → #3D4FE6 → #0A7F9E`.

The prototype has five flow starting points:
- Nav links scroll to their sections, and Launch / Talk scroll to Contact.
- The theme toggle switches between Dark and Light. On mobile, the menu button does this.
- "Explore AI Apps" opens the service page.

## Re-running

Send `00-helpers.js` + `01-builders.js` + one of the numbered scripts through the Figma MCP `use_figma` tool.

The node IDs inside the scripts belong to the current file. If you rebuild from scratch, take them from each script's return value.
