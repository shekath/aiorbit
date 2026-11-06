/* ==========================================================================
   AI Orbit · Version 7 "Neural Ember" — WebGL neural network background.
   [data-neural7="hero"]  full-width layered network: forward-pass waves, sporadic
                          signals, backward pulses; pointer attention, hold to
                          charge, release fires a forward pass; 3D parallax.
   [data-neural7="calm"]  fewer layers, slower (sub-page heroes, CTA band).
   Network colours: #A485FF violet → #3FDCF2 cyan. Text stays readable: the
   network dims to ~12% inside the parent's first [data-safe] element.
   ========================================================================== */
import * as THREE from "../../../assets/vendor/three.module.min.js";

THREE.ColorManagement.enabled = false;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLight = () => document.documentElement.dataset.theme === "light";
const lerp = (a, b, k) => a + (b - a) * k;

const ADD = "vec4 addv(vec3 x){ float a=clamp(max(max(x.r,x.g),x.b),0.0,1.0); return vec4(x/max(a,0.0001),a); }";
const COMMON = `uniform float uTime; uniform float uCharge; uniform float uWaveT; uniform float uLight; uniform float uLayers; uniform float uPx; uniform float uHW; uniform float uD; uniform float uSpeed;
  uniform vec2 uMouse; uniform vec4 uSafe; uniform float uFloor; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uBase;
  float phaseF(){ return mod(uTime*(0.5+uCharge*1.8)*uSpeed, uLayers+2.5) - 1.0; }
  float burstF(){ float a=uTime-uWaveT; return a<4.0 ? a*3.4-0.6 : -99.0; }
  float act(float l){ return exp(-pow(phaseF()-l,2.0)*3.0)*(0.75+uCharge*0.8) + exp(-pow(burstF()-l,2.0)*4.0)*1.7; }
  float near(vec2 p){ return exp(-dot(p-uMouse,p-uMouse)/(180.0*180.0)); }
  float safeK(vec2 p){ vec2 d=max(vec2(0.0),max(uSafe.xy-p,p-uSafe.zw)); return uFloor+(1.0-uFloor)*smoothstep(0.0,120.0,length(d)); }
  vec3 grad(float x, float s){ return mix(uC1,uC2,smoothstep(0.25,0.75,s*0.85+(x/(2.0*uHW)+0.5)*0.15)); }
  ${ADD}`;
const VS_NODE = `attribute float aLayer; attribute float aSeed; ${COMMON} varying float vA; varying vec3 vCol; varying float vK;
  void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); float m=near(position.xy);
    float tw=smoothstep(0.96,1.0,sin(uTime*(0.8+aSeed*1.6)+aSeed*60.0));
    vA=act(aLayer)+m*1.3+tw*0.6; vK=safeK(position.xy); vCol=grad(position.x,aSeed);
    gl_PointSize=(8.0+aSeed*6.0+vA*14.0)*uPx*(uD/-mv.z); gl_Position=projectionMatrix*mv; }`;
const FS_NODE = `uniform float uLight; ${ADD} varying float vA; varying vec3 vCol; varying float vK;
  void main(){ float d=length(gl_PointCoord-0.5); float core=smoothstep(0.2,0.1,d); float halo=smoothstep(0.5,0.0,d)*0.5*(0.25+min(vA,1.5));
    float ring=smoothstep(0.5,0.44,d)*smoothstep(0.36,0.42,d)*0.35; float a=(core*(0.5+min(vA,1.5)*0.7)+halo+ring)*vK;
    if(uLight>0.5) gl_FragColor=vec4(vCol*0.85,a); else gl_FragColor=addv(vCol*a+vec3(1.0)*core*min(vA,1.0)*0.35*vK); }`;
