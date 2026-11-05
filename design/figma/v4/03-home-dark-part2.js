// ---- Home Dark, part 2: services → footer ----
const C = id => figma.getNodeByIdAsync(id);
const labC = await C('1425:2484'), scardC = await C('1425:2497'), indC = await C('1425:2518'), knC = await C('1425:2526'), solidC = await C('1425:2470');
const home = await C('1426:2470');
// fix: case-study heading size
const wkH = home.findOne(n => n.name === 'H2' && n.parent.name === 'Intro'); wkH.fontSize = 60; wkH.parent.resize(460, wkH.parent.height);
for (const n of home.children.slice(6)) n.remove();
const sec = (name, o = {}) => { const s = F(name, o); add(home, s); fill(s); if (o.inv) s.setExplicitVariableModeForCollection(coll, LIGHT); return s; };
const lbl = (t) => { const i = labC.createInstance(); i.findOne(n => n.name === 'Label').characters = t; return i; };
const btn = (t) => { const i = solidC.createInstance(); i.findOne(n => n.name === 'Label').characters = t; return i; };
const sp = (h) => { const s = figma.createFrame(); s.name = 'spacer'; s.fills = []; s.resize(10, h); return s; };
const out = {};

// 7 SERVICES — words state + cards state
const svcWords = async (name, cardsOn) => {
  const s = F(name, { w: 1440, h: 900, fill: 'bg', clip: true }); s.resize(1440, 900); add(home, s);
  const core = rect('IMG · WebGL AI core (scroll-driven)', 1440, 900, 'bg'); s.appendChild(core);
  const top = await T('Our services · Enterprise AI with structure, speed, and security', 'Label', 'fg-muted'); s.appendChild(top); top.x = (1440 - top.width) / 2; top.y = 96;
  const w = await T('Agents\nEngineering\nGovernance\nAdvisory', 'Words', 'fg', { name: 'Words (per-letter scatter)', g: 'Governance' }); w.textAlignHorizontal = 'CENTER'; s.appendChild(w); w.x = (1440 - w.width) / 2; w.y = (900 - w.height) / 2 + 10;
  if (cardsOn) {
    w.opacity = .1;
    const data = [['01 · Enterprise Agent Solutions', 'Build What Thinks', 'Intelligent applications that don’t just automate. They reason.', 'Production-ready, scalable, edge-case-tested and governance-ready agents for high-stakes problems.', 'Explore AI Apps →'],
      ['02 · AI-First Software Engineering', 'Intelligence in Every Sprint', 'Code at the speed of thought.', 'Specialist AI agents across your SDLC. Your engineers own the architecture, compliance, and every release.', 'Explore SDLC AI →'],
      ['03 · AI Governance', 'Move Fast. Sleep Well', 'The seatbelt that lets you go faster.', 'Frameworks for guardrails, quality assurance, ethics, and regulatory audit readiness.', 'Explore AI Governance →'],
      ['04 · AI Advisory', 'Know Before You Build', 'Every successful AI project begins with the right questions.', 'Strategy, readiness, prioritized use cases, and the foundation for what comes next.', 'Explore AI Advisory →']];
    const pos = [[64, 380, -3], [392, 240, 0], [728, 240, 0], [1056, 380, 3]];
    data.forEach(([n, t, g, b, l], k) => { const c = scardC.createInstance(); c.name = 'Service card · ' + t; s.appendChild(c);
      c.findOne(x => x.name === 'Number').characters = n; c.findOne(x => x.name === 'Title').characters = t; c.findOne(x => x.name === 'Tag').characters = g; c.findOne(x => x.name === 'Body').characters = b; c.findOne(x => x.name === 'Link').characters = l;
      c.x = pos[k][0]; c.y = pos[k][1]; c.rotation = pos[k][2]; });
  }
  const f1 = lbl('Different disciplines. One orbit.'); s.appendChild(f1); f1.x = 64; f1.y = 852;
  const f2 = await T(cardsOn ? 'Cards orbit in on scroll · 02 / 02' : 'Scroll to explore', 'Label', 'fg-muted'); s.appendChild(f2); f2.x = 1376 - f2.width; f2.y = 852;
  return core.id;
};
out.coreA = await svcWords('07a Services · AI core + word scatter', false);
out.coreB = await svcWords('07b Services · cards orbit in (scroll state)', true);

