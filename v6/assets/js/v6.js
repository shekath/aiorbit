/* AI Orbit · Version 6 "Signal" — interface mechanics (no dependencies). */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---- Theme (applied early by the head script; persisted across versions) ---- */
  const tbtn = $("[data-theme-toggle]");
  const syncTheme = () => { const l = root.dataset.theme === "light"; tbtn?.setAttribute("aria-pressed", String(l)); tbtn?.setAttribute("aria-label", l ? "Switch to dark theme" : "Switch to light theme"); };
  syncTheme();
  tbtn?.addEventListener("click", () => { root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light"; try { for (const k of ["orbit-theme", "orbitb-theme", "orbitc-theme"]) localStorage.setItem(k, root.dataset.theme); } catch {} syncTheme(); });

  /* ---- Motion switch (footer) + M key ---- */
  let motion = !reduce; try { if (localStorage.getItem("orbit6-motion") === "off") motion = false; } catch {}
  const sw = $("[data-motion]");
  const setMotion = (on) => { motion = on; root.classList.toggle("no-motion", !on); sw?.setAttribute("aria-checked", String(on)); try { localStorage.setItem("orbit6-motion", on ? "on" : "off"); } catch {} dispatchEvent(new CustomEvent("v6:motion", { detail: on })); };
  setMotion(motion); sw?.addEventListener("click", () => setMotion(!motion));

  /* ---- Header: hide on scroll down, show on scroll up; active section ---- */
  const hdr = $(".hdr"); let lastY = scrollY;
  addEventListener("scroll", () => { const y = scrollY; hdr?.classList.toggle("hide", y > 320 && y > lastY && !drawer?.classList.contains("open")); lastY = y; }, { passive: true });
  const links = $$(".menu a");
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* ---- Drawer ---- */
  const burger = $(".burger"), drawer = $("#drawer");
  const setMenu = (o) => { drawer?.classList.toggle("open", o); burger?.setAttribute("aria-expanded", String(o)); burger?.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
  burger?.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
  drawer?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---- Hero intro + cycling index ---- */
  const hero = $(".hero"); if (hero) requestAnimationFrame(() => setTimeout(() => hero.classList.add("go"), 80));
  const idx = $$(".hero .meta ol li"); let ii = 0;
  if (idx.length) setInterval(() => { if (!motion) return; idx[ii].classList.remove("on"); ii = (ii + 1) % idx.length; idx[ii].classList.add("on"); }, 2400);

  /* ---- Magnetic CTAs ---- */
  if (fine && !reduce) $$(".cta").forEach((el) => {
    el.addEventListener("pointermove", (e) => { if (!motion) return; const r = el.getBoundingClientRect(); el.style.transition = "transform .15s ease-out"; el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .2}px)`; });
    el.addEventListener("pointerleave", () => { el.style.transition = "transform .6s cubic-bezier(.34,1.56,.64,1)"; el.style.transform = ""; });
  });

  /* ---- Reveal / count-up / signal log ---- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; const t = e.target; io.unobserve(t); t.classList.add("in");
    if (t.classList.contains("log")) runLog(t); $$("[data-count]", t).forEach(count); }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
  $$(".rv, .cols3 > div, .fact, .log, .proof").forEach((el) => io.observe(el));

  function count(el) {
    if (el._done) return; el._done = true; const m = el.textContent.match(/^(\d+)(.*)$/s); if (!m || !motion) return;
    const end = +m[1], rest = el.innerHTML.slice(m[1].length), finalText = el.textContent, t0 = performance.now();
    el.textContent = ""; const sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = finalText;
    const vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true"); el.append(sr, vis);
    const tick = (t) => { const p = Math.min(1, (t - t0) / 1500), k = 1 - Math.pow(1 - p, 4); vis.innerHTML = Math.round(end * k) + rest; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function runLog(c) {
    const items = $$(".steps li", c), pr = $(".prompt > span", c), full = pr.dataset.text || pr.textContent; pr.dataset.text = full;
    items.forEach((li, i) => { li.style.transitionDelay = motion ? `${.6 + i * .5}s` : "0s"; });
    pr.textContent = ""; const sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = full;
    const vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true"); pr.append(sr, vis);
    if (motion) { const caret = document.createElement("i"); caret.className = "caret"; let n = 0;
      const type = () => { vis.textContent = full.slice(0, n); vis.append(caret); if (n++ < full.length) setTimeout(type, 20); else setTimeout(() => caret.remove(), 1400); }; type(); }
    else vis.textContent = full;
    c.classList.add("go");
  }
  $$(".ask").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); const i = $("input", f), v = i.value.trim(); if (!v) { i.focus(); return; }
    const c = f.closest(".log"), pr = $(".prompt > span", c); pr.dataset.text = v; i.value = ""; c.classList.remove("go"); void c.offsetWidth; runLog(c);
  }));

  /* ---- Staircase: build the step path, draw it as you scroll ---- */
  $$(".stairs").forEach((st) => {
    const svg = $("svg", st), base = $("path.base", st), lit = $("path.lit", st), lis = $$("li", st);
    const build = () => { if (getComputedStyle(svg).display === "none") return; const sr = st.getBoundingClientRect();
      const pts = lis.map((li) => { const r = $(".node", li).getBoundingClientRect(); return [r.left - sr.left, r.bottom - sr.top]; });
      let d = `M${pts[0][0]},${pts[0][1]}`; pts.forEach((p, i) => { if (i) d += ` H${p[0]} V${p[1]}`; }); d += ` H${sr.width}`;
      svg.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`); base.setAttribute("d", d); lit.setAttribute("d", d); };
    const upd = () => { const r = st.getBoundingClientRect(), vh = innerHeight, p = Math.max(0, Math.min(1, (vh * .8 - r.top) / (r.height + vh * .3)));
      st.style.setProperty("--p", p.toFixed(3)); lis.forEach((li, i) => li.classList.toggle("on", p >= (i + .3) / lis.length || p > .98)); };
    new ResizeObserver(() => { build(); upd(); }).observe(st); addEventListener("scroll", upd, { passive: true });
  });

  /* ---- Partner logo rail: scrolls only when more logos than columns ---- */
  $$(".logo-rail").forEach((rail) => {
    const nav = rail.parentElement.querySelector(".rail-nav");
    const state = () => { const over = rail.scrollWidth > rail.clientWidth + 2; rail.classList.toggle("overflow", over); if (nav) nav.hidden = !over;
      rail.classList.toggle("at-start", rail.scrollLeft < 4); rail.classList.toggle("at-end", rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 4); };
    const page = () => (rail.querySelector("li")?.getBoundingClientRect().width || 200) * (innerWidth < 760 ? 1 : 2);
    nav?.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => rail.scrollBy({ left: page() * +b.dataset.dir, behavior: motion ? "smooth" : "auto" })));
    let down = null;
    rail.addEventListener("pointerdown", (e) => { if (!rail.classList.contains("overflow") || e.pointerType !== "mouse") return; down = { x: e.clientX, s: rail.scrollLeft }; rail.classList.add("drag"); rail.setPointerCapture(e.pointerId); });
    rail.addEventListener("pointermove", (e) => { if (down) rail.scrollLeft = down.s - (e.clientX - down.x); });
    const up = () => { if (!down) return; down = null; rail.classList.remove("drag"); };
    rail.addEventListener("pointerup", up); rail.addEventListener("pointercancel", up);
    rail.addEventListener("scroll", state, { passive: true }); new ResizeObserver(state).observe(rail); new MutationObserver(state).observe(rail, { childList: true, subtree: true }); state();
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

  /* ---- Keyboard shortcuts (ignored while typing) ---- */
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("open")) { setMenu(false); burger.focus(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input, textarea, select, [contenteditable]")) return;
    const k = e.key.toLowerCase(), go = (id) => { const el = document.getElementById(id); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: motion ? "smooth" : "auto" }); } };
    if (k === "c") go("contact"); else if (k === "s") go(document.getElementById("services") ? "services" : "approach");
    else if (k === "/") { const i = $(".ask input"); if (i) { e.preventDefault(); i.focus(); } } else if (k === "m") setMotion(!motion);
  });

  const y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
