const page = figma.root.children.find(p => p.id === '249:3691'); await figma.setCurrentPageAsync(page);
const MOCKB = await figma.getNodeByIdAsync('1377:5588');
const coll = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:1421:1138');
const DARK = '1421:0', LIGHT = '1421:1';
const vars = (await figma.variables.getLocalVariablesAsync('COLOR')).filter(v => v.variableCollectionId === coll.id);
const V = n => { const v = vars.find(v => v.name === 'v4/' + n); if (!v) throw new Error('no var ' + n); return v; };
const P = n => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V(n));
const styles = (await figma.getLocalTextStylesAsync()).filter(s => s.name.startsWith('V4/'));
for (const s of styles) await figma.loadFontAsync(s.fontName);
const ST = n => { const s = styles.find(s => s.name === 'V4/' + n); if (!s) throw new Error('no style ' + n); return s; };
const hex = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const GD = ['#9B7BFF', '#6C82FF', '#3FDCF2'], GL = ['#6A3DF0', '#3D4FE6', '#0A7F9E'];
const grad = g => ({ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: g.map((c, i) => ({ position: i / 2, color: { ...hex(c), a: 1 } })) });
async function T(chars, style, color = 'fg', o = {}) {
  const t = figma.createText(); await t.setTextStyleIdAsync(ST(style).id); t.characters = chars; t.fills = [P(color)];
  if (o.name) t.name = o.name; else t.name = chars.slice(0, 40);
  if (o.w) { t.resize(o.w, Math.max(t.height, 1)); t.textAutoResize = 'HEIGHT'; }
  if (o.g) { const i = chars.indexOf(o.g); if (i >= 0) t.setRangeFills(i, i + o.g.length, [grad(o.gc || GD)]); }
  if (o.size) t.fontSize = o.size;
  return t;
}
function F(name, o = {}) {
  const f = o.comp ? figma.createComponent() : figma.createFrame(); f.name = name; f.fills = o.fill ? [P(o.fill)] : [];
  if (o.dir) {
    f.layoutMode = o.dir; f.itemSpacing = o.gap ?? 0; const p = o.pad ?? 0; const [pt, pr, pb, pl] = Array.isArray(p) ? (p.length === 2 ? [p[0], p[1], p[0], p[1]] : p) : [p, p, p, p];
    f.paddingTop = pt; f.paddingRight = pr; f.paddingBottom = pb; f.paddingLeft = pl; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    if (o.align) f.counterAxisAlignItems = o.align; if (o.just) f.primaryAxisAlignItems = o.just;
  }
  if (o.r != null) f.cornerRadius = o.r; if (o.stroke) { f.strokes = [P(o.stroke)]; f.strokeWeight = 1; }
  if (o.w) { if (o.dir === 'VERTICAL') f.counterAxisSizingMode = 'FIXED'; else if (o.dir === 'HORIZONTAL') f.primaryAxisSizingMode = 'FIXED'; f.resize(o.w, o.h || f.height || 10); }
  else if (o.h && !o.dir) f.resize(f.width, o.h);
  f.clipsContent = !!o.clip; return f;
}
const FILLQ = new Set();
const add = (p, ...c) => { for (const x of c) { p.appendChild(x); if (FILLQ.has(x)) { x.layoutSizingHorizontal = 'FILL'; FILLQ.delete(x); } } return p; };
const fill = n => { if (n.parent && n.parent.layoutMode && n.parent.layoutMode !== 'NONE') n.layoutSizingHorizontal = 'FILL'; else FILLQ.add(n); return n; };
function arrow(color = 'fg', sz = 16) {
  const n = figma.createNodeFromSvg('<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12m-4-4 4 4-4 4" stroke="#000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  n.name = 'Icon / Arrow'; n.fills = []; n.findAll(x => x.type === 'VECTOR').forEach(v => v.strokes = [P(color)]); if (sz !== 16) n.rescale(sz / 16); return n;
}
function rect(name, w, h, fillVar = 'surface-2', r = 0) { const x = figma.createRectangle(); x.name = name; x.resize(w, h); x.fills = [P(fillVar)]; x.cornerRadius = r; return x; }
const setText = async (inst, name, chars) => { const t = inst.findOne(n => n.type === 'TEXT' && n.name === name); if (t) t.characters = chars; return t; };
