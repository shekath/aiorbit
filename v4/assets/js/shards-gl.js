/* ==========================================================================
   AI Orbit · Version 4 — "Monolith" WebGL (three.js)
   canvas[data-shards="hero"]  crystalline data shards: drift, pointer repel,
                               press-and-hold to charge, release to burst.
   canvas[data-shards="calm"]  fewer, slower shards (sub-page heroes, CTA).
   canvas[data-shards="core"]  the AI core crystal for the services section;
                               rotation, scale and shell driven by scroll.
   Every material fades inside the text safe zone (copy never sits on
   geometry). Theme-aware, pauses off-screen, honours reduced motion.
   ========================================================================== */
import * as THREE from "../../../assets/vendor/three.module.min.js";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLight = () => document.documentElement.dataset.theme === "light";

const SAFE = /* glsl */ `uniform vec4 uSafe[2]; uniform vec2 uRes;
  // fully faded across the whole text box; the feather sits outside it
  float inRect(vec4 r, vec2 uv, vec2 e){ return smoothstep(r.x - 2. * e.x, r.x, uv.x) * (1. - smoothstep(r.z, r.z + 2. * e.x, uv.x)) * smoothstep(r.y - 2. * e.y, r.y, uv.y) * (1. - smoothstep(r.w, r.w + 2. * e.y, uv.y)); }
  float safeFade(){ vec2 uv = gl_FragCoord.xy / uRes; vec2 e = vec2(56.) / uRes; return 1. - .99 * max(inRect(uSafe[0], uv, e), inRect(uSafe[1], uv, e)); }`;

// iridescent crystal shading: dark glassy body, gradient rim (violet → blue → cyan), sharp spec
const CRYSTAL_V = /* glsl */ `
  attribute vec3 aOff; attribute vec4 aRot; attribute float aScale; attribute float aSeed;
  uniform float uTime, uCharge, uBurst; uniform vec3 uPtr; uniform float uPtrOn;
  varying vec3 vN, vV; varying float vSeed, vHeat;
  vec3 rot(vec3 v, vec4 q){ return v + 2. * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
  vec4 qAxis(vec3 a, float t){ return vec4(normalize(a) * sin(t * .5), cos(t * .5)); }
  void main(){
    float t = uTime;
    vec4 q = qAxis(aRot.xyz, aRot.w + t * (.15 + aSeed * .35) * (1. + uCharge * 4.));
    vec3 p = rot(position * aScale, q);
    vec3 o = aOff + vec3(sin(t * .2 + aSeed * 9.) * .25, cos(t * .17 + aSeed * 7.) * .25, 0.);
    // hold-to-charge: pull toward the pointer with a tremble; release: burst outward
    vec3 toP = uPtr - o;
    o += toP * uCharge * .32 * (.4 + .6 * aSeed) + vec3(sin(t * 60. + aSeed * 99.), cos(t * 53. + aSeed * 71.), 0.) * .04 * uCharge;
    o += normalize(o - uPtr + 1e-4) * uBurst * (2.5 + 4. * aSeed);
    // pointer repel
    vec3 d = o - uPtr; float dl = length(d.xy);
    o.xy += normalize(d.xy + 1e-4) * smoothstep(2.6, 0., dl) * 1.1 * uPtrOn * (1. - uCharge);
    vHeat = smoothstep(2.4, 0., dl) * uPtrOn + uCharge * .6 + uBurst * .8;
    vec4 mv = modelViewMatrix * vec4(o + p, 1.);
    vN = normalize(normalMatrix * rot(normal, q)); vV = normalize(-mv.xyz); vSeed = aSeed;
    gl_Position = projectionMatrix * mv;
  }`;
