// ---- V5 component board ----
for (const o of MOCKB.findAll(n => n.name === 'V5 / Components')) o.remove();
const board = F('V5 / Components', { dir: 'VERTICAL', pad: 80, gap: 48, fill: 'bg', w: 1640 });
MOCKB.appendChild(board); board.x = 6200; board.y = 260; board.setExplicitVariableModeForCollection(coll, DARK);
add(board, fill(await T('Version 5 · Clarity — components', 'H1', 'fg', { g: 'Clarity', w: 1400 })));
add(board, fill(await T('Content first. Sora SemiBold headings, DM Sans body at 17px / 165%, JetBrains Mono labels. Every colour is bound to “AI Orbit V5 / Color” (Dark / Light). All text is auto-height inside auto-layout, so nothing clips or overlaps at any width.', 'Lead', 'fg-muted', { w: 1000 })));
const row = async (title) => { const r = F('Row · ' + title, { dir: 'VERTICAL', gap: 18 }); add(board, r); fill(r); add(r, await T(title, 'Label', 'fg-subtle')); const c = F('items', { dir: 'HORIZONTAL', gap: 24, align: 'MIN', wrap: 24 }); add(r, c); fill(c); return c; };
const ids = {};
const mkBtn = async (k) => {
  const v = { Primary: ['btn-bg', null, 'btn-fg'], Secondary: [null, 'line-2', 'fg'], Link: [null, null, 'accent-text'] }[k];
  const b = F('Kind=' + k, { comp: true, dir: 'HORIZONTAL', pad: k === 'Link' ? 0 : [14, 22], gap: 10, r: 10, fill: v[0], stroke: v[1], align: 'CENTER' });
  add(b, await T(k === 'Primary' ? 'Talk to an AI expert' : k === 'Secondary' ? 'Explore services' : 'Read the case study', 'Button', v[2], { name: 'Label' }), icon('arrow', v[2], 18)); return b;
};
const r1 = await row('Buttons · Primary / Secondary / Link');
const bP = await mkBtn('Primary'), bS = await mkBtn('Secondary'), bL = await mkBtn('Link'); add(r1, bP, bS, bL);
const set = figma.combineAsVariants([bP, bS, bL], r1); set.name = 'Button'; set.layoutMode = 'HORIZONTAL'; set.itemSpacing = 24; set.counterAxisAlignItems = 'CENTER'; set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 24; set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO'; set.fills = []; set.strokes = [P('line-2')]; set.dashPattern = [6, 6]; set.cornerRadius = 16;
ids.bP = bP.id; ids.bS = bS.id; ids.bL = bL.id;
const eb = F('Eyebrow', { comp: true, dir: 'HORIZONTAL', gap: 8, pad: [6, 12], r: 999, fill: 'chip', align: 'CENTER' }); const dot = figma.createEllipse(); dot.resize(7, 7); dot.fills = [P('success')]; dot.name = 'dot';
add(eb, dot, await T('New · Evoke AI Orbit', 'Label', 'accent-text', { name: 'Label' })); add(r1, eb); ids.eb = eb.id;
// Nav
const r2 = await row('Navigation · sticky, blurred surface on scroll');
const nav = F('Nav', { comp: true, dir: 'HORIZONTAL', pad: [0, 80], w: 1440, align: 'CENTER', just: 'SPACE_BETWEEN', fill: 'bg', fo: .86 }); nav.counterAxisSizingMode = 'FIXED'; nav.resize(1440, 76); nav.strokes = [P('line')]; side(nav, 'b');
nav.effects = [{ type: 'BACKGROUND_BLUR', radius: 16, visible: true }];
const br = F('Brand', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' }); add(br, tile('agent', 34, 'accent-text'), await T('AI Orbit', 'H3', 'fg', { name: 'Logo' }), await T('by Evoke', 'Label', 'fg-subtle', { name: 'By' }));
const ln = F('Links', { dir: 'HORIZONTAL', gap: 32, align: 'CENTER' });
for (const l of ['Services', 'How it works', 'Case studies', 'Industries', 'Insights']) add(ln, await T(l, 'Strong', 'fg-muted', { name: l }));
const ac = F('Actions', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
const ver = F('Version switch', { dir: 'HORIZONTAL', gap: 6, pad: [9, 12], r: 10, stroke: 'line-2', align: 'CENTER' }); add(ver, await T('Version 5', 'Strong', 'fg', { name: 'Version' }), icon('chev', 'fg-muted', 16));
const th = F('Theme toggle', { dir: 'HORIZONTAL', r: 10, stroke: 'line-2', align: 'CENTER', just: 'CENTER' }); th.primaryAxisSizingMode = 'FIXED'; th.counterAxisSizingMode = 'FIXED'; th.resize(40, 40); add(th, icon('sun', 'fg', 18));
const cta = bP.createInstance(); cta.findOne(n => n.name === 'Label').characters = 'Talk to us';
add(ac, ver, th, cta); add(nav, br, ln, ac); add(r2, nav); ids.nav = nav.id;
// Field + FAQ
const r3 = await row('Form field · FAQ accordion (closed / open)');
const fld = F('Field', { comp: true, dir: 'VERTICAL', gap: 8, w: 300 });
add(fld, fill(await T('Work email *', 'Strong', 'fg', { name: 'Label', w: 300 })));
const box = F('Input', { dir: 'HORIZONTAL', pad: [0, 16], r: 10, fill: 'surface', stroke: 'line-2', align: 'CENTER' }); add(fld, box); fill(box); box.counterAxisSizingMode = 'FIXED'; box.resize(300, 52);
add(box, await T('name@company.com', 'Small', 'fg-subtle', { name: 'Placeholder' })); add(r3, fld); ids.field = fld.id;
const mkFaq = async (open) => {
  const f = F('State=' + (open ? 'Open' : 'Closed'), { comp: true, dir: 'VERTICAL', gap: 12, pad: [24, 0], w: 620 }); f.strokes = [P('line')]; side(f, 'b');
  const q = F('Question row', { dir: 'HORIZONTAL', gap: 16, align: 'CENTER' }); add(f, q); fill(q);
  add(q, grow(await T('How fast can we get an agent into production?', 'H3', 'fg', { name: 'Question', w: 500 })), icon(open ? 'minus' : 'plus', 'accent-text', 22));
  if (open) add(f, fill(await T('Most teams ship a governed pilot in 6–8 weeks: two weeks of discovery and readiness, then iterative builds with evaluation gates before go-live.', 'Body', 'fg-muted', { name: 'Answer', w: 560 })));
  return f; };
const fq0 = await mkFaq(false), fq1 = await mkFaq(true); add(r3, fq0, fq1);
const fset = figma.combineAsVariants([fq0, fq1], r3); fset.name = 'FAQ item'; fset.layoutMode = 'VERTICAL'; fset.itemSpacing = 0; fset.primaryAxisSizingMode = 'AUTO'; fset.counterAxisSizingMode = 'AUTO'; fset.fills = []; ids.faq = fq0.id; ids.faqOpen = fq1.id;
// Cards (builders)
const r4 = await row('Cards · service, case study, industry, metric (built from the same tokens)');
const sc = await serviceCard({ icon: 'agent', n: '01', title: 'Enterprise Agent Solutions', tag: 'Build what thinks.', body: 'Production-ready, governance-ready agents for high-stakes problems.', bullets: ['Edge-case tested', 'Human-in-the-loop controls'], link: 'Explore AI Apps' });
add(r4, sc);
const cc = await caseCard({ industry: 'Tax technology', title: 'COBOL Conversion', body: 'Multi-agent modernization of complex COBOL tax engines into validated MSTX.', metric: 'Minutes', metricLabel: 'not months, with zero errors' });
add(r4, cc);
const ic = await industryCard({ icon: 'bank', title: 'Financial Services', body: 'Built for audit, scale, and scrutiny.', tags: ['Incident triage', 'Tax copilots'] });
add(r4, ic);
const mt = await metricTile({ label: 'Delivery time saved', value: '65%', g: '%', desc: 'Average, with agentic engineering.', bars: [14, 20, 26, 34, 42, 52, 64] });
add(r4, mt);
const r5 = await row('AI elements · agent console and neural lattice (decorative, kept out of the reading area)');
const con = await agentConsole(520); add(r5, con);
const lat = lattice('Neural lattice', 520, 420, 46, 11, .9); add(r5, lat); lat.cornerRadius = 20; lat.strokes = [P('line')];
const r6 = await row('Pipeline step · insight row');
const s1 = await stepItem({ n: '01', icon: 'search', title: 'Discover', body: 'Readiness, data and risk assessed in two weeks.', w: 260 }); add(r6, s1);
const ir = await insightRow({ type: 'Knowledge paper', title: 'Hyper Programming: A New SDLC Paradigm', body: 'Just-in-time software engineering through agentic AI.', meta: '8 min read' }); add(r6, ir);
ids.board = board.id; return ids;