// 8 INDUSTRIES (inverted)
const ind = sec('08 Industries · hover image peek', { dir: 'VERTICAL', pad: [140, 64], fill: 'bg', w: 1440, inv: true });
add(ind, lbl('Industries'), sp(18), await T('AI that speaks your industry.', 'Big', 'fg', { name: 'H2', g: 'your industry.', gc: GL, w: 1100 }), sp(22));
add(ind, await T('Industry-specific AI that understands your regulations, your workflows, and your competitive pressures – that’s where Evoke operates.', 'Lead', 'fg-muted', { w: 760 }), sp(56));
const inds = [['Manufacturing & Industrial', 'From shop floor to boardroom – AI that runs on operational reality.', 'Production optimization · Predictive maintenance · Supply chain risk agents'],
  ['Financial Services (BFSI)', 'Built for audit, scale, and scrutiny.', 'Incident triage agents · Tax compliance copilots · Portfolio risk scoring'],
  ['Energy (Oil & Gas)', 'Decades of unstructured history, turned into operational decisions.', 'Field knowledge assistants · Demand forecasting · Storage intelligence'],
  ['Healthcare & Life Sciences', 'HIPAA-aware AI that earns clinician trust.', 'Clinical knowledge chatbots · Predictive reliability · Medical infrastructure AI'],
  ['Higher Education', 'Stress-free admissions journey.', 'Document verification · Enrollment-scale deduplication · Admissions intelligence'],
  ['Mining & Natural Resources', 'Modernization without disruption.', 'Enterprise spend analytics · Legacy system assistants · Operations AI']];
const rows = F('Rows', { dir: 'VERTICAL' }); add(ind, rows); fill(rows);
rows.strokes = [P('line-2')]; rows.strokeTopWeight = 1; rows.strokeBottomWeight = 0; rows.strokeLeftWeight = 0; rows.strokeRightWeight = 0;
inds.forEach(([t, d, e], k) => { const r = indC.createInstance(); r.name = 'Industry · ' + t; add(rows, r); fill(r); r.findOne(x => x.name === 'Number').characters = '0' + (k + 1); r.findOne(x => x.name === 'Title').characters = t; r.findOne(x => x.name === 'Body').characters = d; r.findOne(x => x.name === 'Tags').characters = e; if (k === 1) r.opacity = 1; });
const peek = rect('IMG · Peek (hover row 02 · BFSI)', 300, 210, 'surface-2', 16); add(ind, peek); peek.layoutPositioning = 'ABSOLUTE'; peek.x = 1010; peek.y = 560; peek.rotation = -4;
peek.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: .25 }, offset: { x: 0, y: 24 }, radius: 48, spread: 0, visible: true, blendMode: 'NORMAL' }];
out.peek = peek.id;

// 9 KNOWLEDGE
const kn = sec('09 Knowledge hub', { dir: 'VERTICAL', pad: [140, 64], fill: 'bg', w: 1440 });
add(kn, lbl('Knowledge hub'), sp(18), await T('From brainstorming to execution – all in one place.', 'Big', 'fg', { name: 'H2', g: 'all in one place.', w: 1200 }), sp(56));
const kns = [['Knowledge paper', 'Hyper Programing: A New SDLC Paradigm', 'Just-In-Time Software Engineering Through Agentic AI'],
  ['Knowledge paper', 'Role Convergence in the AI SDLC (ADLC)', 'Ensuring efficient, governed convergence through a layered skill architecture.'],
  ['Article', 'SEE THE SYSTEM: Why AI Projects Fail When You Map the Symptom Instead of the System', 'Why every AI-native build must map the full system before a solution is designed.'],
  ['Article', 'DECONSTRUCT: Stage 1 of First Principles Delivery', 'How six questions turned a $680,000 routing contract into a $8.3 million finding.'],
  ['Article', 'Build: How We Construct AI Systems That Work in Production', 'How five principles and two failed build gates cut underwriting time from 4.2 hours to 1.4.']];
