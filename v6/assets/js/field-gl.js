/* AI Orbit · Version 6 — reactive particle field (three.js, one draw call).
   A receding grid of points rides slow procedural waves. The pointer leaves a
   velocity-weighted wake (fluid-like push + drag along momentum); a click sends
   a pulse ring. Points fade fully behind [data-safe] copy so text stays pristine. */
import * as THREE from "../../../assets/vendor/three.module.min.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const TRAIL = 14;

const vert = /* glsl */ `
  attribute float aRnd;
  uniform float uTime, uPx, uSpanX, uSpanY;
  uniform vec2 uRes, uVel;
  uniform vec4 uTrail[${TRAIL}];
  uniform vec3 uPulse;
  varying float vGlow, vH, vDepth;
  void main() {
    vec3 p = vec3(position.x * uSpanX, position.y * uSpanY, 0.0);
    float t = uTime * .22;
    float h = sin(p.x * 1.55 + t * 2.1) * .11 + sin(p.y * 2.2 - t * 1.5) * .09 + sin((p.x + p.y) * 3.3 + t * 1.2) * .045 + (aRnd - .5) * .02;
    p.z = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 scr = (clip.xy / clip.w * .5 + .5) * uRes;
    vec2 off = vec2(0.0); float glow = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
      vec4 tr = uTrail[i]; float life = 1.0 - tr.z;
      if (life <= 0.0) continue;
      vec2 d = scr - tr.xy; float r = (60.0 + 110.0 * tr.w) * uPx;
      float f = exp(-dot(d, d) / (r * r)) * life;
      off += normalize(d + 1e-4) * f * (8.0 + 30.0 * tr.w) * uPx;
      glow += f * (.35 + tr.w);
    }
    off += uVel * min(glow, 1.0) * 18.0 * uPx;
    if (uPulse.z < 1.0) {
      float rad = uPulse.z * 1100.0 * uPx; vec2 pd = scr - uPulse.xy; float dd = length(pd);
      float ring = exp(-pow((dd - rad) / (46.0 * uPx), 2.0)) * (1.0 - uPulse.z);
      off += normalize(pd + 1e-4) * ring * 16.0 * uPx; glow += ring * 1.1;
    }
    scr += off;
    clip.xy = ((scr / uRes) * 2.0 - 1.0) * clip.w;
    gl_Position = clip;
    float depth = clamp(-mv.z, .6, 8.0);
    gl_PointSize = (1.7 + aRnd * 1.5 + min(glow, 1.4) * 2.6) * uPx * (3.1 / depth);
    vGlow = min(glow, 1.5); vH = h; vDepth = smoothstep(7.5, 2.2, depth);
  }`;

const frag = /* glsl */ `
  uniform vec4 uSafe; uniform float uFeather, uOpacity;
  varying float vGlow, vH, vDepth;
  void main() {
    vec2 c = gl_PointCoord - .5; float d = length(c);
    if (d > .5) discard;
    float a = smoothstep(.5, .08, d);
    vec3 cobalt = vec3(.184, .184, .894), coral = vec3(1.0, .396, .247);
    vec3 col = mix(cobalt * 1.35, coral, clamp(vH * 3.2 + .45 + vGlow * .55, 0.0, 1.0));
    col += vec3(1.0, .82, .76) * vGlow * .35;
    vec2 q = gl_FragCoord.xy;
    float sx = smoothstep(uSafe.x - uFeather, uSafe.x, q.x) * (1.0 - smoothstep(uSafe.z, uSafe.z + uFeather, q.x));
    float sy = smoothstep(uSafe.y - uFeather, uSafe.y, q.y) * (1.0 - smoothstep(uSafe.w, uSafe.w + uFeather, q.y));
    float safe = sx * sy;
    float alpha = a * uOpacity * (.35 + .65 * vDepth) * (.62 + vGlow) * (1.0 - .96 * safe);
    gl_FragColor = vec4(col * alpha, alpha);
  }`;

const state = { motion: !reduce && localStorage.getItem("orbit6-motion") !== "off" };
addEventListener("v6:motion", (e) => { state.motion = e.detail; fields.forEach((f) => f.kick()); });
const fields = [];
document.querySelectorAll("canvas.field").forEach((cv) => { try { const f = make(cv); if (f) fields.push(f); } catch (err) { console.warn("field disabled", err); cv.remove(); } });

