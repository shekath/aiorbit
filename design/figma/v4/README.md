# Version 4 "Monolith" in Figma

These scripts built the **MockB** section of the Orbit page in the Office-Works file:
https://www.figma.com/design/rtVghJdEHvX6yc7YDkSRUm/Office-Works?node-id=249-3691

## What is in MockB

| Frame | Notes |
|---|---|
| V4 / Components | Button (Solid / Ghost variants), Label / Plus, Chip, Fact card, Service card, Work item, Logo tile, Industry row, Knowledge row, Nav |
| Home — Dark (1440) | 12 sections: hero, statement, marquee, wipe, key facts, case-study rail, services (two scroll states), industries, knowledge hub, CTA, contact, footer |
| Home — Light (1440) | A clone of Home Dark with the Light mode. The inverted bands switch to Dark |
| Mobile — Dark (390) / Mobile — Light (390) | The same page, stacked for phones |
| V4 / Image sources | Photos, partner logos and WebGL renders. The `05` script copies them into every `IMG ·` layer |

All colours are bound to the **AI Orbit V4 / Color** collection, which has Dark and Light modes. All type uses the `V4/*` text styles. An inverted band, such as Key facts, is a section with the opposite mode set on it explicitly.

The one exception is the text gradient (violet → blue → cyan). Gradient stops cannot be bound to variables, so each frame stores literal stops: `#9B7BFF → #6C82FF → #3FDCF2` on dark surfaces and `#6A3DF0 → #3D4FE6 → #0A7F9E` on light surfaces.

The prototype has four flow starting points (V4 · Home Dark / Light, V4 · Mobile Dark / Light).
- The nav links and the Launch / Let's talk buttons scroll to their sections.
- The theme toggle switches between the Dark and Light frames. On mobile, the menu button does this.

## Re-running

Each step is `00-helpers.js` followed by one of the scripts below, sent through the Figma MCP `use_figma` tool. The node IDs in the scripts belong to the current file. If you rebuild from scratch, update them from each script's return value.

1. `01-components.js` builds the component board.
2. `02-home-dark-part1.js` and `03-home-dark-part2.js` build the desktop dark page. The Light clone is made by the snippet in `04-mobile.js`, the "Light clone" block; apply the same logic to the desktop frame.
3. `04-mobile.js` builds Mobile Dark and its Light clone.
4. Upload the images into the `src · *` rectangles of **V4 / Image sources**.
   - Use the `upload_assets` tool with `nodeIds`. It needs network access to `mcp.figma.com`.
   - Image order: hero, core and CTA renders (dark / light), phone hero renders, `svc-engineering`, `case-*`, `ind-*`, then the six partner logos.
5. `05-assign-images.js` fills every `IMG ·` slot, fact-card photo, case-study photo and logo tile.

`capture-webgl.js` renders the WebGL layers without any page copy (run it with the repo served on port 8765). It produces the hero shards, the AI core and the calm CTA shards, in both themes, for desktop and phone.
