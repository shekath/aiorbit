// ---- Mobile (390) Dark ----
const C = id => figma.getNodeByIdAsync(id);
const labC = await C('1425:2484'), chipC = await C('1425:2487'), factC = await C('1425:2492'), scardC = await C('1425:2497'), logoC = await C('1425:2513'), solidC = await C('1425:2470');
const oldM = MOCKB.findOne(n => n.name === 'Mobile — Dark (390)'); if (oldM) oldM.remove();
const M = F('Mobile — Dark (390)', { dir: 'VERTICAL', fill: 'bg', w: 390 });
MOCKB.appendChild(M); M.x = 5080; M.y = 120; M.setExplicitVariableModeForCollection(coll, DARK);
const W = 350;
const sec = (name, o = {}) => { const s = F(name, { dir: 'VERTICAL', pad: [88, 20], fill: 'bg', w: 390, ...o }); add(M, s); fill(s); if (o.inv) s.setExplicitVariableModeForCollection(coll, LIGHT); return s; };
const lbl = (t) => { const i = labC.createInstance(); i.findOne(n => n.name === 'Label').characters = t; return i; };
const btn = (t) => { const i = solidC.createInstance(); i.findOne(n => n.name === 'Label').characters = t; return i; };
const sp = (h) => { const s = figma.createFrame(); s.name = 'spacer'; s.fills = []; s.resize(10, h); return s; };
const H = async (txt, g, gc, size = 44) => { const t = await T(txt, 'Big', 'fg', { name: 'H2', g, gc, w: W }); t.fontSize = size; return t; };
const divRows = (parent) => { const r = F('Rows', { dir: 'VERTICAL' }); add(parent, r); fill(r); r.strokes = [P('line-2')]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; return r; };
const rowItem = async (parent, top, title, body) => { const r = F('Row · ' + title.slice(0, 28), { dir: 'VERTICAL', gap: 8, pad: [22, 0] }); add(parent, r); fill(r);
  r.strokes = [P('line-2')]; r.strokeTopWeight = 0; r.strokeBottomWeight = 1; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
  add(r, await T(top, 'Label', 'fg-muted'), fill(await T(title + '  →', 'H3', 'fg', { w: W, size: 21 }))); if (body) add(r, fill(await T(body, 'Small', 'fg-muted', { w: W }))); };
const out = {};

