const page = figma.root.children.find(p => p.id === '249:3691'); await figma.setCurrentPageAsync(page);
const MOCKB = await figma.getNodeByIdAsync('1377:5588');
const coll = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:1468:1138');
const DARK = '1468:0', LIGHT = '1468:1';
const vars = (await figma.variables.getLocalVariablesAsync('COLOR')).filter(v => v.variableCollectionId === coll.id);
const V = n => { const v = vars.find(v => v.name === 'v5/' + n); if (!v) throw new Error('no var ' + n); return v; };
const P = (n, o) => { const p = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V(n)); return o == null ? p : { ...p, opacity: o }; };
const styles = (await figma.getLocalTextStylesAsync()).filter(s => s.name.startsWith('V5/'));
for (const s of styles) await figma.loadFontAsync(s.fontName);
const ST = n => { const s = styles.find(s => s.name === 'V5/' + n); if (!s) throw new Error('no style ' + n); return s; };
const hex = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const GD = ['#A485FF', '#6C82FF', '#3FDCF2'], GL = ['#6A3DF0', '#3D4FE6', '#0A7F9E'];
const grad = g => ({ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: g.map((c, i) => ({ position: i / 2, color: { ...hex(c), a: 1 } })) });
// Text: always auto-height; with w it wraps at that width (never clipped)
async function T(chars, style, color = 'fg', o = {}) {
  const t = figma.createText(); await t.setTextStyleIdAsync(ST(style).id); t.characters = chars; t.fills = [P(color)];
  t.name = o.name || chars.slice(0, 40);
  if (o.w) { t.resize(o.w, Math.max(t.height, 1)); t.textAutoResize = 'HEIGHT'; } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (o.g) { const i = chars.indexOf(o.g); if (i >= 0) t.setRangeFills(i, i + o.g.length, [grad(o.gc || GD)]); }
  if (o.align) t.textAlignHorizontal = o.align;
  return t;
}
function F(name, o = {}) {
  const f = o.comp ? figma.createComponent() : figma.createFrame(); f.name = name; f.fills = o.fill ? [P(o.fill, o.fo)] : [];
  if (o.dir) {
    f.layoutMode = o.dir; f.itemSpacing = o.gap ?? 0; const p = o.pad ?? 0; const [pt, pr, pb, pl] = Array.isArray(p) ? (p.length === 2 ? [p[0], p[1], p[0], p[1]] : p) : [p, p, p, p];
    f.paddingTop = pt; f.paddingRight = pr; f.paddingBottom = pb; f.paddingLeft = pl; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    if (o.align) f.counterAxisAlignItems = o.align; if (o.just) f.primaryAxisAlignItems = o.just;
    if (o.wrap) { f.layoutWrap = 'WRAP'; f.counterAxisSpacing = o.wrap; }
  }
  if (o.r != null) f.cornerRadius = o.r; if (o.stroke) { f.strokes = [P(o.stroke)]; f.strokeWeight = 1; f.strokeAlign = 'INSIDE'; }
  if (o.w) { if (o.dir === 'VERTICAL') f.counterAxisSizingMode = 'FIXED'; else if (o.dir === 'HORIZONTAL') f.primaryAxisSizingMode = 'FIXED'; f.resize(o.w, o.h || f.height || 10); if (o.h && o.dir) { if (o.dir === 'VERTICAL') f.primaryAxisSizingMode = 'FIXED'; else f.counterAxisSizingMode = 'FIXED'; f.resize(o.w, o.h); } }
  else if (o.h && !o.dir) f.resize(f.width, o.h);
  f.clipsContent = !!o.clip; return f;
}
const FILLQ = new Set(), GROWQ = new Set();
const add = (p, ...c) => { for (const x of c) { p.appendChild(x); if (FILLQ.has(x)) { x.layoutSizingHorizontal = 'FILL'; FILLQ.delete(x); } if (GROWQ.has(x)) { x.layoutGrow = 1; GROWQ.delete(x); } } return p; };
const fill = n => { if (n.parent && n.parent.layoutMode && n.parent.layoutMode !== 'NONE') n.layoutSizingHorizontal = 'FILL'; else FILLQ.add(n); return n; };
const grow = n => { if (n.parent && n.parent.layoutMode && n.parent.layoutMode !== 'NONE') n.layoutGrow = 1; else GROWQ.add(n); return n; };
const side = (f, k, v = 1) => { f.strokeTopWeight = k.includes('t') ? v : 0; f.strokeBottomWeight = k.includes('b') ? v : 0; f.strokeLeftWeight = k.includes('l') ? v : 0; f.strokeRightWeight = k.includes('r') ? v : 0; return f; };
const ICON = {
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  agent: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-30 12 12)"/><circle cx="20" cy="7" r="1.2"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>', shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5"/><circle cx="12" cy="12" r="2"/>', search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>', rocket: '<path d="M5 19c0-3 1-5 3-6M12 15l-3-3c1.5-5 5-8 11-9-1 6-4 9.5-9 11z"/><circle cx="15" cy="9" r="1.5"/>',
  factory: '<path d="M3 20V10l6 4V10l6 4V6h6v14z"/>', bank: '<path d="M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18"/>', bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 11h6M12 8v6"/>', cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  mountain: '<path d="M3 19l6-10 4 6 3-4 5 8z"/>', doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>', chev: '<path d="M6 9l6 6 6-6"/>'
};
function icon(k, color = 'fg', sz = 20, sw = 1.6) {
  const n = figma.createNodeFromSvg(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`);
  n.name = 'Icon / ' + k; n.fills = []; n.findAll(x => x.type === 'VECTOR' || x.type === 'ELLIPSE').forEach(v => { v.strokes = [P(color)]; v.fills = []; }); if (sz !== 24) n.rescale(sz / 24); return n;
}
function tile(k, sz = 44, color = 'accent-text', bg = 'chip') { const t = F('Icon tile', { dir: 'HORIZONTAL', r: 12, fill: bg, align: 'CENTER', just: 'CENTER' }); t.primaryAxisSizingMode = 'FIXED'; t.counterAxisSizingMode = 'FIXED'; t.resize(sz, sz); add(t, icon(k, color, Math.round(sz * .5))); return t; }
// AI lattice: nodes + edges, deterministic. Decorative, low opacity, never behind body copy.
function lattice(name, w, h, n = 42, seed = 7, op = .5) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const f = F(name, { w, h, clip: true }); f.resize(w, h);
  const pts = []; for (let i = 0; i < n; i++) pts.push([rnd() * w, rnd() * h, rnd()]);
  let d = ''; for (let i = 0; i < n; i++) { const near = pts.map((q, j) => [j, Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 2); for (const [j, dist] of near) if (dist < w * .28) d += `M${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}L${pts[j][0].toFixed(1)} ${pts[j][1].toFixed(1)}`; }
  const edges = figma.createVector(); edges.name = 'edges'; edges.vectorPaths = [{ windingRule: 'NONZERO', data: d.replace(/([ML])/g, ' $1 ').trim() }]; edges.strokes = [P('node', .35 * op)]; edges.strokeWeight = 1; edges.fills = []; f.appendChild(edges); edges.x = 0; edges.y = 0;
  for (const [x, y, r] of pts) { const e = figma.createEllipse(); const sz = 3 + r * 5; e.resize(sz, sz); e.x = x - sz / 2; e.y = y - sz / 2; e.fills = [P(r > .8 ? 'accent-2' : 'node', (0.45 + r * .55) * op)]; e.name = 'node'; f.appendChild(e); if (r > .88) { const g = figma.createEllipse(); g.resize(sz * 5, sz * 5); g.x = x - sz * 2.5; g.y = y - sz * 2.5; g.fills = [P('glow', op)]; g.effects = [{ type: 'LAYER_BLUR', radius: 12, visible: true }]; g.name = 'pulse'; f.insertChild(1, g); } }
  return f;
}
const C = id => figma.getNodeByIdAsync(id);
const inst = (comp, map = {}) => { const i = comp.createInstance(); for (const [k, v] of Object.entries(map)) { const t = i.findOne(n => n.type === 'TEXT' && n.name === k); if (t) t.characters = v; } return i; };
