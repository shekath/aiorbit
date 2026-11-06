#!/usr/bin/env python3
"""Generate the Version 2 (mockb/) service pages and case study.

Content is shared with Version 1: service data is imported from tools/build_pages.py.
Run from the repo root:  python3 tools/build_pages_v2.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from build_pages import SERVICES, PIPELINE  # noqa: E402

IMG = {"enterprise-agents": "svc-agents", "ai-first-engineering": "svc-engineering", "ai-governance": "svc-governance", "ai-advisory": "svc-advisory"}
ALT = {
    "svc-agents": "Flowing violet and red light lines, like connected agent workflows",
    "svc-engineering": "A field of glowing data points rolling to the horizon",
    "svc-governance": "Concentric protective rings of light around a bright core",
    "svc-advisory": "A violet nebula crossed by a thin orbital path",
}
ARROW = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ORBIT_BTN = f'<span class="orbit-btn" aria-hidden="true"><svg class="trace" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30"/></svg>{ARROW}</span>'


def head(title, desc):
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <script>try{{var t=localStorage.getItem("orbitb-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}}catch(e){{}}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
"""


TAIL = """<script src="../assets/js/app.js"></script>
<script src="../../assets/js/version-switch.js?v=7"></script>
</body>
</html>
"""


def cta():
    return f"""  <section class="section" aria-labelledby="cta-title">
    <div class="container"><div class="cta rv">
      <img src="../assets/img/cta-planet.webp" alt="" width="2560" height="1100" loading="lazy" />
      <div class="in"><p class="label">Ready when you are</p><h2 id="cta-title" class="h1">Ready to steer your next release?</h2>
        <p>A scoped proposal, a realistic timeline and references from clients in your sector. No pitch decks.</p>
        <a class="btn btn--primary" href="../index.html#contact">Talk to an architect <span class="ico">{ARROW}</span></a></div>
    </div></div>
  </section>
"""