const CRYSTAL_F = /* glsl */ SAFE + `
  uniform float uLight; varying vec3 vN, vV; varying float vSeed, vHeat;
  void main(){
    vec3 n = normalize(vN), v = normalize(vV);
    float fr = pow(1. - abs(dot(n, v)), 2.4);
    vec3 L = normalize(vec3(.5, .8, .6)); float dif = max(dot(n, L), 0.);
    float spec = pow(max(dot(reflect(-L, n), v), 0.), 48.);
    vec3 A = vec3(.643, .522, 1.), B = vec3(.424, .51, 1.), C = vec3(.247, .863, .949);
    float k = clamp(n.y * .5 + .5 + (vSeed - .5) * .4, 0., 1.);
    vec3 grad = k < .5 ? mix(A, B, k * 2.) : mix(B, C, k * 2. - 1.);
    vec3 body = uLight > .5 ? mix(vec3(.80, .80, .84), vec3(.62, .62, .68), dif) : mix(vec3(.05, .05, .06), vec3(.20, .20, .23), dif);
    vec3 col = body + grad * fr * (uLight > .5 ? .55 : .95) + vec3(1.) * spec * (uLight > .5 ? .5 : .85) + grad * vHeat * .35;
    gl_FragColor = vec4(col, (.92 - (uLight > .5 ? .1 : 0.)) * safeFade());
  }`;

