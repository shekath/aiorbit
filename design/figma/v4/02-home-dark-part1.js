// ---- Home Dark, part 1: nav fix, hero → work rail ----
const C = id => figma.getNodeByIdAsync(id);
const navC = await C('1425:2536'), labC = await C('1425:2484'), chipC = await C('1425:2487'), factC = await C('1425:2492'), workC = await C('1425:2506'), logoC = await C('1425:2513'), solidC = await C('1425:2470');
// nav component: brand reads "AI Orbit | EVOKE", version switch last
await setText(navC, 'Logo', 'AI Orbit'); await setText(navC, 'Product', 'Evoke');
const acts = navC.findOne(n => n.name === 'Actions'); const vs = acts.findOne(n => n.name === 'Version switch'); acts.appendChild(vs); await setText(vs, 'Label', '● Version 4 ▾');
const oldH = MOCKB.findOne(n => n.name === 'Home — Dark (1440)'); if (oldH) oldH.remove();
const home = F('Home — Dark (1440)', { dir: 'VERTICAL', fill: 'bg', w: 1440 });
MOCKB.appendChild(home); home.x = 1880; home.y = 120; home.setExplicitVariableModeForCollection(coll, DARK);
const sec = (name, o = {}) => { const s = F(name, o); add(home, s); fill(s); if (o.inv) s.setExplicitVariableModeForCollection(coll, LIGHT); return s; };
const lbl = (t) => { const i = labC.createInstance(); i.findOne(n => n.name === 'Label').characters = t; return i; };
const btn = (t) => { const i = solidC.createInstance(); i.findOne(n => n.name === 'Label').characters = t; return i; };

// 1 HERO (absolute layers)
const hero = F('01 Hero · WebGL shards (hold to charge)', { w: 1440, h: 900, fill: 'bg', clip: true }); hero.resize(1440, 900); add(home, hero);
const gl = rect('IMG · WebGL shards (hero)', 1440, 900, 'bg'); hero.appendChild(gl);
const scr1 = rect('Scrim · copy', 1180, 420, 'bg'); scr1.opacity = .72; scr1.cornerRadius = 400; scr1.effects = [{ type: 'LAYER_BLUR', radius: 90, visible: true }]; hero.appendChild(scr1); scr1.x = 0; scr1.y = 470;
const scr2 = rect('Scrim · side', 520, 360, 'bg'); scr2.opacity = .72; scr2.cornerRadius = 300; scr2.effects = [{ type: 'LAYER_BLUR', radius: 80, visible: true }]; hero.appendChild(scr2); scr2.x = 950; scr2.y = 520;
const nav = navC.createInstance(); hero.appendChild(nav); nav.x = 0; nav.y = 0;
const l1 = lbl('Introducing Evoke AI Orbit'); hero.appendChild(l1); l1.x = 64; l1.y = 112;
const l2 = await T('Build · Modernize · Govern', 'Label', 'fg-muted'); hero.appendChild(l2); l2.x = 1376 - l2.width; l2.y = 112;
const h1 = await T('AI that powers\nyour trajectory.', 'Mega', 'fg', { name: 'H1', g: 'your trajectory.' }); h1.fontSize = 106; hero.appendChild(h1); h1.x = 64; h1.y = 900 - 128 - h1.height;
const side = F('Side', { dir: 'VERTICAL', gap: 22, w: 360 }); hero.appendChild(side); side.x = 1016;
add(side, fill(await T('From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to a measurable impact.', 'Body', 'fg-hero', { name: 'Lead', w: 360 })));
add(side, btn('Launch your AI journey')); side.y = 900 - 128 - side.height;
const ft1 = await T('●  Hold to charge the orbit · release to launch', 'Label', 'fg-muted'); hero.appendChild(ft1); ft1.x = 64; ft1.y = 860;
const ft2 = await T('Scroll ↓', 'Label', 'fg-muted'); hero.appendChild(ft2); ft2.x = 1376 - ft2.width; ft2.y = 860;
const cur = F('Cursor · “Hold” label state', { dir: 'HORIZONTAL', r: 999, stroke: 'line-2', fill: 'glass', align: 'CENTER', just: 'CENTER' }); cur.primaryAxisSizingMode = 'FIXED'; cur.counterAxisSizingMode = 'FIXED'; cur.resize(96, 96);
add(cur, await T('Hold', 'Label', 'fg')); hero.appendChild(cur); cur.x = 672; cur.y = 352;

// 2 STATEMENT (scroll-scrubbed reveal: read part in fg, rest in subtle)
const st = sec('02 Statement · scroll-scrub reveal', { dir: 'HORIZONTAL', pad: [180, 64], gap: 64, fill: 'bg', w: 1440 });
add(st, lbl('About AI Orbit'));
const stmt = 'From strategy to execution, we help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.';
const stT = await T(stmt, 'Statement', 'fg', { name: 'Statement', w: 1000 }); add(st, stT); stT.layoutGrow = 1;
const cut = stmt.indexOf('This end'); stT.setRangeFills(cut, stmt.length, [P('fg-subtle')]);