const VS_EDGE = `attribute float aU; attribute float aLayer; attribute float aSeed; ${COMMON} varying float vU; varying float vL; varying float vS; varying vec2 vP;
  void main(){ vU=aU; vL=aLayer; vS=aSeed; vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const FS_EDGE = `${COMMON} varying float vU; varying float vL; varying float vS; varying vec2 vP;
  void main(){ float k=safeK(vP); float m=near(vP);
    float w=smoothstep(0.22,0.0,abs(vU-(phaseF()-vL)))*(0.8+uCharge); float b=smoothstep(0.25,0.0,abs(vU-(burstF()-vL)))*1.6;
    float h=fract(uTime*(0.25+vS*0.4)*uSpeed+vS*9.0); float gate=step(fract(floor(uTime*(0.25+vS*0.4)*uSpeed+vS*9.0)*0.61+vS*3.7),0.22+m*0.7);
    float s=smoothstep(0.12,0.0,abs(vU-h))*gate*0.9;
    float bk=smoothstep(0.1,0.0,abs(vU-(1.0-fract(uTime*0.18*uSpeed+vS*5.0))))*step(0.86,vS)*0.7;
    vec3 col=grad(vP.x,vS); float g=w+b+s+m*0.35; float base=0.11+m*0.2;
    if(uLight>0.5) gl_FragColor=vec4(mix(uBase,col,clamp(g*1.4,0.0,1.0)),(base*1.6+g*0.85)*k);
    else gl_FragColor=addv((uBase*base+col*g+uC2*bk)*k); }`;
const VS_SIG = `attribute vec3 aB; attribute float aLayer; attribute float aSeed; ${COMMON} varying float vA; varying vec3 vCol; varying float vK;
  void main(){ float t=-1.0; float boost=1.0; float tb=burstF()-aLayer; float tw=phaseF()-aLayer; float m=near(position.xy);
    float hs=fract(uTime*(0.25+aSeed*0.4)*uSpeed+aSeed*9.0); float gate=step(fract(floor(uTime*(0.25+aSeed*0.4)*uSpeed+aSeed*9.0)*0.61+aSeed*3.7),0.22+m*0.7);
    if(tb>0.0&&tb<1.0){t=tb;boost=1.8;} else if(tw>0.0&&tw<1.0){t=tw;boost=1.0+uCharge;} else if(gate>0.5){t=hs;boost=0.8;}
    vec3 p=mix(position,aB,clamp(t,0.0,1.0)); vec4 mv=modelViewMatrix*vec4(p,1.0);
    vA=t<0.0?0.0:boost*smoothstep(0.0,0.08,t)*smoothstep(1.0,0.9,t); vK=safeK(p.xy); vCol=grad(p.x,aSeed);
    gl_PointSize=(6.0+vA*10.0)*uPx*(uD/-mv.z); gl_Position=projectionMatrix*mv; }`;
const FS_SIG = `uniform float uLight; ${ADD} varying float vA; varying vec3 vCol; varying float vK;
  void main(){ if(vA<=0.001) discard; float d=length(gl_PointCoord-0.5); float a=(smoothstep(0.5,0.0,d)*0.6+smoothstep(0.14,0.04,d))*vA*vK;
    if(uLight>0.5) gl_FragColor=vec4(vCol*0.8,a); else gl_FragColor=addv(vCol*a+vec3(1.0)*smoothstep(0.1,0.0,d)*vA*0.5*vK); }`;
const VS_DUST = `attribute float aR; ${COMMON} varying float vA;
  void main(){ vec3 p=position; p.y+=sin(uTime*0.25+aR*20.0)*14.0; p.x+=cos(uTime*0.18+aR*13.0)*12.0;
    vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(1.0+aR*2.2)*uPx*(uD/-mv.z); vA=(0.18+aR*0.5)*safeK(p.xy); gl_Position=projectionMatrix*mv; }`;
const FS_DUST = `uniform vec3 uC2; uniform vec3 uBase; uniform float uLight; ${ADD} varying float vA;
  void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d)*vA; vec3 c=mix(uBase,uC2,0.5);
    if(uLight>0.5) gl_FragColor=vec4(c,a*0.5); else gl_FragColor=addv(c*a); }`;

function mount(host) {
  const mode = host.dataset.neural7 || "calm", hero = mode === "hero";
  const sect = host.parentElement, safeEl = sect.querySelector("[data-safe]");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); } catch { return; }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, 1, 8000), group = new THREE.Group(); scene.add(group);
  const U = { uTime: { value: 0 }, uCharge: { value: 0 }, uWaveT: { value: -10 }, uLight: { value: 0 }, uLayers: { value: 8 }, uPx: { value: renderer.getPixelRatio() },
    uHW: { value: 700 }, uD: { value: 1000 }, uSpeed: { value: hero ? 1 : .7 }, uMouse: { value: new THREE.Vector2(-9999, -9999) }, uSafe: { value: new THREE.Vector4() }, uFloor: { value: .12 },
    uC1: { value: new THREE.Color("#A485FF") }, uC2: { value: new THREE.Color("#3FDCF2") }, uBase: { value: new THREE.Color("#EDEDF0") } };
  const ui = hero ? { chg: sect.querySelector("[data-nn-charge]"), meter: sect.querySelector(".meter i"), layers: sect.querySelector("[data-nn-layers]"), neurons: sect.querySelector("[data-nn-neurons]") } : {};
  let mats = [], W = 0, H = 0, charge = 0, holding = false, visible = true;
  const mouse = { x: -9999, y: -9999, tx: 0, ty: 0, px: 0, py: 0 }, t0 = performance.now();

  function build() {
    const r = sect.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return;
    const D = (H / 2) / Math.tan(THREE.MathUtils.degToRad(17.5));
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.position.set(0, 0, D); camera.far = D * 4; camera.updateProjectionMatrix();
    U.uD.value = D; U.uHW.value = W / 2; const light = isLight(); U.uLight.value = light ? 1 : 0; U.uBase.value.set(light ? "#2A2A33" : "#EDEDF0");
    if (safeEl) { const c = safeEl.getBoundingClientRect(); U.uSafe.value.set(c.left - r.left - W / 2 - 20, H / 2 - (c.bottom - r.top) - 20, c.right - r.left - W / 2 + 20, H / 2 - (c.top - r.top) + 20); }
    else U.uSafe.value.set(1e5, 1e5, 1e5, 1e5);
    U.uFloor.value = W < 700 ? .2 : (hero ? .12 : .16);
    while (group.children.length) group.children.pop().geometry.dispose(); mats.forEach((m) => m.dispose()); mats = [];
    const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    const mk = (vs, fs) => { const m = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, uniforms: U, transparent: true, depthWrite: false, depthTest: false, blending: blend }); mats.push(m); return m; };
    const L = W < 700 ? 5 : hero ? (W < 1100 ? 7 : 8) : 6, per = W < 700 ? (hero ? 15 : 9) : hero ? 17 : 11; U.uLayers.value = L;
    const layers = [], span = W * 1.08;
    for (let l = 0; l < L; l++) { const x0 = -span / 2 + l * span / (L - 1), arr = [], n = per + Math.round((Math.random() - .5) * 4) - (l === 0 || l === L - 1 ? 3 : 0);
      for (let i = 0; i < n; i++) arr.push([x0 + (Math.random() - .5) * span / (L - 1) * .18, ((i + .5) / n - .5) * H * 1.05 + (Math.random() - .5) * (H / n) * .9 + Math.sin(x0 * .004 + i) * 18, (Math.random() - .5) * 200, Math.random()]);
      layers.push(arr); }
    const np = [], nl = [], ns = []; layers.forEach((arr, l) => arr.forEach((p) => { np.push(p[0], p[1], p[2]); nl.push(l); ns.push(p[3]); }));
    const ep = [], eu = [], el = [], es = [], sa = [], sb = [], sl = [], ss = [];
    for (let l = 0; l < L - 1; l++) for (const a of layers[l]) {
      const cand = layers[l + 1].map((b) => [Math.abs(b[1] - a[1]) + Math.random() * 60, b]).sort((x, y) => x[0] - y[0]), k = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < k; j++) { const b = cand[j][1], seed = Math.random(); ep.push(a[0], a[1], a[2], b[0], b[1], b[2]); eu.push(0, 1); el.push(l, l); es.push(seed, seed); sa.push(a[0], a[1], a[2]); sb.push(b[0], b[1], b[2]); sl.push(l); ss.push(seed); } }
    const geo = (attrs) => { const g = new THREE.BufferGeometry(); for (const [n, a, s] of attrs) g.setAttribute(n, new THREE.Float32BufferAttribute(a, s)); return g; };
    const dn = W < 700 ? 140 : hero ? 360 : 200, dp = [], dr = []; for (let i = 0; i < dn; i++) { dp.push((Math.random() - .5) * W * 1.4, (Math.random() - .5) * H * 1.3, -700 + Math.random() * 900); dr.push(Math.random()); }
    group.add(new THREE.Points(geo([["position", dp, 3], ["aR", dr, 1]]), mk(VS_DUST, FS_DUST)));
    group.add(new THREE.LineSegments(geo([["position", ep, 3], ["aU", eu, 1], ["aLayer", el, 1], ["aSeed", es, 1]]), mk(VS_EDGE, FS_EDGE)));
    group.add(new THREE.Points(geo([["position", sa, 3], ["aB", sb, 3], ["aLayer", sl, 1], ["aSeed", ss, 1]]), mk(VS_SIG, FS_SIG)));
    group.add(new THREE.Points(geo([["position", np, 3], ["aLayer", nl, 1], ["aSeed", ns, 1]]), mk(VS_NODE, FS_NODE)));
    if (ui.layers) ui.layers.textContent = L; if (ui.neurons) ui.neurons.textContent = np.length / 3;
    if (reduce) { U.uTime.value = 2.2; renderer.render(scene, camera); }
  }
  function tick(now) {
    const t = (now - t0) / 1000;
    charge = holding ? Math.min(1, charge + 1 / 70) : Math.max(0, charge - 1 / 30); U.uCharge.value = charge;
    if (ui.chg) ui.chg.textContent = Math.round(charge * 100) + "%"; if (ui.meter) ui.meter.style.transform = `scaleX(${charge})`;
    mouse.px = lerp(mouse.px, mouse.tx, .05); mouse.py = lerp(mouse.py, mouse.ty, .05);
    U.uMouse.value.set(lerp(U.uMouse.value.x, mouse.x, .2), lerp(U.uMouse.value.y, mouse.y, .2));
    const r = sect.getBoundingClientRect(), sc = hero ? Math.min(1, Math.max(0, -r.top / Math.max(1, H))) : 0;
    group.rotation.y = mouse.px * (hero ? .14 : .08) + Math.sin(t * .12) * .03; group.rotation.x = -mouse.py * .08 + sc * .3; group.position.y = sc * H * .3; group.position.z = -sc * 380;
    if (visible) { U.uTime.value = t; renderer.render(scene, camera); }
    requestAnimationFrame(tick);
  }
  const toWorld = (e) => { const r = sect.getBoundingClientRect(); return [e.clientX - r.left - W / 2, H / 2 - (e.clientY - r.top)]; };
  sect.addEventListener("pointermove", (e) => { const [x, y] = toWorld(e); mouse.x = x; mouse.y = y; mouse.tx = x / (W / 2); mouse.ty = y / (H / 2); });
  sect.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; mouse.tx = mouse.ty = 0; });
  sect.addEventListener("pointerdown", (e) => { if (e.target.closest("a, button, input, select, textarea, label")) return; holding = true; });
  const fire = () => { if (!holding) return; holding = false; if (charge > .12) U.uWaveT.value = (performance.now() - t0) / 1000; };
  addEventListener("pointerup", fire); addEventListener("pointercancel", fire);
  if (hero) { window.ORBIT4 = window.ORBIT4 || {}; window.ORBIT4.charge = () => charge; }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(sect);
  let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(build, 140); }).observe(sect);
  new MutationObserver(build).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  build(); document.fonts && document.fonts.ready.then(build);
  if (!reduce) requestAnimationFrame(tick);
}
document.querySelectorAll("[data-neural7]").forEach(mount);
