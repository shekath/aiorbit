/* ==========================================================================
   AI Orbit · Version 3 — "Neural Aurora" WebGL (three.js)
   mode "hero":   aurora + pixel-dot matrix + neural globe + agent orbits
   mode "aurora": aurora + pixel-dot matrix only (CTA, sub-page heroes)
   Interactions: cursor-following aurora light, neuron activation near the
   cursor, click/tap shockwave across the network, globe follows the pointer,
   scroll parallax. Theme-aware; pauses off-screen; honours reduced motion.
   ========================================================================== */
import * as THREE from "../../../assets/vendor/three.module.min.js";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLight = () => document.documentElement.dataset.theme === "light";

const AURORA_FRAG = /* glsl */ `
  uniform vec2 uRes; uniform vec2 uMouse; uniform float uTime, uLight, uScroll, uCell;
  varying vec2 vUv;
  float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*n(p); p*=2.03; a*=.5; } return v; }
  float blob(vec2 uv, vec2 c, float r){ return exp(-pow(length(uv - c) / r, 2.)); }
  void main(){
    vec2 px = gl_FragCoord.xy; vec2 uv = vUv; float ar = uRes.x / uRes.y;
    vec2 q = vec2(uv.x * ar, uv.y);
    float t = uTime * .06;
    vec2 w = vec2(fbm(q * 1.4 + t), fbm(q * 1.4 - t + 3.1)) - .5;
    q += w * .35;
    vec2 m = vec2(uMouse.x * ar, uMouse.y);
    float bV = blob(q, vec2(.04 * ar + .05 * sin(t * 3.), 1.04 - uScroll * .25), .5);
    float bB = blob(q, mix(vec2(.5 * ar, -.12), m, .35), .42) * .8;
    float bC = blob(q, vec2(.98 * ar + .04 * cos(t * 2.), -.02 + uScroll * .25), .5);
    vec3 V = vec3(.643, .522, 1.), B = vec3(.424, .51, 1.), C = vec3(.247, .863, .949);
    vec3 bg = mix(vec3(.043, .039, .063), vec3(.965, .965, .976), uLight);
    vec3 glow = V * bV + B * bB * 1.1 + C * bC * .9;
    float g = clamp(bV + bB + bC, 0., 1.6);
    vec3 col = uLight > .5 ? mix(bg, mix(bg, glow, .34), clamp(g, 0., 1.)) : bg + glow * .3;
    // pixel-dot matrix: dots grow and brighten inside the light and near the cursor
    vec2 cell = px / uCell; vec2 f = fract(cell) - .5; float d = length(f);
    float near = exp(-pow(length((uv - uMouse) * vec2(ar, 1.)) / .16, 2.));
    float r = .06 + .24 * clamp(g * .8 + near, 0., 1.) * (.5 + .5 * h(floor(cell)));
    float dotm = smoothstep(r, r - .08, d);
    vec3 dotc = uLight > .5 ? mix(vec3(.24, .31, .9), vec3(.42, .24, .94), uv.x) : mix(B, C, uv.x);
    if (uLight < .5) col += dotm * dotc * (.015 + .42 * g + .7 * near);
    else col = mix(col, dotc, dotm * (.012 + .16 * g + .32 * near) * (uRes.x < 1200. ? .6 : 1.));
    col *= 1. - .25 * smoothstep(.55, 1.2, length(uv - .5) * 1.4) * (1. - uLight);
    gl_FragColor = vec4(col, 1.);
  }`;

