// ---- V5 Home Dark, part 2: fixes + outcomes → footer ----
const bP = await C('1469:3014'), bS = await C('1469:3018'), bL = await C('1469:3022'), faqC = await C('1469:3068'), faqO = await C('1469:3073'), fieldC = await C('1469:3064');
const home = await C('1470:3011');
for (const n of home.children.slice(6)) n.remove();
const heroF = home.children.find(n => n.name.startsWith('01 Hero')); const latF = heroF.findOne(n => n.name === 'AI lattice (decorative)'); latF.x = 780; latF.opacity = .7;
const eqRows = (root) => { for (const r of root.findAll(n => n.type === 'FRAME' && n.name === 'Row' && n.layoutMode === 'HORIZONTAL')) { r.counterAxisAlignItems = 'MIN'; for (const c of r.children) c.layoutAlign = 'STRETCH'; } };
eqRows(home);
const sec = (name, o = {}) => { const s = F(name, { dir: 'VERTICAL', pad: [96, 80], gap: 48, fill: o.fill || 'bg', w: 1440, ...o }); add(home, s); fill(s); return s; };
const head = async (label, h2, g, body, w = 760) => { const h = F('Heading', { dir: 'VERTICAL', gap: 14, w }); add(h, await T(label, 'Label', 'accent-text'), fill(await T(h2, 'H2', 'fg', { g, w }))); if (body) add(h, fill(await T(body, 'Body', 'fg-muted', { w }))); return h; };
const headRow = async (label, h2, g, cta) => { const r = F('Header', { dir: 'HORIZONTAL', gap: 48, align: 'MAX', just: 'SPACE_BETWEEN' }); add(r, await head(label, h2, g, null, 760)); if (cta) add(r, inst(bS, { Label: cta })); return r; };
const grid = (parent, items, perRow) => { const rows = []; for (let i = 0; i < items.length; i += perRow) { const r = F('Row', { dir: 'HORIZONTAL', gap: 24 }); add(parent, r); fill(r); rows.push(r); } return rows; };
// 06 OUTCOMES
const oc = sec('06 Outcomes', { fill: 'bg-2' });
add(oc, await head('Key facts', 'Driving measurable outcomes.', 'measurable', 'Numbers from live client programmes, not lab benchmarks.', 720));
const ocR = F('Row', { dir: 'HORIZONTAL', gap: 24 }); add(oc, ocR); fill(ocR);
for (const d of [{ label: 'Delivery time saved', value: '65%', g: '%', desc: 'Average time saved with agentic engineering across delivery teams.', bars: [16, 22, 28, 36, 44, 54, 66] }, { label: 'Skill packs', value: '150+', g: '+', desc: 'Reusable, tested agent skills that standardise behaviour across projects.', bars: [12, 20, 30, 38, 46, 56, 64] }, { label: 'Agents in production', value: '10+', g: '+', desc: 'Specialized agents running in production today, governed end to end.', bars: [10, 14, 22, 30, 42, 50, 60] }]) { const m = await metricTile({ ...d, w: 410 }); add(ocR, m); grow(m); }
// 07 CASES
const cs = sec('07 Case studies');
const csH = await headRow('Case studies', 'Stories of transformation.', 'transformation.', 'All case studies'); add(cs, csH); fill(csH);
const CS = [{ industry: 'Pharmaceutical', title: 'Sencha Migration', body: 'AI-orchestrated ExtJS to React modernization for a regulated pharmaceutical enterprise.', metric: 'ExtJS → React', metricLabel: 'modernized under regulatory controls' },
  { industry: 'Tax technology & compliance', title: 'COBOL Conversion', body: 'Multi-agent modernization that transforms complex COBOL tax engines into validated MSTX with full compliance.', metric: 'Minutes', metricLabel: 'not months, with zero errors' },
  { industry: 'Manufacturing', title: 'Production Optimization Agent', body: 'An AI assistant that gives plant managers real-time analysis and visual insights on production data for better planning.', metric: 'Real-time', metricLabel: 'production insight for planners' },
  { industry: 'Legal & compliance', title: 'Incident Triage Agent', body: 'Deterministic, AI-orchestrated ITSM triage that classifies, labels and routes incidents in real time with full auditability.', metric: 'Zero', metricLabel: 'manual overhead in routing' }];
