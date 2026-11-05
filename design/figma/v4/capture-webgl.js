// Capture the V4 WebGL layers alone (copy hidden) for use as Figma image fills.
const { chromium } = require('playwright');
const OUT = __dirname + '/fig4/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const theme of ['dark', 'light']) {
    for (const [vw, vh, tag] of [[1440, 900, 'desk'], [390, 844, 'phone']]) {
      const p = await b.newPage({ viewport: { width: vw, height: vh } });
      await p.addInitScript((t) => localStorage.setItem('orbitc-theme', t), theme);
      await p.route('**/v4/index.html', async (r) => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()).replace(/ data-safe/g, '') }); });
      await p.goto('http://localhost:8765/v4/index.html', { waitUntil: 'networkidle' });
      await p.waitForTimeout(3000);
      await p.addStyleTag({ content: `.preload,.cur,.cursor,header,.site-header,.vsw{display:none!important}
        .h4>:not(canvas),.svc4 .stick>:not(canvas),.cta4>:not(canvas){visibility:hidden!important}` });
      await p.waitForTimeout(800);
      await p.screenshot({ path: `${OUT}${tag}-${theme}-hero.png` });
      if (tag === 'desk') {
        for (const [sel, name, frac] of [['.svc4', 'core', 0.55], ['.cta4', 'cta', 0]]) {
          await p.evaluate(([s, f]) => { const e = document.querySelector(s); const r = e.getBoundingClientRect();
            const y = scrollY + r.top + (e.offsetHeight - innerHeight) * f; (window.lenis ? window.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)); }, [sel, frac]);
          await p.waitForTimeout(2200);
          await p.screenshot({ path: `${OUT}${tag}-${theme}-${name}.png` });
        }
      }
      await p.close();
    }
  }
  await b.close(); console.log('done');
})();