const krows = F('Rows', { dir: 'VERTICAL' }); add(kn, krows); fill(krows);
krows.strokes = [P('line-2')]; krows.strokeTopWeight = 1; krows.strokeBottomWeight = 0; krows.strokeLeftWeight = 0; krows.strokeRightWeight = 0;
for (const [ty, t, d] of kns) { const r = knC.createInstance(); r.name = 'Insight · ' + t.slice(0, 30); add(krows, r); fill(r); r.findOne(x => x.name === 'Type').characters = ty; r.findOne(x => x.name === 'Title').characters = t; r.findOne(x => x.name === 'Body').characters = d; }

// 10 CTA
const cta = F('10 CTA · calm shards', { w: 1440, h: 804, fill: 'bg', clip: true }); cta.resize(1440, 804); add(home, cta);
const ctaImg = rect('IMG · WebGL shards (calm)', 1440, 804, 'bg'); cta.appendChild(ctaImg); out.cta = ctaImg.id;
const cs = rect('Scrim', 1000, 520, 'bg'); cs.opacity = .7; cs.cornerRadius = 400; cs.effects = [{ type: 'LAYER_BLUR', radius: 90, visible: true }]; cta.appendChild(cs); cs.x = 220; cs.y = 142;
const cin = F('Content', { dir: 'VERTICAL', gap: 28, align: 'CENTER', w: 1000 }); cta.appendChild(cin);
add(cin, lbl('Build · Modernize · Govern'));
const ch = await T('All in one orbit.', 'Mega', 'fg', { name: 'H2', g: 'orbit.' }); ch.fontSize = 150; ch.textAlignHorizontal = 'CENTER'; add(cin, ch);
const cl = await T('Whether you’re building, modernizing, or governing. AI Orbit brings structure, speed, and safety to every stage of your AI journey.', 'Lead', 'fg-hero', { w: 640 }); cl.textAlignHorizontal = 'CENTER'; add(cin, cl);
add(cin, btn('Launch your AI journey')); cin.x = 220; cin.y = (804 - cin.height) / 2;

// 11 CONTACT (inverted)
const ct = sec('11 Contact · inverted band', { dir: 'HORIZONTAL', pad: [140, 64], gap: 96, fill: 'bg', w: 1440, inv: true });
const left = F('Left', { dir: 'VERTICAL', gap: 0, w: 560 }); add(ct, left);
add(left, lbl('Get in touch'), sp(18), fill(await T('Let’s build what’s next.', 'Big', 'fg', { name: 'H2', w: 560 })), sp(40));
const offs = F('Offices', { dir: 'HORIZONTAL', gap: 16 }); add(left, offs); fill(offs); offs.layoutWrap = 'WRAP'; offs.counterAxisSpacing = 20;
for (const [c, t, p] of [['Dayton, USA', '09:41 AM', '+1-937-312-1204'], ['Dallas, USA', '08:41 AM', ''], ['London, UK', '02:41 PM', ''], ['Wroclaw, Poland', '03:41 PM', '+48 575 090 055'], ['Hyderabad, India', '08:11 PM', '+91-404-050-0900'], ['Bengaluru, India', '08:11 PM', ''], ['Sydney, Australia', '01:41 AM', '+61-489-902-554']]) {
  const o = F('Office · ' + c, { dir: 'VERTICAL', gap: 4, w: 272 }); add(offs, o);
  add(o, await T(c, 'Button', 'fg'), await T(t, 'Label', 'fg-muted')); if (p) add(o, await T(p, 'Small', 'fg-muted'));
}
add(left, sp(28), lbl('For queries'), sp(8), await T('mktg@evoketechnologies.com', 'H3', 'fg', { name: 'Mail' }));
const form = F('Form', { dir: 'HORIZONTAL', gap: 24, w: 656 }); add(ct, form); form.layoutWrap = 'WRAP'; form.counterAxisSpacing = 24;
const field = async (lab, w, h = 56, ph = '') => { const f = F('Field · ' + lab, { dir: 'VERTICAL', gap: 10, w }); add(form, f);
  const l = await T(lab, 'Small', 'fg'); add(f, l); const star = lab.indexOf('*'); if (star >= 0) l.setRangeFills(star, star + 1, [P('accent-text')]);
  const box = F('Input', { dir: 'HORIZONTAL', pad: [0, 18], r: 12, fill: 'surface', stroke: 'line-2', align: h > 56 ? 'MIN' : 'CENTER', w, h }); box.counterAxisSizingMode = 'FIXED'; box.resize(w, h); if (h > 56) box.paddingTop = 16;
  add(f, box); if (ph) add(box, await T(ph, 'Small', 'fg-subtle')); return f; };
