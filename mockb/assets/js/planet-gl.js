/* ==========================================================================
   AI Orbit · MockB — "Orbital horizon" three.js scene
   - A planet limb rises from the bottom of the hero; fresnel atmosphere
     shifts from Evoke violet (#6F1AB6) to Evoke red (#FF0032).
   - Three inclined orbits carry satellites with fading light trails.
   - Pointer: camera parallax + a "signal ping" ripple that travels across
     the planet surface from the point under the cursor (raycast).
   - Theme-aware (dark/light), pauses off-screen, honours reduced motion.
   ========================================================================== */
import * as THREE from "../../../assets/vendor/three.module.min.js";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const C = { pri: new THREE.Color("#3D1766"), sec: new THREE.Color("#6F1AB6"), acc: new THREE.Color("#FF0032"), lav: new THREE.Color("#B98CFF") };

function mount(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { document.documentElement.classList.add("no-webgl"); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
  camera.position.set(0, 0.6, 14);

  const uniforms = {
    uTime: { value: 0 }, uHit: { value: new THREE.Vector3(0, 10, 0) }, uHitAge: { value: 10 },
    uSec: { value: C.sec }, uAcc: { value: C.acc }, uLav: { value: C.lav },
    uSurfA: { value: new THREE.Color("#0B0614") }, uSurfB: { value: new THREE.Color("#22113A") }, uLight: { value: 0 },
  };

  /* ---------- Planet ---------- */
  const R = 7.2;
  const planet = new THREE.Mesh(new THREE.SphereGeometry(R, 160, 160), new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec3 vN; varying vec3 vP; varying vec3 vW; varying vec3 vV;
      void main(){ vP = position; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform float uTime, uHitAge, uLight; uniform vec3 uHit, uSec, uAcc, uLav, uSurfA, uSurfB; varying vec3 vN; varying vec3 vP; varying vec3 vW; varying vec3 vV;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      void main(){
        vec3 n = normalize(vP);
        float lat = asin(n.y), lon = atan(n.z, n.x);
        vec2 g = vec2(lon * 60., lat * 60.);
        vec2 cell = floor(g); vec2 f = fract(g) - .5;
        float pick = step(.62, h(cell));
        float dotv = pick * smoothstep(.16, .02, length(f));
        float fr = pow(1. - max(dot(vN, vV), 0.), 2.6);
        vec3 atm = mix(uSec, uAcc, smoothstep(-.6, .7, vW.x / 7.));
        float d = distance(vW, uHit);
        float wave = smoothstep(.5, 0., abs(d - uHitAge * 3.2)) * exp(-uHitAge * .9);
        float near = exp(-d * .5) * exp(-uHitAge * .25);
        vec3 surf = mix(uSurfA, uSurfB, .35 + .35 * sin(lat * 3. + lon * 2.));
        vec3 dotsCol = mix(uLav, atm, .35);
        vec3 col = surf + dotsCol * dotv * (.18 + wave * 2.2 + near * .6) + atm * wave * .25;
        col += atm * fr * (uLight > .5 ? .45 : .95);
        gl_FragColor = vec4(col, 1.);
      }`,
  }));
  planet.position.set(5.6, -R - 0.4, -3);
  scene.add(planet);

  // Atmosphere halo (back faces, additive in dark)
  const haloMat = new THREE.ShaderMaterial({
    uniforms, transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform vec3 uSec, uAcc; uniform float uLight; varying vec3 vN; varying vec3 vW;
      void main(){ vec3 v = normalize(cameraPosition - vW); float i = pow(max(0., .72 - dot(vN, v)), 3.2); vec3 c = mix(uSec, uAcc, smoothstep(-.6,.7, vW.x/8.)); gl_FragColor = vec4(c, i * (uLight > .5 ? .45 : 1.15)); }`,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.07, 96, 96), haloMat);
  halo.position.copy(planet.position); scene.add(halo);

  /* ---------- Stars ---------- */
  const SN = 1400, sp = new Float32Array(SN * 3), ss = new Float32Array(SN);
  for (let i = 0; i < SN; i++) { sp[i * 3] = (Math.random() - .5) * 70; sp[i * 3 + 1] = Math.random() * 30 - 4; sp[i * 3 + 2] = -10 - Math.random() * 40; ss[i] = Math.random(); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); sg.setAttribute("aS", new THREE.BufferAttribute(ss, 1));
  const starMat = new THREE.ShaderMaterial({ uniforms: { uTime: uniforms.uTime, uCol: { value: new THREE.Color("#ffffff") }, uA: { value: 1 } }, transparent: true, depthWrite: false,
    vertexShader: `attribute float aS; uniform float uTime; varying float vA; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vA = .35 + .65*abs(sin(uTime*.6 + aS*40.)); gl_PointSize = (1. + aS*1.8) * (40. / -mv.z); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uCol; uniform float uA; varying float vA; void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor = vec4(uCol, smoothstep(.5,0.,d)*vA*uA); }` });
  scene.add(new THREE.Points(sg, starMat));

  /* ---------- Orbits, satellites, trails ---------- */
  const orbitGroup = new THREE.Group(); orbitGroup.position.copy(planet.position); scene.add(orbitGroup);
  const ringMat = new THREE.LineBasicMaterial({ color: C.lav, transparent: true, opacity: .22 });
  const orbits = [
    { r: R + 1.4, tilt: [1.18, 0.0, 0.42], speed: 0.16, color: C.lav, phase: 2.2 },
    { r: R + 2.8, tilt: [1.30, 0.0, 0.18], speed: 0.10, color: C.acc, phase: 2.9 },
    { r: R + 4.6, tilt: [1.10, 0.0, 0.62], speed: 0.065, color: new THREE.Color("#ffffff"), phase: 3.4 },
  ].map((o) => {
    const g = new THREE.Group(); g.rotation.set(...o.tilt); orbitGroup.add(g);
    const pts = []; for (let k = 0; k <= 256; k++) { const a = (k / 256) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * o.r, 0, Math.sin(a) * o.r)); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), new THREE.MeshBasicMaterial({ color: o.color })); g.add(sat);
    const TN = 48, tp = new Float32Array(TN * 3), ta = new Float32Array(TN);
    for (let i = 0; i < TN; i++) ta[i] = 1 - i / TN;
    const tg = new THREE.BufferGeometry(); tg.setAttribute("position", new THREE.BufferAttribute(tp, 3)); tg.setAttribute("aA", new THREE.BufferAttribute(ta, 1));
    const trail = new THREE.Line(tg, new THREE.ShaderMaterial({ uniforms: { uCol: { value: o.color } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float aA; varying float vA; void main(){ vA = aA; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 uCol; varying float vA; void main(){ gl_FragColor = vec4(uCol, vA*vA*.9); }` }));
    g.add(trail);
    return { ...o, g, sat, trail, TN };
  });

  /* ---------- Layout ---------- */
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w < 760 ? 52 : 34; camera.updateProjectionMatrix();
    const m = w < 760; planet.position.set(m ? 2.6 : 5.6, m ? -R - 5.2 : -R - 0.4, -3); halo.position.copy(planet.position); orbitGroup.position.copy(planet.position);
  }
  layout(); new ResizeObserver(layout).observe(canvas);

  /* ---------- Theme ---------- */
  function theme() {
    const light = document.documentElement.dataset.theme === "light";
    uniforms.uLight.value = light ? 1 : 0;
    uniforms.uSurfA.value.set(light ? "#EFE6FA" : "#0B0614");
    uniforms.uSurfB.value.set(light ? "#DCC9F4" : "#22113A");
    uniforms.uLav.value.set(light ? "#6F1AB6" : "#B98CFF");
    haloMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending; haloMat.needsUpdate = true;
    starMat.uniforms.uCol.value.set(light ? "#3D1766" : "#ffffff"); starMat.uniforms.uA.value = light ? .35 : 1;
    ringMat.color.set(light ? "#3D1766" : "#B98CFF"); ringMat.opacity = light ? .28 : .22;
  }
  theme(); addEventListener("themechange", theme);

  /* ---------- Pointer ---------- */
  const host = canvas.closest(".hero") || canvas.parentElement;
  const ndc = new THREE.Vector2(), tgt = new THREE.Vector2(), ray = new THREE.Raycaster();
  let lastPing = 0;
  host.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    tgt.copy(ndc);
    const now = performance.now();
    if (now - lastPing > 900) {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(planet)[0];
      if (hit) { uniforms.uHit.value.copy(hit.point); uniforms.uHitAge.value = 0; lastPing = now; }
    }
  });
  host.addEventListener("pointerleave", () => tgt.set(0, 0));

  /* ---------- Loop ---------- */
  let visible = true, t = 0, last = performance.now(), auto = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const tmp = new THREE.Vector3();
  (function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!calm) t += dt;
    uniforms.uTime.value = t;
    uniforms.uHitAge.value += dt;
    // idle ping every ~4s so the effect is discoverable on touch devices
    auto += dt; if (auto > 4.2 && performance.now() - lastPing > 3000) { auto = 0; const a = Math.random() * 1.2 - .6; uniforms.uHit.value.set(Math.sin(a) * R * .8, planet.position.y + Math.cos(a) * R * .97, 2.5); uniforms.uHitAge.value = 0; }
    const sy = Math.min(scrollY / innerHeight, 1.2);
    camera.position.x += (tgt.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (0.6 + tgt.y * 0.5 + sy * 1.4 - camera.position.y) * 0.05;
    camera.lookAt(0, -0.2 - sy * 0.8, 0);
    planet.rotation.y = t * 0.025;
    orbits.forEach((o) => {
      const a = o.phase + t * o.speed;
      o.sat.position.set(Math.cos(a) * o.r, 0, Math.sin(a) * o.r);
      const arr = o.trail.geometry.attributes.position.array;
      for (let i = 0; i < o.TN; i++) { const b = a - i * 0.012; tmp.set(Math.cos(b) * o.r, 0, Math.sin(b) * o.r); arr[i * 3] = tmp.x; arr[i * 3 + 1] = tmp.y; arr[i * 3 + 2] = tmp.z; }
      o.trail.geometry.attributes.position.needsUpdate = true;
    });
    renderer.render(scene, camera);
  })(last);
  canvas.classList.add("ready");
}

document.querySelectorAll("canvas[data-planet]").forEach(mount);
