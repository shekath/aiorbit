// Renders the MockB abstract artwork to PNG, then tools/art/to_webp.py converts it.
// Usage (repo root):  node tools/art/render_art.js && python3 tools/art/to_webp.py
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// [file, mode, seed, width, height]  — modes: 0 planet, 1 ribbons, 2 lattice, 3 rings, 4 nebula
const ART = [
  ['hero-planet', 0, 1.0, 2560, 1440],
  ['cta-planet', 0, 4.0, 2560, 1100],
  ['svc-agents', 1, 2.0, 1800, 1200],
  ['svc-engineering', 2, 3.0, 1800, 1200],
  ['svc-governance', 3, 5.0, 1800, 1200],
  ['svc-advisory', 4, 6.0, 1800, 1200],
  ['case-sencha', 1, 7.3, 1600, 1100],
  ['case-cobol', 2, 8.1, 1600, 1100],
  ['case-production', 4, 9.4, 1600, 1100],
  ['ind-manufacturing', 2, 11.0, 1400, 900],
  ['ind-bfsi', 3, 12.0, 1400, 900],
  ['ind-energy', 4, 13.0, 1400, 900],
  ['insight-feature', 3, 14.5, 1800, 1100],
];

(async () => {
  const out = path.resolve(__dirname, '../../mockb/assets/img/_png');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'render-art.html'));
  for (const [name, mode, seed, w, h] of ART) {
    const data = await p.evaluate(([m, s, w, h]) => window.render(m, s, w, h), [mode, seed, w, h]);
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(data.split(',')[1], 'base64'));
    console.log('rendered', name, `${w}x${h}`);
  }
  await b.close();
})();