await field('Full name *', 316); await field('Work email *', 316); await field('Company', 316); await field('Interested in', 316, 56, 'Enterprise Agent Solutions  ▾');
await field('What are you solving?', 656, 160);
add(form, await T('Fields marked * are required.', 'Small', 'fg-muted', { w: 656 })); add(form, btn('Send request'));

// 12 FOOTER
const ft = sec('12 Footer · wordmark spotlight', { dir: 'VERTICAL', pad: [96, 64, 40, 64], gap: 56, fill: 'bg', w: 1440 });
const cols = F('Columns', { dir: 'HORIZONTAL', gap: 48 }); add(ft, cols); fill(cols);
const about = F('About', { dir: 'VERTICAL', gap: 16, w: 340 }); add(cols, about);
add(about, await T('AI Orbit', 'H3', 'fg'), fill(await T('Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.', 'Small', 'fg-muted', { w: 340 })));
const colData = [['Services', ['Enterprise Agent Solutions', 'AI-First Software Engineering', 'AI Governance', 'AI Advisory']], ['Industries', ['Manufacturing & Industrial', 'Financial Services (BFSI)', 'Energy (Oil & Gas)', 'Healthcare & Life Sciences', 'Higher Education', 'Mining & Natural Resources']], ['Partners', ['Microsoft', 'AWS', 'Salesforce', 'ServiceNow', 'Oracle', 'UiPath']], ['Insights', ['Case studies', 'Blog', 'Videos', 'News & events', 'Press releases', 'Resource hub']]];
for (const [h, items] of colData) { const c = F('Col · ' + h, { dir: 'VERTICAL', gap: 12 }); add(cols, c); c.layoutGrow = 1; add(c, await T(h, 'Label', 'fg-muted')); for (const it of items) add(c, await T(it, 'Small', 'fg')); }
const wm = await T('AI Orbit', 'Mega', 'fg', { name: 'Wordmark (pointer spotlight reveals gradient)' }); wm.fontSize = 330; wm.fills = [grad(GD)]; wm.opacity = .22; add(ft, wm);
const legal = F('Legal', { dir: 'HORIZONTAL', just: 'SPACE_BETWEEN', align: 'CENTER' }); add(ft, legal); fill(legal);
legal.strokes = [P('line')]; legal.strokeTopWeight = 1; legal.strokeBottomWeight = 0; legal.strokeLeftWeight = 0; legal.strokeRightWeight = 0; legal.paddingTop = 24;
add(legal, await T('Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.', 'Small', 'fg-muted'), await T('Terms of Use    Privacy Policy    Cookies Policy    Disclaimer    Sitemap    Modern Slavery Statement', 'Small', 'fg-muted'));
out.h = home.height; return out;
