// Captures the V7 WebGL backgrounds (text hidden) used as image fills in Figma. Serve the site on :8765, then:
//   node capture-renders.js <out-dir>
const { chromium } = require('playwright');
const OUT = (process.argv[2] || 'renders') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const t of ['dark', 'light']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript((x) => localStorage.setItem('orbitc-theme', x), t);
    await p.goto('http://localhost:8765/v7/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(3200);
    await p.mouse.move(1050, 380); await p.waitForTimeout(600);
    await p.addStyleTag({ content: '.nav, .vsw, .cur, .progress7 { visibility: hidden !important } .h7 > :not(.nn7), .cta4 > :not(.nn7), .svc4 .stick > :not(canvas) { visibility: hidden !important }' });
    await p.waitForTimeout(300); await (await p.$('.h7')).screenshot({ path: `${OUT}hero-${t}.png` });
    const svc = await p.$('.svc4'); const bb = await svc.boundingBox(); await p.evaluate((y) => scrollTo(0, y), bb.y + 400); await p.waitForTimeout(1600);
    await p.screenshot({ path: `${OUT}svc-${t}.png` });
    await p.evaluate(() => document.querySelector('.cta4').scrollIntoView()); await p.waitForTimeout(1800); await (await p.$('.cta4')).screenshot({ path: `${OUT}cta-${t}.png` });
    await p.close(); }
  await b.close(); })();
