/* AI Orbit · Version 8 "Pure" — interface (no dependencies). */
(() => {
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  /* ---------- Header: solid after the hero, hide on scroll down ---------- */
  const hdr = $("[data-hdr]"), hero = $(".hero"); let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY, edge = hero ? hero.offsetHeight - 100 : 10;
    hdr.classList.toggle("solid", y > edge || !hdr.classList.contains("hdr--dark") && y > 10);
    hdr.classList.toggle("hide", y > 600 && y > lastY + 4 && !body.classList.contains("locked") && !$(".has-mega.open"));
    if (y < lastY - 4) hdr.classList.remove("hide");
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Mega menu ---------- */
  const mg = $(".has-mega"), mgb = mg && $("button", mg);
  const setMega = (o) => { mg.classList.toggle("open", o); mgb.setAttribute("aria-expanded", String(o)); };
  if (mg) {
    let hovT = 0; // a click right after hover-open keeps the menu open instead of toggling it shut
    mgb.addEventListener("click", () => setMega(performance.now() - hovT < 700 ? true : !mg.classList.contains("open")));
    mg.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover)").matches) { hovT = performance.now(); setMega(true); } });
    mg.addEventListener("mouseleave", () => setMega(false));
    document.addEventListener("click", (e) => { if (!mg.contains(e.target)) setMega(false); });
  }

  /* ---------- Full-screen menu (burger) ---------- */
  const burger = $(".burger"), drawer = $("#drawer");
  const setDrawer = (o) => { drawer.hidden = !o; burger.setAttribute("aria-expanded", String(o)); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); body.classList.toggle("locked", o); hdr.classList.toggle("drawer-open", o); };
  burger?.addEventListener("click", () => setDrawer(drawer.hidden));
  drawer?.addEventListener("click", (e) => { if (e.target.closest("a")) setDrawer(false); });

  /* ---------- Let's talk panel ---------- */
  const talk = $("#talk"), panel = talk && $(".talk-panel", talk), tab = $(".talk-tab"); let opener = null;
  const setTalk = (o) => {
    talk.hidden = !o; body.classList.toggle("locked", o || !drawer.hidden); tab.setAttribute("aria-expanded", String(o));
    if (o) { opener = document.activeElement; setTimeout(() => $("input", panel)?.focus(), 60); } else opener?.focus();
  };
  $$("[data-talk]").forEach((b) => b.addEventListener("click", () => { if (!drawer.hidden) setDrawer(false); setTalk(true); }));
  talk && $$("[data-close]", talk).forEach((b) => b.addEventListener("click", () => setTalk(false)));
  talk?.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return; const f = $$("button, input, select, textarea, a[href]", panel).filter((x) => !x.disabled && x.offsetParent);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  addEventListener("keydown", (e) => { if (e.key !== "Escape") return; if (!talk.hidden) setTalk(false); else if (!drawer.hidden) { setDrawer(false); burger.focus(); } else if (mg) setMega(false); });

  /* ---------- Hero image-strip slider ---------- */
  const strips = $$(".strip"); let si = 0, sTimer;
  const showStrip = (i) => {
    si = (i + strips.length) % strips.length;
    strips.forEach((s, k) => { const a = $(".strip-link", s), on = k === si; s.classList.toggle("is-on", on); a.tabIndex = on ? 0 : -1; on ? a.removeAttribute("aria-hidden") : a.setAttribute("aria-hidden", "true"); });
    const c = $(".hero .count .cur"); if (c) c.textContent = si + 1;
  };
  const autoplay = () => { clearInterval(sTimer); if (!reduce) sTimer = setInterval(() => showStrip(si + 1), 6000); };
  if (strips.length) {
    $(".hero [data-prev]").addEventListener("click", () => { showStrip(si - 1); autoplay(); });
    $(".hero [data-next]").addEventListener("click", () => { showStrip(si + 1); autoplay(); });
    strips.forEach((s, k) => { s.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover)").matches) { showStrip(k); autoplay(); } });
      $(".strip-link", s).addEventListener("click", (e) => { if (k !== si) { e.preventDefault(); showStrip(k); autoplay(); } }); });
    autoplay();
  }

  /* ---------- Rotating bold word ---------- */
  const rot = $$(".rot span"); let ri = 0;
  if (rot.length && !reduce) setInterval(() => { rot[ri].classList.remove("on"); ri = (ri + 1) % rot.length; rot[ri].classList.add("on"); }, 2400);

  /* ---------- Product buckets: the hovered card takes the red state ---------- */
  const buckets = $$(".bucket");
  buckets.forEach((b) => { const on = () => buckets.forEach((x) => x.classList.toggle("is-on", x === b)); b.addEventListener("mouseenter", on); b.addEventListener("focusin", on); });

  /* ---------- Globe: dotted sphere, office markers and orbit arcs ---------- */
  const cv = $(".globe");
  if (cv) {
    const ctx = cv.getContext("2d"); let W = 0, R = 0, rotY = .9, raf = 0, vis = true;
    const N = 1500, pts = []; for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const city = (lat, lon) => { const la = lat * Math.PI / 180, lo = lon * Math.PI / 180; return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; };
    const cities = [city(39.76, -84.19), city(32.78, -96.8), city(51.51, -.13), city(51.11, 17.03), city(17.39, 78.49), city(12.97, 77.59), city(-33.87, 151.21)];
    const size = () => { const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); W = r.width; R = W * .47; cv.width = W * dpr; cv.height = W * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const proj = (p) => { const c = Math.cos(rotY), s = Math.sin(rotY), x = p[0] * c + p[2] * s, z = -p[0] * s + p[2] * c, t = .35, y = p[1] * Math.cos(t) - z * Math.sin(t), zz = p[1] * Math.sin(t) + z * Math.cos(t); return [W / 2 + x * R, W / 2 - y * R, zz]; };
    const draw = (time) => {
      ctx.clearRect(0, 0, W, W);
      const g = ctx.createRadialGradient(W * .4, W * .38, R * .2, W / 2, W / 2, R); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#EDEDF0");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, W / 2, R, 0, Math.PI * 2); ctx.fill();
      for (const p of pts) { const [x, y, z] = proj(p); if (z < 0) continue; ctx.fillStyle = `rgba(23,23,27,${.08 + z * .22})`; ctx.fillRect(x - .9, y - .9, 1.8, 1.8); }
      const cp = cities.map(proj);
      ctx.lineWidth = 1;
      for (let i = 0; i < cp.length; i++) for (let j = i + 1; j < cp.length; j++) { if ((i + j) % 2) continue; const a = cp[i], b = cp[j]; if (a[2] < 0 && b[2] < 0) continue;
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = mx - W / 2, dy = my - W / 2, L = Math.hypot(dx, dy) || 1, lift = R * .18;
        ctx.strokeStyle = `rgba(224,35,45,${.18 + Math.max(0, Math.min(a[2], b[2])) * .3})`; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mx + dx / L * lift, my + dy / L * lift, b[0], b[1]); ctx.stroke(); }
      cp.forEach(([x, y, z], k) => { if (z < -.05) return; const ph = ((time / 1600) + k * .37) % 1;
        ctx.strokeStyle = `rgba(224,35,45,${(1 - ph) * .7})`; ctx.beginPath(); ctx.arc(x, y, 4 + ph * 14, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#E0232D"; ctx.beginPath(); ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fill(); });
    };
    const loop = (t) => { rotY += .0016; draw(t); if (vis) raf = requestAnimationFrame(loop); };
    size(); draw(0); new ResizeObserver(() => { size(); draw(performance.now()); }).observe(cv);
    if (!reduce) new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(loop); }).observe(cv);
  }

  /* ---------- Count-up on stat cards ---------- */
  const cio = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; cio.unobserve(e.target); const el = e.target, end = +el.dataset.count; if (reduce || !end) return;
    const t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); }; el.textContent = "0"; requestAnimationFrame(tick); }), { threshold: .6 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Industries fade ---------- */
  const ib = $$(".ind-list button"), figs = $$(".fade-media figure"); let ii = 0, iTimer;
  const showInd = (i) => { ii = i % ib.length; ib.forEach((b, k) => { b.classList.toggle("on", k === ii); b.setAttribute("aria-pressed", String(k === ii)); }); figs.forEach((f, k) => f.classList.toggle("on", k === ii)); };
  const indAuto = () => { clearInterval(iTimer); if (!reduce) iTimer = setInterval(() => showInd(ii + 1), 4200); };
  ib.forEach((b, k) => b.addEventListener("click", () => { showInd(k); indAuto(); }));
  if (ib.length) { indAuto(); $(".fade")?.addEventListener("mouseenter", () => clearInterval(iTimer)); $(".fade")?.addEventListener("mouseleave", indAuto); }

  /* ---------- Outcomes carousel ---------- */
  const outs = $$(".out"); let oi = 0;
  const showOut = (i) => { oi = (i + outs.length) % outs.length; outs.forEach((o, k) => { o.classList.toggle("on", k === oi); o.setAttribute("aria-hidden", String(k !== oi)); $$("a", o).forEach((a) => a.tabIndex = k === oi ? 0 : -1); }); };
  if (outs.length) { showOut(0); $(".outcomes [data-prev]").addEventListener("click", () => showOut(oi - 1)); $(".outcomes [data-next]").addEventListener("click", () => showOut(oi + 1)); }

  /* ---------- Card rails ---------- */
  $$(".cases").forEach((sec) => { const rail = $(".rail", sec); if (!rail) return;
    const step = () => (rail.querySelector(".card")?.getBoundingClientRect().width || 300) + 22;
    $("[data-prev]", sec)?.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
    $("[data-next]", sec)?.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" })); });

  /* ---------- Service page: capability tabs ---------- */
  const caps = $$(".cap"), cap = $(".tab-media figcaption");
  caps.forEach((c) => c.addEventListener("click", () => { caps.forEach((x) => { x.classList.toggle("on", x === c); x.setAttribute("aria-pressed", String(x === c)); }); $("b", cap).textContent = c.dataset.t; $("span", cap).textContent = c.dataset.cap; }));

  /* ---------- FAQ accordion ---------- */
  $$(".acc button").forEach((b) => b.addEventListener("click", () => { const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(o)); document.getElementById(b.getAttribute("aria-controls")).hidden = !o; }));

  /* ---------- Reveal ---------- */
  const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
  $$(".bucket, .stat, .ebox, .card, .col, .pcard, .rcard").forEach((el, i) => { el.classList.add("rv"); el.style.transitionDelay = `${(i % 4) * .07}s`; rio.observe(el); });

  /* ---------- Office clocks ---------- */
  $$("time[data-tz]").forEach((t) => { const tick = () => { try { t.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz }).format(new Date()) + " local time"; } catch { t.textContent = ""; } }; tick(); setInterval(tick, 30000); });

  /* ---------- Contact form ---------- */
  $$("form.form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); let first = null;
    $$("[required]", f).forEach((el) => { const err = document.getElementById(el.getAttribute("aria-describedby")); let msg = "";
      if (!el.value.trim()) msg = "Please fill in this field."; else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = "Please enter a valid email address.";
      el.setAttribute("aria-invalid", msg ? "true" : "false"); if (err) err.textContent = msg; if (msg && !first) first = el; });
    if (first) { first.focus(); return; } f.classList.add("sent"); $(".ok", f).focus(); f.reset();
  }));
  $$("[data-year]").forEach((y) => y.textContent = new Date().getFullYear());
})();
