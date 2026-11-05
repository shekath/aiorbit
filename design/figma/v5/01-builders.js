// ---- V5 builders (token-bound, auto-layout, auto-height text) ----
async function bullets(list, color = 'fg-muted', w = 300) { const b = F('Bullets', { dir: 'VERTICAL', gap: 10, w }); for (const x of list) { const r = F('Item', { dir: 'HORIZONTAL', gap: 10, align: 'MIN', w }); add(b, r); fill(r); add(r, icon('check', 'success', 18)); add(r, grow(await T(x, 'Small', color, { w: 200 }))); r.children[1].layoutSizingHorizontal = 'FILL'; } return b; }
async function serviceCard(d) {
  const c = F('Service · ' + d.title, { dir: 'VERTICAL', pad: 32, gap: 18, r: 20, fill: 'surface', stroke: 'line', w: d.w || 400 });
  const top = F('Top', { dir: 'HORIZONTAL', just: 'SPACE_BETWEEN', align: 'CENTER' }); add(c, top); fill(top); add(top, tile(d.icon, 48), await T(d.n, 'Label', 'fg-subtle'));
  add(c, fill(await T(d.title, 'H3', 'fg', { w: 300 })), fill(await T(d.tag, 'Strong', 'accent-text', { w: 300 })), fill(await T(d.body, 'Body', 'fg-muted', { w: 300 })));
  const b = await bullets(d.bullets); add(c, b); fill(b);
  const l = F('Link', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' }); add(l, await T(d.link, 'Button', 'fg'), icon('arrow', 'fg', 18)); add(c, l); return c;
}
async function caseCard(d) {
  const c = F('Case · ' + d.title, { dir: 'VERTICAL', pad: 28, gap: 14, r: 20, fill: 'surface', stroke: 'line', w: d.w || 360 });
  const chip = F('Tag', { dir: 'HORIZONTAL', pad: [6, 10], r: 999, fill: 'chip' }); add(chip, await T(d.industry, 'Label', 'accent-text')); add(c, chip);
  add(c, fill(await T(d.title, 'H3', 'fg', { w: 300 })), fill(await T(d.body, 'Small', 'fg-muted', { w: 300 })));
  const m = F('Outcome', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER', pad: [14, 0, 0, 0] }); add(c, m); fill(m); m.strokes = [P('line')]; side(m, 't');
  add(m, await T(d.metric, 'H3', 'fg', { g: d.metric, gc: d.gc })); add(m, grow(await T(d.metricLabel, 'Small', 'fg-subtle', { w: 160 })));
  const l = F('Link', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' }); add(l, await T('Read case study', 'Button', 'fg'), icon('arrow', 'fg', 18)); add(c, l); return c;
}
async function industryCard(d) {
  const c = F('Industry · ' + d.title, { dir: 'VERTICAL', pad: 28, gap: 14, r: 20, fill: 'surface', stroke: 'line', w: d.w || 300 });
  add(c, tile(d.icon, 44), fill(await T(d.title, 'H3', 'fg', { w: 300 })), fill(await T(d.body, 'Small', 'fg-muted', { w: 300 })));
  const tg = F('Use cases', { dir: 'HORIZONTAL', gap: 8, wrap: 8 }); add(c, tg); fill(tg);
  for (const x of d.tags) { const t = F('Tag', { dir: 'HORIZONTAL', pad: [6, 10], r: 8, fill: 'surface-2' }); add(t, await T(x, 'Small', 'fg-muted')); t.children[0].fontSize = 13; add(tg, t); }
  return c;
}
async function insightRow(d) {
  const r = F('Insight · ' + d.title.slice(0, 30), { dir: 'HORIZONTAL', pad: [24, 0], gap: 32, align: 'CENTER', w: d.w || 1000 }); r.strokes = [P('line')]; side(r, 'b');
  const ty = F('Type', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER', w: 200 }); add(r, ty); add(ty, icon('doc', 'accent-text', 18), await T(d.type, 'Label', 'fg-muted'));
  const tx = F('Text', { dir: 'VERTICAL', gap: 6 }); add(r, tx); grow(tx); add(tx, fill(await T(d.title, 'H3', 'fg', { w: 600 })), fill(await T(d.body, 'Small', 'fg-muted', { w: 600 })));
  add(r, await T(d.meta, 'Label', 'fg-subtle'), icon('arrow', 'fg', 20)); return r;
}
async function stepItem(d) {
  const s = F('Step · ' + d.title, { dir: 'VERTICAL', gap: 14, w: d.w || 240 });
  const top = F('Top', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' }); add(s, top); fill(top);
  const n = F('Index', { dir: 'HORIZONTAL', r: 999, stroke: 'accent', align: 'CENTER', just: 'CENTER' }); n.primaryAxisSizingMode = 'FIXED'; n.counterAxisSizingMode = 'FIXED'; n.resize(40, 40); add(n, await T(d.n, 'Label', 'accent-text')); add(top, n);
  const ln = figma.createRectangle(); ln.name = 'connector'; ln.resize(100, 1); ln.fills = [P(d.last ? 'line' : 'line-2')]; add(top, ln); grow(ln);
  add(s, icon(d.icon, 'accent-2', 22), fill(await T(d.title, 'H3', 'fg', { w: 200 })), fill(await T(d.body, 'Small', 'fg-muted', { w: 200 }))); return s;
}
async function metricTile(d) {
  const m = F('Metric · ' + d.label, { dir: 'VERTICAL', pad: 28, gap: 10, r: 20, fill: 'surface', stroke: 'line', w: d.w || 300 });
  add(m, await T(d.label, 'Label', 'fg-muted'), await T(d.value, 'Stat', 'fg', { g: d.g, gc: d.gc }), fill(await T(d.desc, 'Small', 'fg-muted', { w: 300 })));
  const bars = F('Trend', { dir: 'HORIZONTAL', gap: 6, align: 'MAX', pad: [10, 0, 0, 0] }); add(m, bars);
  d.bars.forEach((h, k) => { const b = figma.createRectangle(); b.name = 'bar'; b.resize(18, h); b.cornerRadius = 3; b.fills = [P(k === d.bars.length - 1 ? 'accent-2' : 'accent', .35 + .65 * k / d.bars.length)]; add(bars, b); });
  return m;
}
async function agentConsole(w = 520) {
  const c = F('Agent console · AI element', { dir: 'VERTICAL', r: 20, fill: 'surface', stroke: 'line-2', w, clip: true });
  c.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: .35 }, offset: { x: 0, y: 30 }, radius: 60, spread: -10, visible: true, blendMode: 'NORMAL' }];
  const hd = F('Header', { dir: 'HORIZONTAL', pad: [14, 18], gap: 10, align: 'CENTER' }); add(c, hd); fill(hd); hd.strokes = [P('line')]; side(hd, 'b');
  add(hd, tile('agent', 28, 'accent-text')); add(hd, grow(await T('Orbit Agent · Modernization run', 'Strong', 'fg', { w: 200 })));
  const live = F('Badge', { dir: 'HORIZONTAL', gap: 6, pad: [4, 10], r: 999, fill: 'surface-2', align: 'CENTER' }); const dot = figma.createEllipse(); dot.resize(7, 7); dot.fills = [P('success')]; add(live, dot, await T('Live', 'Label', 'success')); add(hd, live);
  const bd = F('Body', { dir: 'VERTICAL', pad: 18, gap: 14 }); add(c, bd); fill(bd);
  const u = F('Prompt', { dir: 'HORIZONTAL', pad: [12, 14], r: 12, fill: 'surface-2', gap: 10, align: 'MIN' }); add(bd, u); fill(u);
  add(u, icon('spark', 'accent-text', 18), grow(await T('Modernize our COBOL tax engine and keep it audit-ready.', 'Small', 'fg', { w: 300 })));
  const steps = [['Parsed 4,812 business rules', '0.8s', 'check', 'success'], ['Generated validated MSTX modules', '2m 14s', 'check', 'success'], ['Ran 1,206 regression tests · 0 failures', '41s', 'check', 'success'], ['Policy check · SOX controls, audit trail', 'running', 'spark', 'accent-text']];
  const sl = F('Steps', { dir: 'VERTICAL', gap: 10 }); add(bd, sl); fill(sl);
  for (const [t, tm, ic, col] of steps) { const r = F('Step', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' }); add(sl, r); fill(r); add(r, icon(ic, col, 18), grow(await T(t, 'Small', 'fg', { w: 260 })), await T(tm, 'Code', tm === 'running' ? 'accent-text' : 'fg-subtle')); }
  const pr = F('Progress', { dir: 'VERTICAL', gap: 8 }); add(bd, pr); fill(pr);
  const pl = F('Row', { dir: 'HORIZONTAL', just: 'SPACE_BETWEEN' }); add(pr, pl); fill(pl); add(pl, await T('Run progress', 'Label', 'fg-subtle'), await T('78%', 'Label', 'fg'));
  const tr = F('Track', { h: 6, r: 3, fill: 'surface-2', w: 300 }); add(pr, tr); fill(tr); tr.resize(tr.width, 6); const bar = figma.createRectangle(); bar.resize(Math.round((w - 36) * .78), 6); bar.cornerRadius = 3; bar.fills = [grad(GD)]; bar.name = 'value'; tr.appendChild(bar);
  const tg = F('Guardrails', { dir: 'HORIZONTAL', gap: 8, wrap: 8 }); add(bd, tg); fill(tg);
  for (const x of ['Governed', 'Human-in-the-loop', 'Audit trail', 'PII redacted']) { const t = F('Tag', { dir: 'HORIZONTAL', gap: 6, pad: [5, 10], r: 999, stroke: 'line-2', align: 'CENTER' }); add(t, icon('shield', 'accent-2', 14), await T(x, 'Small', 'fg-muted')); t.children[1].fontSize = 13; add(tg, t); }
  const inp = F('Ask', { dir: 'HORIZONTAL', pad: [8, 8, 8, 16], r: 12, stroke: 'line-2', gap: 10, align: 'CENTER' }); add(bd, inp); fill(inp);
  add(inp, grow(await T('Ask the orbit about your stack…', 'Small', 'fg-subtle', { w: 200 })));
  const sb = F('Send', { dir: 'HORIZONTAL', r: 8, fill: 'btn-bg', align: 'CENTER', just: 'CENTER' }); sb.primaryAxisSizingMode = 'FIXED'; sb.counterAxisSizingMode = 'FIXED'; sb.resize(34, 34); add(sb, icon('arrow', 'btn-fg', 16)); add(inp, sb);
  return c;
}
async function office(c, t, p) { const o = F('Office · ' + c, { dir: 'VERTICAL', gap: 2 }); add(o, await T(c, 'Strong', 'fg'), await T(t, 'Code', 'fg-subtle')); if (p) add(o, await T(p, 'Small', 'fg-muted')); return o; }