function make(cv) {
  const host = cv.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  host.classList.add("gl-on");
  const calm = cv.dataset.density === "calm";
  const small = innerWidth < 760;
  const COLS = calm ? (small ? 56 : 96) : (small ? 78 : 150), ROWS = calm ? (small ? 34 : 54) : (small ? 64 : 88);
  const N = COLS * ROWS;
  const pos = new Float32Array(N * 3), rnd = new Float32Array(N);
  let k = 0;
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    pos[k * 3] = (i / (COLS - 1)) * 2 - 1; pos[k * 3 + 1] = (j / (ROWS - 1)) * 2 - 1; pos[k * 3 + 2] = 0; rnd[k] = Math.random(); k++;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
  const trail = Array.from({ length: TRAIL }, () => new THREE.Vector4(-1e5, -1e5, 1, 0));
  const uni = {
    uTime: { value: 0 }, uPx: { value: 1 }, uSpanX: { value: 3 }, uSpanY: { value: 2.2 }, uRes: { value: new THREE.Vector2(1, 1) }, uVel: { value: new THREE.Vector2() },
    uTrail: { value: trail }, uPulse: { value: new THREE.Vector3(0, 0, 1) }, uSafe: { value: new THREE.Vector4(-1, -1, -1, -1) }, uFeather: { value: 90 }, uOpacity: { value: calm ? .7 : .85 },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: uni, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat);
  pts.rotation.x = -1.02;
  pts.position.y = -.12;
  const scene = new THREE.Scene(); scene.add(pts);
  const cam = new THREE.PerspectiveCamera(42, 1, .1, 50); cam.position.set(0, 0, 2.5);

  let W = 1, H = 1, px = 1, raf = 0, vis = false, last = performance.now(), fpsT = 0, frames = 0;
  const ptr = { x: -1e5, y: -1e5, vx: 0, vy: 0, has: false, lt: 0 };
  let head = 0;

  function safeRect() {
    const el = host.querySelector("[data-safe]"); if (!el) { uni.uSafe.value.set(-1, -1, -1, -1); return; }
    const c = cv.getBoundingClientRect(), r = el.getBoundingClientRect();
    uni.uSafe.value.set((r.left - c.left) * px, (c.bottom - r.bottom) * px, (r.right - c.left) * px, (c.bottom - r.top) * px);
    uni.uFeather.value = 90 * px;
  }
  function size() {
    const r = cv.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    px = Math.min(devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(px); renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    uni.uRes.value.set(W * px, H * px); uni.uPx.value = px;
    uni.uSpanX.value = Math.max(2.6, cam.aspect * 2.2); uni.uSpanY.value = 2.6;
    safeRect(); if (!raf) render(0);
  }
  addEventListener("pointermove", (e) => {
    const r = cv.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { ptr.has = false; return; }
    const x = (e.clientX - r.left) * px, y = (r.bottom - e.clientY) * px, now = performance.now(), dt = Math.max(8, now - ptr.lt);
    if (ptr.has) { ptr.vx = ptr.vx * .7 + ((x - ptr.x) / dt) * .3; ptr.vy = ptr.vy * .7 + ((y - ptr.y) / dt) * .3; }
    ptr.x = x; ptr.y = y; ptr.lt = now; ptr.has = true; kick();
  }, { passive: true });
  host.addEventListener("pointerdown", (e) => { const r = cv.getBoundingClientRect(); uni.uPulse.value.set((e.clientX - r.left) * px, (r.bottom - e.clientY) * px, 0); kick(); });

  function render(dt) {
    uni.uTime.value += state.motion ? dt / 1000 : 0;
    // advance trail: age existing points, drop a new one at the pointer
    for (const t of trail) t.z = Math.min(1, t.z + dt / 1100);
    if (ptr.has && state.motion) {
      const speed = Math.min(1, Math.hypot(ptr.vx, ptr.vy) / 2.2);
      const slot = trail[head]; slot.set(ptr.x, ptr.y, 0, speed); head = (head + 1) % TRAIL;
    }
    ptr.vx *= .9; ptr.vy *= .9;
    uni.uVel.value.set(Math.max(-1.5, Math.min(1.5, ptr.vx)), Math.max(-1.5, Math.min(1.5, ptr.vy)));
    if (uni.uPulse.value.z < 1) uni.uPulse.value.z = Math.min(1, uni.uPulse.value.z + dt / 1400);
    renderer.render(scene, cam);
  }
  function loop(now) {
    const dt = Math.min(50, now - last); last = now; render(dt);
    frames++; fpsT += dt; if (fpsT > 1000) { dispatchEvent(new CustomEvent("v6:field", { detail: { fps: Math.round(frames * 1000 / fpsT), count: N } })); frames = 0; fpsT = 0; }
    raf = vis && state.motion && !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function kick() { if (!raf && vis && state.motion && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } else if (!state.motion) render(16); }
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) kick(); }).observe(cv);
  document.addEventListener("visibilitychange", kick);
  new ResizeObserver(size).observe(cv);
  addEventListener("resize", safeRect);
  size();
  dispatchEvent(new CustomEvent("v6:field", { detail: { fps: 0, count: N } }));
  return { kick };
}
