/* ==========================================================================
   AI Orbit · Version 3 — "Neural Aurora" WebGL (three.js)
   mode "hero":   deep-space backdrop + neural planet (graticule, sharp limb,
                  instrument ring) + agent orbits
   mode "aurora": deep-space backdrop only (CTA, sub-page heroes)
   A text safe zone keeps stars and nebula out from behind copy.
   Interactions: cursor-following aurora light, neuron activation near the
   cursor, click/tap shockwave across the network, globe follows the pointer,
   scroll parallax. Theme-aware; pauses off-screen; honours reduced motion.
   ========================================================================== */
import * as THREE from "../../../assets/vendor/three.module.min.js";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLight = () => document.documentElement.dataset.theme === "light";

const AURORA_FRAG = /* glsl */ `
  // Deep-space backdrop: edge nebulae + three parallax star layers + bright
  // stars with diffraction spikes + an occasional shooting star.
  // uSafe (uv rect: x0, y0, x1, y1) is the text area — stars and nebula are
  // suppressed there so copy always sits on a calm, solid background.
  uniform vec2 uRes; uniform vec2 uMouse; uniform float uTime, uLight, uScroll, uPR, uMotion;
  uniform vec4 uSafe;
  varying vec2 vUv;
  float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.02; a*=.5; } return v; }
  // one star layer; p in CSS pixels, cell = grid size in px
  float stars(vec2 p, float cell, float keep, float seed, float t){
    vec2 g = p / cell, i = floor(g), f = fract(g);
    float r = h(i + seed); if (r < keep) return 0.;
    vec2 o = .2 + .6 * vec2(h(i + seed + 1.7), h(i + seed + 4.1));
    vec2 d = (f - o) * cell;                       // offset in px
    float sz = .55 + 1.1 * h(i + seed + 2.3);      // radius in px
    float core = exp(-dot(d, d) / (sz * sz));
    float bright = step(.9935, r);                 // a few hero stars get spikes
    float spike = bright * (exp(-abs(d.x) * 1.6) * exp(-abs(d.y) * .09) + exp(-abs(d.y) * 1.6) * exp(-abs(d.x) * .09)) * .55;
    float tw = .65 + .35 * sin(t * (1.2 + 2.5 * h(i + seed + 9.)) + r * 60.);
    return (core * (.55 + .9 * bright) + spike) * tw;
  }
  void main(){
    vec2 uv = vUv; float ar = uRes.x / uRes.y; vec2 css = gl_FragCoord.xy / uPR;
    float t = uTime;
    // text safe zone (feathered)
    float fx = 18. / (uRes.x / uPR), fy = 18. / (uRes.y / uPR);
    float safe = smoothstep(uSafe.x - fx * 4., uSafe.x + fx, uv.x) * (1. - smoothstep(uSafe.z - fx, uSafe.z + fx * 4., uv.x))
               * smoothstep(uSafe.y - fy * 4., uSafe.y + fy, uv.y) * (1. - smoothstep(uSafe.w - fy, uSafe.w + fy * 4., uv.y));
    // nebulae hugging the edges (violet top-left, cyan bottom-right)
    vec2 q = vec2(uv.x * ar, uv.y);
    float neb = fbm(q * 2.2 + vec2(t * .01, -t * .006)) ;
    float edge = smoothstep(.25, .95, length((uv - .5) * vec2(1.25, 1.)) * 1.55);
    float nV = edge * smoothstep(.55, -.05, uv.x - uv.y * .6 + uScroll * .2) * smoothstep(.35, .85, neb);
    float nC = edge * smoothstep(.5, 1.15, uv.x * .7 + (1. - uv.y) * .6) * smoothstep(.3, .82, neb);
    vec3 V = vec3(.55, .40, 1.), C = vec3(.15, .78, .95), B = vec3(.35, .45, 1.);
    vec3 bg = mix(vec3(.027, .024, .043), vec3(.965, .965, .976), uLight);
    // pointer light: a soft cool glow that follows the cursor
    float pl = exp(-pow(length((uv - uMouse) * vec2(ar, 1.)) / .38, 2.)) * .35;
    vec3 col;
    float calm = 1. - .9 * safe;
    if (uLight < .5) {
      col = bg + (V * nV * .55 + C * nC * .5 + B * pl * .35) * (1. - .75 * safe);
      vec2 par = (uMouse - .5) * vec2(uRes.x, uRes.y) / uPR;
      float sc = uScroll * 220.;
      float st = stars(css + par * .010 + vec2(0., sc * .2), 22., .9, 1., t) * .55
               + stars(css + par * .022 + vec2(0., sc * .45), 40., .86, 7., t) * .9
               + stars(css + par * .040 + vec2(0., sc * .8), 72., .82, 13., t) * 1.25;
      vec3 sc3 = mix(vec3(.86, .88, 1.), vec3(.72, .85, 1.), h(floor(css / 74.)));
      col += sc3 * st * calm;
      // shooting star every ~9s (disabled when motion is reduced)
      float k = floor(t / 9.), ph = fract(t / 9.);
      vec2 a0 = vec2(.25 + .6 * h(vec2(k, 3.)), .78 + .18 * h(vec2(k, 7.)));
      vec2 dir = normalize(vec2(-1., -.42));
      vec2 head = a0 + dir * ph * 1.4;
      vec2 rel = (uv - head) * vec2(ar, 1.);
      float along = dot(rel, vec2(dir.x * ar, dir.y) / length(vec2(dir.x * ar, dir.y)));
      float across = length(rel - along * vec2(dir.x * ar, dir.y) / length(vec2(dir.x * ar, dir.y)));
      float tail = smoothstep(-.16, 0., along) * step(along, 0.) * exp(-across * uRes.y / uPR * .9);
      col += vec3(.85, .92, 1.) * tail * step(ph, .22) * smoothstep(0., .03, ph) * uMotion * calm;
      col = mix(col, bg, safe * .35);
    } else {
      vec3 VL = vec3(.42, .28, .93), CL = vec3(.04, .5, .62);
      col = bg;
      col = mix(col, VL, nV * .18 * (1. - .8 * safe));
      col = mix(col, CL, nC * .16 * (1. - .8 * safe));
      vec2 par = (uMouse - .5) * vec2(uRes.x, uRes.y) / uPR;
      float st = stars(css + par * .02, 36., .9, 7., t) * .6 + stars(css + par * .04, 70., .86, 13., t);
      col = mix(col, vec3(.2, .2, .42), clamp(st, 0., 1.) * .55 * calm);
    }
    // vignette (dark only)
    col *= 1. - .35 * smoothstep(.6, 1.25, length(uv - .5) * 1.4) * (1. - uLight);
    gl_FragColor = vec4(col, 1.);
  }`;


