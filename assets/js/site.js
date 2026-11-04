/* ==========================================================================
   AI Orbit — shared chrome (header/footer) + micro-interactions
   ========================================================================== */
(() => {
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";
  const html = document.documentElement;

  /* ---------- Theme (persisted per viewer) ---------- */
  const stored = (() => { try { return localStorage.getItem("orbit-theme"); } catch { return null; } })();
  html.dataset.theme = stored || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  const icon = {
    arrow: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.3"/></svg>',
    diag: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10 10 2M4 2h6v6" stroke="currentColor" stroke-width="1.3"/></svg>',
    agents: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor"/><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-dasharray="2 2.5"/><circle cx="15.5" cy="6" r="1.4" fill="currentColor"/></svg>',
    code: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 5 2 9l4 4M12 5l4 4-4 4M10 3 8 15" stroke="currentColor" stroke-width="1.2"/></svg>',
    shield: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.8 15 4v4.6c0 3.6-2.6 6.4-6 7.6-3.4-1.2-6-4-6-7.6V4l6-2.2Z" stroke="currentColor"/><path d="m6.2 9 2 2 3.6-3.8" stroke="currentColor"/></svg>',
    compass: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.2" stroke="currentColor"/><path d="m11.8 6.2-1.6 4-4 1.6 1.6-4 4-1.6Z" stroke="currentColor"/></svg>',
  };
  window.ORBIT_ICONS = icon;

  const services = [
    { slug: "enterprise-agents", name: "Enterprise Agent Solutions", d: "Production-ready agents that reason, not just automate.", i: icon.agents },
    { slug: "ai-first-engineering", name: "AI-First Software Engineering", d: "Specialist agents embedded across your SDLC.", i: icon.code },
    { slug: "ai-governance", name: "AI Governance", d: "Guardrails, QA, ethics and audit readiness.", i: icon.shield },
    { slug: "ai-advisory", name: "AI Advisory", d: "Strategy, readiness and use-case prioritisation.", i: icon.compass },
  ];

  const brand = `
    <a class="brand" href="${root}index.html" aria-label="AI Orbit home">
      <svg class="brand-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="4.2" fill="currentColor"/>
        <ellipse cx="14" cy="14" rx="12.5" ry="5.2" stroke="currentColor" stroke-opacity=".45" transform="rotate(-28 14 14)"/>
        <g class="sat"><circle cx="14" cy="1.6" r="1.8" fill="var(--accent)"/></g>
      </svg>
      AI Orbit <small>BY EVOKE</small>
    </a>`;

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container nav">
      ${brand}
      <ul class="nav-links" id="nav-links">
        <span class="nav-pill" aria-hidden="true"></span>
        <li class="has-menu">
          <button aria-expanded="false" aria-haspopup="true" ${page.startsWith("svc") ? 'aria-current="page"' : ""}>Services
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="m2 4 3 3 3-3" stroke="currentColor"/></svg></button>
          <div class="mega" role="menu">
            ${services.map((s) => `<a role="menuitem" href="${root}services/${s.slug}.html"><i class="mi">${s.i}</i><div><b>${s.name}</b><span>${s.d}</span></div></a>`).join("")}
          </div>
        </li>
        <li><a href="${root}index.html#industries">Industries</a></li>
        <li><a href="${root}case-studies/lift-truck-self-service.html" ${page === "case" ? 'aria-current="page"' : ""}>Case Studies</a></li>
        <li><a href="${root}index.html#insights">Insights</a></li>
        <li><a href="${root}index.html#about">About</a></li>
      </ul>
      <div class="nav-actions">
        <button class="theme-toggle" aria-label="Toggle colour theme" title="Toggle theme"><span class="planet"></span><span class="moon"></span></button>
        <a class="btn btn--primary btn--sm magnetic" href="${root}index.html#contact">Get in touch <span class="orb"></span></a>
        <button class="menu-btn" aria-label="Open menu" aria-controls="nav-links" aria-expanded="false">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 11h12" stroke="currentColor" stroke-width="1.3"/></svg></button>
      </div>
    </div>`;
  document.body.prepend(header);

  const skip = document.createElement("a");
  skip.className = "skip"; skip.href = "#main"; skip.textContent = "Skip to content";
  document.body.prepend(skip);

  const col = (h, items) => `<div><h4>${h}</h4><ul>${items.map((t) => `<li><a href="${typeof t === "string" ? "#" : t[1]}">${typeof t === "string" ? t : t[0]}</a></li>`).join("")}</ul></div>`;
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">${brand}<p>Build, modernize, govern — all in one orbit. Structure, speed and safety for every stage of your AI journey.</p></div>
        ${col("Services", [["AI Apps", `${root}services/enterprise-agents.html`], ["SDLC AI", `${root}services/ai-first-engineering.html`], ["AI Governance", `${root}services/ai-governance.html`], ["AI Strategy", `${root}services/ai-advisory.html`], "AI Operations", "AI Academy"])}
        ${col("Industries", ["Manufacturing & Industrial", "BFSI", "Retail & E-Commerce", "Healthcare", "Energy & Utilities", "Pharma & Life Sciences", "Oil & Gas"])}
        ${col("Partners", ["Microsoft", "Oracle", "Salesforce", "ServiceNow", "UiPath", "AWS", "Pega"])}
        ${col("Insights", [["Case Studies", `${root}case-studies/lift-truck-self-service.html`], "Blog", "Videos", "News & Events", "Press Releases", "Resource Hub"])}
      </div>
      <div class="foot-word" aria-hidden="true">AI&nbsp;Orbit</div>
      <div class="foot-bottom">
        <span>Evoke Technologies Pvt. Ltd. © 2026 All Rights Reserved.</span>
        <nav aria-label="Legal"><a href="#">Terms of Use</a><a href="#">Privacy Policy</a><a href="#">Cookies Policy</a><a href="#">Disclaimer</a><a href="#">Sitemap</a><a href="#">Modern Slavery Statement</a></nav>
      </div>
    </div>`;
  document.body.append(footer);

  /* ---------- Header behaviour ---------- */
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 12);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  header.querySelector(".theme-toggle").addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("orbit-theme", html.dataset.theme); } catch {}
    dispatchEvent(new Event("themechange"));
  });
  const menuBtn = header.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  header.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => { header.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", false); }));
  const svcBtn = header.querySelector(".has-menu > button");
  svcBtn.addEventListener("click", () => {
    const li = svcBtn.parentElement; const open = li.classList.toggle("open");
    svcBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".has-menu")) { svcBtn.parentElement.classList.remove("open"); svcBtn.setAttribute("aria-expanded", false); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { svcBtn.parentElement.classList.remove("open"); header.classList.remove("menu-open"); } });

  // Sliding pill indicator under hovered nav item
  const pill = header.querySelector(".nav-pill");
  const links = header.querySelector(".nav-links");
  links.querySelectorAll(":scope > li > a, :scope > li > button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const r = el.getBoundingClientRect(), p = links.getBoundingClientRect();
      pill.style.width = r.width + "px"; pill.style.transform = `translateX(${r.left - p.left - 4}px)`; pill.style.opacity = 1;
      pill.style.left = "4px";
    });
  });
  links.addEventListener("mouseleave", () => (pill.style.opacity = 0));

  /* ---------- Reduced motion guard ---------- */
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Cursor satellite ---------- */
  if (fine && !calm) {
    const c = document.createElement("div"); c.className = "cursor"; document.body.append(c);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
    (function loop() { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; c.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", (e) => c.classList.toggle("hover", !!e.target.closest("a, button, [data-hover]")));
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !calm) {
    document.addEventListener("pointermove", (e) => {
      document.querySelectorAll(".magnetic").forEach((b) => {
        const r = b.getBoundingClientRect(); const mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(mx, my) < Math.max(r.width, 80);
        b.style.transform = near ? `translate(${mx * 0.18}px, ${my * 0.3}px)` : "";
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), dur = calm ? 0 : 1600, t0 = performance.now();
    const dec = (el.dataset.count.split(".")[1] || "").length;
    (function step(now) { const p = Math.min((now - t0) / (dur || 1), 1); const v = to * (1 - Math.pow(1 - p, 4)); el.firstChild.nodeValue = v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(step); })(t0);
  }), { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Statement word-by-word reveal ---------- */
  document.querySelectorAll(".statement").forEach((st) => {
    st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    const words = [...st.querySelectorAll(".w")];
    const update = () => {
      const r = st.getBoundingClientRect(); const p = Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0), 1);
      const n = Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle("on", i < n || calm));
    };
    addEventListener("scroll", update, { passive: true }); update();
  });

  /* ---------- Services orbit ↔ list sync ---------- */
  const svcItems = [...document.querySelectorAll(".svc")];
  if (svcItems.length) {
    const set = (i) => {
      svcItems.forEach((s, k) => s.classList.toggle("on", k === i));
      document.querySelectorAll("[data-ring]").forEach((r) => r.classList.toggle("on", +r.dataset.ring === i));
      document.querySelectorAll("[data-planet]").forEach((p) => p.classList.toggle("on", +p.dataset.planet === i));
    };
    svcItems.forEach((s, i) => { s.addEventListener("mouseenter", () => set(i)); s.addEventListener("focusin", () => set(i)); });
    document.querySelectorAll("[data-planet]").forEach((p) => p.addEventListener("mouseenter", () => set(+p.dataset.planet)));
    set(0);
    // Planets travel along their rings
    const planets = [...document.querySelectorAll("[data-planet]")];
    const speeds = [0.22, 0.14, 0.09, 0.06], offs = [0.3, 2.1, 3.9, 5.3];
    let t = 0, last = performance.now();
    (function loop(now) {
      const dt = (now - last) / 1000; last = now; if (!calm) t += dt;
      planets.forEach((p, i) => { const r = +p.dataset.r, a = offs[i] + t * speeds[i]; p.setAttribute("transform", `translate(${300 + Math.cos(a) * r} ${300 + Math.sin(a) * r * 0.56})`); });
      requestAnimationFrame(loop);
    })(last);
  }

  /* ---------- Pipeline progress (scroll-linked satellite) ---------- */
  document.querySelectorAll(".pipeline").forEach((pl) => {
    const stages = [...pl.querySelectorAll(".stage")];
    const update = () => {
      const r = pl.getBoundingClientRect(); const p = Math.min(Math.max((innerHeight * 0.75 - r.top) / (innerHeight * 0.6), 0), 1);
      pl.style.setProperty("--p", p * 100 + "%");
      stages.forEach((s, i) => s.classList.toggle("on", p * stages.length > i + 0.05));
    };
    addEventListener("scroll", update, { passive: true }); update();
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll("[role=tablist]").forEach((tl) => {
    const tabs = [...tl.querySelectorAll("[role=tab]")];
    const select = (t) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute("aria-controls")); p.hidden = !on; if (on) { p.classList.remove("anim"); void p.offsetWidth; p.classList.add("anim"); } });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => { const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (d) { e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); } });
    });
  });

  /* ---------- Case study TOC scrollspy ---------- */
  const toc = document.querySelectorAll(".cs-toc a");
  if (toc.length) {
    const sio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) toc.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-30% 0px -60% 0px" });
    toc.forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (t) sio.observe(t); });
  }

  /* ---------- Hero telemetry (live pointer readout) ---------- */
  const theta = document.querySelector("[data-theta]");
  if (theta) {
    addEventListener("pointermove", (e) => {
      const a = (Math.atan2(e.clientY - innerHeight / 2, e.clientX - innerWidth / 2) * 180) / Math.PI;
      theta.textContent = ((a + 360) % 360).toFixed(1).padStart(5, "0") + "°";
    });
  }

  /* ---------- Contact form (demo) ---------- */
  document.querySelectorAll("form.form").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); f.classList.add("sent"); f.reset(); }));

  /* ---------- Generative orbit art for cards (2D canvas) ---------- */
  const arts = document.querySelectorAll("canvas[data-art]");
  arts.forEach((cv) => {
    const ctx = cv.getContext("2d"); const seed = +cv.dataset.art; let hover = 0, h = 0, t = seed * 10, run = false;
    const card = cv.closest(".card"); card?.addEventListener("mouseenter", () => (hover = 1)); card?.addEventListener("mouseleave", () => (hover = 0));
    new IntersectionObserver(([e]) => (run = e.isIntersecting)).observe(cv);
    const size = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2); cv.width = r.width * d; cv.height = r.height * d; };
    size(); new ResizeObserver(size).observe(cv);
    const css = (n) => getComputedStyle(html).getPropertyValue(n).trim();
    (function draw() {
      requestAnimationFrame(draw); if (!run) return;
      h += (hover - h) * 0.06; if (!calm) t += 0.004 + h * 0.018;
      const W = cv.width, H = cv.height, cx = W * (seed === 1 ? 0.5 : seed === 2 ? 0.62 : 0.38), cy = H * 0.58;
      ctx.clearRect(0, 0, W, H);
      const fg = css("--fg"), ac = css("--accent"), sg = css("--signal");
      const n = 5 + seed; ctx.lineWidth = Math.max(1, W / 600);
      for (let i = 0; i < n; i++) {
        const rx = W * (0.12 + i * 0.075), ry = rx * (0.28 + seed * 0.06), rot = -0.35 + seed * 0.25 + h * 0.08;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.globalAlpha = 0.14 + (i === 2 ? 0.2 : 0); ctx.strokeStyle = i === 2 ? ac : fg; ctx.setLineDash(i % 2 ? [2, 6] : []);
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        const a = t * (1.6 / (i + 1)) + i * 1.7; ctx.globalAlpha = 1; ctx.fillStyle = i === n - 1 ? sg : i % 2 ? fg : ac;
        ctx.beginPath(); ctx.arc(Math.cos(a) * rx, Math.sin(a) * ry, W / (i === 2 ? 110 : 200), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.09); g.addColorStop(0, ac); g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.9; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, W * 0.09, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    })();
  });
})();
