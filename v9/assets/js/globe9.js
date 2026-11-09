/* ==========================================================================
   AI Orbit · Version 9 — hero background: WebGL globe wrapped in an AI network (three.js).
   The Version 8 mock "Option 2": a dotted globe with Evoke's seven offices and
   arcs between them, inside a shell of network nodes. Pulses run between
   neighbouring nodes, down to the offices and along the office arcs; two thin
   orbits circle the globe, each with a satellite.
   Hover lights nearby nodes and links, drag spins the globe with momentum,
   click sends a wave across the network.
   Drawn at 50% opacity (CSS .hero-globe), faded toward the headline.
   Accent #ff4c0a. Reduced motion: one still frame.
   ========================================================================== */
import * as THREE from "../../../assets/vendor/three.module.min.js";

THREE.ColorManagement.enabled = false;

const host = document.querySelector(".hero-globe");
if (host) init(host);

function init(host) {
  /* WebGL globe + AI network shell */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, hero = host.closest('.hero');
  const DPR = Math.min(2, devicePixelRatio || 1);
  let renderer; try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return; }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.setPixelRatio(DPR); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 1, .1, 100); camera.position.set(0, 0, 6.2);
  const root3 = new THREE.Group(); scene.add(root3);            // positioned/scaled into the hero
  const globe = new THREE.Group(); root3.add(globe);            // rotates (auto + drag)
  const U = { uTime: { value: 0 }, uPulse: { value: 1 }, uMouse: { value: new THREE.Vector3(9, 9, 9) }, uHot: { value: 0 }, uWaveT: { value: -10 }, uWaveP: { value: new THREE.Vector3(0, 0, 1) } };
  const PS = DPR.toFixed(1);
  // proximity + wave helpers shared by the network shaders (local space)
  const NEAR = 'uniform vec3 uMouse; uniform float uHot; uniform float uWaveT; uniform vec3 uWaveP; uniform float uTime; float near(vec3 p){ return exp(-pow(distance(p,uMouse),2.)*7.)*uHot; } float wave(vec3 p){ float a=uTime-uWaveT; if(a>2.6) return 0.; float g=acos(clamp(dot(normalize(p),normalize(uWaveP)),-1.,1.)); return smoothstep(.22,0.,abs(g-a*1.6))*(1.-a/2.6); }';

  // globe dots
  const N = 5200, pos = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  globe.add(new THREE.Points(dg, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: U,
    vertexShader: NEAR + ' varying float vF; varying float vN; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vF=clamp((normalMatrix*position).z*.5+.5,0.,1.); vN=near(position*1.32)+wave(position); gl_PointSize=(1.2+vF*1.8+vN*2.5)*(6.0/-mv.z)*' + PS + '; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'varying float vF; varying float vN; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.0,d)*(.1+pow(vF,2.)*.7+vN*.8); gl_FragColor=vec4(mix(vec3(1.),vec3(1.,.55,.35),clamp(vN,0.,1.)),a); }' })));
  const rim = new THREE.Mesh(new THREE.SphereGeometry(1.02, 64, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
    vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vN; void main(){ float f=pow(1.0-abs(vN.z),3.0); gl_FragColor=vec4(1.0,.9,.86,f*.12); }' }));
  root3.add(rim);

  // offices
  const ll = (lat, lon, r = 1) => { const a = lat * Math.PI / 180, b = -lon * Math.PI / 180; return new THREE.Vector3(Math.cos(a) * Math.cos(b) * r, Math.sin(a) * r, Math.cos(a) * Math.sin(b) * r); };
  const C = [[39.76, -84.19], [32.78, -96.8], [51.51, -.13], [51.11, 17.03], [17.39, 78.49], [12.97, 77.59], [-33.87, 151.21]].map(([a, b]) => ll(a, b, 1.005));
  const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(C.flatMap((v) => [v.x, v.y, v.z])), 3)); mg.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(C.map((_, i) => i / C.length)), 1));
  globe.add(new THREE.Points(mg, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: U,
    vertexShader: 'attribute float aSeed; uniform float uTime; varying float vP; varying float vF; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vF=step(0.0,(normalMatrix*position).z); vP=fract(uTime*.35+aSeed); gl_PointSize=40.0*' + PS + '; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'varying float vP; varying float vF; void main(){ float d=length(gl_PointCoord-.5)*2.; float core=smoothstep(.2,.1,d); float ring=smoothstep(.06,0.,abs(d-vP))*(1.-vP); gl_FragColor=vec4(1.,.298,.039,(core+ring*.9)*vF); }' })));

  // AI network shell: nodes on an outer sphere, linked to their neighbours and down to the offices
  const SR = 1.32, M = 96, nodes = [];
  for (let i = 0; i < M; i++) { const y = 1 - (i / (M - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963 + Math.sin(i) * .3; nodes.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(SR * (1 + (Math.random() - .5) * .06))); }
  const ep = [], et = [], es = [];
  const link = (a, b, seed, lift) => { const mid = a.clone().add(b).multiplyScalar(.5); if (lift) mid.setLength(Math.max(a.length(), b.length()) * lift); const cv = new THREE.QuadraticBezierCurve3(a, mid, b), pts = cv.getPoints(24);
    for (let s = 0; s < 24; s++) { ep.push(pts[s].x, pts[s].y, pts[s].z, pts[s + 1].x, pts[s + 1].y, pts[s + 1].z); et.push(s / 24, (s + 1) / 24); es.push(seed, seed); } };
  nodes.forEach((a, i) => { nodes.map((b, j) => [a.distanceTo(b), j]).filter(([d, j]) => j > i).sort((x, y) => x[0] - y[0]).slice(0, 2).forEach(([, j]) => link(a, nodes[j], Math.random(), 1.02)); });
  C.forEach((c) => { const k = nodes.map((b, j) => [b.distanceTo(c), j]).sort((x, y) => x[0] - y[0]); for (let q = 0; q < 2; q++) link(nodes[k[q][1]], c, Math.random(), 0); });
  const PAIRS = [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [0, 1], [2, 3], [5, 6], [1, 4]];
  PAIRS.forEach(([i, j]) => link(C[i], C[j], Math.random(), 1 + C[i].distanceTo(C[j]) * .28));
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ep), 3)); eg.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(et), 1)); eg.setAttribute('aS', new THREE.BufferAttribute(new Float32Array(es), 1));
  globe.add(new THREE.LineSegments(eg, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: U,
    vertexShader: NEAR + ' attribute float aT; attribute float aS; varying float vT; varying float vS; varying float vF; varying float vN; void main(){ vT=aT; vS=aS; vF=clamp((normalMatrix*position).z*1.6+.55,0.,1.); vN=near(position)+wave(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform float uTime; uniform float uPulse; varying float vT; varying float vS; varying float vF; varying float vN; void main(){ float sp=.18+vN*.6; float h=fract(uTime*sp+vS*3.1)*1.25; float on=step(fract(vS*7.3+floor(uTime*sp+vS*3.1)*.37),.45+vN); float p=smoothstep(.2,0.,h-vT)*step(vT,h)*uPulse*on; vec3 c=mix(vec3(1.),vec3(1.,.298,.039),clamp(p+vN*.6,0.,1.)); gl_FragColor=vec4(c,(.12+vN*.4+p*1.8)*vF); }' })));
  // shell nodes
  const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodes.flatMap((v) => [v.x, v.y, v.z])), 3)); ng.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(nodes.map(() => Math.random())), 1));
  globe.add(new THREE.Points(ng, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: U,
    vertexShader: NEAR + ' attribute float aSeed; varying float vF; varying float vN; varying float vB; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vF=clamp((normalMatrix*position).z*1.4+.6,0.,1.); vN=near(position)+wave(position); vB=smoothstep(.93,1.,sin(uTime*(.8+aSeed)+aSeed*40.)); gl_PointSize=(5.0+vN*10.+vB*4.)*(6.0/-mv.z)*' + PS + '; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'varying float vF; varying float vN; varying float vB; void main(){ float d=length(gl_PointCoord-.5); float core=smoothstep(.22,.1,d); float halo=smoothstep(.5,0.,d)*.4*(.3+vN+vB); vec3 c=mix(vec3(1.),vec3(1.,.45,.2),clamp(vN+vB*.6,0.,1.)); gl_FragColor=vec4(c,(core*(.45+vN)+halo)*vF); }' })));
  // two thin orbit rings
  const rings = new THREE.Group(); root3.add(rings);
  [[1.5, .5, .2], [1.62, -.35, -.5]].forEach(([r, tx, tz]) => { const pts = new THREE.EllipseCurve(0, 0, r, r).getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .16 })); l.rotation.set(Math.PI / 2 + tx, 0, tz); rings.add(l);
    const sat = new THREE.Mesh(new THREE.SphereGeometry(.018, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff4c0a })); sat.userData = { r, tx, tz, a: Math.random() * 6 }; rings.add(sat); });

  // place into the hero
  let W = 0, H = 0;
  const size = () => { const r = hero.getBoundingClientRect(); W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
    const narrow = W < 900, vh = 2 * Math.tan(THREE.MathUtils.degToRad(16)) * camera.position.z, vw = vh * camera.aspect;
    const s = narrow ? Math.min(vw * .42, vh * .26) : vh * .34; root3.scale.setScalar(s); root3.position.set(narrow ? vw * .18 : vw * .2, narrow ? -vh * .14 : -vh * .02, 0); };
  size(); new ResizeObserver(size).observe(hero);

  // pointer: hover lights the network, drag spins the globe, click sends a wave
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3(), sph = new THREE.Sphere();
  let rotY = 1.2, rotX = .38, vY = 0, vX = 0, drag = null, moved = 0, hot = 0, hotT = 0;
  const pick = (e) => { const r = hero.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
    root3.updateMatrixWorld(); sph.set(root3.position, root3.scale.x * SR); return ray.ray.intersectSphere(sph, hit) ? globe.worldToLocal(hit.clone()) : null; };
  hero.addEventListener('pointermove', (e) => { const p = pick(e); if (p) { U.uMouse.value.copy(p); hotT = 1; hero.style.cursor = drag ? 'grabbing' : 'grab'; } else { hotT = 0; hero.style.cursor = ''; }
    if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); vY = dx * .005; vX = dy * .003; rotY += vY; rotX = Math.max(-.6, Math.min(1.1, rotX + vX)); drag = { x: e.clientX, y: e.clientY }; } });
  hero.addEventListener('pointerleave', () => { hotT = 0; });
  hero.addEventListener('pointerdown', (e) => { if (e.target.closest('a, button')) return; if (!pick(e)) return; drag = { x: e.clientX, y: e.clientY }; moved = 0; });
  addEventListener('pointerup', (e) => { if (!drag) return; drag = null; if (moved < 6) { const p = pick(e); if (p) { U.uWaveP.value.copy(p); U.uWaveT.value = U.uTime.value; } } });
  host.style.pointerEvents = 'none';

  const t0 = performance.now(); let vis = true; new IntersectionObserver(([en]) => { vis = en.isIntersecting; }).observe(hero);
  const frame = (now) => { const t = (now - t0) / 1000; U.uTime.value = reduce ? 2.4 : t;
    hot += (hotT - hot) * .08; U.uHot.value = hot;
    if (!drag) { vY *= .95; vX *= .92; rotY += vY + (reduce ? 0 : .0011); }
    globe.rotation.set(rotX, rotY, -.12);
    rings.children.forEach((o) => { if (o.userData.r) { o.userData.a += .006; const a = o.userData.a, v = new THREE.Vector3(Math.cos(a) * o.userData.r, Math.sin(a) * o.userData.r, 0); v.applyEuler(new THREE.Euler(Math.PI / 2 + o.userData.tx, 0, o.userData.tz)); o.position.copy(v); } });
    rings.rotation.y = t * .05;
    if (vis) renderer.render(scene, camera); if (!reduce) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}
