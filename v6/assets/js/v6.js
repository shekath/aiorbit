/* AI Orbit · Version 6 "Spatial" — interface mechanics (no dependencies).
   Magnetic triggers, edge-light borders, spring-damped tabs, telemetry, motion
   switch, keyboard shortcuts, console run, count-ups, trajectory progress. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---- Motion switch (persisted; off by default with reduced motion) ---- */
  let motion = !reduce; try { if (localStorage.getItem("orbit6-motion") === "off") motion = false; } catch {}
  const sw = $("[data-motion]");
  const setMotion = (on) => {
    motion = on; root.classList.toggle("no-motion", !on);
    if (sw) { sw.setAttribute("aria-checked", String(on)); }
    try { localStorage.setItem("orbit6-motion", on ? "on" : "off"); } catch {}
    dispatchEvent(new CustomEvent("v6:motion", { detail: on }));
  };
  setMotion(motion);
  sw?.addEventListener("click", () => setMotion(!motion));

  /* ---- Dock: compact on scroll, active section in menu + rail ---- */
  const dock = $(".dock");
  const heroEl = $(".hero, .p-hero"), teleEl = $(".telemetry");
  const onScroll = () => { dock?.classList.toggle("compact", scrollY > 24); tele.scroll(); if (teleEl && heroEl) teleEl.classList.toggle("show", scrollY < heroEl.offsetHeight * .55); };
  const navLinks = $$('.dock nav.menu a, .rail a');
  const secs = $$("main section[id]");
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => spy.observe(s));

  /* ---- Drawer ---- */
  const burger = $(".burger"), drawer = $("#drawer");
  const setMenu = (o) => { drawer?.classList.toggle("open", o); burger?.setAttribute("aria-expanded", String(o)); burger?.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
  burger?.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
  drawer?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---- Magnetic pull (spring-back via CSS) ---- */
  if (fine && !reduce) $$(".magnet").forEach((el) => {
    const s = el.dataset.magnet ? +el.dataset.magnet : .32;
    el.style.transition = "transform .55s cubic-bezier(.34,1.56,.64,1)";
    el.addEventListener("pointermove", (e) => {
      if (!motion) return; const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = "transform .15s ease-out";
      el.style.transform = `translate(${Math.max(-10, Math.min(10, dx * s))}px, ${Math.max(-8, Math.min(8, dy * s))}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transition = "transform .55s cubic-bezier(.34,1.56,.64,1)"; el.style.transform = ""; });
  });

  /* ---- Ripple on buttons ---- */
  $$(".btn").forEach((b) => b.addEventListener("pointerdown", (e) => {
    if (!motion) return; const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, i = document.createElement("span");
    i.className = "ripple"; i.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${s}px;height:${s}px`; b.append(i); setTimeout(() => i.remove(), 650);
  }));

  /* ---- Edge-light: border illuminates toward the pointer ---- */
  if (fine) $$(".edge").forEach((el) => {
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90 - 300; el.style.setProperty("--a", `${a}deg`); el.classList.add("lit"); });
    el.addEventListener("pointerleave", () => el.classList.remove("lit"));
  });

  /* ---- Spring util (stiffness/damping, critically damped-ish) ---- */
  function spring(from, k = 260, c = 26) {
    let x = from, v = 0, to = from, raf = 0, cb = () => {};
    const step = (t0) => { let last = t0; const tick = (t) => { const dt = Math.min(.032, (t - last) / 1000); last = t; const a = -k * (x - to) - c * v; v += a * dt; x += v * dt; cb(x); if (Math.abs(v) > .01 || Math.abs(x - to) > .1) raf = requestAnimationFrame(tick); else { x = to; cb(x); raf = 0; } }; raf = requestAnimationFrame(tick); };
    return { set(t, f) { to = t; cb = f; if (!motion || reduce) { x = t; v = 0; cb(x); return; } if (!raf) step(performance.now()); } };
  }

  /* ---- Tabs (ARIA) with spring-damped indicator; keys 1–4 select ---- */
  $$("[data-tabs]").forEach((wrap) => {
    const list = $('[role="tablist"]', wrap), tabs = $$('[role="tab"]', wrap), panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    const ind = $(".ind", list); const sy = spring(0), sh = spring(0), sx = spring(0), sw2 = spring(0);
    const place = (t) => { const lr = list.getBoundingClientRect(), r = t.getBoundingClientRect();
      sy.set(r.top - lr.top, (y) => { ind.style.transform = `translate(${ind._x || 0}px, ${y}px)`; ind._y = y; });
      sx.set(r.left - lr.left, (x) => { ind._x = x; ind.style.transform = `translate(${x}px, ${ind._y || 0}px)`; });
      sh.set(r.height, (h) => { ind.style.height = h + "px"; }); sw2.set(r.width, (w) => { ind.style.width = w + "px"; }); };
    const select = (i, focus) => { tabs.forEach((t, j) => { const on = i === j; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; panels[j].hidden = !on; if (on) { panels[j].classList.remove("enter"); void panels[j].offsetWidth; panels[j].classList.add("enter"); } }); place(tabs[i]); if (focus) tabs[i].focus(); };
    tabs.forEach((t, i) => { t.addEventListener("click", () => select(i)); t.addEventListener("keydown", (e) => { const n = tabs.length; let j = null; if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % n; if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + n) % n; if (e.key === "Home") j = 0; if (e.key === "End") j = n - 1; if (j !== null) { e.preventDefault(); select(j, true); } }); });
    ind.style.left = "0"; ind.style.right = "auto";
    select(0); new ResizeObserver(() => place(tabs.find((t) => t.getAttribute("aria-selected") === "true"))).observe(list);
    wrap._select = select; wrap._n = tabs.length;
  });

  /* ---- Headline word reveal ---- */
  $$(".mega").forEach((h) => {
    let i = 0; const walk = (n) => { [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) { const parts = c.textContent.split(/(\s+)/); const frag = document.createDocumentFragment(); parts.forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) frag.append(p); else { const s = document.createElement("span"); s.className = "w"; s.textContent = p; s.style.transitionDelay = `${.08 + i++ * .07}s`; frag.append(s); } }); c.replaceWith(frag); }
      else if (c.nodeType === 1) walk(c); }); };
    walk(h); requestAnimationFrame(() => setTimeout(() => h.classList.add("go"), 60));
  });

  /* ---- Reveal / instruments / console / count-up ---- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; const t = e.target; io.unobserve(t);
    t.classList.add("in"); if (t.classList.contains("console")) runConsole(t);
    $$("[data-count]", t).forEach(count); if (t.matches("[data-count]")) count(t); }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
  $$(".rv, .inst, .console, .readout").forEach((el) => io.observe(el));

  function count(el) {
    if (el._done) return; el._done = true; const m = el.textContent.match(/^(\d+)(.*)$/s); if (!m || !motion) return;
    // the final value stays readable for assistive tech; the counting digits are visual only
    const end = +m[1], rest = el.innerHTML.slice(m[1].length), finalText = el.textContent, t0 = performance.now(), dur = 1400;
    el.textContent = ""; const sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = finalText;
    const vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true"); el.append(sr, vis);
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); vis.innerHTML = Math.round(end * e) + rest; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function runConsole(c) {
    const items = $$(".steps li", c), pr = $(".prompt > span", c);
    const full = pr.dataset.text || pr.textContent; pr.dataset.text = full;
    items.forEach((li, i) => { li.style.transitionDelay = motion ? `${.5 + i * .45}s` : "0s"; });
    // screen readers get the whole prompt at once; the typing effect is visual only
    pr.textContent = ""; const sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = full;
    const vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true"); pr.append(sr, vis);
    if (motion) { const caret = document.createElement("i"); caret.className = "caret"; let n = 0;
      const type = () => { vis.textContent = full.slice(0, n); vis.append(caret); if (n++ < full.length) setTimeout(type, 18); else setTimeout(() => caret.remove(), 1200); }; type(); }
    else vis.textContent = full;
    c.classList.add("go");
  }
  $$(".ask").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); const i = $("input", f), v = i.value.trim(); if (!v) { i.focus(); return; }
    const c = f.closest(".console"), pr = $(".prompt > span", c); pr.dataset.text = v; i.value = ""; c.classList.remove("go"); void c.offsetWidth; runConsole(c);
  }));

  /* ---- Trajectory progress (path draws as you scroll) ---- */
  $$(".trajectory").forEach((tr) => {
    const lit = $("path.lit", tr), lis = $$("li", tr); if (lit) tr.style.setProperty("--len", lit.getTotalLength ? lit.getTotalLength() : 2000);
    const upd = () => { const r = tr.getBoundingClientRect(), vh = innerHeight; const p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height + vh * .35))); tr.style.setProperty("--p", p.toFixed(3)); lis.forEach((li, i) => li.classList.toggle("on", p >= (i + .5) / lis.length || p > .98)); };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  });

  /* ---- FAQ ---- */
  $$(".qa button").forEach((b) => b.addEventListener("click", () => b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true"))));

  /* ---- Office clocks ---- */
  $$("time[data-tz]").forEach((t) => { const tick = () => { try { t.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz }).format(new Date()) + " local"; } catch { t.textContent = ""; } }; tick(); setInterval(tick, 30000); });

  /* ---- Copy email ---- */
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const lbl = $(".lbl", b), live = $("#copy-status"); try { await navigator.clipboard.writeText(b.dataset.copy); lbl.textContent = "Copied"; if (live) live.textContent = "Email address copied to clipboard"; } catch { lbl.textContent = "Press Ctrl+C"; }
    setTimeout(() => { lbl.textContent = "Copy"; if (live) live.textContent = ""; }, 1800);
  }));

  /* ---- Form validation ---- */
  $$("form.form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); let first = null;
    $$("[required]", f).forEach((el) => { const err = document.getElementById(el.getAttribute("aria-describedby")?.split(" ")[0]); let msg = "";
      if (!el.value.trim()) msg = "Please fill in this field."; else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = "Please enter a valid email address.";
      el.setAttribute("aria-invalid", msg ? "true" : "false"); if (err) err.textContent = msg; if (msg && !first) first = el; });
    if (first) { first.focus(); return; } f.classList.add("sent"); $(".ok", f).focus(); f.reset();
  }));

  /* ---- Telemetry HUD: real interface readouts ---- */
  const tele = { clock: $("[data-t-clock]"), fps: $("[data-t-fps]"), pts: $("[data-t-pts]"), depth: $("[data-t-depth]"),
    scroll() { if (this.depth) { const h = document.documentElement.scrollHeight - innerHeight; this.depth.textContent = String(Math.round(h > 0 ? scrollY / h * 100 : 0)).padStart(2, "0") + "%"; } } };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (tele.clock) { const t = () => { tele.clock.textContent = new Date().toISOString().slice(11, 19) + " UTC"; }; t(); setInterval(t, 1000); }
  addEventListener("v6:field", (e) => { if (tele.fps) tele.fps.textContent = motion ? (e.detail.fps ? e.detail.fps + " fps" : "live") : "paused"; if (tele.pts) tele.pts.textContent = e.detail.count.toLocaleString("en-US"); });
  addEventListener("v6:motion", (e) => { if (tele.fps && !e.detail) tele.fps.textContent = "paused"; });

  /* ---- Keyboard shortcuts (ignored while typing) ---- */
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("open")) { setMenu(false); burger.focus(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input, textarea, select, [contenteditable]")) return;
    const k = e.key.toLowerCase(); const go = (id) => { const el = document.getElementById(id); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: motion ? "smooth" : "auto" }); } };
    if (k === "c") go("contact"); else if (k === "s") go(document.getElementById("services") ? "services" : "approach");
    else if (k === "/") { const i = $(".ask input"); if (i) { e.preventDefault(); i.focus(); } }
    else if (k === "m") setMotion(!motion);
    else if (/^[1-9]$/.test(k)) { const w = $("[data-tabs]"); if (w && w._select && +k <= w._n) { const r = w.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) w._select(+k - 1, false); } }
  });

  const y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
