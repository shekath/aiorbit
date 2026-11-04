/* ==========================================================================
   AI Orbit — WebGL orbital system (hero background)
   - ~9k particles on Keplerian orbits (inner bodies move faster)
   - Mouse acts as a gravity well: particles near the cursor are pushed
     outward and lit with the accent colour; the scene parallax-tilts.
   - Respects prefers-reduced-motion and theme changes.
   ========================================================================== */
import * as THREE from "../vendor/three.module.min.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function cssColor(name) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || "#ffffff");
}

export function mountOrbit(canvas, opts = {}) {
  const variant = opts.variant || "hero"; // "hero" | "page"
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const system = new THREE.Group();
  scene.add(system);

  /* ---------- Particle belt ---------- */
  const COUNT = variant === "hero" ? 9000 : 5000;
  const aRadius = new Float32Array(COUNT);
  const aAngle = new Float32Array(COUNT);
  const aSpeed = new Float32Array(COUNT);
  const aY = new Float32Array(COUNT);
  const aSize = new Float32Array(COUNT);
  const aSeed = new Float32Array(COUNT);
  const bands = [1.6, 2.6, 3.7, 5.0, 6.6]; // orbital shells
  for (let i = 0; i < COUNT; i++) {
    const band = bands[Math.floor(Math.pow(Math.random(), 0.8) * bands.length)];
    const r = band + (Math.random() - 0.5) * (0.25 + band * 0.08);
    aRadius[i] = r;
    aAngle[i] = Math.random() * Math.PI * 2;
    aSpeed[i] = 0.55 / Math.pow(r, 1.5) * (0.85 + Math.random() * 0.3); // Kepler-ish
    aY[i] = (Math.random() - 0.5) * 0.06 * r;
    aSize[i] = Math.random() < 0.015 ? 3.2 : 0.6 + Math.random() * 1.2;
    aSeed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geo.setAttribute("aRadius", new THREE.BufferAttribute(aRadius, 1));
  geo.setAttribute("aAngle", new THREE.BufferAttribute(aAngle, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
  geo.setAttribute("aY", new THREE.BufferAttribute(aY, 1));
  geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(999, 999, 999) },
    uMouseStrength: { value: 0 },
    uPR: { value: renderer.getPixelRatio() },
    uBase: { value: cssColor("--fg") },
    uAccent: { value: cssColor("--accent") },
    uSignal: { value: cssColor("--signal") },
    uAlpha: { value: 1 },
  };

  const pMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      attribute float aRadius, aAngle, aSpeed, aY, aSize, aSeed;
      uniform float uTime, uMouseStrength, uPR;
      uniform vec3 uMouse;
      varying float vHeat; varying float vSeed; varying float vDepth;
      void main() {
        float ang = aAngle + uTime * aSpeed;
        vec3 p = vec3(cos(ang) * aRadius, aY + sin(ang * 3.0 + aSeed * 6.28) * 0.02, sin(ang) * aRadius);
        vec4 world = modelMatrix * vec4(p, 1.0);
        vec3 d = world.xyz - uMouse;
        float dist = length(d);
        float f = smoothstep(2.2, 0.0, dist) * uMouseStrength;
        world.xyz += normalize(d + 1e-4) * f * 0.75;   // gravity-well push
        world.z += f * 0.4;
        vHeat = f; vSeed = aSeed;
        vec4 mv = viewMatrix * world;
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPR * (1.0 + f * 1.6) * (22.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase, uAccent, uSignal; uniform float uAlpha;
      varying float vHeat; varying float vSeed; varying float vDepth;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float soft = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uBase, uAccent, step(0.82, vSeed) * 0.9);
        col = mix(col, uSignal, step(0.985, vSeed));
        col = mix(col, uAccent, clamp(vHeat * 1.4, 0.0, 1.0));
        float fade = smoothstep(26.0, 9.0, vDepth);
        gl_FragColor = vec4(col, soft * (0.35 + 0.65 * vSeed) * fade * uAlpha);
      }`,
  });
  const points = new THREE.Points(geo, pMat);
  system.add(points);

  /* ---------- Orbit rings ---------- */
  const ringMat = new THREE.LineDashedMaterial({ color: cssColor("--fg"), transparent: true, opacity: 0.16, dashSize: 0.06, gapSize: 0.1 });
  const solidRing = new THREE.LineBasicMaterial({ color: cssColor("--fg"), transparent: true, opacity: 0.1 });
  const rings = [];
  [1.6, 2.6, 3.7, 5.0, 6.6, 8.4].forEach((r, i) => {
    const pts = [];
    for (let k = 0; k <= 256; k++) { const a = (k / 256) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(g, i % 2 ? ringMat : solidRing);
    line.computeLineDistances();
    system.add(line); rings.push(line);
  });

  /* ---------- Satellites (bright bodies with trails) ---------- */
  const satMat = new THREE.MeshBasicMaterial({ color: cssColor("--accent") });
  const sats = [
    { r: 2.6, s: 0.32, o: 0.4, size: 0.07 },
    { r: 5.0, s: 0.12, o: 2.2, size: 0.09 },
    { r: 8.4, s: 0.05, o: 4.1, size: 0.11, signal: true },
  ].map((d) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(d.size, 24, 24), d.signal ? new THREE.MeshBasicMaterial({ color: cssColor("--signal") }) : satMat);
    system.add(m); return { ...d, mesh: m };
  });

  /* ---------- Core: fresnel sphere ---------- */
  const coreMat = new THREE.ShaderMaterial({
    uniforms: { uAccent: uniforms.uAccent, uBase: uniforms.uBase, uTime: uniforms.uTime },
    transparent: true,
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uAccent, uBase; uniform float uTime; varying vec3 vN; varying vec3 vV;
      void main(){ float fr = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
        float band = 0.5 + 0.5*sin(vN.y*18.0 + uTime*0.6);
        vec3 col = mix(uAccent*0.55, uAccent*1.15, fr) + band*0.05;
        gl_FragColor = vec4(col, 0.35 + fr*0.65); }`,
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.72, 64, 64), coreMat);
  system.add(core);

  /* ---------- Layout ---------- */
  system.rotation.set(-0.42, 0, 0.18); // tilted ecliptic
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const wide = w > 900;
    if (variant === "hero") system.position.set(wide ? 3.6 : 0, wide ? 0.6 : 1.4, 0);
    else system.position.set(wide ? 5.2 : 1, wide ? 0.4 : 2.4, -2);
    system.scale.setScalar(wide ? 1 : 0.7);
  }
  layout();
  new ResizeObserver(layout).observe(canvas);

  /* ---------- Pointer → gravity well ---------- */
  const ndc = new THREE.Vector2(9, 9);
  const target = new THREE.Vector2(0, 0);
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const hit = new THREE.Vector3();
  let hover = 0;
  const host = canvas.parentElement;
  host.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    target.set(ndc.x, ndc.y);
    hover = 1;
  });
  host.addEventListener("pointerleave", () => { hover = 0; target.set(0, 0); });

  /* ---------- Theme ---------- */
  function syncTheme() {
    const light = document.documentElement.dataset.theme === "light";
    uniforms.uBase.value = cssColor("--fg");
    uniforms.uAccent.value = cssColor("--accent");
    uniforms.uSignal.value = cssColor("--signal");
    pMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    pMat.needsUpdate = true;
    ringMat.color = cssColor("--fg"); solidRing.color = cssColor("--fg");
    satMat.color = cssColor("--accent");
    ringMat.opacity = light ? 0.22 : 0.16;
  }
  syncTheme();
  window.addEventListener("themechange", syncTheme);

  /* ---------- Loop ---------- */
  let visible = true, last = performance.now(), t = 0, scrollT = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const tilt = new THREE.Vector2();

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    t += reduceMotion ? 0 : dt;
    uniforms.uTime.value = t + 40; // offset so orbits start spread

    // parallax tilt toward pointer
    tilt.lerp(target, 0.04);
    scrollT += ((window.scrollY / window.innerHeight) - scrollT) * 0.08;
    system.rotation.x = -0.42 - tilt.y * 0.14 - scrollT * 0.5;
    system.rotation.z = 0.18 - tilt.x * 0.08;
    system.rotation.y = t * 0.01;

    // gravity well position on the ecliptic plane
    system.updateMatrixWorld();
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0).applyQuaternion(system.quaternion), system.position);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.lerp(hit, 0.18);
    uniforms.uMouseStrength.value += (hover - uniforms.uMouseStrength.value) * 0.06;

    sats.forEach((s) => { const a = s.o + t * s.s; s.mesh.position.set(Math.cos(a) * s.r, 0, Math.sin(a) * s.r); });
    core.scale.setScalar(1 + Math.sin(t * 1.4) * 0.015 + uniforms.uMouseStrength.value * 0.05);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

document.querySelectorAll("canvas[data-orbit]").forEach((c) => {
  try { mountOrbit(c, { variant: c.dataset.orbit }); }
  catch (err) { c.remove(); console.warn("WebGL unavailable", err); }
});