const SAFE_GLSL = `uniform vec4 uSafe; uniform vec2 uRes;
  float safeFade(){ vec2 uv = gl_FragCoord.xy / uRes; vec2 e = vec2(36.) / uRes;
    float inside = smoothstep(uSafe.x - e.x, uSafe.x + e.x, uv.x) * (1. - smoothstep(uSafe.z - e.x, uSafe.z + e.x, uv.x))
                 * smoothstep(uSafe.y - e.y, uSafe.y + e.y, uv.y) * (1. - smoothstep(uSafe.w - e.y, uSafe.w + e.y, uv.y));
    return 1. - .94 * inside; }`;

function mount(canvas) {
  const mode = canvas.dataset.neural || "hero";
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" }); }
  catch (e) { canvas.classList.add("no-gl"); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.autoClear = false;

  /* ---------- Aurora pass ---------- */
  const aScene = new THREE.Scene(), aCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const aU = { uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(.5, .5) }, uTime: { value: 0 }, uLight: { value: 0 }, uScroll: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uMotion: { value: calm ? 0 : 1 }, uSafe: { value: new THREE.Vector4(-1, -1, -1, -1) } };
  const safeEl = canvas.parentElement.querySelector(".inner, .copy, .in");
  aScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: aU, vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`, fragmentShader: AURORA_FRAG, depthWrite: false })));

  /* ---------- Neural globe ---------- */
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 1, .1, 100);
  cam.position.set(0, 0, 11);
  const globe = new THREE.Group(); scene.add(globe);
  const nU = { uSafe: aU.uSafe, uRes: aU.uRes, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(9, 9) }, uHover: { value: 0 }, uWaveDir: { value: new THREE.Vector3(0, 0, 1) }, uWaveT: { value: 99 }, uLight: { value: 0 }, uPR: { value: renderer.getPixelRatio() } };
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
      fragmentShader: SAFE_GLSL + `uniform float uTime, uLight; varying float vT, vOff, vA, vZ, vW;
        void main(){ float p = fract(uTime * .22 + vOff); float pulse = smoothstep(.1, 0., abs(vT - p));
          vec3 c = mix(vec3(.64, .52, 1.), vec3(.25, .86, .95), vT);
          if (uLight > .5) c = mix(vec3(.25, .3, .85), vec3(.42, .24, .94), vT);
          float a = (.1 + .55 * vA + .8 * vW) * vZ + pulse * (.55 + vA) * vZ;
          gl_FragColor = vec4(c, a * (uLight > .5 ? 1.4 : 1.)); gl_FragColor.a *= safeFade(); }` }));
    globe.add(lines);
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); pg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const points = new THREE.Points(pg, new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: common + `uniform float uPR; attribute float aSeed; varying float vA, vZ, vS;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vec4 c = projectionMatrix * mv; float a = act(c) + wave(position);
          vA = a; vS = aSeed; vZ = smoothstep(-13.5, -8.6, mv.z);
          float tw = .6 + .4 * sin(uTime * 2. + aSeed * 30.);
          gl_PointSize = (1.6 + aSeed * 1.8 + a * 5.) * tw * uPR * (10. / -mv.z); gl_Position = c; }`,
      fragmentShader: SAFE_GLSL + `uniform float uLight; varying float vA, vZ, vS;
        void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard;
          vec3 c = mix(vec3(.78, .76, .9), vec3(.25, .86, .95), clamp(vA, 0., 1.));
          if (uLight > .5) c = mix(vec3(.24, .22, .4), vec3(.24, .31, .9), clamp(vA, 0., 1.));
          gl_FragColor = vec4(c, smoothstep(.5, 0., d) * (.45 + .55 * vS + vA) * vZ); gl_FragColor.a *= safeFade(); }` }));
    globe.add(points);
    // core
    const core = new THREE.Mesh(new THREE.SphereGeometry(.95, 48, 48), new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN, vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: SAFE_GLSL + `uniform float uTime, uLight; varying vec3 vN, vV; void main(){ float fr = pow(1. - max(dot(vN, vV), 0.), 2.); vec3 c = mix(vec3(.42, .51, 1.), vec3(.25, .86, .95), .5 + .5 * sin(uTime * .8));
        gl_FragColor = vec4(c, (.02 + fr * .32) * (uLight > .5 ? .6 : 1.)); gl_FragColor.a *= safeFade(); }` }));
    globe.add(core);
    // graticule: crisp latitude / longitude lines (instrument-grade wireframe)
    const grat = [];
    for (let lat = -75; lat <= 75; lat += 15) { const y = Math.sin(lat * Math.PI / 180) * R * 1.004, rr = Math.cos(lat * Math.PI / 180) * R * 1.004;
      for (let k = 0; k < 96; k++) { const a0 = k / 96 * Math.PI * 2, a1 = (k + 1) / 96 * Math.PI * 2; grat.push(Math.cos(a0) * rr, y, Math.sin(a0) * rr, Math.cos(a1) * rr, y, Math.sin(a1) * rr); } }
    for (let lon = 0; lon < 180; lon += 20) { const th = lon * Math.PI / 180;
      for (let k = 0; k < 64; k++) { const p0 = k / 64 * Math.PI * 2, p1 = (k + 1) / 64 * Math.PI * 2;
        grat.push(Math.cos(p0) * Math.cos(th) * R * 1.004, Math.sin(p0) * R * 1.004, Math.cos(p0) * Math.sin(th) * R * 1.004, Math.cos(p1) * Math.cos(th) * R * 1.004, Math.sin(p1) * R * 1.004, Math.cos(p1) * Math.sin(th) * R * 1.004); } }
    const gg = new THREE.BufferGeometry(); gg.setAttribute("position", new THREE.Float32BufferAttribute(grat, 3));
    const gratMat = new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying float vZ; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vZ = smoothstep(-13.5, -9.2, mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: SAFE_GLSL + `uniform float uLight; varying float vZ; void main(){ vec3 c = uLight > .5 ? vec3(.24, .3, .8) : vec3(.62, .66, 1.); gl_FragColor = vec4(c, (uLight > .5 ? .16 : .11) * vZ); gl_FragColor.a *= safeFade(); }` });
    globe.add(new THREE.LineSegments(gg, gratMat));
    // atmosphere: a thin, sharp limb
    const limb = new THREE.Mesh(new THREE.SphereGeometry(R * 1.035, 96, 96), new THREE.ShaderMaterial({ uniforms: nU, transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN, vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: SAFE_GLSL + `uniform float uLight; varying vec3 vN, vV; void main(){ float d = abs(dot(vN, vV)); float rim = smoothstep(.0, .18, d) * smoothstep(.34, .12, d);
        vec3 c = mix(vec3(.55, .45, 1.), vec3(.25, .86, .95), .5 + .5 * vN.x); if (uLight > .5) c = vec3(.25, .3, .85); gl_FragColor = vec4(c, rim * (uLight > .5 ? .35 : .6)); gl_FragColor.a *= safeFade(); }` }));
    globe.add(limb);
    // agent orbits
    const orbitMat = new THREE.ShaderMaterial({ uniforms: { uSafe: aU.uSafe, uRes: aU.uRes, uC: { value: new THREE.Color(0xB2AFCA) }, uO: { value: .18 } }, transparent: true, depthWrite: false,
      vertexShader: `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: SAFE_GLSL + `uniform vec3 uC; uniform float uO; void main(){ gl_FragColor = vec4(uC, uO * safeFade()); }` });
    const agents = [[3.2, [1.2, 0, .3], .32, 0x3FDCF2], [3.9, [1.35, 0, -.45], .22, 0xA485FF], [4.7, [1.05, .2, .9], .15, 0x6C82FF]].map(([r, rot, s, col], i) => {
      const g = new THREE.Group(); g.rotation.set(...rot); scene.add(g);
      const pts = []; for (let k = 0; k <= 200; k++) { const a = k / 200 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); }
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat));
      const node = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 16), new THREE.MeshBasicMaterial({ color: col, transparent: true })); g.add(node);
      const TN = 40, tp = new Float32Array(TN * 3), ta = new Float32Array(TN); for (let k = 0; k < TN; k++) ta[k] = 1 - k / TN;
      const tg = new THREE.BufferGeometry(); tg.setAttribute("position", new THREE.BufferAttribute(tp, 3)); tg.setAttribute("aA", new THREE.BufferAttribute(ta, 1));
      const trail = new THREE.Line(tg, new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color(col) }, uA: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `attribute float aA; varying float vA; void main(){ vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
        fragmentShader: SAFE_GLSL + `uniform vec3 uC; uniform float uA; varying float vA; void main(){ gl_FragColor = vec4(uC, vA * vA * uA); gl_FragColor.a *= safeFade(); }` }));
      g.add(trail);
      return { g, node, trail, r, s, ph: i * 2.1, TN, fade: 1 };
    });
    const instr = new THREE.Group(); instr.rotation.set(1.25, 0, -.12); scene.add(instr);
    const IR = R * 1.42, tk = [], ring = [];
    for (let k = 0; k < 180; k++) { const a0 = k / 180 * Math.PI * 2, len = k % 15 === 0 ? .2 : k % 5 === 0 ? .1 : .045;
      tk.push(Math.cos(a0) * IR, 0, Math.sin(a0) * IR, Math.cos(a0) * (IR + len), 0, Math.sin(a0) * (IR + len)); }
    for (let k = 0; k < 256; k++) { const a0 = k / 256 * Math.PI * 2, a1 = (k + 1) / 256 * Math.PI * 2; ring.push(Math.cos(a0) * IR, 0, Math.sin(a0) * IR, Math.cos(a1) * IR, 0, Math.sin(a1) * IR); }
    const instrMat = new THREE.ShaderMaterial({ uniforms: { uSafe: aU.uSafe, uRes: aU.uRes, uC: { value: new THREE.Color(0xB2AFCA) }, uO: { value: .42 } }, transparent: true, depthWrite: false,
      vertexShader: `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: SAFE_GLSL + `uniform vec3 uC; uniform float uO; void main(){ gl_FragColor = vec4(uC, uO * safeFade()); }` });
    const tg2 = new THREE.BufferGeometry(); tg2.setAttribute("position", new THREE.Float32BufferAttribute(tk.concat(ring), 3));
    instr.add(new THREE.LineSegments(tg2, instrMat));
    // a bright locator that sweeps the instrument ring
    const loc = new THREE.Mesh(new THREE.RingGeometry(.07, .1, 32), new THREE.MeshBasicMaterial({ color: 0x3FDCF2, side: THREE.DoubleSide, transparent: true, opacity: .95 }));
    loc.rotation.x = -Math.PI / 2; instr.add(loc);
    globe.userData = { lines, points, agents, orbitMat, R, instr, instrMat, loc, IR };
  }

  /* ---------- Layout ---------- */
  const layout = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); aU.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    cam.aspect = w / h; cam.fov = w < 760 ? 54 : 36; cam.updateProjectionMatrix();
  };
  layout(); new ResizeObserver(layout).observe(canvas);

  /* ---------- Theme ---------- */
  const theme = () => {
    const L = isLight() ? 1 : 0; aU.uLight.value = L; nU.uLight.value = L;
    [globe.userData.lines, globe.userData.points].forEach((o) => { if (o) { o.material.blending = L ? THREE.NormalBlending : THREE.AdditiveBlending; o.material.needsUpdate = true; } });
    if (globe.userData.orbitMat) { globe.userData.orbitMat.uniforms.uC.value.set(L ? 0x3D4FE6 : 0xB2AFCA); globe.userData.orbitMat.uniforms.uO.value = L ? .25 : .18; }
    if (globe.userData.instrMat) { globe.userData.instrMat.uniforms.uC.value.set(L ? 0x3D4FE6 : 0xB2AFCA); globe.userData.instrMat.uniforms.uO.value = L ? .45 : .42; globe.userData.loc.material.color.set(L ? 0x3D4FE6 : 0x3FDCF2); }
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
    if (safeEl) { const b = safeEl.getBoundingClientRect(); aU.uSafe.value.set((b.left - r.left) / r.width, 1 - (b.bottom - r.top) / r.height, (b.right - r.left) / r.width, 1 - (b.top - r.top) / r.height); }
    if (mode === "hero") {
      nU.uHover.value += (hover - nU.uHover.value) * .08;
      nU.uMouse.value.lerp(hover ? ndc : new THREE.Vector2(9, 9), hover ? .25 : .02);
      nU.uWaveT.value += dt;
      idle += dt; if (idle > 5.5 && !hover && !calm) { idle = 0; shock((Math.random() - .5) * .6, (Math.random() - .5) * .6 - .1); }
      rotY += ((tgt.x - .5) * .9 - rotY) * .04; rotX += ((.5 - tgt.y) * .5 - rotX) * .04;
      globe.rotation.y = t * .06 + rotY; globe.rotation.x = rotX;
      const small = canvas.clientWidth < 760;
      globe.position.y = (small ? -4.45 : -3.45) + aU.uScroll.value * 2.6;
      globe.scale.setScalar((small ? 1.05 : 1.3) * (1 - aU.uScroll.value * .15));
      const U = globe.userData; U.instr.position.copy(globe.position); U.instr.scale.copy(globe.scale);
      U.instr.rotation.y = -t * .03 - rotY * .4; const la = t * .35; U.loc.position.set(Math.cos(la) * U.IR, 0, Math.sin(la) * U.IR);
      globe.userData.agents.forEach((a) => {
        a.g.position.copy(globe.position); a.g.scale.copy(globe.scale);
        const ang = a.ph + t * a.s; a.node.position.set(Math.cos(ang) * a.r, 0, Math.sin(ang) * a.r);
        const arr = a.trail.geometry.attributes.position.array;
        for (let k = 0; k < a.TN; k++) { const b = ang - k * .02; tmp.set(Math.cos(b) * a.r, 0, Math.sin(b) * a.r); arr[k * 3] = tmp.x; arr[k * 3 + 1] = tmp.y; arr[k * 3 + 2] = tmp.z; }
        a.trail.geometry.attributes.position.needsUpdate = true;
        // fade the agent while it passes behind the text block
        a.node.getWorldPosition(tmp).project(cam); const su = (tmp.x + 1) / 2, sv = (tmp.y + 1) / 2, S = aU.uSafe.value;
        const behind = su > S.x - .03 && su < S.z + .03 && sv > S.y - .03 && sv < S.w + .03;
        a.fade += ((behind ? .0 : 1) - a.fade) * .12; a.node.material.opacity = a.fade; a.trail.material.uniforms.uA.value = a.fade;
      });
    }
    renderer.clear(); renderer.render(aScene, aCam);
    if (mode === "hero") { renderer.clearDepth(); renderer.render(scene, cam); }
  })(last);
  canvas.dataset.ready = "1";
}

document.querySelectorAll("canvas[data-neural]").forEach(mount);