const csRows = grid(cs, CS, 2); for (let i = 0; i < CS.length; i++) { const c = await caseCard({ ...CS[i], w: 628 }); add(csRows[Math.floor(i / 2)], c); grow(c); }
// 08 INDUSTRIES
const id = sec('08 Industries', { fill: 'bg-2' });
add(id, await head('Industries', 'AI that speaks your industry.', 'your industry.', 'Industry-specific AI that understands your regulations, your workflows and your competitive pressures.', 720));
const ID = [['factory', 'Manufacturing & Industrial', 'From shop floor to boardroom — AI that runs on operational reality.', ['Production optimization', 'Predictive maintenance', 'Supply-chain risk']], ['bank', 'Financial Services (BFSI)', 'Built for audit, scale, and scrutiny.', ['Incident triage', 'Tax compliance copilots', 'Portfolio risk scoring']], ['bolt', 'Energy (Oil & Gas)', 'Decades of unstructured history, turned into operational decisions.', ['Field knowledge assistants', 'Demand forecasting']],
  ['health', 'Healthcare & Life Sciences', 'HIPAA-aware AI that earns clinician trust.', ['Clinical knowledge chatbots', 'Predictive reliability']], ['cap', 'Higher Education', 'A stress-free admissions journey.', ['Document verification', 'Admissions intelligence']], ['mountain', 'Mining & Natural Resources', 'Modernization without disruption.', ['Spend analytics', 'Legacy system assistants']]];
