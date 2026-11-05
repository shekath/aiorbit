/* AI Orbit · Version 5 "Clarity" — interactions (no dependencies). */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme toggle (theme is applied early by the inline head script) */
  const tbtn = document.querySelector("[data-theme-toggle]");
  const syncTheme = () => { const light = root.dataset.theme === "light"; if (tbtn) { tbtn.setAttribute("aria-pressed", String(light)); tbtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme"); } };
  syncTheme();
  tbtn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { for (const k of ["orbit-theme", "orbitb-theme", "orbitc-theme"]) localStorage.setItem(k, root.dataset.theme); } catch {}
    syncTheme(); lattices.forEach((l) => l.recolor());
  });

  /* Header border on scroll */
  const hdr = document.querySelector(".hdr");
  const onScroll = () => hdr?.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile drawer */
  const burger = document.querySelector(".burger"), drawer = document.getElementById("drawer");
  const setMenu = (o) => { drawer?.classList.toggle("open", o); burger?.setAttribute("aria-expanded", String(o)); burger?.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
  burger?.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
  drawer?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer?.classList.contains("open")) { setMenu(false); burger.focus(); } });

  /* FAQ accordion */
  document.querySelectorAll(".qa button").forEach((b) => b.addEventListener("click", () => b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true"))));

  /* Reveal, metrics, console run */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const t = e.target; io.unobserve(t);
    if (t.classList.contains("console")) runConsole(t); else t.classList.add("in");
  }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
  document.querySelectorAll(".rv, .metric, .console").forEach((el) => io.observe(el));

  function runConsole(c) {
    const items = [...c.querySelectorAll(".steps li")];
    items.forEach((li, i) => { li.style.transitionDelay = reduce ? "0s" : `${.25 + i * .45}s`; });
    c.querySelector(".track i")?.style.setProperty("transition-delay", reduce ? "0s" : ".4s");
    c.classList.add("go");
  }

  /* Ask box: echo the question into the prompt (demo only, nothing is sent) */
  document.querySelectorAll(".ask").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); const i = f.querySelector("input"); const v = i.value.trim(); if (!v) { i.focus(); return; }
    const p = f.closest(".console").querySelector(".prompt span"); p.textContent = v; i.value = "";
    const c = f.closest(".console"); c.classList.remove("go"); void c.offsetWidth; runConsole(c);
  }));

  /* Office clocks */
  document.querySelectorAll("time[data-tz]").forEach((t) => {
    const tick = () => { try { t.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz }).format(new Date()) + " local"; } catch { t.textContent = ""; } };
    tick(); setInterval(tick, 30000);
  });

  /* Contact form validation */
  document.querySelectorAll("form.form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); let first = null;
    f.querySelectorAll("[required]").forEach((el) => {
      const err = document.getElementById(el.getAttribute("aria-describedby")?.split(" ")[0]);
      let msg = "";
      if (!el.value.trim()) msg = "Please fill in this field.";
      else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = "Please enter a valid email address.";
      el.setAttribute("aria-invalid", msg ? "true" : "false"); if (err) err.textContent = msg; if (msg && !first) first = el;
    });
    if (first) { first.focus(); return; }
    f.classList.add("sent"); const ok = f.querySelector(".ok"); ok.focus(); f.reset();
  }));

  /* Neural lattice: slow drifting nodes; decorative, never behind body copy */
  const lattices = [];
  document.querySelectorAll("canvas[data-lattice]").forEach((cv) => {
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const N = +cv.dataset.lattice || 46; let w = 0, h = 0, dpr = 1, pts = [], col = {}, raf = 0, vis = false, mx = -1e4, my = -1e4;
    const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();
    const recolor = () => { col = { node: css("--node"), hi: css("--accent-2") }; if (reduce || !vis) draw(); };
    const size = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pts.length) { let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; pts = Array.from({ length: N }, () => ({ x: rnd(), y: rnd(), vx: (rnd() - .5) * .00018, vy: (rnd() - .5) * .00018, r: rnd() })); } draw(); };
    function draw() {
      ctx.clearRect(0, 0, w, h); const lim = Math.min(w, 520) * .26;
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) { const a = pts[i], ax = a.x * w, ay = a.y * h;
        for (let j = i + 1; j < pts.length; j++) { const b = pts[j], d = Math.hypot(ax - b.x * w, ay - b.y * h); if (d < lim) { ctx.globalAlpha = (1 - d / lim) * .38; ctx.strokeStyle = col.node; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); } } }
      for (const p of pts) { const x = p.x * w, y = p.y * h, near = Math.hypot(x - mx, y - my) < 120; ctx.globalAlpha = near ? 1 : .45 + p.r * .5; ctx.fillStyle = p.r > .82 || near ? col.hi : col.node; ctx.beginPath(); ctx.arc(x, y, 1.6 + p.r * 2.4 + (near ? 1 : 0), 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    const step = () => { for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; } draw(); raf = requestAnimationFrame(step); };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis && !reduce) raf = requestAnimationFrame(step); }).observe(cv);
    const host = cv.parentElement;
    host.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; if (reduce) draw(); }, { passive: true });
    host.addEventListener("pointerleave", () => { mx = my = -1e4; if (reduce) draw(); });
    new ResizeObserver(size).observe(cv);
    recolor(); lattices.push({ recolor });
  });

  const y = document.querySelector("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
