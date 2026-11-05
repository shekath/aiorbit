// ---- V5 Home Dark, part 1: nav → how it works ----
const bP = await C('1469:3014'), bS = await C('1469:3018'), ebC = await C('1469:3027'), navC = await C('1469:3033');
for (const o of MOCKB.findAll(n => n.name === 'V5 · Home — Dark (1440)')) o.remove();
const home = F('V5 · Home — Dark (1440)', { dir: 'VERTICAL', fill: 'bg', w: 1440 });
MOCKB.appendChild(home); home.x = 8000; home.y = 260; home.setExplicitVariableModeForCollection(coll, DARK);
const sec = (name, o = {}) => { const s = F(name, { dir: 'VERTICAL', pad: [96, 80], gap: 48, fill: o.fill || 'bg', w: 1440, ...o }); add(home, s); fill(s); return s; };
const head = async (label, h2, g, body, w = 760) => { const h = F('Heading', { dir: 'VERTICAL', gap: 14, w }); add(h, await T(label, 'Label', 'accent-text'), fill(await T(h2, 'H2', 'fg', { g, w }))); if (body) add(h, fill(await T(body, 'Body', 'fg-muted', { w }))); return h; };
const btn = (c, t) => inst(c, { Label: t });
add(home, inst(navC));
// HERO — compact, two columns, content first; AI lattice sits only behind the right column
const hero = F('01 Hero · content first', { dir: 'HORIZONTAL', pad: [72, 80, 88, 80], gap: 64, fill: 'bg', w: 1440, align: 'CENTER' }); add(home, hero); fill(hero); hero.clipsContent = true;
const lat = lattice('AI lattice (decorative)', 760, 640, 54, 23, .55); add(hero, lat); lat.layoutPositioning = 'ABSOLUTE'; lat.x = 680; lat.y = 0;
const glow = figma.createEllipse(); glow.name = 'Glow'; glow.resize(560, 420); glow.fills = [P('glow', .9)]; glow.effects = [{ type: 'LAYER_BLUR', radius: 140, visible: true }]; add(hero, glow); glow.layoutPositioning = 'ABSOLUTE'; glow.x = 820; glow.y = 120;
const left = F('Copy', { dir: 'VERTICAL', gap: 24 }); add(hero, left); grow(left);
add(left, inst(ebC, { Label: 'New · Evoke AI Orbit' }));
add(left, fill(await T('AI that powers your trajectory.', 'Display', 'fg', { name: 'H1', g: 'your trajectory.', w: 640 })));
add(left, fill(await T('From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to measurable impact.', 'Lead', 'fg-muted', { w: 640 })));
const ctas = F('Actions', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER', pad: [8, 0, 0, 0] }); add(left, ctas); add(ctas, btn(bP, 'Launch your AI journey'), btn(bS, 'Explore services'));
const trust = F('Proof points', { dir: 'HORIZONTAL', gap: 0, pad: [16, 0, 0, 0] }); add(left, trust); fill(trust);
for (const [v, l, k] of [['65%', 'faster delivery with agentic engineering', 0], ['150+', 'reusable, tested skill packs', 1], ['10+', 'specialized agents in production', 2]]) {
  const p = F('Proof · ' + v, { dir: 'VERTICAL', gap: 4, pad: [0, 20, 0, k ? 20 : 0] }); add(trust, p); grow(p); if (k) { p.strokes = [P('line-2')]; side(p, 'l'); }
  add(p, await T(v, 'H2', 'fg'), fill(await T(l, 'Small', 'fg-muted', { w: 160 }))); }
const con = await agentConsole(520); add(hero, con);
// LOGOS
const lg = F('02 Platforms', { dir: 'HORIZONTAL', pad: [28, 80], gap: 32, fill: 'bg', w: 1440, align: 'CENTER', just: 'SPACE_BETWEEN' }); add(home, lg); fill(lg); lg.strokes = [P('line')]; side(lg, 'tb');
add(lg, await T('Built on platforms you trust', 'Label', 'fg-subtle'));
for (const n of ['Microsoft', 'AWS', 'Salesforce', 'ServiceNow', 'Oracle', 'UiPath']) add(lg, await T(n, 'H3', 'fg-subtle', { name: 'Partner · ' + n }));
// ABOUT
const ab = sec('03 About', { dir: 'HORIZONTAL', gap: 80 }); ab.counterAxisAlignItems = 'MIN';
add(ab, await head('About AI Orbit', 'From strategy to execution, one accountable partner.', null, null, 480));
const abR = F('Detail', { dir: 'VERTICAL', gap: 28 }); add(ab, abR); grow(abR);
add(abR, fill(await T('We help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.', 'Lead', 'fg', { w: 640 })));
const pts = F('Pillars', { dir: 'HORIZONTAL', gap: 24 }); add(abR, pts); fill(pts);
for (const [ic, t, d] of [['agent', 'Build', 'Custom agents and AI apps that reason, not just automate.'], ['layers', 'Modernize', 'Agentic engineering that moves legacy estates forward safely.'], ['shield', 'Govern', 'Guardrails, evaluation and audit evidence by design.']]) {
  const p = F('Pillar · ' + t, { dir: 'VERTICAL', gap: 10 }); add(pts, p); grow(p); add(p, tile(ic, 40), await T(t, 'H3', 'fg'), fill(await T(d, 'Small', 'fg-muted', { w: 180 }))); }
// SERVICES
const sv = sec('04 Services', { fill: 'bg-2' });
const svH = F('Header', { dir: 'HORIZONTAL', gap: 48, align: 'MAX', just: 'SPACE_BETWEEN' }); add(sv, svH); fill(svH);
add(svH, await head('Our services', 'Enterprise AI with structure, speed, and security.', 'structure, speed, and security.', null, 720));
const svR = F('Aside', { dir: 'VERTICAL', gap: 16, w: 400 }); add(svH, svR); add(svR, fill(await T('Four disciplines, one orbit. Start anywhere and connect the rest as your AI programme grows.', 'Body', 'fg-muted', { w: 400 })), btn(bS, 'Compare services'));
const S = [
  { icon: 'agent', n: '01', title: 'Enterprise Agent Solutions', tag: 'Build what thinks — applications that don’t just automate. They reason.', body: 'Production-ready, scalable, edge-case-tested and governance-ready agents for high-stakes problems.', bullets: ['Custom agents for complex workflows', 'Evaluation gates before go-live', 'Human-in-the-loop controls'], link: 'Explore AI Apps' },
  { icon: 'code', n: '02', title: 'AI-First Software Engineering', tag: 'Intelligence in every sprint — code at the speed of thought.', body: 'Specialist AI agents across your SDLC. Your engineers own the architecture, compliance, and every release.', bullets: ['Agentic SDLC with 150+ skill packs', 'Legacy modernization (COBOL, ExtJS)', 'Up to 65% delivery time saved'], link: 'Explore SDLC AI' },
  { icon: 'shield', n: '03', title: 'AI Governance', tag: 'Move fast. Sleep well — the seatbelt that lets you go faster.', body: 'Frameworks for guardrails, quality assurance, ethics, and regulatory audit readiness.', bullets: ['Guardrails and policy controls', 'Model risk and bias testing', 'Audit-ready evidence trails'], link: 'Explore AI Governance' },
  { icon: 'bulb', n: '04', title: 'AI Advisory', tag: 'Know before you build — every successful AI project begins with the right questions.', body: 'Strategy, readiness, prioritized use cases, and the foundation for what comes next.', bullets: ['AI readiness assessment', 'Prioritized use-case roadmap', 'Business case and value model'], link: 'Explore AI Advisory' }];
for (let r = 0; r < 2; r++) { const row = F('Row', { dir: 'HORIZONTAL', gap: 24 }); add(sv, row); fill(row); for (const d of S.slice(r * 2, r * 2 + 2)) { const c = await serviceCard({ ...d, w: 628 }); add(row, c); grow(c); } }
// HOW IT WORKS
const hw = sec('05 How it works');
add(hw, await head('How it works', 'From first question to governed production.', 'governed production.', 'A delivery rhythm built for regulated enterprises: every stage ends with evidence you can show an auditor.', 720));
const steps = F('Pipeline', { dir: 'HORIZONTAL', gap: 24 }); add(hw, steps); fill(steps);
const SD = [['01', 'search', 'Discover', 'Readiness, data and risk assessed in two weeks.'], ['02', 'layers', 'Design', 'Use cases prioritized and the target architecture agreed.'], ['03', 'code', 'Build', 'Agents built with evaluation gates at every step.'], ['04', 'shield', 'Govern', 'Guardrails, audit trails and human review in place.'], ['05', 'rocket', 'Scale', 'Reusable skill packs roll the win out across teams.']];
for (let k = 0; k < SD.length; k++) { const [n, ic, t, b] = SD[k]; const s = await stepItem({ n, icon: ic, title: t, body: b, last: k === SD.length - 1, w: 237 }); add(steps, s); grow(s); }
return { home: home.id, h: home.height };
