/* ==========================================================================
   AI Orbit · MockB — chrome + micro-interactions
   ========================================================================== */
(() => {
  const html = document.documentElement;
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  try { const t = localStorage.getItem("orbitb-theme"); if (t) html.dataset.theme = t; } catch {}
  if (!html.dataset.theme) html.dataset.theme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

  const I = {
    arrow: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="m3 5 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="3.6" stroke="currentColor" stroke-width="1.6"/><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    burger: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };
  window.ORBIT_I = I;

  const SVC = [
    ["enterprise-agents", "Enterprise Agent Solutions", "Production-ready agents that reason, not just automate.", "photos/svc-agents-team"],
    ["ai-first-engineering", "AI-First Software Engineering", "Specialist agents embedded across your SDLC.", "photos/svc-engineering-dev"],
    ["ai-governance", "AI Governance", "Guardrails, quality, ethics and audit readiness.", "photos/svc-governance-secure"],
    ["ai-advisory", "AI Advisory", "Strategy, readiness and use-case prioritisation.", "photos/svc-advisory-workshop"],
  ];
  const logo = `<a class="logo" href="${root}index.html" aria-label="AI Orbit by Evoke — home">
      <svg viewBox="0 0 34 34" fill="none" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="34" y2="34"><stop stop-color="#6F1AB6"/><stop offset="1" stop-color="#FF0032"/></linearGradient></defs>
        <circle cx="17" cy="17" r="7" fill="url(#lg)"/><ellipse cx="17" cy="17" rx="15.5" ry="6.4" stroke="currentColor" stroke-opacity=".4" stroke-width="1.4" transform="rotate(-24 17 17)"/>
        <g class="orbit-sat"><circle cx="17" cy="1.8" r="2.2" fill="#FF0032"/></g></svg>
      AI Orbit <small>Evoke</small></a>`;

  const hdr = document.createElement("header");
  hdr.className = "hdr";
  hdr.innerHTML = `<div class="container row">
    ${logo}
    <nav aria-label="Primary"><ul class="menu" id="menu">
      <li class="dd"><button aria-expanded="false" aria-controls="dd-svc" ${page.startsWith("svc") ? 'aria-current="page"' : ""}>Services ${I.chev}</button>
        <div class="dd-panel" id="dd-svc">${SVC.map(([s, n, d, img]) => `<a href="${root}services/${s}.html"><img src="${root}assets/img/${img}-900.webp" alt="" width="88" height="64" loading="lazy"><div><b>${n}</b><span>${d}</span></div></a>`).join("")}</div></li>
      <li><a href="${root}index.html#industries">Industries</a></li>
      <li><a href="${root}index.html#cases" ${page === "case" ? 'aria-current="page"' : ""}>Case studies</a></li>
      <li><a href="${root}index.html#insights">Insights</a></li>
      <li><a href="${root}index.html#about">About</a></li>
    </ul></nav>
    <div class="tools">
      <button class="theme-switch" role="switch" aria-checked="false" aria-label="Light theme">${I.moon}${I.sun}</button>
      <a class="btn btn--violet btn--sm" href="${root}index.html#contact">Get in touch</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">${I.burger}</button>
    </div></div>`;
  document.body.prepend(hdr);
  const skip = Object.assign(document.createElement("a"), { className: "skip", href: "#main", textContent: "Skip to main content" });
  document.body.prepend(skip);

  const col = (h, items) => `<div><h4>${h}</h4><ul>${items.map(([t, u]) => `<li><a href="${u || "#"}">${t}</a></li>`).join("")}</ul></div>`;
  const ftr = document.createElement("footer");
  ftr.className = "ftr";
  ftr.innerHTML = `<div class="container"><div class="cols">
      <div class="brand">${logo}<p>Build, modernize and govern enterprise AI — structure, speed and safety at every stage of the journey.</p>
        <div class="social"><a href="#" aria-label="Evoke on LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z"/></svg></a>
        <a href="#" aria-label="Evoke on YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9L15.2 12l-5.4 3.1Z"/></svg></a>
        <a href="#" aria-label="Evoke on Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5V12h2.8v9.8H14V12h2.8l.4-3.5H14Z"/></svg></a></div></div>
      ${col("Services", [["Enterprise Agents", `${root}services/enterprise-agents.html`], ["AI-First Engineering", `${root}services/ai-first-engineering.html`], ["AI Governance", `${root}services/ai-governance.html`], ["AI Advisory", `${root}services/ai-advisory.html`], ["AI Academy"]])}
      ${col("Industries", [["Manufacturing & Industrial"], ["Financial Services"], ["Energy & Utilities"], ["Healthcare"], ["Pharma & Life Sciences"], ["Retail & E-Commerce"]])}
      ${col("Partners", [["Microsoft"], ["AWS"], ["Salesforce"], ["ServiceNow"], ["Oracle"], ["UiPath"]])}
      ${col("Insights", [["Case studies", `${root}case-studies/lift-truck-self-service.html`], ["Blog"], ["Videos"], ["News & events"], ["Press releases"], ["Resource hub"]])}
    </div>
    <div class="legal"><span>Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.</span>
      <nav aria-label="Legal"><a href="#">Terms of Use</a><a href="#">Privacy Policy</a><a href="#">Cookies Policy</a><a href="#">Disclaimer</a><a href="#">Sitemap</a><a href="#">Modern Slavery Statement</a></nav></div></div>`;
  document.body.append(ftr);

  /* ---------- Header behaviour ---------- */
  let lastY = null, armed = false; // hide-on-scroll arms only after real input, so arriving at #section keeps the header visible
  ["wheel", "touchmove", "keydown"].forEach((ev) => addEventListener(ev, () => (armed = true), { passive: true, once: true }));
  const onScroll = (e) => {
    const y = scrollY;
    hdr.classList.toggle("scrolled", y > 16);
    if (e && armed && lastY !== null && Math.abs(y - lastY) > 4) hdr.classList.toggle("hide", y > 400 && y > lastY && !hdr.classList.contains("open") && !hdr.querySelector(".dd.open, .vsw.open"));
    if (e) lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const sw = hdr.querySelector(".theme-switch");
  const syncSwitch = () => sw.setAttribute("aria-checked", html.dataset.theme === "light");
  syncSwitch();
  sw.addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("orbitb-theme", html.dataset.theme); } catch {}
    syncSwitch(); dispatchEvent(new Event("themechange"));
  });
  const burger = hdr.querySelector(".burger");
  burger.addEventListener("click", () => { const o = hdr.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); });
  const dd = hdr.querySelector(".dd"), ddb = dd.querySelector("button");
  ddb.addEventListener("click", () => { const o = dd.classList.toggle("open"); ddb.setAttribute("aria-expanded", o); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) { dd.classList.remove("open"); ddb.setAttribute("aria-expanded", false); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { dd.classList.remove("open"); ddb.setAttribute("aria-expanded", false); hdr.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
  hdr.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => { hdr.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  /* ---------- Hero headline word stagger ---------- */
  document.querySelectorAll("[data-words]").forEach((h) => {
    const walk = (node) => { [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) { const frag = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach((w) => { if (/^\s+$/.test(w) || !w) frag.append(w); else { const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.append(s); } }); n.replaceWith(frag); }
      else if (n.nodeType === 1) walk(n); }); };
    walk(h);
    h.querySelectorAll(".w").forEach((w, i) => (w.style.animationDelay = `${0.15 + i * 0.07}s`));
  });

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  /* ---------- Counters + progress rings ---------- */
  const fmt = (v, d) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), d = (el.dataset.count.split(".")[1] || "").length, dur = calm ? 1 : 1700, t0 = performance.now();
    (function step(now) { const p = Math.min((now - t0) / dur, 1), v = to * (1 - Math.pow(1 - p, 4)); el.firstChild.nodeValue = fmt(v, d); if (p < 1) requestAnimationFrame(step); })(t0);
    const ring = el.closest(".ring-stat")?.querySelector(".bar"); if (ring) ring.style.strokeDashoffset = 471 * (1 - (+ring.dataset.pct || 0) / 100);
  }), { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Image parallax ---------- */
  const par = [...document.querySelectorAll("[data-parallax]")];
  if (par.length && !calm) {
    const upd = () => par.forEach((img) => { const r = img.parentElement.getBoundingClientRect(); const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; img.style.transform = `translateY(${(-p * 8 - 6).toFixed(2)}%)`; });
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* ---------- Orbit pipeline (tabs around an orbit) ---------- */
  const pipe = document.querySelector("[data-pipeline]");
  if (pipe) {
    const steps = JSON.parse(pipe.querySelector("script[type='application/json']").textContent);
    const orbit = pipe.querySelector(".pipe-orbit"), detail = pipe.querySelector(".pipe-detail .content"), list = pipe.querySelector(".pipe-list"), prog = pipe.querySelector(".prog");
    const N = steps.length, C = 2 * Math.PI * 230;
    prog.style.strokeDasharray = C; prog.style.strokeDashoffset = C;
    const nodes = steps.map((s, i) => {
      const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
      const b = document.createElement("button"); b.className = "node"; b.textContent = String(i + 1).padStart(2, "0");
      b.setAttribute("role", "tab"); b.id = `pn-${i}`; b.setAttribute("aria-controls", "pipe-panel"); b.setAttribute("aria-label", `Step ${i + 1}: ${s.t}`);
      b.style.left = `${50 + Math.cos(a) * 41}%`; b.style.top = `${50 + Math.sin(a) * 41}%`;
      orbit.append(b); return b;
    });
    const chips = steps.map((s, i) => { const c = document.createElement("button"); c.textContent = s.t; c.setAttribute("role", "tab"); c.setAttribute("aria-controls", "pipe-panel"); c.tabIndex = -1; list.append(c); return c; });
    let cur = -1, timer;
    const select = (i, user) => {
      if (i === cur) return; cur = i;
      [nodes, chips].forEach((arr) => arr.forEach((n, k) => { n.setAttribute("aria-selected", k === i); n.tabIndex = k === i ? 0 : -1; }));
      prog.style.strokeDashoffset = C * (1 - (i + 1) / N);
      const s = steps[i];
      detail.innerHTML = `<p class="step">Step ${i + 1} of ${N}</p><h3 class="h3">${s.t}</h3><p class="lead">${s.d}</p>`;
      detail.classList.remove("anim"); void detail.offsetWidth; detail.classList.add("anim");
      if (user) stop();
    };
    const stop = () => { clearInterval(timer); timer = null; pipe.querySelector(".autoplay").hidden = true; };
    [...nodes, ...chips].forEach((n, k) => {
      const i = k % N;
      n.addEventListener("click", () => select(i, true));
      n.addEventListener("keydown", (e) => { const d = ["ArrowRight", "ArrowDown"].includes(e.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(e.key) ? -1 : 0; if (d) { e.preventDefault(); const j = (cur + d + N) % N; select(j, true); (k < N ? nodes : chips)[j].focus(); } });
    });
    select(0);
    if (!calm) {
      const vis = new IntersectionObserver(([e]) => { if (e.isIntersecting && !timer && !pipe.querySelector(".autoplay").hidden) timer = setInterval(() => select((cur + 1) % N), 3800); else if (!e.isIntersecting) { clearInterval(timer); timer = null; } });
      vis.observe(pipe);
      pipe.addEventListener("pointerenter", () => { clearInterval(timer); timer = null; });
    }
  }

  /* ---------- Carousel ---------- */
  document.querySelectorAll("[data-carousel]").forEach((wrap) => {
    const track = wrap.querySelector(".carousel"), prev = wrap.querySelector("[data-prev]"), next = wrap.querySelector("[data-next]");
    const step = () => track.querySelector(".case").getBoundingClientRect().width + 24;
    const upd = () => { prev.disabled = track.scrollLeft < 8; next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8; };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: calm ? "auto" : "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: calm ? "auto" : "smooth" }));
    track.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  });

  /* ---------- TOC scrollspy ---------- */
  const toc = document.querySelectorAll(".toc a");
  if (toc.length) {
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) toc.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-25% 0px -65% 0px" });
    toc.forEach((a) => { const t = document.querySelector(a.hash); if (t) so.observe(t); });
  }

  /* ---------- Form validation (accessible) ---------- */
  document.querySelectorAll("form.form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); let first = null;
    f.querySelectorAll("[required]").forEach((inp) => {
      const err = f.querySelector(`#${inp.id}-err`); const bad = !inp.value.trim() || (inp.type === "email" && !/^\S+@\S+\.\S+$/.test(inp.value));
      inp.setAttribute("aria-invalid", bad); if (err) err.textContent = bad ? (inp.type === "email" ? "Enter a valid work email, like name@company.com." : "This field is required.") : "";
      if (bad && !first) first = inp;
    });
    if (first) { first.focus(); return; }
    f.classList.add("sent"); f.querySelector(".ok").focus(); f.reset();
  }));
})();