// 3 MARQUEE
const mq = F('03 Marquee · scroll-velocity', { fill: 'bg', w: 1440, h: 220, clip: true }); mq.resize(1440, 220); add(home, mq);
mq.strokes = [P('line')]; mq.strokeLeftWeight = 0; mq.strokeRightWeight = 0; mq.strokeTopWeight = 1; mq.strokeBottomWeight = 1;
const mqs = 'Build + Modernize + Govern + Build + Modernize + Govern +';
const mqT = await T(mqs, 'Marquee', 'fg', { name: 'Track' }); add(mq, mqT);
let i = -1; while ((i = mqs.indexOf('+', i + 1)) >= 0) { mqT.setRangeFills(i, i + 1, [P('fg-subtle')]); mqT.setRangeFontSize(i, i + 1, 68); }
i = -1; while ((i = mqs.indexOf('Modernize', i + 1)) >= 0) mqT.setRangeFills(i, i + 9, [grad(GD)]);
mq.resize(1440, mqT.height + 56); mqT.x = -180; mqT.y = 28;

// 4 WIPE (bars sweep in light tone of the next band)
const wipe = F('04 Wipe · band transition', { w: 1440, h: 196, fill: 'bg' }); wipe.resize(1440, 196); add(home, wipe);
const wl = F('bars (inverse tone)', { w: 1440, h: 196 }); wl.resize(1440, 196); wipe.appendChild(wl); wl.setExplicitVariableModeForCollection(coll, LIGHT);
[1, .86, .72, .58, .44, .3, .16].reverse().forEach((s, k) => { const b = rect('bar ' + (k + 1), Math.round(1440 * s), 28, 'bg'); wl.appendChild(b); b.x = 0; b.y = k * 28; });

// 5 KEY FACTS (inverted band)
const kf = sec('05 Key facts · inverted band', { dir: 'VERTICAL', pad: [140, 64], gap: 0, fill: 'bg', w: 1440, inv: true });
add(kf, lbl('Key facts'));
const kfH = await T('Driving measurable outcomes.', 'Big', 'fg', { name: 'H2', g: 'measurable', gc: GL, w: 1100 }); add(kf, kfH);
const sp = (h) => { const s = figma.createFrame(); s.name = 'spacer'; s.fills = []; s.resize(10, h); return s; };
kf.insertChild(1, sp(18)); add(kf, sp(64));
const cards = F('Cards', { dir: 'HORIZONTAL', gap: 40 }); add(kf, cards);
const facts = [['Time saved', '65%', 'Average delivery time saved with agentic engineering.', '%', true], ['Skill packs', '150+', 'Reusable, tested agent skills that standardise behaviour.', '+', false], ['In production', '10+', 'Specialized agents running in production today.', '+', true]];
const factIds = [];
for (const [l, n, b, g, photo] of facts) {
  const c = factC.createInstance(); add(cards, c);
  c.findOne(x => x.name === 'Label').characters = l; const s = c.findOne(x => x.name === 'Stat'); s.characters = n; s.setRangeFills(0, n.length, [P('fg')]); s.setRangeFills(n.indexOf(g), n.length, [grad(GL)]);
  c.findOne(x => x.name === 'Body').characters = b; const p = c.findOne(x => x.name === 'Photo'); if (!photo) p.visible = false; else factIds.push(p.id);
}
add(kf, sp(72)); add(kf, await T('Powering innovation together', 'Label', 'fg-muted'));
add(kf, sp(20));
const logos = F('Partner logos (fixed-width tiles)', { dir: 'HORIZONTAL', gap: 16 }); add(kf, logos);
const logoIds = [];
for (const n of ['Microsoft', 'AWS', 'Salesforce', 'ServiceNow', 'Oracle', 'UiPath']) { const t = logoC.createInstance(); t.name = 'Logo · ' + n; t.findOne(x => x.name === 'Name').characters = n; add(logos, t); logoIds.push(t.id); }

// 6 WORK RAIL (inverted band, pinned horizontal scroll)
const wk = sec('06 Case studies · pinned horizontal rail', { dir: 'HORIZONTAL', pad: [140, 0, 140, 64], gap: 40, fill: 'bg', w: 1440, clip: true, inv: true });
const intro = F('Intro', { dir: 'VERTICAL', gap: 22, w: 420 }); add(wk, intro);
add(intro, lbl('Case studies'), fill(await T('Stories of transformation', 'Big', 'fg', { name: 'H2', w: 420 })), fill(await T('Curated highlights of recent client work across AI service lines showcasing real-world impact and transformation.', 'Body', 'fg-muted', { w: 420 })));
add(intro, await T('Drag or scroll →  01 / 05', 'Label', 'fg-muted'));
const works = [['Pharmaceutical', 'Sencha Migration', 'AI-Orchestrated ExtJS to React Modernization for a Regulated Pharmaceutical Enterprise.'], ['Tax Technology & Compliance', 'COBOL Conversion', 'AI‑powered multi‑agent modernization that transforms complex COBOL tax engines into validated MSTX in minutes with zero errors and full compliance.'], ['Manufacturing', 'Production Optimization Agent', 'AI-powered chatbot delivers real-time analysis and visual insights on Production Data to plant managers for better planning.'], ['Legal & Compliance', 'Incident Triage Agent', 'A deterministic, AI-orchestrated ITSM triage that classifies, labels, and routes incidents in real time with full compliance, auditability, and zero manual overhead.']];
const workIds = [];
for (const [c, t, b] of works) { const w = workC.createInstance(); w.name = 'Work · ' + t; add(wk, w); w.findOne(x => x.name === 'Label').characters = c; w.findOne(x => x.name === 'Title').characters = t; w.findOne(x => x.name === 'Body').characters = b; workIds.push(w.findOne(x => x.name === 'Photo').id); }
return { home: home.id, gl: gl.id, factIds, logoIds, workIds, h: home.height };