function mount(canvas) {
  const mode = canvas.dataset.shards || "hero";
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 1, .1, 100);
  cam.position.set(0, 0, 16);
  const host = canvas.parentElement;
  const safeEls = [...host.querySelectorAll("[data-safe]")].slice(0, 2);
  const U = { uTime: { value: 0 }, uCharge: { value: 0 }, uBurst: { value: 0 }, uPtr: { value: new THREE.Vector3(99, 99, 0) }, uPtrOn: { value: 0 }, uLight: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) }, uSafe: { value: [new THREE.Vector4(-1, -1, -1, -1), new THREE.Vector4(-1, -1, -1, -1)] } };

  /* ---------- Shards (hero / calm) ---------- */
  let mesh = null, sparks = null;
  if (mode === "hero" || mode === "calm") {
    const small = innerWidth < 760;
    const N = mode === "hero" ? (small ? 70 : 150) : (small ? 30 : 60);
    const base = new THREE.OctahedronGeometry(1, 0); base.scale(.22, 1, .07); // a thin, sharp blade
    const g = new THREE.InstancedBufferGeometry(); g.index = base.index; g.attributes.position = base.attributes.position; g.attributes.normal = base.attributes.normal;
    const off = new Float32Array(N * 3), rot = new Float32Array(N * 4), sc = new Float32Array(N), sd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // bias toward the right/upper field so copy (bottom-left) stays clear
      const x = (Math.random() * 1.15 - .25) * (small ? 7 : 14), y = (Math.random() * 1.6 - .55) * 5.5, z = (Math.random() - .5) * 8;
      off.set([x, y, z], i * 3); rot.set([Math.random() - .5, Math.random() - .5, Math.random() - .5, Math.random() * 6.28], i * 4);
      sc[i] = (.35 + Math.pow(Math.random(), 2.2) * 1.6) * (mode === "calm" ? .8 : 1); sd[i] = Math.random();
    }
    g.setAttribute("aOff", new THREE.InstancedBufferAttribute(off, 3)); g.setAttribute("aRot", new THREE.InstancedBufferAttribute(rot, 4));
    g.setAttribute("aScale", new THREE.InstancedBufferAttribute(sc, 1)); g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(sd, 1));
    g.instanceCount = N;
    mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: U, vertexShader: CRYSTAL_V, fragmentShader: CRYSTAL_F, transparent: true }));
    mesh.frustumCulled = false; scene.add(mesh);
    // spark streaks
    const SN = mode === "hero" ? 220 : 90, sp = new Float32Array(SN * 3), ss = new Float32Array(SN);
    for (let i = 0; i < SN; i++) { sp.set([(Math.random() - .3) * 18, (Math.random() - .5) * 11, (Math.random() - .5) * 8], i * 3); ss[i] = Math.random(); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); sg.setAttribute("aS", new THREE.BufferAttribute(ss, 1));
    sparks = new THREE.Points(sg, new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float aS; uniform float uTime, uBurst; varying float vA, vS; void main(){ vec3 p = position; p.x += mod(uTime * (.3 + aS) + aS * 20., 18.) - 9.; p += normalize(p + 1e-3) * uBurst * 3.;
        vec4 mv = modelViewMatrix * vec4(p, 1.); vS = aS; vA = .3 + .7 * abs(sin(uTime * (1. + aS * 3.) + aS * 40.)); gl_PointSize = (1. + aS * 2.) * (30. / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: SAFE + `uniform float uLight; varying float vA, vS; void main(){ vec2 c = gl_PointCoord - .5; float d = length(c * vec2(1., 4.)); if (d > .5) discard;
        vec3 col = mix(vec3(.64, .52, 1.), vec3(.25, .86, .95), vS); if (uLight > .5) col = mix(vec3(.42, .24, .94), vec3(.04, .5, .62), vS); gl_FragColor = vec4(col, smoothstep(.5, 0., d) * vA * .8 * safeFade()); }` }));
    scene.add(sparks);
  }

  /* ---------- AI core (services) ---------- */
  let core = null, shell = null, ring = null;
  if (mode === "core") {
    const cg = new THREE.IcosahedronGeometry(2.2, 1);
    const CU = { ...U, uGlow: { value: 0 } };
    core = new THREE.Mesh(cg, new THREE.ShaderMaterial({ uniforms: CU, transparent: true,
      vertexShader: `varying vec3 vN, vV, vP; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: SAFE + `uniform float uTime, uLight, uGlow; varying vec3 vN, vV, vP; void main(){
        vec3 n = normalize(vN); float fr = pow(1. - abs(dot(n, normalize(vV))), 2.2); float dif = max(dot(n, normalize(vec3(.4, .8, .5))), 0.);
        float k = clamp(vP.y / 4.4 + .5, 0., 1.); vec3 grad = k < .5 ? mix(vec3(.643, .522, 1.), vec3(.424, .51, 1.), k * 2.) : mix(vec3(.424, .51, 1.), vec3(.247, .863, .949), k * 2. - 1.);
        float scan = smoothstep(.04, 0., abs(fract(vP.y * .9 - uTime * .25) - .5)) * .5;
        vec3 body = uLight > .5 ? mix(vec3(.82), vec3(.6), dif) : mix(vec3(.03), vec3(.16), dif);
        vec3 col = body + grad * (fr * 1.1 + scan * (.4 + uGlow)) + grad * uGlow * .25;
        gl_FragColor = vec4(col, .96 * safeFade()); }` }));
    core.material.flatShading = true; core.material.extensions = { derivatives: true };
    scene.add(core);
    shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.1, 1)), new THREE.ShaderMaterial({ uniforms: CU, transparent: true, depthWrite: false,
      vertexShader: `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: SAFE + `uniform float uLight, uGlow; void main(){ vec3 c = uLight > .5 ? vec3(.24, .3, .85) : vec3(.62, .66, 1.); gl_FragColor = vec4(c, (.12 + uGlow * .3) * safeFade()); }` }));
    scene.add(shell);
    const rp = []; for (let k = 0; k < 180; k++) { const a0 = k / 180 * Math.PI * 2, len = k % 15 === 0 ? .35 : .12; rp.push(Math.cos(a0) * 4.2, Math.sin(a0) * 4.2, 0, Math.cos(a0) * (4.2 + len), Math.sin(a0) * (4.2 + len), 0); }
    const rg = new THREE.BufferGeometry(); rg.setAttribute("position", new THREE.Float32BufferAttribute(rp, 3));
    ring = new THREE.LineSegments(rg, shell.material); scene.add(ring);
    core.userData.CU = CU;
  }

  /* ---------- Layout, theme ---------- */
  const layout = () => { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; renderer.setSize(w, h, false); U.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio()); cam.aspect = w / h; cam.fov = w < 760 ? 58 : 36; cam.updateProjectionMatrix(); };
  layout(); new ResizeObserver(layout).observe(canvas);
  const theme = () => { U.uLight.value = (isLight() !== !!canvas.closest(".band-inv")) ? 1 : 0; if (sparks) { sparks.material.blending = U.uLight.value ? THREE.NormalBlending : THREE.AdditiveBlending; sparks.material.needsUpdate = true; } };
  theme(); addEventListener("themechange", theme);

  /* ---------- Pointer: repel, hold to charge, release to burst ---------- */
  const ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), ray = new THREE.Raycaster(), hit = new THREE.Vector3();
  let on = 0, holding = false, holdT = 0;
  const toNdc = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); };
  host.addEventListener("pointermove", (e) => { toNdc(e); on = 1; });
  host.addEventListener("pointerleave", () => { on = 0; holding = false; });
  if (mode === "hero" && !calm) {
    host.addEventListener("pointerdown", (e) => { if (e.target.closest("a, button")) return; toNdc(e); holding = true; holdT = 0; });
    addEventListener("pointerup", () => { if (holding && U.uCharge.value > .25) U.uBurst.value = U.uCharge.value; holding = false; });
    host.addEventListener("keydown", (e) => { if (e.key === " " && e.target === host) { e.preventDefault(); U.uBurst.value = 1; } });
  }
  window.ORBIT4 = window.ORBIT4 || {}; if (mode === "hero") window.ORBIT4.charge = () => U.uCharge.value;

  /* ---------- Loop ---------- */
  let visible = true, t = 0, last = performance.now(), prog = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  (function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, .05); last = now; if (!calm) t += dt;
    U.uTime.value = t;
    const r = canvas.getBoundingClientRect();
    safeEls.forEach((el, i) => { const b = el.getBoundingClientRect(); U.uSafe.value[i].set((b.left - r.left) / r.width, 1 - (b.bottom - r.top) / r.height, (b.right - r.left) / r.width, 1 - (b.top - r.top) / r.height); });
    ray.setFromCamera(ndc, cam); if (ray.ray.intersectPlane(plane, hit)) U.uPtr.value.lerp(hit, .2);
    U.uPtrOn.value += (on - U.uPtrOn.value) * .08;
    if (holding) { holdT += dt; U.uCharge.value = Math.min(1, holdT / 1.3); } else U.uCharge.value += (0 - U.uCharge.value) * .2;
    U.uBurst.value *= Math.pow(.18, dt);
    if (mesh) { const sy = Math.min(Math.max(-r.top / (r.height || 1), 0), 1.2); mesh.position.y = sy * 3; mesh.rotation.y = (ndc.x * .08) * U.uPtrOn.value; if (sparks) sparks.position.y = sy * 4; }
    if (core) {
      // progress through the pinned services section drives the core
      const sec = canvas.closest("[data-core-progress]"); if (sec) { const sr = sec.getBoundingClientRect(); prog = Math.min(Math.max(-sr.top / Math.max(sec.offsetHeight - innerHeight, 1), 0), 1); }
      const small = canvas.clientWidth < 760;
      const enter = Math.min(prog / .22, 1), ease = 1 - Math.pow(1 - enter, 3);
      core.position.set(0, (1 - ease) * 7, 0); core.scale.setScalar((small ? .6 : 1) * (.55 + .45 * ease));
      core.rotation.set(t * .12 + prog * 2.4 + ndc.y * .2 * U.uPtrOn.value, t * .18 + prog * 4 + ndc.x * .3 * U.uPtrOn.value, prog * .6);
      shell.position.copy(core.position); shell.scale.copy(core.scale); shell.rotation.set(-core.rotation.x * .6, -core.rotation.y * .5, 0);
      ring.position.copy(core.position); ring.scale.copy(core.scale); ring.rotation.z = -t * .05 - prog * 1.5;
      core.userData.CU.uGlow.value = Math.min(Math.max((prog - .45) / .3, 0), 1);
    }
    renderer.render(scene, cam);
  })(last);
}

document.querySelectorAll("canvas[data-shards]").forEach(mount);
