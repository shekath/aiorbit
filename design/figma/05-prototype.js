// AI Orbit — Figma step 5: prototype wiring (run after 04-light-themes.js).
// - Hover/active variants become interactive components (Button, Service Row, Case Card, Pipeline Stage)
// - Nav, service rows, cards, story card, prev/next and theme toggle navigate between screens
// - Theme toggle jumps between the Dark and Light version of the same screen
// - Adds two flow starting points: "AI Orbit — Dark" and "AI Orbit — Light"
const page = await figma.getNodeByIdAsync('249:3691'); await figma.setCurrentPageAsync(page);
const mock = await figma.getNodeByIdAsync('1356:1159');
const T = { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: 0.4 };
const DISSOLVE = { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.32 };
const go = (dest, t = T) => [{ type: 'NODE', destinationId: dest.id, navigation: 'NAVIGATE', transition: t, preserveScrollPosition: false, resetScrollPosition: true }];
const onClick = async (node, dest, t) => { if (node && dest) await node.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: go(dest, t) }]); };

// 1. Interactive component hover states
async function hover(setId, from, to) {
  const set = await figma.getNodeByIdAsync(setId); if (!set) return;
  for (const v of set.children) {
    if (!v.name.includes(from)) continue;
    const target = set.children.find(x => x.name === v.name.replace(from, to)); if (!target) continue;
    await v.setReactionsAsync([{ trigger: { type: 'ON_HOVER' }, actions: [{ type: 'NODE', destinationId: target.id, navigation: 'CHANGE_TO', transition: T }] }]);
  }
}
await hover('1364:1199', 'State=Default', 'State=Hover');   // Button
await hover('1364:1298', 'State=Default', 'State=Active');  // Service Row
await hover('1364:1374', 'State=Default', 'State=Hover');   // Case Card
await hover('1364:1320', 'State=Off', 'State=On');          // Pipeline Stage

// 2. Screen map
const frames = mock.children.filter(n => n.type === 'FRAME' && /— (Dark|Light)$/.test(n.name));
const screen = (theme, key) => frames.find(f => f.name.endsWith('— ' + theme) && f.name.includes(key));
const KEYS = { home: 'Home', agents: 'Enterprise Agent', eng: 'AI-First', gov: 'AI Governance', adv: 'AI Advisory', cs: 'Case Study' };
const svcByTitle = { 'Enterprise Agent Solutions': 'agents', 'AI-First Software Engineering': 'eng', 'AI Governance': 'gov', 'AI Advisory': 'adv' };
let wired = 0;
for (const theme of ['Dark', 'Light']) {
  const other = theme === 'Dark' ? 'Light' : 'Dark';
  for (const [k, label] of Object.entries(KEYS)) {
    const f = screen(theme, label); if (!f) continue;
    const S = (key) => screen(theme, KEYS[key]);
    const header = f.findOne(n => n.name === 'Header' && n.type === 'INSTANCE');
    if (header) {
      await onClick(header.findOne(n => n.name === 'Brand'), S('home'));
      await onClick(header.findOne(n => n.name === 'Link/Services'), S('agents'));
      await onClick(header.findOne(n => n.name === 'Link/Case Studies'), S('cs'));
      await onClick(header.findOne(n => n.name === 'Theme toggle'), screen(other, label), DISSOLVE);
      wired += 4;
    }
    for (const row of f.findAll(n => n.type === 'INSTANCE' && n.name.startsWith('Service Row/'))) { await onClick(row, S(svcByTitle[row.name.split('/')[1]])); wired++; }
    for (const card of f.findAll(n => n.type === 'INSTANCE' && n.mainComponent && n.mainComponent.parent && n.mainComponent.parent.name === 'Case Card')) { await onClick(card, S('cs')); wired++; }
    const story = f.findOne(n => n.name === 'Story card → Case study'); if (story) { await onClick(story, S('cs')); wired++; }
    const crumbHome = f.findOne(n => n.name === 'Breadcrumb'); if (crumbHome) { await onClick(crumbHome, S('home')); wired++; }
    const slugKey = { 'enterprise-agents': 'agents', 'ai-first-engineering': 'eng', 'ai-governance': 'gov', 'ai-advisory': 'adv' };
    for (const n of f.findAll(n => n.name.startsWith('Prev → ') || n.name.startsWith('Next → '))) { await onClick(n, S(slugKey[n.name.split('→ ')[1]])); wired++; }
    const link = f.findOne(n => n.name === 'Link → Enterprise Agents'); if (link) { await onClick(link, S('agents')); wired++; }
  }
}
const starts = [['AI Orbit — Dark', screen('Dark', 'Home')], ['AI Orbit — Light', screen('Light', 'Home')]].filter(([, n]) => n).map(([name, n]) => ({ nodeId: n.id, name }));
page.flowStartingPoints = [...page.flowStartingPoints.filter(s => !starts.some(x => x.name === s.name)), ...starts];
return { wired, starts };
