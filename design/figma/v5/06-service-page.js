// ---- V5 Service page: Enterprise Agent Solutions (Dark 1440) ----
const bP = await C('1469:3014'), bS = await C('1469:3018'), ebC = await C('1469:3027'), navC = await C('1469:3033');
const home = await C('1470:3011');
for (const o of MOCKB.findAll(n => n.name.startsWith('V5 · Service'))) o.remove();
const pg = F('V5 · Service — Enterprise Agent Solutions — Dark (1440)', { dir: 'VERTICAL', fill: 'bg', w: 1440 });
MOCKB.appendChild(pg); pg.x = 11200; pg.y = 260; pg.setExplicitVariableModeForCollection(coll, DARK);
const sec = (name, o = {}) => { const s = F(name, { dir: 'VERTICAL', pad: [96, 80], gap: 48, fill: o.fill || 'bg', w: 1440, ...o }); add(pg, s); fill(s); return s; };
const head = async (label, h2, g, body, w = 760) => { const h = F('Heading', { dir: 'VERTICAL', gap: 14, w }); add(h, await T(label, 'Label', 'accent-text'), fill(await T(h2, 'H2', 'fg', { g, w }))); if (body) add(h, fill(await T(body, 'Body', 'fg-muted', { w }))); return h; };
add(pg, inst(navC));
// hero
const hero = F('01 Service hero', { dir: 'HORIZONTAL', pad: [56, 80, 80, 80], gap: 64, fill: 'bg', w: 1440, align: 'MIN', clip: true }); add(pg, hero); fill(hero);
const lat = lattice('AI lattice (decorative)', 620, 560, 40, 41, .45); hero.insertChild(0, lat); lat.layoutPositioning = 'ABSOLUTE'; lat.x = 820; lat.y = 0;
const L = F('Copy', { dir: 'VERTICAL', gap: 22 }); add(hero, L); grow(L);
const crumb = F('Breadcrumb', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' }); add(L, crumb); add(crumb, await T('Home', 'Small', 'fg-subtle'), await T('/', 'Small', 'fg-subtle'), await T('Services', 'Small', 'fg-subtle'), await T('/', 'Small', 'fg-subtle'), await T('Enterprise Agent Solutions', 'Small', 'fg'));
add(L, inst(ebC, { Label: 'Service 01 · Build' }));
add(L, fill(await T('Enterprise Agent Solutions', 'H1', 'fg', { name: 'H1', g: 'Agent Solutions', w: 680 })));
add(L, fill(await T('Build what thinks. Intelligent applications that don’t just automate — they reason, cite their sources and know when to ask a human.', 'Lead', 'fg', { w: 680 })));
add(L, fill(await T('Production-ready, scalable, edge-case-tested and governance-ready agents for high-stakes problems — from claims triage to plant-floor copilots.', 'Body', 'fg-muted', { w: 680 })));
const ac = F('Actions', { dir: 'HORIZONTAL', gap: 12, pad: [6, 0, 0, 0] }); add(L, ac); add(ac, inst(bP, { Label: 'Scope an agent with us' }), inst(bS, { Label: 'See agent case studies' }));
const card = F('At a glance', { dir: 'VERTICAL', pad: 28, gap: 18, r: 20, fill: 'surface', stroke: 'line-2', w: 460 }); add(hero, card);
add(card, await T('At a glance', 'Label', 'fg-subtle'));
for (const [k, v] of [['Typical pilot', '6–8 weeks to a governed pilot'], ['Team', 'Agent architect, AI engineers, domain SME, governance lead'], ['Platforms', 'Azure OpenAI, AWS Bedrock, Salesforce, ServiceNow, UiPath'], ['Controls', 'Evaluation gates, guardrails, audit trail, human review']]) {
  const r = F('Fact · ' + k, { dir: 'VERTICAL', gap: 4, pad: [0, 0, 16, 0] }); add(card, r); fill(r); r.strokes = [P('line')]; side(r, 'b');
  add(r, await T(k, 'Strong', 'accent-text'), fill(await T(v, 'Small', 'fg', { w: 400 }))); }
add(card, inst(bP, { Label: 'Download the service brief' })); card.children[card.children.length - 1].layoutSizingHorizontal = 'FILL';
// what we build
const wb = sec('02 What we build', { fill: 'bg-2' });
add(wb, await head('What we build', 'Agents for the work that matters most.', 'matters most.', 'Each agent is designed around a business outcome, tested on your edge cases, and shipped with the controls your risk team expects.', 760));
const caps = [['agent', 'Workflow agents', 'Multi-step agents that plan, call tools and complete processes end to end — with checkpoints where humans approve.', ['Claims & case triage', 'Order-to-cash', 'IT service desk']], ['search', 'Knowledge assistants', 'Grounded assistants that answer from your documents and systems, with citations and permission-aware retrieval.', ['Policy & SOP Q&A', 'Field knowledge', 'Clinical references']], ['spark', 'Decision copilots', 'Copilots that analyse data, explain options and draft the next action for analysts and managers.', ['Production planning', 'Risk scoring', 'Spend analytics']]];
const row = F('Row', { dir: 'HORIZONTAL', gap: 24 }); add(wb, row); fill(row);
for (const [ic, t, b, tags] of caps) { const c = F('Capability · ' + t, { dir: 'VERTICAL', pad: 28, gap: 14, r: 20, fill: 'surface', stroke: 'line', w: 410 }); add(row, c); grow(c);
  add(c, tile(ic, 44), fill(await T(t, 'H3', 'fg', { w: 340 })), fill(await T(b, 'Small', 'fg-muted', { w: 340 }))); const tg = F('Examples', { dir: 'VERTICAL', gap: 8 }); add(c, tg); fill(tg);
  for (const x of tags) { const r = F('Item', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' }); add(tg, r); fill(r); add(r, icon('check', 'success', 16), await T(x, 'Small', 'fg')); } }
const mh = Math.max(...row.children.map(c => c.height)); row.counterAxisSizingMode = 'FIXED'; row.resize(row.width, mh); for (const c of row.children) c.layoutAlign = 'STRETCH';
// architecture strip (AI element)
const ar = sec('03 Reference architecture', { gap: 32 });
add(ar, await head('How an agent is put together', 'Governed by design, not bolted on.', 'by design', null, 760));
const flow = F('Flow', { dir: 'HORIZONTAL', gap: 0, align: 'CENTER' }); add(ar, flow); fill(flow);
const nodes = [['doc', 'Your data', 'Documents, apps, APIs'], ['layers', 'Retrieval', 'Permission-aware context'], ['agent', 'Agent core', 'Plans, reasons, calls tools'], ['shield', 'Guardrails', 'Policy, PII, evaluation'], ['check', 'Human review', 'Approve or correct'], ['rocket', 'Action', 'Systems of record']];
for (let k = 0; k < nodes.length; k++) { const [ic, t, d] = nodes[k];
  const n = F('Node · ' + t, { dir: 'VERTICAL', gap: 10, pad: 20, r: 16, fill: k === 2 ? 'chip' : 'surface', stroke: k === 2 ? 'accent' : 'line', w: 180, align: 'MIN' }); add(flow, n); grow(n);
  add(n, icon(ic, k === 2 ? 'accent-text' : 'accent-2', 22), fill(await T(t, 'Strong', 'fg', { w: 140 })), fill(await T(d, 'Small', 'fg-muted', { w: 140 })));
  if (k < nodes.length - 1) { const a = F('Edge', { dir: 'HORIZONTAL', w: 28, h: 20, align: 'CENTER', just: 'CENTER' }); add(flow, a); add(a, icon('arrow', 'fg-subtle', 16)); } }
const fmh = Math.max(...flow.children.map(c => c.height)); flow.counterAxisSizingMode = 'FIXED'; flow.resize(flow.width, fmh); for (const c of flow.children) if (c.name.startsWith('Node')) c.layoutAlign = 'STRETCH';
// reuse sections from the home page
const take = async (prefix, rename) => { const s = home.children.find(n => n.name.startsWith(prefix)); const c = s.clone(); add(pg, c); fill(c); if (rename) c.name = rename; return c; };
const hw = await take('05 How it works', '04 How we deliver');
const oc = await take('06 Outcomes', '05 Outcomes');
const cs = await take('07 Case studies', '06 Related case studies'); const rows = cs.findAll(n => n.name === 'Row'); if (rows[1]) rows[1].remove();
await take('10 FAQ', '07 FAQ'); await take('11 CTA', '08 CTA'); await take('13 Footer', '09 Footer');
const bad = []; for (const t of pg.findAll(n => n.type === 'TEXT')) { if (t.textAutoResize === 'NONE') bad.push(t.characters.slice(0, 30)); }
return { page: pg.id, h: pg.height, bad };
