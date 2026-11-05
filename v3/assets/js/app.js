/* ==========================================================================
   AI Orbit · Version 3 — chrome + interactions
   ========================================================================== */
(() => {
  const html = document.documentElement;
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  try { const t = localStorage.getItem("orbitc-theme"); if (t) html.dataset.theme = t; } catch {}
  if (!html.dataset.theme) html.dataset.theme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

  const ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const roll = (s) => `<span data-roll aria-hidden="true">${[...s].map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("")}</span><span class="sr-only">${s}</span>`;
  window.V3 = { ARROW, roll };

  const SVC = [
    ["enterprise-agents", "Enterprise Agent Solutions", "Build what thinks.", "svc-agents"],
    ["ai-first-engineering", "AI-First Software Engineering", "Intelligence in every sprint.", "svc-engineering"],
    ["ai-governance", "AI Governance", "Move fast. Sleep well.", "svc-governance"],
    ["ai-advisory", "AI Advisory", "Know before you build.", "svc-advisory"],
  ];
  const brand = `<a class="brand" href="${root}index.html" aria-label="AI Orbit by Evoke — home">
      <svg viewBox="0 0 30 30" fill="none" aria-hidden="true"><defs><linearGradient id="v3g" x1="0" y1="0" x2="30" y2="30"><stop stop-color="#A485FF"/><stop offset=".5" stop-color="#6C82FF"/><stop offset="1" stop-color="#3FDCF2"/></linearGradient></defs>
        <circle cx="15" cy="15" r="5.2" fill="url(#v3g)"/><g class="ring"><ellipse cx="15" cy="15" rx="13" ry="5.4" stroke="url(#v3g)" stroke-width="1.3" transform="rotate(-30 15 15)"/><circle cx="26.2" cy="8.6" r="1.8" fill="#3FDCF2"/></g></svg>
      AI Orbit <small>EVOKE</small></a>`;

  /* ---------- Nav ---------- */
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `${brand}
    <nav aria-label="Primary"><ul class="links" id="v3-links">
      <li class="dd"><button aria-expanded="false" aria-controls="v3-dd" ${page.startsWith("svc") ? 'aria-current="page"' : ""}>Services <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
        <div class="dd-panel" id="v3-dd">${SVC.map(([s, n, d, img]) => `<a href="${root}services/${s}.html"><img src="${root}assets/img/${img}-900.webp" alt="" width="84" height="60" loading="lazy"><div><b>${n}</b><span>${d}</span></div></a>`).join("")}</div></li>
      <li><a href="${root}index.html#cases" ${page === "case" ? 'aria-current="page"' : ""}>Case studies</a></li>
      <li><a href="${root}index.html#industries">Industries</a></li>
      <li><a href="${root}index.html#insights">Insights</a></li>
      <li><a href="${root}index.html#contact">Contact</a></li>
    </ul></nav>
    <div class="actions v3-actions">
      <button class="theme-btn" aria-label="Switch to light theme"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5"/><path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor"/></svg></button>
      <a class="btn btn--solid btn--sm" href="${root}index.html#contact">${roll("Launch your AI journey")}<span class="ic">${ARROW}</span></a>
      <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="v3-links"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 6h12M3 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
    </div>`;
  document.body.prepend(nav);
  const skip = Object.assign(document.createElement("a"), { className: "skip", href: "#main", textContent: "Skip to main content" });
  document.body.prepend(skip);

  const tb = nav.querySelector(".theme-btn");
  const syncTb = () => tb.setAttribute("aria-label", html.dataset.theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  syncTb();
  tb.addEventListener("click", () => { html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light"; try { localStorage.setItem("orbitc-theme", html.dataset.theme); } catch {} syncTb(); dispatchEvent(new Event("themechange")); });
  const burger = nav.querySelector(".burger");
  burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); });
  const dd = nav.querySelector(".dd"), ddb = dd.querySelector("button");
  ddb.addEventListener("click", () => { const o = dd.classList.toggle("open"); ddb.setAttribute("aria-expanded", o); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) { dd.classList.remove("open"); ddb.setAttribute("aria-expanded", false); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { dd.classList.remove("open"); nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
  nav.querySelectorAll(".links a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  /* ---------- Footer ---------- */
  const col = (h, items) => `<div><h4>${h}</h4><ul>${items.map(([t, u]) => `<li><a href="${u || "#"}">${t}</a></li>`).join("")}</ul></div>`;
  const ftr = document.createElement("footer");
  ftr.className = "ftr";
  ftr.innerHTML = `<div class="container"><div class="cols">
      <div class="about">${brand}<p>Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.</p></div>
      ${col("Services", SVC.map(([s, n]) => [n, `${root}services/${s}.html`]))}
      ${col("Industries", [["Manufacturing & Industrial"], ["Financial Services (BFSI)"], ["Energy (Oil & Gas)"], ["Healthcare & Life Sciences"], ["Higher Education"], ["Mining & Natural Resources"]])}
      ${col("Partners", [["Microsoft"], ["AWS"], ["Salesforce"], ["ServiceNow"], ["Oracle"], ["UiPath"]])}
      ${col("Insights", [["Case studies", `${root}case-studies/lift-truck-self-service.html`], ["Blog"], ["Videos"], ["News & events"], ["Press releases"], ["Resource hub"]])}
    </div>
    <div class="wordmark" aria-hidden="true">AI Orbit</div>
    <div class="legal"><span>Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.</span>
      <nav aria-label="Legal"><a href="#">Terms of Use</a><a href="#">Privacy Policy</a><a href="#">Cookies Policy</a><a href="#">Disclaimer</a><a href="#">Sitemap</a><a href="#">Modern Slavery Statement</a></nav></div></div>`;
  document.body.append(ftr);
  const wm = ftr.querySelector(".wordmark");
  ftr.addEventListener("pointermove", (e) => { const r = wm.getBoundingClientRect(); wm.style.setProperty("--mx", `${e.clientX - r.left}px`); });

  /* ---------- Roll labels on static buttons ---------- */
  document.querySelectorAll("[data-roll-text]").forEach((el) => { el.innerHTML = roll(el.dataset.rollText); });

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!calm && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach((a) => a.addEventListener("click", (e) => {
      const u = new URL(a.href, location.href); if (u.pathname !== location.pathname || !u.hash) return;
      const t = document.querySelector(u.hash); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -90 }); history.replaceState(null, "", u.hash);
    }));
  }

  /* ---------- Nav hide on scroll down (armed after real input) ---------- */
  let lastY = scrollY, armed = false;
  ["wheel", "touchmove", "keydown"].forEach((ev) => addEventListener(ev, () => (armed = true), { passive: true, once: true }));

  /* ---------- Scroll-driven effects (one rAF loop) ---------- */
  const statement = document.querySelector(".statement");
  let words = [];
  if (statement) { statement.innerHTML = statement.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" "); words = [...statement.querySelectorAll(".w")]; }
  const par = [...document.querySelectorAll("[data-speed]")];
  const pin = document.querySelector(".svc-pin"), track = pin?.querySelector(".svc-track"), bar = pin?.querySelector(".svc-progress");
  const pinOn = () => pin && !calm && innerWidth > 900;
  const tl = document.querySelector(".timeline"), steps = tl ? [...tl.querySelectorAll(".step")] : [];
  const onFrame = () => {
    const y = scrollY, vh = innerHeight;
    if (armed && Math.abs(y - lastY) > 4) nav.classList.toggle("hide", y > 500 && y > lastY && !nav.classList.contains("open") && !document.querySelector(".dd.open, .vsw.open"));
    lastY = y;
    if (words.length) { const r = statement.getBoundingClientRect(); const p = Math.min(Math.max((vh * .85 - r.top) / (r.height + vh * .45), 0), 1); const n = calm ? words.length : Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle("on", i < n)); }
    if (!calm) par.forEach((el) => { const r = el.getBoundingClientRect(); const c = (r.top + r.height / 2 - vh / 2) / vh; el.style.transform = `translate3d(0, ${(c * +el.dataset.speed * 100).toFixed(2)}px, 0)`; });
    if (pinOn()) {
      const r = pin.getBoundingClientRect(); const total = pin.offsetHeight - vh; const p = Math.min(Math.max(-r.top / total, 0), 1);
      const max = track.scrollWidth - innerWidth; track.style.transform = `translate3d(${(-p * max).toFixed(1)}px, 0, 0)`;
      bar.style.setProperty("--p", `${p * 100}%`); bar.querySelector(".mono").textContent = `0${Math.min(4, Math.floor(p * 3.999) + 1)} / 04`;
    } else if (track) track.style.transform = "";
    if (tl) { const r = tl.getBoundingClientRect(); const p = Math.min(Math.max((vh * .6 - r.top) / r.height, 0), 1); tl.querySelector(".fill").style.height = `${p * 100}%`; steps.forEach((s) => s.classList.toggle("on", s.getBoundingClientRect().top < vh * .6)); }
    requestAnimationFrame(onFrame);
  };
  requestAnimationFrame(onFrame);

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  /* ---------- Cursor spotlight on surfaces ---------- */
  if (fine) document.addEventListener("pointermove", (e) => {
    const el = e.target.closest?.(".spot"); if (!el) return; const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });

  /* ---------- Hero HUD: live neural activity readout ---------- */
  const hudA = document.querySelector("[data-hud-agents]"), hudS = document.querySelector("[data-hud-signals]");
  if (hudA) { let s = 2318; setInterval(() => { s += 37 + Math.floor(Math.random() * 60); hudS.textContent = s.toLocaleString("en-US"); hudA.textContent = String(10 + Math.floor(Math.random() * 3)).padStart(2, "0"); }, calm ? 99999 : 1200); }

  /* ---------- HUD UTC clock ---------- */
  const utc = document.querySelector("[data-utc]");
  if (utc) { const tick = () => { utc.textContent = "UTC " + new Date().toISOString().slice(11, 19); }; tick(); setInterval(tick, 1000); }

  /* ---------- Industries explorer ---------- */
  const ind = document.querySelector("[data-industries]");
  if (ind) {
    const items = [...ind.querySelectorAll(".ind-item")], imgs = [...ind.querySelectorAll(".ind-view img")], cap = ind.querySelector(".ind-view .cap");
    const set = (i) => { items.forEach((it, k) => { it.classList.toggle("on", k === i); it.querySelector("button").setAttribute("aria-expanded", k === i); }); imgs.forEach((im, k) => im.classList.toggle("on", k === i)); cap.textContent = items[i].querySelector(".t").textContent; };
    items.forEach((it, i) => { const b = it.querySelector("button"); b.addEventListener("click", () => set(i)); if (fine) b.addEventListener("mouseenter", () => set(i)); });
    set(0);
  }

  /* ---------- Knowledge hub filters + load more ---------- */
  const kh = document.querySelector("[data-kh]");
  if (kh) {
    const cards = [...kh.querySelectorAll(".kh-card")], btns = [...document.querySelectorAll("[data-filter]")], more = document.querySelector("[data-more]");
    let filter = "all", expanded = false; const LIMIT = 6;
    const apply = () => { let shown = 0, total = 0; cards.forEach((c) => { const ok = filter === "all" || c.dataset.type === filter; if (ok) total++; const vis = ok && (expanded || shown < LIMIT); if (vis) shown++; c.hidden = !vis; }); if (more) more.hidden = expanded || total <= LIMIT; };
    btns.forEach((b) => b.addEventListener("click", () => { filter = b.dataset.filter; btns.forEach((x) => x.setAttribute("aria-pressed", x === b)); apply(); }));
    more?.addEventListener("click", () => { expanded = true; apply(); });
    apply();
  }

  /* ---------- Office clocks ---------- */
  const clocks = [...document.querySelectorAll("[data-tz]")];
  if (clocks.length) { const tick = () => clocks.forEach((c) => { c.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: c.dataset.tz }).format(new Date()) + " local"; }); tick(); setInterval(tick, 20000); }

  /* ---------- TOC scrollspy ---------- */
  const toc = document.querySelectorAll(".toc a");
  if (toc.length) { const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) toc.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-25% 0px -65% 0px" }); toc.forEach((a) => { const t = document.querySelector(a.hash); if (t) so.observe(t); }); }

  /* ---------- Form validation ---------- */
  document.querySelectorAll("form.form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); let first = null;
    f.querySelectorAll("[required]").forEach((inp) => { const err = f.querySelector(`#${inp.id}-err`); const bad = !inp.value.trim() || (inp.type === "email" && !/^\S+@\S+\.\S+$/.test(inp.value)); inp.setAttribute("aria-invalid", bad); if (err) err.textContent = bad ? (inp.type === "email" ? "Enter a valid work email, like name@company.com." : "This field is required.") : ""; if (bad && !first) first = inp; });
    if (first) { first.focus(); return; } f.classList.add("sent"); f.querySelector(".ok").focus(); f.reset();
  }));
})();