function mount(canvas) {
  const mode = canvas.dataset.neural || "hero";
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" }); }
  catch (e) { canvas.classList.add("no-gl"); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.autoClear = false;

  /* ---------- Aurora pass ---------- */
  const aScene = new THREE.Scene(), aCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const aU = { uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(.5, .5) }, uTime: { value: 0 }, uLight: { value: 0 }, uScroll: { value: 0 }, uCell: { value: 7 } };
  aScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: aU, vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`, fragmentShader: AURORA_FRAG, depthWrite: false })));

  /* ---------- Neural globe ---------- */
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 1, .1, 100);
  cam.position.set(0, 0, 11);
  const globe = new THREE.Group(); scene.add(globe);
  const nU = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(9, 9) }, uHover: { value: 0 }, uWaveDir: { value: new THREE.Vector3(0, 0, 1) }, uWaveT: { value: 99 }, uLight: { value: 0 }, uPR: { value: renderer.getPixelRatio() } };
  if (mode === "hero") {
    const N = innerWidth < 760 ? 420 : 700, R = 2.35, pos = new Float32Array(N * 3), seed = new Float32Array(N), P = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = ga * i, j = 1 + (Math.random() - .5) * .08;
      const v = new THREE.Vector3(Math.cos(th) * rr * R * j, y * R * j, Math.sin(th) * rr * R * j);
      P.push(v); pos.set([v.x, v.y, v.z], i * 3); seed[i] = Math.random();
    }
    // synapses: each neuron to its 3 nearest neighbours
    const seg = [], tAttr = [], oAttr = [], seen = new Set();
    for (let i = 0; i < N; i++) {
      const d = []; for (let k = 0; k < N; k++) if (k !== i) d.push([P[i].distanceToSquared(P[k]), k]);
      d.sort((a, b) => a[0] - b[0]);
      for (let m = 0; m < 3; m++) { const k = d[m][1], key = i < k ? i + "-" + k : k + "-" + i; if (seen.has(key)) continue; seen.add(key);
        seg.push(P[i].x, P[i].y, P[i].z, P[k].x, P[k].y, P[k].z); tAttr.push(0, 1); const o = Math.random(); oAttr.push(o, o); }
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    lg.setAttribute("aT", new THREE.Float32BufferAttribute(tAttr, 1));
    lg.setAttribute("aOff", new THREE.Float32BufferAttribute(oAttr, 1));
    const common = `uniform float uTime, uHover, uWaveT, uLight; uniform vec2 uMouse; uniform vec3 uWaveDir;
      float act(vec4 clip){ vec2 ndc = clip.xy / clip.w; return smoothstep(.42, 0., distance(ndc * vec2(1.6, 1.), uMouse * vec2(1.6, 1.))) * uHover; }
      float wave(vec3 p){ float a = acos(clamp(dot(normalize(p), uWaveDir), -1., 1.)); return smoothstep(.22, 0., abs(a - uWaveT * 2.2)) * exp(-uWaveT * 1.2); }`;
    const lines = new THREE.LineSegments(lg, new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: common + `attribute float aT, aOff; varying float vT, vOff, vA, vZ, vW;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vec4 c = projectionMatrix * mv; vT = aT; vOff = aOff; vA = act(c); vW = wave(position); vZ = smoothstep(-13.5, -8.6, mv.z); gl_Position = c; }`,
      fragmentShader: `uniform float uTime, uLight; varying float vT, vOff, vA, vZ, vW;
        void main(){ float p = fract(uTime * .22 + vOff); float pulse = smoothstep(.1, 0., abs(vT - p));
          vec3 c = mix(vec3(.64, .52, 1.), vec3(.25, .86, .95), vT);
          if (uLight > .5) c = mix(vec3(.25, .3, .85), vec3(.42, .24, .94), vT);
          float a = (.1 + .55 * vA + .8 * vW) * vZ + pulse * (.55 + vA) * vZ;
          gl_FragColor = vec4(c, a * (uLight > .5 ? 1.4 : 1.)); }` }));
    globe.add(lines);
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); pg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const points = new THREE.Points(pg, new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: common + `uniform float uPR; attribute float aSeed; varying float vA, vZ, vS;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vec4 c = projectionMatrix * mv; float a = act(c) + wave(position);
          vA = a; vS = aSeed; vZ = smoothstep(-13.5, -8.6, mv.z);
          float tw = .6 + .4 * sin(uTime * 2. + aSeed * 30.);
          gl_PointSize = (1.6 + aSeed * 1.8 + a * 5.) * tw * uPR * (10. / -mv.z); gl_Position = c; }`,
      fragmentShader: `uniform float uLight; varying float vA, vZ, vS;
        void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard;
          vec3 c = mix(vec3(.78, .76, .9), vec3(.25, .86, .95), clamp(vA, 0., 1.));
          if (uLight > .5) c = mix(vec3(.24, .22, .4), vec3(.24, .31, .9), clamp(vA, 0., 1.));
          gl_FragColor = vec4(c, smoothstep(.5, 0., d) * (.45 + .55 * vS + vA) * vZ); }` }));
    globe.add(points);
    // core
    const core = new THREE.Mesh(new THREE.SphereGeometry(.95, 48, 48), new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN, vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform float uTime, uLight; varying vec3 vN, vV; void main(){ float fr = pow(1. - max(dot(vN, vV), 0.), 2.); vec3 c = mix(vec3(.42, .51, 1.), vec3(.25, .86, .95), .5 + .5 * sin(uTime * .8));
        gl_FragColor = vec4(c, (.02 + fr * .32) * (uLight > .5 ? .6 : 1.)); }` }));
    globe.add(core);
    // agent orbits
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xB2AFCA, transparent: true, opacity: .18 });
    const agents = [[3.2, [1.2, 0, .3], .32, 0x3FDCF2], [3.9, [1.35, 0, -.45], .22, 0xA485FF], [4.7, [1.05, .2, .9], .15, 0x6C82FF]].map(([r, rot, s, col], i) => {
      const g = new THREE.Group(); g.rotation.set(...rot); scene.add(g);
      const pts = []; for (let k = 0; k <= 200; k++) { const a = k / 200 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); }
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat));
      const node = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 16), new THREE.MeshBasicMaterial({ color: col })); g.add(node);
      const TN = 40, tp = new Float32Array(TN * 3), ta = new Float32Array(TN); for (let k = 0; k < TN; k++) ta[k] = 1 - k / TN;
      const tg = new THREE.BufferGeometry(); tg.setAttribute("position", new THREE.BufferAttribute(tp, 3)); tg.setAttribute("aA", new THREE.BufferAttribute(ta, 1));
      const trail = new THREE.Line(tg, new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color(col) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `attribute float aA; varying float vA; void main(){ vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
        fragmentShader: `uniform vec3 uC; varying float vA; void main(){ gl_FragColor = vec4(uC, vA * vA); }` }));
      g.add(trail);
      return { g, node, trail, r, s, ph: i * 2.1, TN };
    });
    globe.userData = { lines, points, agents, orbitMat, R };
  }

  /* ---------- Layout ---------- */
  const layout = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); aU.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    aU.uCell.value = 7 * renderer.getPixelRatio();
    cam.aspect = w / h; cam.fov = w < 760 ? 54 : 36; cam.updateProjectionMatrix();
  };
  layout(); new ResizeObserver(layout).observe(canvas);

  /* ---------- Theme ---------- */
  const theme = () => {
    const L = isLight() ? 1 : 0; aU.uLight.value = L; nU.uLight.value = L;
    [globe.userData.lines, globe.userData.points].forEach((o) => { if (o) { o.material.blending = L ? THREE.NormalBlending : THREE.AdditiveBlending; o.material.needsUpdate = true; } });
    if (globe.userData.orbitMat) { globe.userData.orbitMat.color.set(L ? 0x3D4FE6 : 0xB2AFCA); globe.userData.orbitMat.opacity = L ? .25 : .18; }
    renderer.setClearColor(L ? 0xF6F6F9 : 0x0B0A10, 1);
  };
  theme(); addEventListener("themechange", theme);

  /* ---------- Pointer ---------- */
  const host = canvas.parentElement, ndc = new THREE.Vector2(9, 9), tgt = new THREE.Vector2(.5, .5), ray = new THREE.Raycaster(), sph = new THREE.Sphere(new THREE.Vector3(), 2.35), hit = new THREE.Vector3();
  let hover = 0;
  const toLocal = (e) => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]; };
  host.addEventListener("pointermove", (e) => { const [x, y] = toLocal(e); tgt.set(x, y); ndc.set(x * 2 - 1, y * 2 - 1); hover = 1; });
  host.addEventListener("pointerleave", () => { hover = 0; tgt.set(.5, .5); });
  const shock = (x, y) => {
    if (mode !== "hero" || calm) return;
    ray.setFromCamera(new THREE.Vector2(x, y), cam);
    sph.center.copy(globe.position); sph.radius = 2.35 * globe.scale.x;
    if (ray.ray.intersectSphere(sph, hit)) { const local = globe.worldToLocal(hit.clone()); nU.uWaveDir.value.copy(local.normalize()); nU.uWaveT.value = 0; }
  };
  host.addEventListener("pointerdown", (e) => { const [x, y] = toLocal(e); shock(x * 2 - 1, y * 2 - 1); });

  /* ---------- Loop ---------- */
  let visible = true, t = 0, last = performance.now(), idle = 0, rotY = 0, rotX = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const tmp = new THREE.Vector3();
  (function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!calm) t += dt;
    aU.uTime.value = t; nU.uTime.value = t;
    aU.uMouse.value.lerp(tgt, .05);
    const r = canvas.getBoundingClientRect(); const sc = Math.min(Math.max(-r.top / (r.height || 1), 0), 1.2);
    aU.uScroll.value += (sc - aU.uScroll.value) * .1;
    if (mode === "hero") {
      nU.uHover.value += (hover - nU.uHover.value) * .08;
      nU.uMouse.value.lerp(hover ? ndc : new THREE.Vector2(9, 9), hover ? .25 : .02);
      nU.uWaveT.value += dt;
      idle += dt; if (idle > 5.5 && !hover && !calm) { idle = 0; shock((Math.random() - .5) * .6, (Math.random() - .5) * .6 - .1); }
      rotY += ((tgt.x - .5) * .9 - rotY) * .04; rotX += ((.5 - tgt.y) * .5 - rotX) * .04;
      globe.rotation.y = t * .06 + rotY; globe.rotation.x = rotX;
      const small = canvas.clientWidth < 760;
      globe.position.y = (small ? -2.7 : -3.05) + aU.uScroll.value * 2.6;
      globe.scale.setScalar((small ? .95 : 1.3) * (1 - aU.uScroll.value * .15));
      globe.userData.agents.forEach((a) => {
        a.g.position.copy(globe.position); a.g.scale.copy(globe.scale);
        const ang = a.ph + t * a.s; a.node.position.set(Math.cos(ang) * a.r, 0, Math.sin(ang) * a.r);
        const arr = a.trail.geometry.attributes.position.array;
        for (let k = 0; k < a.TN; k++) { const b = ang - k * .02; tmp.set(Math.cos(b) * a.r, 0, Math.sin(b) * a.r); arr[k * 3] = tmp.x; arr[k * 3 + 1] = tmp.y; arr[k * 3 + 2] = tmp.z; }
        a.trail.geometry.attributes.position.needsUpdate = true;
      });
    }
    renderer.clear(); renderer.render(aScene, aCam);
    if (mode === "hero") { renderer.clearDepth(); renderer.render(scene, cam); }
  })(last);
  canvas.dataset.ready = "1";
}

document.querySelectorAll("canvas[data-neural]").forEach(mount);
