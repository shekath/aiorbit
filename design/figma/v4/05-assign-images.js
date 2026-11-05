// Run after uploads: copies image hashes from "V4 / Image sources" into every IMG slot of the four home frames.
const S = await figma.getNodeByIdAsync('1377:5588');
const src = S.findOne(n => n.name === 'V4 / Image sources');
const H = {}; for (const r of src.children) { const f = r.fills && r.fills[0]; if (f && f.type === 'IMAGE') H[r.name.replace('src · ', '')] = f.imageHash; }
const img = (k, mode = 'FILL') => { if (!H[k]) throw new Error('missing upload ' + k); return [{ type: 'IMAGE', imageHash: H[k], scaleMode: mode }]; };
const frames = [['1426:2470', 'dark'], ['1428:2657', 'light'], ['1429:2844', 'dark'], ['1429:3113', 'light']];
const work = { 'Sencha Migration': 'case-pharma', 'COBOL Conversion': 'case-tax', 'Production Optimization Agent': 'case-production', 'Incident Triage Agent': 'case-triage' };
let n = 0;
for (const [id, t] of frames) {
  const F = await figma.getNodeByIdAsync(id);
  for (const x of F.findAll(x => x.name.startsWith('IMG · '))) {
    const nm = x.name;
    const k = nm.includes('(phone)') ? 'phone-hero-' + t : nm.includes('(hero)') ? 'hero-' + t : nm.includes('AI core') ? 'core-' + t : nm.includes('(calm)') ? 'cta-' + t : nm.includes('Peek') ? 'ind-financial' : null;
    if (k) { x.fills = img(k); n++; }
  }
  const facts = F.findAll(x => x.type === 'INSTANCE' && x.name === 'Fact card');
  const fk = ['svc-engineering', null, 'case-production'];
  for (let i = 0; i < facts.length; i++) { const k = fk[i % 3]; if (k) { facts[i].findOne(y => y.name === 'Photo').fills = img(k); n++; } }
  for (const w of F.findAll(x => x.name.startsWith('Work · '))) { const k = work[w.name.slice(7)]; const ph = w.findOne(y => y.name === 'Photo'); if (k && ph) { ph.fills = img(k); n++; } }
  for (const l of F.findAll(x => x.type === 'INSTANCE' && x.name.startsWith('Logo · '))) { const k = 'logo-' + l.name.slice(7).toLowerCase(); const s = l.findOne(y => y.name === 'Logo'); if (H[k] && s) { s.fills = img(k, 'FIT'); n++; } }
}
// component board samples
const board = S.findOne(n => n.name === 'V4 / Components');
const fc = board.findOne(n => n.type === 'COMPONENT' && n.name === 'Fact card'); fc.findOne(y => y.name === 'Photo').fills = img('svc-engineering');
const wc = board.findOne(n => n.type === 'COMPONENT' && n.name === 'Work item'); wc.findOne(y => y.name === 'Photo').fills = img('case-pharma');
return { assigned: n, sources: Object.keys(H).length };
