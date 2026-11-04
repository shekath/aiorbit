// AI Orbit — Figma step 4: create the Light screens.
// Run with the Figma MCP `use_figma` tool (file rtVghJdEHvX6yc7YDkSRUm) or paste into a
// Scripter-style plugin. Clones every "— Dark" frame inside the MockA section, places it
// 9400px below, and re-binds every colour from "AI Orbit / Color · Dark" to the
// same-named variable in "AI Orbit / Color · Light" (including instance overrides).
// Safe to re-run: existing "— Light" frames are replaced.
const page = await figma.getNodeByIdAsync('249:3691'); await figma.setCurrentPageAsync(page);
const mock = await figma.getNodeByIdAsync('1356:1159'); // MockA section
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const dk = cols.find(c => c.name === 'AI Orbit / Color · Dark'), lt = cols.find(c => c.name === 'AI Orbit / Color · Light');
const L = {}, map = {};
for (const id of lt.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); L[v.name] = v; }
for (const id of dk.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); map[id] = L[v.name]; }
await Promise.all([['Geist','Medium'],['Geist','Regular'],['Geist','SemiBold'],['Geist Mono','Regular'],['Instrument Serif','Italic']].map(([family, style]) => figma.loadFontAsync({ family, style })));
const remap = (paints) => paints.map(p => {
  const b = p.boundVariables && p.boundVariables.color;
  if (b && map[b.id]) return figma.variables.setBoundVariableForPaint(p, 'color', map[b.id]);
  if (p.type === 'GRADIENT_LINEAR') return { ...p, gradientStops: p.gradientStops.map(s => ({ ...s, color: { r: 0.953, g: 0.949, b: 0.933, a: s.color.a } })) };
  if (p.type === 'GRADIENT_RADIAL') return { ...p, gradientStops: p.gradientStops.map((s, i) => ({ ...s, color: i === 0 ? { r: 0.62, g: 0.68, b: 1, a: s.color.a } : { r: 0.184, g: 0.31, b: 0.878, a: s.color.a } })) };
  return p;
});
const out = [];
for (const src of mock.children.filter(n => n.type === 'FRAME' && n.name.endsWith('— Dark'))) {
  const name = src.name.replace('— Dark', '— Light');
  for (const n of [...mock.children]) if (n.name === name) n.remove();
  const c = src.clone(); mock.appendChild(c); c.name = name; c.x = src.x; c.y = src.y + 9400;
  for (const n of [c, ...c.findAll(() => true)]) {
    if ('fills' in n && Array.isArray(n.fills) && n.fills.length) {
      if (n.type === 'TEXT') { const segs = n.getStyledTextSegments(['fills']); if (segs.length > 1) segs.forEach(s => n.setRangeFills(s.start, s.end, remap(s.fills))); else n.fills = remap(n.fills); }
      else n.fills = remap(n.fills);
    }
    if ('strokes' in n && Array.isArray(n.strokes) && n.strokes.length) n.strokes = remap(n.strokes);
    if ('effects' in n && Array.isArray(n.effects) && n.effects.length) n.effects = n.effects.map(e => e.type === 'DROP_SHADOW' ? { ...e, color: { r: 0.184, g: 0.31, b: 0.878, a: Math.min(e.color.a, 0.22) } } : e);
  }
  for (const m of c.findAll(n => n.name === 'moon')) m.visible = false; // light toggle state
  out.push({ id: c.id, name });
}
return out;
