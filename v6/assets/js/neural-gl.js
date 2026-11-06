/* AI Orbit · Version 6 "Signal" — WebGL neural network (three.js).
   A deep network of six layers floats in front of a faint graticule globe
   (Version 3 reference). Mint pulses propagate forward synapse by synapse,
   activating neurons; ember pulses occasionally travel backward (learning).
   Hover excites nearby neurons; click fires the nearest layer.
   Theme-aware (dark: additive glow; light: ink on paper). Copy in [data-safe]
   stays on a calm background. Pauses off-screen / hidden tab / motion off. */
import * as THREE from "../../../assets/vendor/three.module.min.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLight = () => document.documentElement.dataset.theme === "light";
let motion = !reduce; try { if (localStorage.getItem("orbit6-motion") === "off") motion = false; } catch {}
const nets = [];
addEventListener("v6:motion", (e) => { motion = e.detail; nets.forEach((n) => n.kick()); });
new MutationObserver(() => nets.forEach((n) => n.theme())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

const SAFE = /* glsl */ `
  uniform vec4 uSafe[4]; uniform float uFeather;
  float safeMask(vec2 q) {
    float m = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 r = uSafe[i]; if (r.z <= r.x) continue;
      float sx = smoothstep(r.x - uFeather, r.x, q.x) * (1.0 - smoothstep(r.z, r.z + uFeather, q.x));
      float sy = smoothstep(r.y - uFeather, r.y, q.y) * (1.0 - smoothstep(r.w, r.w + uFeather, q.y));
      m = max(m, sx * sy);
    }
    return m;
  }`;

const lineMat = (u) => new THREE.ShaderMaterial({
  uniforms: u, transparent: true, depthWrite: false, depthTest: false,
  vertexShader: `attribute float aHeat; varying float vHeat; varying float vFog;
    void main(){ vHeat = aHeat; vec4 mv = modelViewMatrix * vec4(position,1.0); vFog = smoothstep(11.0, 4.0, -mv.z); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `${SAFE} uniform vec3 uBase, uHot; uniform float uAlpha, uLight;
    varying float vHeat; varying float vFog;
    void main(){ float a = (uAlpha + vHeat * .55) * (.35 + .65 * vFog) * (1.0 - safeMask(gl_FragCoord.xy));
      vec3 c = mix(uBase, uHot, clamp(vHeat * 1.4, 0.0, 1.0));
      gl_FragColor = uLight > .5 ? vec4(c, a) : vec4(c * a, a); }`,
});
const pointMat = (u) => new THREE.ShaderMaterial({
  uniforms: u, transparent: true, depthWrite: false, depthTest: false,
  vertexShader: `attribute float aAct; attribute float aSize; uniform float uPx; varying float vAct; varying float vFog;
    void main(){ vAct = aAct; vec4 mv = modelViewMatrix * vec4(position,1.0); vFog = smoothstep(11.0, 4.0, -mv.z);
      gl_PointSize = (aSize + aAct * aSize * 1.6) * uPx * (6.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `${SAFE} uniform vec3 uBase, uHot; uniform float uAlpha, uLight; varying float vAct; varying float vFog;
    void main(){ vec2 c = gl_PointCoord - .5; float d = length(c); if (d > .5) discard;
      float core = smoothstep(.5, .32, d), halo = smoothstep(.5, .0, d) * .6;
      float a = (core * (uAlpha + vAct * .8) + halo * vAct) * (.4 + .6 * vFog) * (1.0 - safeMask(gl_FragCoord.xy));
      vec3 col = mix(uBase, uHot, clamp(vAct * 1.3, 0.0, 1.0));
      gl_FragColor = uLight > .5 ? vec4(col, a) : vec4(col * a, a); }`,
});

document.querySelectorAll("canvas.neural").forEach((cv) => { try { nets.push(make(cv)); } catch (e) { console.warn("neural field disabled", e); cv.remove(); } });

function make(cv) {
  const host = cv.parentElement;
  const calm = cv.dataset.mode === "calm";
  const small = innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(34, 1, .1, 60); cam.position.set(0, 0, 8);
  const root = new THREE.Group(); scene.add(root);
  const net = new THREE.Group(); root.add(net);

  /* ---- shared uniforms ---- */
  const safe = [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()];
  const U = () => ({ uSafe: { value: safe }, uFeather: { value: 80 }, uBase: { value: new THREE.Color() }, uHot: { value: new THREE.Color() }, uAlpha: { value: .1 }, uLight: { value: 0 }, uPx: { value: 1 } });
  const uEdge = U(), uNode = U(), uPulse = U(), uBack = U(), uGlobe = U();

  /* ---- layers + neurons ---- */
  const COUNTS = calm ? [6, 10, 14, 10, 6] : small ? [6, 10, 14, 14, 10, 6] : [8, 14, 22, 22, 14, 8];
  const L = COUNTS.length, SPAN = calm ? 3.4 : 4.4;
  const nodes = [], layerOf = [];
  COUNTS.forEach((n, li) => {
    const x = -SPAN / 2 + (li / (L - 1)) * SPAN;
    const R = .38 + Math.sqrt(n) * .2;
    for (let k = 0; k < n; k++) {
      const ring = n > 12 ? (k % 2 ? 1 : .55) : 1, a = (k / n) * Math.PI * 2 + li * .4;
      nodes.push({ p: new THREE.Vector3(x, Math.sin(a) * R * ring, Math.cos(a) * R * ring), layer: li, act: 0, out: [], inn: [], cool: 0 });
      layerOf.push(li);
    }
  });
  const byLayer = COUNTS.map((_, li) => nodes.map((n, i) => (n.layer === li ? i : -1)).filter((i) => i >= 0));
  /* ---- sparse synapses between consecutive layers ---- */
  const edges = [];
  for (let li = 0; li < L - 1; li++) for (const a of byLayer[li]) {
    const pool = byLayer[li + 1].slice().sort(() => Math.random() - .5).slice(0, calm ? 3 : 4);
    for (const b of pool) { const e = edges.length; edges.push({ a, b, heat: 0 }); nodes[a].out.push(e); nodes[b].inn.push(e); }
  }
  const ePos = new Float32Array(edges.length * 6), eHeat = new Float32Array(edges.length * 2);
  edges.forEach((e, i) => { const A = nodes[e.a].p, B = nodes[e.b].p; ePos.set([A.x, A.y, A.z, B.x, B.y, B.z], i * 6); });
  const eGeo = new THREE.BufferGeometry(); eGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3)); eGeo.setAttribute("aHeat", new THREE.BufferAttribute(eHeat, 1));
  net.add(new THREE.LineSegments(eGeo, lineMat(uEdge)));
  const nPos = new Float32Array(nodes.length * 3), nAct = new Float32Array(nodes.length), nSize = new Float32Array(nodes.length);
  nodes.forEach((n, i) => { nPos.set([n.p.x, n.p.y, n.p.z], i * 3); nSize[i] = n.layer === 0 || n.layer === L - 1 ? 5.2 : 4.2; });
  const nGeo = new THREE.BufferGeometry(); nGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3)); nGeo.setAttribute("aAct", new THREE.BufferAttribute(nAct, 1)); nGeo.setAttribute("aSize", new THREE.BufferAttribute(nSize, 1));
  net.add(new THREE.Points(nGeo, pointMat(uNode)));

  /* ---- pulses (pool, with a 4-sample tail) ---- */
  const MAXP = calm ? 120 : 260, TAIL = 4;
  const pulses = []; const mkPool = (u) => { const pos = new Float32Array(MAXP * TAIL * 3), act = new Float32Array(MAXP * TAIL), size = new Float32Array(MAXP * TAIL);
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("aAct", new THREE.BufferAttribute(act, 1)); g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setDrawRange(0, 0); net.add(new THREE.Points(g, pointMat(u))); return { g, pos, act, size }; };
  const fwd = mkPool(uPulse), back = mkPool(uBack);

  /* ---- graticule globe + limb ring (Version 3 reference) ---- */
  const globe = new THREE.Group(); root.add(globe);
  const gp = [], R0 = calm ? 2.6 : 3.1;
  for (let lat = -60; lat <= 60; lat += 20) { const r = Math.cos(lat * Math.PI / 180) * R0, y = Math.sin(lat * Math.PI / 180) * R0; for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2, b = (i + 1) / 64 * Math.PI * 2; gp.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(b) * r, y, Math.sin(b) * r); } }
  for (let lon = 0; lon < 180; lon += 20) { const t = lon * Math.PI / 180; for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2, b = (i + 1) / 64 * Math.PI * 2; gp.push(Math.cos(a) * Math.cos(t) * R0, Math.sin(a) * R0, Math.cos(a) * Math.sin(t) * R0, Math.cos(b) * Math.cos(t) * R0, Math.sin(b) * R0, Math.cos(b) * Math.sin(t) * R0); } }
  const gGeo = new THREE.BufferGeometry(); gGeo.setAttribute("position", new THREE.Float32BufferAttribute(gp, 3)); gGeo.setAttribute("aHeat", new THREE.Float32BufferAttribute(new Float32Array(gp.length / 3), 1));
  globe.add(new THREE.LineSegments(gGeo, lineMat(uGlobe)));
  const ring = []; for (let i = 0; i < 160; i++) { const a = i / 160 * Math.PI * 2, b = (i + 1) / 160 * Math.PI * 2, r = R0 * 1.18; ring.push(Math.cos(a) * r, Math.sin(a) * r, 0, Math.cos(b) * r, Math.sin(b) * r, 0); if (i % 4 === 0) { const r2 = r * (i % 20 === 0 ? 1.05 : 1.025); ring.push(Math.cos(a) * r, Math.sin(a) * r, 0, Math.cos(a) * r2, Math.sin(a) * r2, 0); } }
  const rGeo = new THREE.BufferGeometry(); rGeo.setAttribute("position", new THREE.Float32BufferAttribute(ring, 3)); rGeo.setAttribute("aHeat", new THREE.Float32BufferAttribute(new Float32Array(ring.length / 3), 1));
  root.add(new THREE.LineSegments(rGeo, lineMat(uGlobe)));

  /* ---- theme ---- */
  function theme() {
    const light = isLight();
    const base = light ? 0x0a0a0a : 0xf4f4f1, hot = light ? 0x0f9a5f : 0x73ffb9, ember = light ? 0xd9481a : 0xff6338;
    for (const u of [uEdge, uNode, uPulse, uBack, uGlobe]) { u.uLight.value = light ? 1 : 0; u.uBase.value.set(base); }
    uEdge.uHot.value.set(hot); uNode.uHot.value.set(hot); uPulse.uHot.value.set(hot); uPulse.uBase.value.set(hot); uBack.uHot.value.set(ember); uBack.uBase.value.set(ember); uGlobe.uHot.value.set(hot);
    uEdge.uAlpha.value = light ? .13 : .1; uNode.uAlpha.value = light ? .55 : .5; uPulse.uAlpha.value = .9; uBack.uAlpha.value = .9; uGlobe.uAlpha.value = light ? .08 : .085;
    const mode = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    scene.traverse((o) => { if (o.material) { o.material.blending = mode; o.material.needsUpdate = true; } });
    if (!raf) render(0);
  }

  /* ---- signal dynamics ---- */
  const spawn = (e, dir) => { if (e === undefined || pulses.length >= MAXP) return; pulses.push({ e, t: 0, dir, v: .55 + Math.random() * .5 }); };
  const fire = (i, dir = 1, p = 1) => { const n = nodes[i]; n.act = 1; const list = dir > 0 ? n.out : n.inn; for (const e of list) if (Math.random() < p) spawn(e, dir); };
  function arrive(pu) {
    const e = edges[pu.e], i = pu.dir > 0 ? e.b : e.a, n = nodes[i]; n.act = 1; e.heat = 1;
    if (pu.dir > 0) {
      if (n.layer < L - 1) { const k = Math.random() < .45 ? 2 : 1; for (let j = 0; j < k; j++) spawn(n.out[(Math.random() * n.out.length) | 0], 1); }
      else if (Math.random() < .14 && n.inn.length) spawn(n.inn[(Math.random() * n.inn.length) | 0], -1);
    } else if (n.layer > 0 && Math.random() < .7) spawn(n.inn[(Math.random() * n.inn.length) | 0], -1);
  }
  let clock = 0, nextWave = 0;
  function step(dt) {
    clock += dt;
    if (clock > nextWave) { const ins = byLayer[0]; for (let k = 0; k < (calm ? 2 : 3); k++) fire(ins[(Math.random() * ins.length) | 0], 1, .6); nextWave = clock + (calm ? 1.6 : .9) + Math.random() * .8; }
    for (let i = pulses.length - 1; i >= 0; i--) { const pu = pulses[i]; pu.t += dt * pu.v; if (pu.t >= 1) { arrive(pu); pulses.splice(i, 1); } }
    for (const n of nodes) n.act *= Math.exp(-dt * 2.6);
    for (const e of edges) e.heat *= Math.exp(-dt * 2.2);
  }
  const tmp = new THREE.Vector3();
  function upload() {
    nodes.forEach((n, i) => (nAct[i] = n.act)); nGeo.attributes.aAct.needsUpdate = true;
    edges.forEach((e, i) => { eHeat[i * 2] = eHeat[i * 2 + 1] = e.heat; }); eGeo.attributes.aHeat.needsUpdate = true;
    let fi = 0, bi = 0;
    for (const pu of pulses) {
      const e = edges[pu.e], A = nodes[pu.dir > 0 ? e.a : e.b].p, B = nodes[pu.dir > 0 ? e.b : e.a].p, pool = pu.dir > 0 ? fwd : back;
      for (let s = 0; s < TAIL; s++) {
        const t = Math.max(0, pu.t - s * .045); tmp.lerpVectors(A, B, t); e.heat = Math.max(e.heat, .6);
        const k = pu.dir > 0 ? fi++ : bi++; pool.pos.set([tmp.x, tmp.y, tmp.z], k * 3); pool.act[k] = 1 - s / TAIL; pool.size[k] = s === 0 ? 4.6 : 3.2 - s * .5;
      }
    }
    for (const [pool, n] of [[fwd, fi], [back, bi]]) { pool.g.setDrawRange(0, n); pool.g.attributes.position.needsUpdate = true; pool.g.attributes.aAct.needsUpdate = true; pool.g.attributes.aSize.needsUpdate = true; }
  }

  /* ---- layout, pointer, safe zones ---- */
  let W = 1, H = 1, px = 1, raf = 0, vis = false, last = performance.now();
  const ptr = { x: 0, y: 0, sx: -1e4, sy: -1e4, tx: 0, ty: 0, has: false };
  function layout() {
    const r = cv.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    px = Math.min(devicePixelRatio || 1, 1.75); renderer.setPixelRatio(px); renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    // place the network by screen fraction (NDC) so it sits in open space at any aspect ratio
    const wide = W / H > 1.1, halfH = Math.tan(cam.fov * Math.PI / 360) * cam.position.z, halfW = halfH * cam.aspect;
    const tx = cv.dataset.x ? +cv.dataset.x : wide ? (calm ? .62 : .36) : 0, ty = cv.dataset.y ? +cv.dataset.y : wide ? (calm ? .12 : .08) : .45;
    root.position.set(tx * halfW, ty * halfH, 0);
    const s = cv.dataset.s ? +cv.dataset.s : wide ? (calm ? Math.max(.5, Math.min(1, H / 860)) * .85 : 1) : Math.min(1, W / 520) * .78; root.scale.setScalar(s);
    for (const u of [uEdge, uNode, uPulse, uBack, uGlobe]) { u.uPx.value = px; u.uFeather.value = 70 * px; }
    safeRects(); if (!raf) render(0);
  }
  function safeRects() {
    const c = cv.getBoundingClientRect(); const els = [...host.querySelectorAll("[data-safe]")].filter((el) => el.getClientRects().length).slice(0, 4);
    safe.forEach((v, i) => { const el = els[i]; if (!el) { v.set(0, 0, 0, 0); return; } const r = el.getBoundingClientRect(); v.set((r.left - c.left - 18) * px, (c.bottom - r.bottom - 18) * px, (r.right - c.left + 18) * px, (c.bottom - r.top + 18) * px); });
  }
  addEventListener("pointermove", (e) => {
    const r = cv.getBoundingClientRect(); const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    ptr.has = inside; if (!inside) return; ptr.tx = (e.clientX - r.left) / W * 2 - 1; ptr.ty = (e.clientY - r.top) / H * 2 - 1; ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top; kick();
  }, { passive: true });
  host.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, select, textarea")) return;
    const r = cv.getBoundingClientRect(); const x = e.clientX - r.left; let best = 0, bd = 1e9;
    byLayer.forEach((ids, li) => { tmp.copy(nodes[ids[0]].p); net.localToWorld(tmp); tmp.project(cam); const sx = (tmp.x * .5 + .5) * W, d = Math.abs(sx - x); if (d < bd) { bd = d; best = li; } });
    for (const i of byLayer[best]) fire(i, best === L - 1 ? -1 : 1, .8); kick();
  });
  function hover() {
    if (!ptr.has) return;
    nodes.forEach((n, i) => { if (n.cool > clock) return; tmp.copy(n.p); net.localToWorld(tmp); tmp.project(cam); const sx = (tmp.x * .5 + .5) * W, sy = (-tmp.y * .5 + .5) * H;
      if (Math.hypot(sx - ptr.sx, sy - ptr.sy) < 70) { n.act = Math.max(n.act, .9); n.cool = clock + .55; if (n.out.length) spawn(n.out[(Math.random() * n.out.length) | 0], 1); } });
  }

  function render(dt) {
    const s = dt / 1000;
    if (motion && s > 0) { step(s); hover(); }
    ptr.x += (ptr.tx - ptr.x) * .05; ptr.y += (ptr.ty - ptr.y) * .05;
    net.rotation.set(-.12 + ptr.y * .12, -.62 + Math.sin(clock * .12) * .12 + ptr.x * .22, .04);
    globe.rotation.y = clock * .04; globe.rotation.x = .3 + ptr.y * .05;
    upload();
    renderer.render(scene, cam);
  }
  function loop(now) { const dt = Math.min(48, now - last); last = now; render(dt); raf = vis && motion && !document.hidden ? requestAnimationFrame(loop) : 0; }
  function kick() { if (!raf && vis && motion && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } else if (!motion) render(0); }
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; kick(); }).observe(cv);
  document.addEventListener("visibilitychange", kick);
  new ResizeObserver(layout).observe(cv);
  addEventListener("resize", safeRects);
  // a still-but-alive first frame (also what reduced motion sees)
  for (let i = 0; i < 90; i++) step(1 / 30);
  theme(); layout();
  return { kick, theme };
}
