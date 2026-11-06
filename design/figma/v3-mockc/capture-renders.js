// Captures the WebGL backgrounds (text hidden) used as image fills in Figma. Run with the site served on :8765:
//   node capture-renders.js <out-dir>
const { chromium } = require('playwright');
const OUT = (process.argv[2] || 'renders') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const [t, w, h] of [['dark',1440,900],['light',1440,900],['dark',390,844],['light',390,844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript((x) => localStorage.setItem('orbitc-theme', x), t);
    await p.goto('http://localhost:8765/v3/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(3500);
    await p.addStyleTag({ content: '.nav, .vsw{visibility:hidden!important} .hero *{visibility:hidden!important} .hero canvas{visibility:visible!important}' });
    await p.waitForTimeout(300);
    const hero = await p.$('.hero'); await hero.screenshot({ path: `${OUT}hero-${t}-${w}.png` });
    const info = await p.evaluate(() => { const c = document.querySelector('.hero canvas'); const r = document.querySelector('.hero').getBoundingClientRect(); return [r.height, c && c.className]; });
    // CTA panel
    const cta = await p.evaluateHandle(() => [...document.querySelectorAll('main > section')].find((s) => /All in One Orbit/.test(s.innerText)));
    await cta.evaluate((s) => { s.scrollIntoView(); s.querySelectorAll('h2,p,a,span,.label').forEach((e) => e.style.visibility = 'hidden'); });
    await p.waitForTimeout(1200);
    const panel = await cta.evaluateHandle((s) => s.querySelector('[class*=panel], [class*=card], .cta') || s.firstElementChild);
    await panel.asElement().screenshot({ path: `${OUT}cta-${t}-${w}.png` });
    console.log(t, w, info, await panel.evaluate((e) => e.className + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)));
    await p.close(); }
  await b.close(); })();