def service(s, prev, nxt):
    title_plain = re.sub(r"<[^>]+>", "", s["title"])
    m = re.search(r"<span[^>]*>(.*?)</span>", s["title"])
    lead_part = re.sub(r"<span.*", "", s["title"]).strip()
    h1 = f'{lead_part} <span class="grad-text">{m.group(1)}</span>' if m else title_plain
    img = IMG[s["slug"]]
    facts = "".join(f"<div><span>{k}</span><b>{v}</b></div>" for k, v in s["meta"])
    panels = ""
    for i, (eb, h, p, checks, fit) in enumerate(s["panels"]):
        lis = "".join(f"<li>{c}</li>" for c in checks)
        panels += f"""<div class="panel rv" data-d="{i}"><p class="label">{eb}</p><h3 class="h3">{h}</h3><p>{p}</p><ul class="ticks">{lis}</ul><div class="fit"><span>Fit for</span><p>{fit}</p></div></div>"""
    caps = "".join(f'<div class="cap rv" data-d="{i % 3}"><i aria-hidden="true">{i + 1:02d}</i><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(s["caps"]))
    rings = ""
    for i, (n, u, l) in enumerate(s["stats"]):
        num = f'<span data-count="{n}">0</span>' if n.isdigit() else n
        pct = [72, 84, 58][i]
        rings += f"""<div class="ring-stat rv" data-d="{i}"><div class="dial"><svg viewBox="0 0 168 168" aria-hidden="true"><circle class="track" cx="84" cy="84" r="75"/><circle class="bar" data-pct="{pct}" cx="84" cy="84" r="75"/></svg><div class="val">{num}<sup>{u}</sup></div></div><b>{l}</b></div>"""
    steps = ",\n          ".join('{"t":"%s","d":"%s"}' % (h, p.replace('"', "'")) for h, p in PIPELINE)
    desc = re.sub(r"<[^>]+>", "", s["lead"])
    return head(f"{s['name']} — AI Orbit by Evoke", desc) + f"""<body data-root="../" data-page="svc-{s['slug']}">
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6F1AB6"/><stop offset="1" stop-color="#FF0032"/></linearGradient>
  <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B98CFF"/><stop offset=".55" stop-color="#6F1AB6"/><stop offset="1" stop-color="#FF0032"/></linearGradient></defs></svg>
<main id="main">
  <section class="p-hero" aria-labelledby="ph-title">
    <div class="bg"><img src="../assets/img/{img}.webp" alt="" width="1800" height="1200" /></div>
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s['name']}</span></nav>
      <div class="copy">
        <p class="label">Service {s['idx']} · {s['name']}</p>
        <h1 id="ph-title" class="h1">{h1}</h1>
        <p class="lead">{s['lead']}</p>
        <div class="hero-ctas"><a class="btn btn--primary" href="../index.html#contact">Get started <span class="ico">{ARROW}</span></a><a class="btn btn--ghost" href="#approach">See the approach</a></div>
      </div>
      <div class="facts">{facts}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="imp-title">
    <div class="container impact">
      <div class="rv" style="display:grid;gap:20px"><p class="label">Impact</p><h2 id="imp-title" class="h2">Outcomes you can measure.</h2><p class="lead">Numbers from delivery programs in this service line.</p></div>
      <div class="rings">{rings}</div>
    </div>
  </section>

  <section class="section section--alt" id="approach" aria-labelledby="ap-title">
    <div class="container">
      <div class="head"><div><p class="label">Approach</p><h2 id="ap-title" class="h2">Two paths. One engine.</h2></div><p class="lead" style="max-width:440px">The same agent pipeline powers both — tuned for the problem you’re solving.</p></div>
      <div class="two">{panels}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="cap-title">
    <div class="container">
      <div class="head"><div><p class="label">Capabilities</p><h2 id="cap-title" class="h2">What’s inside this orbit.</h2></div></div>
      <div class="caps">{caps}</div>
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="pipe-title">
    <div class="container">
      <div class="head"><div><p class="label">The agentic pipeline</p><h2 id="pipe-title" class="h2">Evoke agentic modernization accelerator.</h2></div><p class="lead" style="max-width:440px">Specialist agents hand off cleanly between stages. Select a stage to see what happens.</p></div>
      <div class="pipe" data-pipeline>
        <script type="application/json">[
          {steps}
        ]</script>
        <div class="pipe-orbit" role="tablist" aria-label="Pipeline stages">
          <svg viewBox="0 0 560 560" aria-hidden="true"><circle class="o2" cx="280" cy="280" r="270"/><circle class="o" cx="280" cy="280" r="230"/><circle class="prog" cx="280" cy="280" r="230" transform="rotate(-90 280 280)"/><circle class="o2" cx="280" cy="280" r="190"/></svg>
          <div class="core"><div><b>6</b><br /><span>stages · 1 engine</span></div></div>
        </div>
        <div class="pipe-detail"><div class="content" id="pipe-panel" role="tabpanel" aria-live="polite"></div><div class="pipe-list" role="tablist" aria-label="Pipeline stages (list)"></div>
          <p class="autoplay"><i><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 2v10l9-5-9-5Z"/></svg></i>Auto-advancing — select any stage to take control</p></div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="story-title">
    <div class="container">
      <div class="head"><div><p class="label">Client story</p><h2 id="story-title" class="h2">Insights behind the success.</h2></div></div>
      <a class="case rv" href="../case-studies/lift-truck-self-service.html" style="grid-template-columns:1.1fr 1fr;grid-template-rows:none">
        <div class="img" style="aspect-ratio:auto;min-height:360px"><img src="../assets/img/photos/case-lift-truck.webp" alt="Operator driving an orange forklift loaded with timber at a warehouse door" width="1600" height="1000" loading="lazy" /><span class="tag">Manufacturing · Global</span></div>
        <div class="body" style="padding:48px;align-content:center"><h3 class="h3" style="font-size:clamp(1.5rem,2.2vw,2rem)">Lift-truck manufacturer turns 453,958 support tickets into self-service answers.</h3>
          <p class="muted">A grounded AI assistant answers dealer questions in 30–60 seconds, with a source reference on every answer.</p>
          <div class="kpi"><b>30–60s</b><span>to a cited answer</span></div>
          <span class="link" style="margin-top:12px"><span>Read the story</span><span class="ico">{ARROW}</span></span></div>
      </a>
    </div>
  </section>

{cta()}
  <nav class="section" style="padding-top:0" aria-label="More services">
    <div class="container next">
      <a href="{prev['slug']}.html"><span>← Previous service</span><b>{prev['name']}</b></a>
      <a href="{nxt['slug']}.html"><span>Next service →</span><b>{nxt['name']}</b></a>
    </div>
  </nav>
</main>
""" + TAIL


def case_study():
    rows = [
        ("Ticket load", "~6,000 new service tickets a month raised to the manufacturer", "Dealers and vendors self-serve fixes across 14,843 indexed source files"),
        ("Time to answer", "1–2 days per ticket", "30–60 seconds per cited answer"),
        ("Answer trust", "No traceability; plausible but wrong answers possible", "Inline citations on every answer; out-of-scope questions declined; 0/22 → 11/22 fully correct after tuning"),
        ("Content freshness", "Manual reloading; stale answers", "0 manual re-ingestion steps; uploads and deletes reach the index automatically"),
        ("Isolation & release", "Isolation not yet architected", "1 codebase, 6 environments, 2 tenants; RBAC-secured and live in production"),
        ("State & credentials", "File-based SQLite store", "Azure SQL with Managed Identity; no SQL password in configuration"),
        ("Search scoping", "Slow to narrow across 142 series", "4 filter dimensions; 1-click saved presets per user"),
    ]
    trs = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in rows)
    return head("Lift-truck manufacturer self-service AI — AI Orbit case study", "How a global lift-truck manufacturer turned 453,958 support tickets into self-service answers for its dealer network.") + f"""<body data-root="../" data-page="case">
<main id="main">
  <section class="p-hero" aria-labelledby="ph-title">
    <div class="bg"><img src="../assets/img/case-production.webp" alt="" width="1600" height="1100" /></div>
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#cases">Case studies</a><span aria-hidden="true">/</span><span aria-current="page">Lift-truck manufacturer</span></nav>
      <div class="copy">
        <p class="label">Case study · 5 min read</p>
        <h1 id="ph-title" class="h1">Lift-truck manufacturer turns <span class="grad-text">453,958 support tickets</span> into self-service answers.</h1>
        <p class="lead">The client received about 6,000 support tickets a month from dealers and service vendors who could not resolve issues on their own.</p>
      </div>
      <div class="facts"><div><span>Industry</span><b>Manufacturing — industrial lift trucks</b></div><div><span>Region</span><b>Global</b></div><div><span>Technology</span><b>Agent Skills · Multi-agent orchestration · React 18</b></div><div><span>Service line</span><b><a href="../services/enterprise-agents.html" style="color:var(--violet);text-decoration:underline">Enterprise Agents</a></b></div></div>
    </div>
  </section>

  <section class="section">
    <div class="container cs">
      <nav class="toc" aria-label="On this page"><a href="#challenge">Business challenge</a><a href="#approach">Evoke’s approach</a><a href="#outcomes">The outcomes</a><a href="#value">Strategic value</a></nav>
      <article class="prose">
        <div class="kpis"><div><b><span data-count="453958">0</span></b><span>Historical tickets on record</span></div><div><b>~<span data-count="6000">0</span></b><span>New tickets every month</span></div><div><b>~51 GiB</b><span>Source documents to search</span></div></div>
        <h2 id="challenge">Business challenge</h2>
        <p>Every issue a dealer or service vendor could not fix on site became a ticket for the manufacturer. The answers usually already existed across thousands of manuals, technical documents, knowledge base articles and past cases, but finding the right one quickly and confidently was hard.</p>
        <p>As the product portfolio and documentation grew, service teams spent more time searching, escalating and waiting for manufacturer support. This led to:</p>
        <ul>
          <li><strong>Rising ticket volume:</strong> more escalations to the manufacturer and higher support costs.</li>
          <li><strong>Slow resolution:</strong> most tickets took 1–2 days to close, delaying dealers and service vendors.</li>
          <li><strong>Unused knowledge:</strong> institutional know-how spread across multiple repositories.</li>
          <li><strong>Stretched support teams:</strong> lower productivity under growing pressure from escalations.</li>
          <li><strong>Compliance risk:</strong> no easy way to confirm teams followed approved maintenance and repair guidance.</li>
        </ul>
        <h2 id="approach">Evoke’s approach</h2>
        <p>Evoke partnered with the client to create a trusted self-service support system that reduces dependence on manufacturer support and enables faster fixes. Dealers and service partners ask questions in natural language and get answers grounded in approved company knowledge, each with source references they can check before acting. Five requirements shaped the build.</p>
        <ul>
          <li><strong>Trusted answers:</strong> responses draw only on approved manuals, tickets and KB content; out-of-scope questions are declined.</li>
          <li><strong>Always current:</strong> new and revised manuals reach users automatically via Azure Event Grid and Azure Functions.</li>
          <li><strong>Secure access:</strong> Microsoft Entra ID RBAC limits the assistant to authorised users; demo and client environments never share a data plane.</li>
          <li><strong>Faster discovery:</strong> filters by product line, brand, region and content type, with one-click saved presets.</li>
          <li><strong>Proven at production scale:</strong> 2,413,646 search records migrated with zero mismatches; safeguards added after test peaks hit 208,534 tokens per minute.</li>
        </ul>
        <div class="kpis"><div><b><span data-count="142">0</span></b><span>Truck series covered</span></div><div><b><span data-count="5693">0</span></b><span>KB articles unified</span></div><div><b><span data-count="14843">0</span></b><span>Source files indexed</span></div></div>
        <h2 id="outcomes">The outcomes</h2>
        <p>The assistant meets the client’s core goal of reducing reliance on manufacturer support: dealers and service vendors find answers faster and resolve more issues on their own.</p>
        <div class="tbl-wrap" tabindex="0" role="region" aria-label="Before and after outcomes"><table><thead><tr><th scope="col">Outcome</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>{trs}</tbody></table></div>
        <h2 id="value">Strategic value delivered</h2>
        <div class="kpis"><div><b>30–60s</b><span>Time to a cited answer</span></div><div><b>7.41B</b><span>Vector values migrated, zero mismatches</span></div><div><b>100K+</b><span>Tokens-per-minute capacity</span></div></div>
      </article>
    </div>
  </section>

{cta()}</main>
""" + TAIL


if __name__ == "__main__":
    out = ROOT / "mockb" / "services"
    out.mkdir(parents=True, exist_ok=True)
    n = len(SERVICES)
    for i, s in enumerate(SERVICES):
        (out / f"{s['slug']}.html").write_text(service(s, SERVICES[(i - 1) % n], SERVICES[(i + 1) % n]), encoding="utf-8")
        print("wrote", f"mockb/services/{s['slug']}.html")
    cs = ROOT / "mockb" / "case-studies"
    cs.mkdir(parents=True, exist_ok=True)
    (cs / "lift-truck-self-service.html").write_text(case_study(), encoding="utf-8")
    print("wrote mockb/case-studies/lift-truck-self-service.html")
