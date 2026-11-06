// Captures the WebGL backgrounds (text hidden) used as image fills in Figma. Run with the site served on :8765:
//   node capture-renders.js <out-dir>
const { chromium } = require('playwright');
const OUT = (process.argv[2] || 'renders') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const t of ['dark', 'light']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.addInitScript((x) => { localStorage.setItem('orbitc-theme', x); localStorage.setItem('orbit-theme', x); }, t);
    await p.goto('http://localhost:8765/v6/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(4000);
    await p.addStyleTag({ content: '.hdr,.vsw{visibility:hidden!important} .hero *, .horizon *{visibility:hidden!important} .hero canvas, .horizon canvas{visibility:visible!important}' });
    await p.waitForTimeout(400); await (await p.$('.hero')).screenshot({ path: `${OUT}hero-${t}.png` });
    const hz = await p.$('.horizon'); await hz.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await hz.screenshot({ path: `${OUT}horizon-${t}.png` });
    console.log(t, await hz.boundingBox()); await p.close(); }
  await b.close(); })();
