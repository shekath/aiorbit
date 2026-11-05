// ---- V4 component board ----
const old = MOCKB.findOne(n => n.name === 'V4 / Components'); if (old) old.remove();
const board = F('V4 / Components', { dir: 'VERTICAL', pad: 80, gap: 56, fill: 'bg', w: 1640 });
MOCKB.appendChild(board); board.x = 120; board.y = 120; board.setExplicitVariableModeForCollection(coll, DARK);
add(board, await T('Version 4 · Monolith — components', 'Big', 'fg', { g: 'Monolith', w: 1280 }));
add(board, await T('Monochrome bands, oversized Sora display type, one violet → blue → cyan gradient. Every colour is bound to the “AI Orbit V4 / Color” collection — switch the frame mode to Light to theme.', 'Lead', 'fg-muted', { w: 900 }));
const row = async (title) => { const r = F('Row · ' + title, { dir: 'VERTICAL', gap: 20 }); add(board, r); fill(r); add(r, await T(title, 'Label', 'fg-muted')); const c = F('items', { dir: 'HORIZONTAL', gap: 24, align: 'MIN' }); add(r, c); c.layoutWrap = 'WRAP'; fill(c); c.counterAxisSpacing = 24; return c; };
const ids = {};

// Buttons (variants)
const mkBtn = async (style) => {
  const solid = style === 'Solid';
  const b = F('Style=' + style, { comp: true, dir: 'HORIZONTAL', pad: [8, 8, 8, 24], gap: 16, r: 999, fill: solid ? 'btn-bg' : null, stroke: solid ? null : 'line-2', align: 'CENTER' });
  add(b, await T('Launch your AI journey', 'Button', solid ? 'btn-fg' : 'fg', { name: 'Label' }));
  const ic = F('Icon circle', { dir: 'HORIZONTAL', w: 40, h: 40, r: 999, fill: solid ? 'btn-fg' : 'fg', align: 'CENTER', just: 'CENTER' }); ic.primaryAxisSizingMode = 'FIXED'; ic.counterAxisSizingMode = 'FIXED'; ic.resize(40, 40);
  add(ic, arrow(solid ? 'btn-bg' : 'bg')); add(b, ic); return b;
};
const r1 = await row('Buttons · magnetic, text roll on hover');
const bs = await mkBtn('Solid'), bg = await mkBtn('Ghost'); add(r1, bs, bg);
const btnSet = figma.combineAsVariants([bs, bg], r1); btnSet.name = 'Button'; btnSet.layoutMode = 'HORIZONTAL'; btnSet.itemSpacing = 24; btnSet.paddingTop = btnSet.paddingBottom = btnSet.paddingLeft = btnSet.paddingRight = 24; btnSet.primaryAxisSizingMode = 'AUTO'; btnSet.counterAxisSizingMode = 'AUTO'; btnSet.fills = []; btnSet.strokes = [P('line')]; btnSet.dashPattern = [6, 6]; btnSet.cornerRadius = 16;
ids.button = btnSet.id; ids.btnSolid = bs.id; ids.btnGhost = bg.id;

