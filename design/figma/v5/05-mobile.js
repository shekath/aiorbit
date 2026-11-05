// ---- V5 Mobile (390) Dark + Light ----
const bP = await C('1469:3014'), bS = await C('1469:3018'), bL = await C('1469:3022'), ebC = await C('1469:3027'), faqC = await C('1469:3068'), faqO = await C('1469:3073'), fieldC = await C('1469:3064');
for (const o of MOCKB.findAll(n => n.name.startsWith('V5 · Mobile'))) o.remove();
const W = 350;
const M = F('V5 · Mobile — Dark (390)', { dir: 'VERTICAL', fill: 'bg', w: 390, clip: true });
MOCKB.appendChild(M); M.x = 12800; M.y = 260; M.setExplicitVariableModeForCollection(coll, DARK);
const sec = (name, o = {}) => { const s = F(name, { dir: 'VERTICAL', pad: [64, 20], gap: 28, fill: o.fill || 'bg', w: 390, ...o }); add(M, s); fill(s); return s; };
const h2 = async (label, t, g, body) => { const h = F('Heading', { dir: 'VERTICAL', gap: 12, w: W }); add(h, await T(label, 'Label', 'accent-text')); const x = await T(t, 'H2', 'fg', { g, w: W }); x.fontSize = 30; add(h, x); fill(x); if (body) add(h, fill(await T(body, 'Body', 'fg-muted', { w: W }))); return h; };
const full = (c, t) => { const i = inst(c, { Label: t }); i.primaryAxisAlignItems = 'CENTER'; return i; };
// nav
const nav = F('Nav (mobile)', { dir: 'HORIZONTAL', pad: [0, 20], w: 390, h: 64, align: 'CENTER', just: 'SPACE_BETWEEN', fill: 'bg' }); add(M, nav); nav.strokes = [P('line')]; side(nav, 'b');
const br = F('Brand', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' }); add(br, tile('agent', 30), await T('AI Orbit', 'H3', 'fg')); br.children[1].fontSize = 19;
const mb = F('Menu', { dir: 'HORIZONTAL', r: 10, stroke: 'line-2', align: 'CENTER', just: 'CENTER' }); mb.primaryAxisSizingMode = 'FIXED'; mb.counterAxisSizingMode = 'FIXED'; mb.resize(44, 44); add(mb, icon('menu', 'fg', 20)); add(nav, br, mb);
// hero
const hero = sec('01 Hero', { pad: [40, 20, 48, 20], gap: 22 });
add(hero, inst(ebC, { Label: 'New · Evoke AI Orbit' }));
const h1 = await T('AI that powers your trajectory.', 'Display', 'fg', { name: 'H1', g: 'your trajectory.', w: W }); h1.fontSize = 42; add(hero, h1); fill(h1);
add(hero, fill(await T('From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to measurable impact.', 'Body', 'fg-muted', { w: W })));
const ha = F('Actions', { dir: 'VERTICAL', gap: 10, w: W }); add(hero, ha); for (const b of [full(bP, 'Launch your AI journey'), full(bS, 'Explore services')]) { add(ha, b); fill(b); }
const pf = F('Proof points', { dir: 'HORIZONTAL', gap: 0, w: W }); add(hero, pf);
for (const [v, l, k] of [['65%', 'faster delivery', 0], ['150+', 'skill packs', 1], ['10+', 'agents live', 2]]) { const p = F('Proof · ' + v, { dir: 'VERTICAL', gap: 2, pad: [0, 12, 0, k ? 12 : 0] }); add(pf, p); grow(p); if (k) { p.strokes = [P('line-2')]; side(p, 'l'); } const v1 = await T(v, 'H2', 'fg'); v1.fontSize = 26; add(p, v1, fill(await T(l, 'Small', 'fg-muted', { w: 90 }))); }
const con = await agentConsole(W); add(hero, con);
const lat = lattice('AI lattice (decorative)', 390, 300, 26, 31, .45); hero.insertChild(0, lat); lat.layoutPositioning = 'ABSOLUTE'; lat.x = 0; lat.y = 560;
// platforms
const pl = sec('02 Platforms', { pad: [24, 20], gap: 14 }); pl.strokes = [P('line')]; side(pl, 'tb');
add(pl, await T('Built on platforms you trust', 'Label', 'fg-subtle'));
const pw = F('Names', { dir: 'HORIZONTAL', gap: 20, wrap: 10, w: W }); add(pl, pw); for (const n of ['Microsoft', 'AWS', 'Salesforce', 'ServiceNow', 'Oracle', 'UiPath']) add(pw, await T(n, 'Strong', 'fg-subtle'));
// services
const sv = sec('04 Services', { fill: 'bg-2' }); add(sv, await h2('Our services', 'Enterprise AI with structure, speed, and security.', 'structure, speed, and security.'));
for (const d of [{ icon: 'agent', n: '01', title: 'Enterprise Agent Solutions', tag: 'Build what thinks.', body: 'Production-ready, governance-ready agents for high-stakes problems.', bullets: ['Custom agents for complex workflows', 'Human-in-the-loop controls'], link: 'Explore AI Apps' }, { icon: 'code', n: '02', title: 'AI-First Software Engineering', tag: 'Intelligence in every sprint.', body: 'Specialist AI agents across your SDLC. Your engineers own every release.', bullets: ['150+ skill packs', 'Up to 65% delivery time saved'], link: 'Explore SDLC AI' }, { icon: 'shield', n: '03', title: 'AI Governance', tag: 'Move fast. Sleep well.', body: 'Guardrails, quality assurance, ethics and audit readiness.', bullets: ['Policy controls', 'Audit-ready evidence'], link: 'Explore AI Governance' }, { icon: 'bulb', n: '04', title: 'AI Advisory', tag: 'Know before you build.', body: 'Strategy, readiness and prioritized use cases.', bullets: ['Readiness assessment', 'Use-case roadmap'], link: 'Explore AI Advisory' }]) { const c = await serviceCard({ ...d, w: W }); c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 24; add(sv, c); fill(c); }
// how it works (vertical timeline)
const hw = sec('05 How it works'); add(hw, await h2('How it works', 'From first question to governed production.', 'governed production.'));
const tl = F('Timeline', { dir: 'VERTICAL', gap: 0, w: W }); add(hw, tl);
const SD = [['01', 'Discover', 'Readiness, data and risk assessed in two weeks.'], ['02', 'Design', 'Use cases prioritized and architecture agreed.'], ['03', 'Build', 'Agents built with evaluation gates at every step.'], ['04', 'Govern', 'Guardrails, audit trails and human review in place.'], ['05', 'Scale', 'Reusable skill packs roll the win out across teams.']];
for (let k = 0; k < SD.length; k++) { const [n, t, b] = SD[k]; const r = F('Step · ' + t, { dir: 'HORIZONTAL', gap: 16, pad: [0, 0, k < 4 ? 22 : 0, 0], align: 'MIN' }); add(tl, r); fill(r);
  const ix = F('Index', { dir: 'HORIZONTAL', r: 999, stroke: 'accent', align: 'CENTER', just: 'CENTER' }); ix.primaryAxisSizingMode = 'FIXED'; ix.counterAxisSizingMode = 'FIXED'; ix.resize(36, 36); add(ix, await T(n, 'Label', 'accent-text')); add(r, ix);
  const tx = F('Text', { dir: 'VERTICAL', gap: 4 }); add(r, tx); grow(tx); add(tx, fill(await T(t, 'H3', 'fg', { w: 280 })), fill(await T(b, 'Small', 'fg-muted', { w: 280 }))); }
// outcomes
const oc = sec('06 Outcomes', { fill: 'bg-2' }); add(oc, await h2('Key facts', 'Driving measurable outcomes.', 'measurable'));
for (const d of [{ label: 'Delivery time saved', value: '65%', g: '%', desc: 'Average time saved with agentic engineering.', bars: [12, 18, 24, 30, 38, 46, 56] }, { label: 'Skill packs', value: '150+', g: '+', desc: 'Reusable, tested agent skills.', bars: [10, 16, 24, 30, 38, 44, 52] }, { label: 'Agents in production', value: '10+', g: '+', desc: 'Specialized agents running in production today.', bars: [8, 12, 18, 26, 34, 42, 50] }]) { const m = await metricTile({ ...d, w: W }); add(oc, m); fill(m); }
// cases
const cs = sec('07 Case studies'); add(cs, await h2('Case studies', 'Stories of transformation.', 'transformation.'));
for (const d of [{ industry: 'Tax technology', title: 'COBOL Conversion', body: 'Multi-agent modernization of COBOL tax engines into validated MSTX with full compliance.', metric: 'Minutes', metricLabel: 'not months, zero errors' }, { industry: 'Legal & compliance', title: 'Incident Triage Agent', body: 'AI-orchestrated ITSM triage that classifies and routes incidents in real time.', metric: 'Zero', metricLabel: 'manual routing overhead' }]) { const c = await caseCard({ ...d, w: W }); add(cs, c); fill(c); }
const ab = inst(bS, { Label: 'All case studies' }); add(cs, ab);
// industries
const id = sec('08 Industries', { fill: 'bg-2' }); add(id, await h2('Industries', 'AI that speaks your industry.', 'your industry.'));
const il = F('List', { dir: 'VERTICAL', w: W }); add(id, il); il.strokes = [P('line')]; side(il, 't');
for (const [ic, t, b] of [['factory', 'Manufacturing & Industrial', 'AI that runs on operational reality.'], ['bank', 'Financial Services (BFSI)', 'Built for audit, scale, and scrutiny.'], ['bolt', 'Energy (Oil & Gas)', 'Unstructured history into decisions.'], ['health', 'Healthcare & Life Sciences', 'HIPAA-aware AI clinicians trust.'], ['cap', 'Higher Education', 'A stress-free admissions journey.'], ['mountain', 'Mining & Natural Resources', 'Modernization without disruption.']]) {
  const r = F('Industry · ' + t, { dir: 'HORIZONTAL', gap: 14, pad: [18, 0], align: 'CENTER', w: W }); add(il, r); r.strokes = [P('line')]; side(r, 'b');
  add(r, tile(ic, 40)); const tx = F('Text', { dir: 'VERTICAL', gap: 2 }); add(r, tx); grow(tx); add(tx, fill(await T(t, 'Strong', 'fg', { w: 240 })), fill(await T(b, 'Small', 'fg-muted', { w: 240 }))); add(r, icon('arrow', 'fg-muted', 18)); }
// insights
const kn = sec('09 Knowledge hub'); add(kn, await h2('Knowledge hub', 'From brainstorming to execution — all in one place.', 'all in one place.'));
const kl = F('List', { dir: 'VERTICAL', w: W }); add(kn, kl); kl.strokes = [P('line')]; side(kl, 't');
for (const [ty, t] of [['Knowledge paper', 'Hyper Programming: A New SDLC Paradigm'], ['Knowledge paper', 'Role Convergence in the AI SDLC (ADLC)'], ['Article', 'Build: How We Construct AI Systems That Work in Production']]) { const r = F('Insight', { dir: 'VERTICAL', gap: 6, pad: [18, 0], w: W }); add(kl, r); r.strokes = [P('line')]; side(r, 'b'); add(r, await T(ty, 'Label', 'fg-subtle'), fill(await T(t, 'H3', 'fg', { w: W }))); r.children[1].fontSize = 19; }
// faq
const fq = sec('10 FAQ', { fill: 'bg-2', gap: 8 }); add(fq, await h2('FAQ', 'Questions, answered.'));
for (const [q, a] of [['How fast can we get an agent into production?', 'Most teams ship a governed pilot in 6–8 weeks, with evaluation gates before go-live.'], ['How do you keep AI governed and auditable?', null], ['Will this work with our existing stack?', null]]) { const it = (a ? faqO : faqC).createInstance(); add(fq, it); fill(it); const qq = it.findOne(n => n.name === 'Question'); qq.characters = q; qq.fontSize = 18; if (a) it.findOne(n => n.name === 'Answer').characters = a; }
// cta
const ct = sec('11 CTA', { pad: [40, 20] });
const pn = F('Panel', { dir: 'VERTICAL', pad: 28, gap: 16, r: 22, fill: 'surface', stroke: 'line-2', w: W, clip: true }); add(ct, pn);
const plat = lattice('AI lattice (decorative)', W, 200, 18, 9, .5); pn.insertChild(0, plat); plat.layoutPositioning = 'ABSOLUTE'; plat.x = 0; plat.y = 0;
add(pn, await T('Build · Modernize · Govern', 'Label', 'accent-text')); const ch = await T('All in one orbit.', 'H1', 'fg', { g: 'orbit.', w: 294 }); ch.fontSize = 36; add(pn, ch); fill(ch);
add(pn, fill(await T('Structure, speed and safety at every stage of your AI journey.', 'Body', 'fg-muted', { w: 294 }))); const cb = full(bP, 'Launch your AI journey'); add(pn, cb); fill(cb);
// contact
const co = sec('12 Contact'); add(co, await h2('Get in touch', 'Let’s build what’s next.', null, 'An AI specialist replies within one business day.'));
for (const [l, ph] of [['Full name *', 'Jane Doe'], ['Work email *', 'name@company.com'], ['Company', 'Company name'], ['Interested in', 'Enterprise Agent Solutions ▾']]) { const f = inst(fieldC, { Label: l, Placeholder: ph }); add(co, f); fill(f); }
const sb = full(bP, 'Send request'); add(co, sb); fill(sb);
const ml = F('Email', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' }); add(co, ml); add(ml, icon('doc', 'accent-text', 18), await T('mktg@evoketechnologies.com', 'Strong', 'fg'));
// footer
const ft = sec('13 Footer', { pad: [48, 20, 32, 20], gap: 24, fill: 'bg-2' }); ft.strokes = [P('line')]; side(ft, 't');
const fb = F('Brand', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' }); add(fb, tile('agent', 30), await T('AI Orbit', 'H3', 'fg')); add(ft, fb, fill(await T('Build, modernize, govern — all in one orbit.', 'Small', 'fg-muted', { w: W })));
const fc = F('Columns', { dir: 'HORIZONTAL', gap: 20, w: W }); add(ft, fc);
for (const [h, items] of [['Services', ['Agent Solutions', 'AI-First Engineering', 'AI Governance', 'AI Advisory']], ['Insights', ['Case studies', 'Blog', 'Videos', 'Resource hub']]]) { const c = F('Col · ' + h, { dir: 'VERTICAL', gap: 10 }); add(fc, c); grow(c); add(c, await T(h, 'Label', 'fg-subtle')); for (const it of items) add(c, await T(it, 'Small', 'fg-muted')); }
add(ft, fill(await T('Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.', 'Small', 'fg-subtle', { w: W })));
// Light clone
const ML = M.clone(); MOCKB.appendChild(ML); ML.name = 'V5 · Mobile — Light (390)'; ML.x = M.x + 390 + 80; ML.y = M.y; ML.setExplicitVariableModeForCollection(coll, LIGHT);
const near = (c, h) => { const x = hex(h); return Math.abs(c.r - x.r) + Math.abs(c.g - x.g) + Math.abs(c.b - x.b) < .02; };
const swap = p => p.type !== 'GRADIENT_LINEAR' ? p : { ...p, gradientStops: p.gradientStops.map(s => { for (let k = 0; k < 3; k++) if (near(s.color, GD[k])) return { ...s, color: { ...hex(GL[k]), a: 1 } }; return s; }) };
for (const t of ML.findAll(n => n.type === 'TEXT')) for (const s of t.getStyledTextSegments(['fills'])) if (s.fills.some(p => p.type === 'GRADIENT_LINEAR')) t.setRangeFills(s.start, s.end, s.fills.map(swap));
for (const n of ML.findAll(n => n.type === 'RECTANGLE' && n.name === 'value')) n.fills = n.fills.map(swap);
for (const sh of ML.findAll(n => n.name === 'Agent console · AI element')) sh.effects = [{ type: 'DROP_SHADOW', color: { r: .1, g: .12, b: .2, a: .14 }, offset: { x: 0, y: 24 }, radius: 48, spread: -8, visible: true, blendMode: 'NORMAL' }];
// overflow check
const bad = []; for (const t of M.findAll(n => n.type === 'TEXT')) { const b = t.absoluteBoundingBox, m = M.absoluteBoundingBox; if (b.x + b.width > m.x + 390 - 19 || b.x < m.x + 19) bad.push(t.characters.slice(0, 30)); }
return { dark: M.id, light: ML.id, h: M.height, bad: bad.slice(0, 10) };