// Hero
const hero = F('01 Hero', { w: 390, h: 844, fill: 'bg', clip: true }); hero.resize(390, 844); add(M, hero);
const gl = rect('IMG · WebGL shards (phone)', 390, 844, 'bg'); hero.appendChild(gl); out.gl = gl.id;
const scr = rect('Scrim', 430, 520, 'bg'); scr.opacity = .75; scr.cornerRadius = 260; scr.effects = [{ type: 'LAYER_BLUR', radius: 60, visible: true }]; hero.appendChild(scr); scr.x = -20; scr.y = 360;
const nav = F('Nav (mobile)', { dir: 'HORIZONTAL', pad: [0, 20], w: 390, align: 'CENTER', just: 'SPACE_BETWEEN' }); nav.counterAxisSizingMode = 'FIXED'; nav.resize(390, 64); hero.appendChild(nav);
const br = F('Brand', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' }); add(br, await T('AI Orbit', 'H3', 'fg', { size: 20 }), await T('Evoke', 'Label', 'fg-muted'));
const menu = F('Menu button', { dir: 'HORIZONTAL', r: 999, stroke: 'line-2', align: 'CENTER', just: 'CENTER' }); menu.primaryAxisSizingMode = 'FIXED'; menu.counterAxisSizingMode = 'FIXED'; menu.resize(44, 44); add(menu, await T('☰', 'Small', 'fg'));
add(nav, br, menu);
const hl = lbl('Introducing Evoke AI Orbit'); hero.appendChild(hl); hl.x = 20; hl.y = 92;
const copy = F('Copy', { dir: 'VERTICAL', gap: 20, w: W }); hero.appendChild(copy); copy.x = 20;
const h1 = await T('AI that powers\nyour trajectory.', 'Mega', 'fg', { name: 'H1', g: 'your trajectory.', w: W }); h1.fontSize = 50; add(copy, h1);
add(copy, fill(await T('From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to a measurable impact.', 'Small', 'fg-hero', { w: W })), btn('Launch your AI journey'));
copy.y = 844 - 72 - copy.height;
const hf = await T('Tap & hold to charge · Scroll ↓', 'Label', 'fg-muted'); hero.appendChild(hf); hf.x = 20; hf.y = 806;

// Statement
const st = sec('02 Statement'); add(st, lbl('About AI Orbit'), sp(20));
const stmt = 'From strategy to execution, we help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.';
const sT = await T(stmt, 'Statement', 'fg', { w: W }); sT.fontSize = 30; add(st, sT); fill(sT); sT.setRangeFills(stmt.indexOf('This end'), stmt.length, [P('fg-subtle')]);

// Marquee
const mq = F('03 Marquee', { w: 390, h: 100, fill: 'bg', clip: true }); mq.resize(390, 100); add(M, mq);
mq.strokes = [P('line')]; mq.strokeTopWeight = 1; mq.strokeBottomWeight = 1; mq.strokeLeftWeight = 0; mq.strokeRightWeight = 0;
const mqs = 'Build + Modernize + Govern +'; const mt = await T(mqs, 'Marquee', 'fg'); mt.fontSize = 64; add(mq, mt);
let i = -1; while ((i = mqs.indexOf('+', i + 1)) >= 0) { mt.setRangeFills(i, i + 1, [P('fg-subtle')]); mt.setRangeFontSize(i, i + 1, 30); }
mt.setRangeFills(mqs.indexOf('Modernize'), mqs.indexOf('Modernize') + 9, [grad(GD)]); mt.x = -90; mt.y = (100 - mt.height) / 2;

// Key facts (inv)
const kf = sec('05 Key facts', { inv: true, gap: 0 });
add(kf, lbl('Key facts'), sp(16), await H('Driving measurable outcomes.', 'measurable', GL), sp(36));
const cards = F('Cards', { dir: 'VERTICAL', gap: 16 }); add(kf, cards); fill(cards);
out.facts = [];
for (const [l, n, b, g, photo] of [['Time saved', '65%', 'Average delivery time saved with agentic engineering.', '%', true], ['Skill packs', '150+', 'Reusable, tested agent skills that standardise behaviour.', '+', false], ['In production', '10+', 'Specialized agents running in production today.', '+', true]]) {
  const c = factC.createInstance(); add(cards, c); fill(c);
  c.findOne(x => x.name === 'Label').characters = l; const s = c.findOne(x => x.name === 'Stat'); s.characters = n; s.setRangeFills(0, n.length, [P('fg')]); s.setRangeFills(n.indexOf(g), n.length, [grad(GL)]);
  c.findOne(x => x.name === 'Body').characters = b; const p = c.findOne(x => x.name === 'Photo'); if (!photo) p.visible = false; else out.facts.push(p.id);
}
add(kf, sp(40), await T('Powering innovation together', 'Label', 'fg-muted'), sp(16));
const lg = F('Partner logos', { dir: 'HORIZONTAL', gap: 12 }); add(kf, lg); fill(lg); lg.layoutWrap = 'WRAP'; lg.counterAxisSpacing = 12;
out.logos = [];
for (const n of ['Microsoft', 'AWS', 'Salesforce', 'ServiceNow', 'Oracle', 'UiPath']) { const t = logoC.createInstance(); t.name = 'Logo · ' + n; t.findOne(x => x.name === 'Name').characters = n; t.resize(169, 72); add(lg, t); out.logos.push(t.id); }

// Case studies (inv) — swipe rail
const wk = sec('06 Case studies · swipe rail', { inv: true, gap: 0, clip: true });
add(wk, lbl('Case studies'), sp(16), await H('Stories of transformation'), sp(28));
const rail = F('Rail', { dir: 'HORIZONTAL', gap: 16 }); add(wk, rail);
out.work = [];
for (const [c, t, b] of [['Pharmaceutical', 'Sencha Migration', 'AI-Orchestrated ExtJS to React Modernization for a Regulated Pharmaceutical Enterprise.'], ['Tax Technology & Compliance', 'COBOL Conversion', 'AI‑powered multi‑agent modernization that transforms complex COBOL tax engines into validated MSTX.']]) {
  const card = F('Work · ' + t, { dir: 'VERTICAL', gap: 12, w: 300 }); add(rail, card);
  const ph = F('Photo', { r: 20, fill: 'surface-2', w: 300, h: 225, clip: true }); ph.resize(300, 225); add(card, ph); out.work.push(ph.id);
  const ch = chipC.createInstance(); ch.findOne(x => x.name === 'Label').characters = c; ph.appendChild(ch); ch.x = 14; ch.y = 14;
  add(card, fill(await T(t, 'H3', 'fg', { w: 300, size: 21 })), fill(await T(b, 'Small', 'fg-muted', { w: 300 })), await T('Explore project →', 'Label', 'fg'));
}
add(wk, sp(20), await T('Swipe →  01 / 05', 'Label', 'fg-muted'));

// Services
const sv = sec('07 Services', { gap: 0 });
const core = F('Core + words', { w: W, h: 420, clip: true }); core.resize(W, 420); add(sv, core); fill(core);
const coreImg = rect('IMG · WebGL AI core', 560, 420, 'bg'); core.appendChild(coreImg); coreImg.x = -105; out.core = coreImg.id;
const words = await T('Agents\nEngineering\nGovernance\nAdvisory', 'Words', 'fg', { g: 'Governance' }); words.fontSize = 50; words.textAlignHorizontal = 'CENTER'; core.appendChild(words); words.x = (W - words.width) / 2; words.y = (420 - words.height) / 2;
const svTop = await T('Our services', 'Label', 'fg-muted'); sv.insertChild(0, svTop); sv.insertChild(1, sp(24));
add(sv, sp(32));
const sc = F('Cards', { dir: 'VERTICAL', gap: 16 }); add(sv, sc); fill(sc);
for (const [n, t, g, b, l] of [['01 · Enterprise Agent Solutions', 'Build What Thinks', 'Intelligent applications that don’t just automate. They reason.', 'Production-ready, scalable, edge-case-tested and governance-ready agents for high-stakes problems.', 'Explore AI Apps →'], ['02 · AI-First Software Engineering', 'Intelligence in Every Sprint', 'Code at the speed of thought.', 'Specialist AI agents across your SDLC. Your engineers own the architecture, compliance, and every release.', 'Explore SDLC AI →'], ['03 · AI Governance', 'Move Fast. Sleep Well', 'The seatbelt that lets you go faster.', 'Frameworks for guardrails, quality assurance, ethics, and regulatory audit readiness.', 'Explore AI Governance →'], ['04 · AI Advisory', 'Know Before You Build', 'Every successful AI project begins with the right questions.', 'Strategy, readiness, prioritized use cases, and the foundation for what comes next.', 'Explore AI Advisory →']]) {
  const c = scardC.createInstance(); add(sc, c); fill(c); c.findOne(x => x.name === 'Number').characters = n; c.findOne(x => x.name === 'Title').characters = t; c.findOne(x => x.name === 'Tag').characters = g; c.findOne(x => x.name === 'Body').characters = b; c.findOne(x => x.name === 'Link').characters = l; }

// Industries (inv)
const ind = sec('08 Industries', { inv: true, gap: 0 });
add(ind, lbl('Industries'), sp(16), await H('AI that speaks your industry.', 'your industry.', GL), sp(32));
const ir = divRows(ind);
for (const [k, t, d] of [['01', 'Manufacturing & Industrial', 'From shop floor to boardroom – AI that runs on operational reality.'], ['02', 'Financial Services (BFSI)', 'Built for audit, scale, and scrutiny.'], ['03', 'Energy (Oil & Gas)', 'Decades of unstructured history, turned into operational decisions.'], ['04', 'Healthcare & Life Sciences', 'HIPAA-aware AI that earns clinician trust.'], ['05', 'Higher Education', 'Stress-free admissions journey.'], ['06', 'Mining & Natural Resources', 'Modernization without disruption.']]) await rowItem(ir, k, t, d);

// Knowledge
const kn = sec('09 Knowledge hub', { gap: 0 });
add(kn, lbl('Knowledge hub'), sp(16), await H('From brainstorming to execution – all in one place.', 'all in one place.', GD, 38), sp(32));
const kr = divRows(kn);
for (const [k, t] of [['Knowledge paper', 'Hyper Programing: A New SDLC Paradigm'], ['Knowledge paper', 'Role Convergence in the AI SDLC (ADLC)'], ['Article', 'SEE THE SYSTEM: Why AI Projects Fail When You Map the Symptom Instead of the System'], ['Article', 'DECONSTRUCT: Stage 1 of First Principles Delivery'], ['Article', 'Build: How We Construct AI Systems That Work in Production']]) await rowItem(kr, k, t);

// CTA
const cta = F('10 CTA', { w: 390, h: 620, fill: 'bg', clip: true }); cta.resize(390, 620); add(M, cta);
const ci = rect('IMG · WebGL shards (calm)', 990, 620, 'bg'); cta.appendChild(ci); ci.x = -300; out.cta = ci.id;
const cc = F('Content', { dir: 'VERTICAL', gap: 22, align: 'CENTER', w: W }); cta.appendChild(cc); cc.x = 20;
add(cc, lbl('Build · Modernize · Govern'));
const ch2 = await T('All in one orbit.', 'Mega', 'fg', { g: 'orbit.', w: W }); ch2.fontSize = 64; ch2.textAlignHorizontal = 'CENTER'; add(cc, ch2);
const cl = await T('Whether you’re building, modernizing, or governing. AI Orbit brings structure, speed, and safety to every stage of your AI journey.', 'Small', 'fg-hero', { w: W }); cl.textAlignHorizontal = 'CENTER'; add(cc, cl);
add(cc, btn('Launch your AI journey')); cc.y = (620 - cc.height) / 2;

// Contact (inv)
const ct = sec('11 Contact', { inv: true, gap: 0 });
add(ct, lbl('Get in touch'), sp(16), await H('Let’s build what’s next.'), sp(28));
const offs = F('Offices', { dir: 'HORIZONTAL', gap: 14 }); add(ct, offs); fill(offs); offs.layoutWrap = 'WRAP'; offs.counterAxisSpacing = 16;
for (const [c, t] of [['Dayton, USA', '09:41 AM'], ['Dallas, USA', '08:41 AM'], ['London, UK', '02:41 PM'], ['Wroclaw, Poland', '03:41 PM'], ['Hyderabad, India', '08:11 PM'], ['Bengaluru, India', '08:11 PM'], ['Sydney, Australia', '01:41 AM']]) {
  const o = F('Office · ' + c, { dir: 'VERTICAL', gap: 4, w: 168 }); add(offs, o); add(o, await T(c, 'Button', 'fg'), await T(t, 'Label', 'fg-muted')); }
add(ct, sp(24), lbl('For queries'), sp(6), await T('mktg@evoketechnologies.com', 'H3', 'fg', { size: 20 }), sp(36));
const form = F('Form', { dir: 'VERTICAL', gap: 18 }); add(ct, form); fill(form);
for (const [lab, h, ph] of [['Full name *', 52, ''], ['Work email *', 52, ''], ['Company', 52, ''], ['Interested in', 52, 'Enterprise Agent Solutions  ▾'], ['What are you solving?', 132, '']]) {
  const f = F('Field · ' + lab, { dir: 'VERTICAL', gap: 8 }); add(form, f); fill(f);
  const l = await T(lab, 'Small', 'fg'); add(f, l); const s = lab.indexOf('*'); if (s >= 0) l.setRangeFills(s, s + 1, [P('accent-text')]);
  const box = F('Input', { dir: 'HORIZONTAL', pad: [0, 16], r: 12, fill: 'surface', stroke: 'line-2', align: 'CENTER' }); add(f, box); fill(box); box.counterAxisSizingMode = 'FIXED'; box.resize(W, h); if (ph) add(box, await T(ph, 'Small', 'fg-subtle'));
}
add(form, btn('Send request'));

// Footer
const ft = sec('12 Footer', { gap: 28, pad: [64, 20, 32, 20] });
add(ft, await T('AI Orbit', 'H3', 'fg'), fill(await T('Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.', 'Small', 'fg-muted', { w: W })));
const fc = F('Columns', { dir: 'HORIZONTAL', gap: 20 }); add(ft, fc); fill(fc); fc.layoutWrap = 'WRAP'; fc.counterAxisSpacing = 28;
for (const [h, items] of [['Services', ['Agent Solutions', 'AI-First Engineering', 'AI Governance', 'AI Advisory']], ['Insights', ['Case studies', 'Blog', 'Videos', 'Resource hub']]]) { const c = F('Col · ' + h, { dir: 'VERTICAL', gap: 10, w: 165 }); add(fc, c); add(c, await T(h, 'Label', 'fg-muted')); for (const it of items) add(c, await T(it, 'Small', 'fg')); }
const wm = await T('AI Orbit', 'Mega', 'fg'); wm.fontSize = 110; wm.fills = [grad(GD)]; wm.opacity = .22; add(ft, wm);
add(ft, fill(await T('Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.', 'Small', 'fg-muted', { w: W })));

// Light clone
const oldL = MOCKB.findOne(n => n.name === 'Mobile — Light (390)'); if (oldL) oldL.remove();
const ML = M.clone(); MOCKB.appendChild(ML); ML.name = 'Mobile — Light (390)'; ML.x = M.x + 390 + 80; ML.y = M.y; ML.setExplicitVariableModeForCollection(coll, LIGHT);
for (const n of ML.findAll(n => n.explicitVariableModes && n.explicitVariableModes[coll.id] === LIGHT)) n.setExplicitVariableModeForCollection(coll, DARK);
const near = (c, h) => { const x = hex(h); return Math.abs(c.r - x.r) + Math.abs(c.g - x.g) + Math.abs(c.b - x.b) < .02; };
const swap = p => p.type !== 'GRADIENT_LINEAR' ? p : { ...p, gradientStops: p.gradientStops.map(s => { for (let k = 0; k < 3; k++) { if (near(s.color, GD[k])) return { ...s, color: { ...hex(GL[k]), a: 1 } }; if (near(s.color, GL[k])) return { ...s, color: { ...hex(GD[k]), a: 1 } }; } return s; }) };
for (const t of ML.findAll(n => n.type === 'TEXT')) for (const s of t.getStyledTextSegments(['fills'])) if (s.fills.some(p => p.type === 'GRADIENT_LINEAR')) t.setRangeFills(s.start, s.end, s.fills.map(swap));
out.mDark = M.id; out.mLight = ML.id; out.h = M.height;
return out;