// Label + chip
const r2 = await row('Labels & chips · JetBrains Mono 12 / +10% / uppercase');
const lab = F('Label / Plus', { comp: true, dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
add(lab, await T('+', 'Label', 'accent-text', { name: 'Plus' }), await T('Introducing Evoke AI Orbit', 'Label', 'fg-muted', { name: 'Label' }));
const chip = F('Chip', { comp: true, dir: 'HORIZONTAL', pad: [8, 14], r: 999, fill: 'glass', stroke: 'line-2', align: 'CENTER' });
add(chip, await T('Pharmaceutical', 'Label', 'fg', { name: 'Label' }));
add(r2, lab, chip); ids.label = lab.id; ids.chip = chip.id;

// Fact cards
const r3 = await row('Key-fact cards · tilt on pointer, count-up numbers');
const fact = F('Fact card', { comp: true, dir: 'VERTICAL', pad: 32, gap: 18, r: 28, fill: 'surface', stroke: 'line', w: 400 });
const ph = rect('Photo', 336, 200, 'surface-2', 18); add(fact, ph); fill(ph);
add(fact, await T('Time saved', 'Label', 'fg-muted', { name: 'Label' }));
add(fact, await T('65%', 'Stat', 'fg', { name: 'Stat', g: '%' }));
add(fact, fill(await T('Average delivery time saved with agentic engineering.', 'Body', 'fg-muted', { name: 'Body', w: 336 })));
add(r3, fact); ids.fact = fact.id;

// Service card
const scard = F('Service card', { comp: true, dir: 'VERTICAL', pad: 32, gap: 14, r: 24, fill: 'glass', stroke: 'line-2', w: 320 });
add(scard, fill(await T('01 · Enterprise Agent Solutions', 'Label', 'accent-text', { name: 'Number', w: 256 })));
add(scard, fill(await T('Build What Thinks', 'H3', 'fg', { name: 'Title', w: 256 })));
add(scard, fill(await T('Intelligent applications that don’t just automate. They reason.', 'Body', 'fg', { name: 'Tag', w: 256 })));
add(scard, fill(await T('Production-ready, scalable, edge-case-tested and governance-ready agents for high-stakes problems.', 'Small', 'fg-muted', { name: 'Body', w: 256 })));
add(scard, await T('Explore AI Apps →', 'Button', 'fg', { name: 'Link' }));
add(r3, scard); ids.scard = scard.id;

// Work item
const r4 = await row('Case study (horizontal pinned rail) · “View” cursor');
const work = F('Work item', { comp: true, dir: 'VERTICAL', gap: 16, w: 560 });
const wph = F('Photo', { r: 24, fill: 'surface-2', w: 560, h: 420, clip: true }); wph.resize(560, 420); add(work, wph);
const wchip = chip.createInstance(); wph.appendChild(wchip); wchip.x = 20; wchip.y = 20;
add(work, fill(await T('Sencha Migration', 'H3', 'fg', { name: 'Title', w: 560 })));
add(work, fill(await T('AI-Orchestrated ExtJS to React Modernization for a Regulated Pharmaceutical Enterprise.', 'Body', 'fg-muted', { name: 'Body', w: 560 })));
add(work, await T('Explore project →', 'Label', 'fg', { name: 'Link' }));
add(r4, work); ids.work = work.id;

// Logo tile
const logo = F('Logo tile', { comp: true, dir: 'HORIZONTAL', r: 16, fill: 'surface', stroke: 'line', align: 'CENTER', just: 'CENTER' });
logo.primaryAxisSizingMode = 'FIXED'; logo.counterAxisSizingMode = 'FIXED'; logo.resize(200, 88);
add(logo, await T('Partner', 'Small', 'fg-muted', { name: 'Name' }));
add(r4, logo); ids.logo = logo.id;

// Industry row + knowledge row
const r5 = await row('List rows · hover reveals image peek (industries) / arrow slide');
const ind = F('Industry row', { comp: true, dir: 'HORIZONTAL', pad: [32, 0], gap: 40, w: 1280, align: 'MIN' });
ind.strokes = [P('line-2')]; ind.strokeTopWeight = 0; ind.strokeLeftWeight = 0; ind.strokeRightWeight = 0; ind.strokeBottomWeight = 1;
add(ind, await T('01', 'Label', 'fg-muted', { name: 'Number' }));
add(ind, await T('Manufacturing & Industrial', 'H3', 'fg', { name: 'Title', w: 420 }));
const dcol = F('Desc', { dir: 'VERTICAL', gap: 8 }); add(ind, dcol); dcol.layoutGrow = 1;
add(dcol, fill(await T('From shop floor to boardroom – AI that runs on operational reality.', 'Body', 'fg-muted', { name: 'Body', w: 500 })));
add(dcol, fill(await T('Production optimization · Predictive maintenance · Supply chain risk agents', 'Small', 'fg-subtle', { name: 'Tags', w: 500 })));
add(ind, arrow('fg', 22));
add(r5, ind); ids.ind = ind.id;
const kn = F('Knowledge row', { comp: true, dir: 'HORIZONTAL', pad: [28, 0], gap: 40, w: 1280, align: 'CENTER' });
kn.strokes = [P('line-2')]; kn.strokeTopWeight = 0; kn.strokeLeftWeight = 0; kn.strokeRightWeight = 0; kn.strokeBottomWeight = 1;
add(kn, await T('Knowledge paper', 'Label', 'fg-muted', { name: 'Type', w: 200 }));
const kcol = F('Text', { dir: 'VERTICAL', gap: 6 }); add(kn, kcol); kcol.layoutGrow = 1;
add(kcol, fill(await T('Hyper Programing: A New SDLC Paradigm', 'H3', 'fg', { name: 'Title', w: 800 })));
add(kcol, fill(await T('Just-In-Time Software Engineering Through Agentic AI', 'Body', 'fg-muted', { name: 'Body', w: 800 })));
add(kn, arrow('fg', 20));
add(r5, kn); ids.kn = kn.id;

// Nav
const r6 = await row('Navigation · transparent over hero, blurs on scroll, hides on scroll-down');
const nav = F('Nav', { comp: true, dir: 'HORIZONTAL', pad: [0, 64], w: 1440, align: 'CENTER', just: 'SPACE_BETWEEN' }); nav.counterAxisSizingMode = 'FIXED'; nav.resize(1440, 72);
const brand = F('Brand', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
add(brand, await T('evoke', 'H3', 'fg', { name: 'Logo' }), await T('AI Orbit', 'Label', 'fg-muted', { name: 'Product' }));
const links = F('Links', { dir: 'HORIZONTAL', gap: 32, align: 'CENTER' });
for (const l of ['Services ▾', 'Case studies', 'Industries', 'Insights', 'Contact']) add(links, await T(l, 'Label', 'fg', { name: l }));
const right = F('Actions', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
const ver = chip.createInstance(); ver.name = 'Version switch'; await setText(ver, 'Label', 'V4 · Monolith ▾');
const theme = F('Theme toggle', { dir: 'HORIZONTAL', r: 999, stroke: 'line-2', align: 'CENTER', just: 'CENTER' }); theme.primaryAxisSizingMode = 'FIXED'; theme.counterAxisSizingMode = 'FIXED'; theme.resize(40, 40);
add(theme, await T('◐', 'Small', 'fg', { name: 'Icon' }));
const cta = bs.createInstance(); await setText(cta, 'Label', 'Let’s talk');
add(right, ver, theme, cta); add(nav, brand, links, right); add(r6, nav); ids.nav = nav.id;
return ids;
