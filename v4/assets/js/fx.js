/* ==========================================================================
   AI Orbit · Version 4 — motion layer (runs after the shared V3 chrome)
   preloader counter · cursor with hold-to-charge ring · hero reveal ·
   velocity marquee · stripe wipe · 3D tilt cards · count-up ·
   pinned horizontal work rail with image parallax · text scramble ·
   services letter-scatter + card reveal · industries image peek ·
   magnetic buttons · reveal-on-scroll. Everything degrades to static
   content under prefers-reduced-motion.
   ========================================================================== */
(() => {
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const nav = $(".nav");

  /* ---------- Preloader (counts while assets load, max ~1.6s) ---------- */
  const pre = $(".preload");
  const startHero = () => $(".h4")?.classList.add("in");
  if (pre && !calm) {
    const num = $(".count span", pre); let n = 0; const t0 = performance.now();
    const tick = () => { const target = document.readyState === "complete" ? 100 : 86; n += (target - n) * .12 + .4; n = Math.min(n, 100);
      num.textContent = String(Math.floor(n)).padStart(3, "0"); pre.style.setProperty("--p", `${n}%`);
      if (n >= 99.5 || performance.now() - t0 > 2200) { num.textContent = "100"; setTimeout(() => { pre.classList.add("done"); startHero(); setTimeout(() => pre.remove(), 1200); }, 180); } else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  } else { pre?.remove(); startHero(); }

  /* ---------- Nav background after scroll ---------- */
  addEventListener("scroll", () => nav?.classList.toggle("scrolled-v4", scrollY > 30), { passive: true });

  /* ---------- Cursor ---------- */
  if (fine && !calm) {
    const c = document.createElement("div"); c.className = "cur"; c.setAttribute("aria-hidden", "true");
    c.innerHTML = '<span class="ring"><b></b></span><span class="dot"></span><svg class="charge" viewBox="0 0 112 112"><circle cx="56" cy="56" r="54"/></svg>';
    document.body.append(c);
    const ring = $(".ring", c), dot = $(".dot", c), lab = $("b", c);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const l = e.target.closest("[data-cursor]"); c.classList.toggle("label", !!l); lab.textContent = l ? l.dataset.cursor : "";
      c.classList.toggle("hover", !l && !!e.target.closest("a, button, input, select, textarea"));
    });
    (function loop() { rx += (x - rx) * .18; ry += (y - ry) * .18;
      dot.style.transform = `translate(${x}px, ${y}px)`; ring.style.transform = `translate(${rx}px, ${ry}px)`;
      $(".charge", c).style.transform = `translate(${rx}px, ${ry}px) rotate(-90deg)`; c.style.setProperty("--c", (window.ORBIT4?.charge?.() || 0).toFixed(3));
      requestAnimationFrame(loop); })();
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !calm) addEventListener("pointermove", (e) => $$(".magnet").forEach((b) => {
    const r = b.getBoundingClientRect(), mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
    b.style.transform = Math.hypot(mx, my) < Math.max(r.width * .8, 90) ? `translate(${mx * .25}px, ${my * .35}px)` : "";
  }), { passive: true });

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".up").forEach((el) => io.observe(el));

  /* ---------- Count-up ---------- */
  const cio = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.n, t0 = performance.now(), d = calm ? 1 : 1800;
    (function s(now) { const p = clamp((now - t0) / d), v = Math.round(to * (1 - Math.pow(1 - p, 4))); el.textContent = v.toLocaleString("en-US"); if (p < 1) requestAnimationFrame(s); })(t0);
  }), { threshold: .5 });
  $$("[data-n]").forEach((el) => cio.observe(el));

  /* ---------- Text scramble (on enter + hover) ---------- */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*+";
  const scramble = (el) => { if (calm) return; const final = el.dataset.text || el.textContent; el.dataset.text = final; let f = 0; const total = 26;
    const step = () => { el.textContent = [...final].map((ch, i) => ch === " " ? " " : i < (f / total) * final.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(""); if (++f <= total) requestAnimationFrame(step); else el.textContent = final; };
    step(); };
  const sio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { scramble(e.target); sio.unobserve(e.target); } }), { threshold: .6 });
  $$(".scramble").forEach((el) => { el.setAttribute("aria-label", el.textContent); sio.observe(el); el.addEventListener("mouseenter", () => scramble(el)); });

  /* ---------- 3D tilt cards ---------- */
  $$(".fact").forEach((card, i) => {
    const base = [-6, 0, 6][i % 3];
    card.style.transform = `rotateY(${base}deg)`;
    if (!fine || calm) return;
    card.addEventListener("pointermove", (e) => { const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `rotateY(${base + px * 14}deg) rotateX(${-py * 12}deg) translateZ(20px)`; });
    card.addEventListener("pointerleave", () => (card.style.transform = `rotateY(${base}deg)`));
  });

  /* ---------- Industries: cursor-following image peek ---------- */
  const peek = $(".peek");
  if (peek && fine && !calm) {
    const imgs = $$("img", peek); let px = 0, py = 0, tx = 0, ty = 0, vx = 0;
    $$(".ind4 li a").forEach((a, i) => { a.addEventListener("mouseenter", () => { peek.classList.add("on"); imgs.forEach((im, k) => im.classList.toggle("on", k === i)); }); a.addEventListener("mouseleave", () => peek.classList.remove("on")); });
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() { const nx = px + (tx - px) * .14; vx = nx - px; px = nx; py += (ty - py) * .14; peek.style.left = px + "px"; peek.style.top = py + "px"; peek.style.setProperty("--r", `${clamp(vx * .4, -10, 10) - 2}deg`); requestAnimationFrame(loop); })();
  }

  /* ---------- Services: split words into letters for the scatter ---------- */
  const words = $(".svc4 .words");
  let letters = [];
  if (words) {
    $$(".w4", words).forEach((w) => { const t = w.textContent; w.innerHTML = `<span class="sr-only">${t}</span>` + [...t].map((ch) => `<span class="ch" aria-hidden="true">${ch === " " ? "&nbsp;" : ch}</span>`).join(""); });
    const sizeGrad = () => $$(".w4.grad", words).forEach((w) => { const b = w.getBoundingClientRect(); w.style.setProperty("--ww", b.width + "px"); $$(".ch", w).forEach((c) => c.style.setProperty("--ox", (c.getBoundingClientRect().left - b.left) + "px")); });
    sizeGrad(); addEventListener("resize", sizeGrad); document.fonts?.ready.then(sizeGrad);
    letters = $$(".ch", words).map((el) => ({ el, dx: (Math.random() - .5) * 2, dy: (Math.random() - .5) * 2, r: (Math.random() - .5) * 720, z: Math.random() }));
  }
  const svc = $(".svc4"), cards = svc ? $$(".scard", svc) : [];
  const pinOK = () => !calm && innerWidth > 900;

  /* ---------- Velocity marquee, wipes, work rail, services: one loop ---------- */
  const mqs = $$(".mq .track").map((tr) => ({ tr, x: 0, dir: +(tr.dataset.dir || -1) }));
  const wipes = $$(".wipe");
  const work = $(".work"), rail = work ? $(".rail", work) : null, workImgs = work ? $$(".ph img", work) : [];
  let lastY = scrollY, vel = 0;
  (function loop() {
    const y = scrollY, vh = innerHeight; vel += ((y - lastY) - vel) * .12; lastY = y;
    if (!calm) mqs.forEach((m) => { m.x += (m.dir * (1.1 + Math.min(Math.abs(vel) * .35, 14))) * (vel < -1 ? -1 : 1); const w = m.tr.scrollWidth / 2; if (m.x < -w) m.x += w; if (m.x > 0) m.x -= w; m.tr.style.transform = `translate3d(${m.x}px,0,0)`; });
    wipes.forEach((wp) => { const r = wp.getBoundingClientRect(), p = clamp((vh - r.top) / (vh * .9)); $$("span", wp).forEach((s, i) => s.style.setProperty("--s", calm ? 1 : clamp(p * 1.6 - i * .08).toFixed(3))); });
    if (work && rail) {
      if (pinOK()) { const r = work.getBoundingClientRect(), p = clamp(-r.top / (work.offsetHeight - vh)), max = rail.scrollWidth - innerWidth;
        rail.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
        workImgs.forEach((im) => { const b = im.parentElement.getBoundingClientRect(), c = (b.left + b.width / 2 - innerWidth / 2) / innerWidth; im.style.setProperty("--px", `${(-10 - c * 8).toFixed(2)}%`); });
      } else rail.style.transform = "";
    }
    if (svc) {
      if (pinOK()) { const r = svc.getBoundingClientRect(), p = clamp(-r.top / (svc.offsetHeight - vh));
        const s = clamp((p - .18) / .32), e = s * s * (3 - 2 * s);   // scatter phase
        letters.forEach((L) => { L.el.style.transform = `translate3d(${(L.dx * innerWidth * .55 * e).toFixed(1)}px, ${(L.dy * vh * .6 * e).toFixed(1)}px, 0) rotate(${(L.r * e).toFixed(1)}deg) scale(${1 + L.z * e})`; L.el.style.opacity = (1 - e * .96).toFixed(3); });
        cards.forEach((c, i) => c.classList.toggle("on", p > .48 + i * .08));
      } else { letters.forEach((L) => { L.el.style.transform = ""; L.el.style.opacity = ""; }); cards.forEach((c) => c.classList.add("on")); }
    }
    requestAnimationFrame(loop);
  })();
})();