const idRows = grid(id, ID, 3); for (let i = 0; i < ID.length; i++) { const [ic, t, b, tags] = ID[i]; const c = await industryCard({ icon: ic, title: t, body: b, tags, w: 410 }); add(idRows[Math.floor(i / 3)], c); grow(c); }
// 09 INSIGHTS
const kn = sec('09 Knowledge hub', { gap: 32 });
const knH = await headRow('Knowledge hub', 'From brainstorming to execution — all in one place.', 'all in one place.', 'Browse all insights'); add(kn, knH); fill(knH);
const list = F('List', { dir: 'VERTICAL' }); add(kn, list); fill(list); list.strokes = [P('line')]; side(list, 't');
for (const [ty, t, b] of [['Knowledge paper', 'Hyper Programming: A New SDLC Paradigm', 'Just-in-time software engineering through agentic AI.'], ['Knowledge paper', 'Role Convergence in the AI SDLC (ADLC)', 'Efficient, governed convergence through a layered skill architecture.'], ['Article', 'See the System: Why AI Projects Fail When You Map the Symptom', 'Why every AI-native build must map the full system before a solution is designed.'], ['Article', 'Deconstruct: Stage 1 of First Principles Delivery', 'How six questions turned a $680,000 routing contract into an $8.3 million finding.'], ['Article', 'Build: How We Construct AI Systems That Work in Production', 'How five principles and two failed build gates cut underwriting time from 4.2 hours to 1.4.']]) { const r = await insightRow({ type: ty, title: t, body: b, meta: 'Read', w: 1280 }); add(list, r); fill(r); }
// 10 FAQ
const fq = sec('10 FAQ', { dir: 'HORIZONTAL', gap: 80, fill: 'bg-2' }); fq.counterAxisAlignItems = 'MIN';
const fqL = await head('FAQ', 'Questions, answered.', null, 'Straight answers on timelines, governance and ownership. Still curious? Talk to an AI expert.', 420); add(fq, fqL); add(fqL, inst(bL, { Label: 'Ask us anything' }));
const fqR = F('Items', { dir: 'VERTICAL' }); add(fq, fqR); grow(fqR); fqR.strokes = [P('line')]; side(fqR, 't');
const Q = [['How fast can we get an agent into production?', null], ['How do you keep AI governed and auditable?', 'Every agent ships with guardrails, evaluation reports and an audit trail. Human review gates sit wherever risk demands them.'], ['Will this work with our existing stack?', null], ['Who owns the code, prompts and models?', null]];
for (const [q, a] of Q) { const it = (a ? faqO : faqC).createInstance(); add(fqR, it); fill(it); it.findOne(n => n.name === 'Question').characters = q; if (a) it.findOne(n => n.name === 'Answer').characters = a; }
// 11 CTA
const ct = sec('11 CTA', { pad: [48, 80] });
const panel = F('Panel', { dir: 'HORIZONTAL', pad: 64, gap: 48, r: 28, fill: 'surface', stroke: 'line-2', align: 'CENTER', clip: true }); add(ct, panel); fill(panel);
const plat = lattice('AI lattice (decorative)', 560, 420, 40, 5, .6); add(panel, plat); plat.layoutPositioning = 'ABSOLUTE'; plat.x = 700; plat.y = -20;
const pl = F('Copy', { dir: 'VERTICAL', gap: 20 }); add(panel, pl); grow(pl);
add(pl, await T('Build · Modernize · Govern', 'Label', 'accent-text'), fill(await T('All in one orbit.', 'H1', 'fg', { g: 'orbit.', w: 640 })), fill(await T('Whether you’re building, modernizing or governing, AI Orbit brings structure, speed and safety to every stage of your AI journey.', 'Lead', 'fg-muted', { w: 640 })));
const pb = F('Actions', { dir: 'HORIZONTAL', gap: 12 }); add(pl, pb); add(pb, inst(bP, { Label: 'Launch your AI journey' }), inst(bS, { Label: 'Book a readiness call' }));
const pr = F('Spacer', { w: 420, h: 10 }); pr.resize(420, 10); add(panel, pr);
// 12 CONTACT
const co = sec('12 Contact', { dir: 'HORIZONTAL', gap: 80 }); co.counterAxisAlignItems = 'MIN';
const coL = await head('Get in touch', 'Let’s build what’s next.', null, 'Tell us what you’re solving. An AI specialist replies within one business day.', 480); add(co, coL);
const offs = F('Offices', { dir: 'HORIZONTAL', gap: 24, wrap: 20, w: 480 }); add(coL, offs);
for (const [c, t, p] of [['Dayton, USA', 'HQ', '+1-937-312-1204'], ['Dallas, USA', '', ''], ['London, UK', '', ''], ['Wroclaw, Poland', '', '+48 575 090 055'], ['Hyderabad, India', '', '+91-404-050-0900'], ['Bengaluru, India', '', ''], ['Sydney, Australia', '', '+61-489-902-554']]) { const o = F('Office · ' + c, { dir: 'VERTICAL', gap: 2, w: 228 }); add(offs, o); add(o, await T(c + (t ? '  ·  ' + t : ''), 'Strong', 'fg')); if (p) add(o, await T(p, 'Small', 'fg-muted')); }
const mail = F('Email', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' }); add(coL, mail); add(mail, icon('doc', 'accent-text', 18), await T('mktg@evoketechnologies.com', 'H3', 'fg'));
const form = F('Form card', { dir: 'VERTICAL', pad: 32, gap: 20, r: 20, fill: 'surface', stroke: 'line' }); add(co, form); grow(form);
const fr = (a, b) => { const r = F('Row', { dir: 'HORIZONTAL', gap: 20 }); add(form, r); fill(r); for (const [l, ph] of [a, b]) { const f = inst(fieldC, { Label: l, Placeholder: ph }); add(r, f); grow(f); } };
fr(['Full name *', 'Jane Doe'], ['Work email *', 'name@company.com']); fr(['Company', 'Company name'], ['Interested in', 'Enterprise Agent Solutions ▾']);
const ta = inst(fieldC, { Label: 'What are you solving?', Placeholder: 'A sentence or two about your goal…' }); add(form, ta); fill(ta); const tbox = ta.findOne(n => n.name === 'Input'); tbox.resize(tbox.width, 132); tbox.counterAxisAlignItems = 'MIN'; tbox.paddingTop = 14;
const fb = F('Submit row', { dir: 'HORIZONTAL', gap: 16, align: 'CENTER', just: 'SPACE_BETWEEN' }); add(form, fb); fill(fb);
add(fb, await T('Fields marked * are required.', 'Small', 'fg-subtle'), inst(bP, { Label: 'Send request' }));
// 13 FOOTER
const ft = sec('13 Footer', { pad: [64, 80, 40, 80], gap: 48, fill: 'bg-2' }); ft.strokes = [P('line')]; side(ft, 't');
const cols = F('Columns', { dir: 'HORIZONTAL', gap: 48 }); add(ft, cols); fill(cols);
const about = F('About', { dir: 'VERTICAL', gap: 14, w: 360 }); add(cols, about);
const brand = F('Brand', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' }); add(brand, tile('agent', 34), await T('AI Orbit', 'H3', 'fg')); add(about, brand, fill(await T('Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.', 'Small', 'fg-muted', { w: 360 })));
for (const [h, items] of [['Services', ['Enterprise Agent Solutions', 'AI-First Software Engineering', 'AI Governance', 'AI Advisory']], ['Industries', ['Manufacturing', 'Financial Services', 'Energy', 'Healthcare', 'Higher Education', 'Mining']], ['Insights', ['Case studies', 'Blog', 'Videos', 'News & events', 'Resource hub']]]) { const c = F('Col · ' + h, { dir: 'VERTICAL', gap: 12 }); add(cols, c); grow(c); add(c, await T(h, 'Label', 'fg-subtle')); for (const it of items) add(c, await T(it, 'Small', 'fg-muted')); }
const legal = F('Legal', { dir: 'HORIZONTAL', just: 'SPACE_BETWEEN', align: 'CENTER', pad: [24, 0, 0, 0] }); add(ft, legal); fill(legal); legal.strokes = [P('line')]; side(legal, 't');
add(legal, await T('Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.', 'Small', 'fg-subtle'), await T('Terms   ·   Privacy   ·   Cookies   ·   Disclaimer   ·   Sitemap', 'Small', 'fg-subtle'));
eqRows(home);
return { h: home.height };
