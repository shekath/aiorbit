#!/usr/bin/env python3
"""Generate Version 3 (v3/) service pages and the case study.

Service data is shared with Versions 1 and 2 (tools/build_pages.py); taglines and
lead copy come from the live evoketechnologies.com/ai-orbit page.
Run from the repo root:  python3 tools/build_pages_v3.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from build_pages import SERVICES, PIPELINE  # noqa: E402

LIVE = {  # live-site tagline, hook line, description, CTA label, image, alt
    "enterprise-agents": ("Build What Thinks", "Intelligent applications that don’t just automate. They reason.",
        "We design, build, and deploy enterprise AI agents that solve high-stakes business problems. Every agent we build is production-ready, scalable, edge-case-tested, and governance-ready.",
        "svc-agents", "Colleagues of different ages working through a solution together at a laptop"),
    "ai-first-engineering": ("Intelligence in Every Sprint", "Code at the speed of thought.",
        "We embed specialist AI agents across your SDLC. Your engineers own the architecture, compliance, and every release.",
        "svc-engineering", "Software engineer writing code across two monitors"),
    "ai-governance": ("Move Fast. Sleep Well", "Responsible AI isn’t a brake on innovation; it’s the seatbelt that lets you go faster.",
        "We embed governance into your AI lifecycle through frameworks for guardrails, quality assurance, ethics, and regulatory audit readiness.",
        "svc-governance", "Close-up of a secured, blue-lit server rack"),
    "ai-advisory": ("Know Before You Build", "Every successful AI project begins with the right questions.",
        "We cut through the noise, defining AI strategy, assessing readiness, prioritizing use cases, and building the foundation for what comes next.",
        "svc-advisory", "Consultant leading a strategy workshop at a planning board"),
}
ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def head(title, desc):
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <script>try{{var t=localStorage.getItem("orbitc-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}}catch(e){{}}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
"""


TAIL = """<script src="../../assets/vendor/lenis.min.js"></script>
<script src="../assets/js/app.js"></script>
<script src="../../assets/js/version-switch.js?v=3"></script>
<script type="module" src="../assets/js/neural-gl.js"></script>
</body>
</html>
"""


def cta(title="Ready to steer your next release?", sub="A scoped proposal, a realistic timeline, and references from clients in your sector. No pitch decks, no vague “AI transformation” talk."):
    return f"""  <section class="section" aria-labelledby="cta-title">
    <div class="container"><div class="cta rv">
      <canvas data-neural="aurora" aria-hidden="true"></canvas>
      <div class="in"><p class="mono eyebrow">Build · Modernize · Govern</p><h2 id="cta-title" class="h1">{title}</h2><p class="lead">{sub}</p>
        <a class="btn btn--solid" href="../index.html#contact"><span data-roll-text="Talk to an architect"></span><span class="ic">{ARROW}</span></a></div>
    </div></div>
  </section>
"""


def service(s, prev, nxt):
    tag, hook, desc, img, alt = LIVE[s["slug"]]
    words = tag.split(" ")
    h1 = " ".join(words[:-2]) + ' <span class="grad">' + " ".join(words[-2:]) + "</span>"
    facts = "".join(f"<div><span>{k}</span><b>{v}</b></div>" for k, v in s["meta"])
    panels = ""
    for i, (eb, h, p, checks, fit) in enumerate(s["panels"]):
        lis = "".join(f"<li>{c}</li>" for c in checks)
        panels += f'<div class="panel spot rv" data-d="{i}"><p class="mono eyebrow">{eb}</p><h3 class="h3">{h}</h3><p>{p}</p><ul class="ticks">{lis}</ul><div class="fit"><span>Fit for</span><p>{fit}</p></div></div>'
    caps = "".join(f'<div class="cap spot rv" data-d="{i % 3}"><span class="n">{i + 1:02d}</span><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(s["caps"]))
    steps = "".join(f'<div class="step"><span class="mono">Stage {i + 1:02d}</span><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(PIPELINE))
    return head(f"{s['name']} — {tag} | Evoke AI Orbit", hook) + f"""<body data-root="../" data-page="svc-{s['slug']}">
<main id="main">
  <section class="p-hero" aria-labelledby="ph-title">
    <canvas data-neural="aurora" aria-hidden="true"></canvas>
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s['name']}</span></nav>
      <div class="copy">
        <p class="mono eyebrow">Service {s['idx']} · {s['name']}</p>
        <h1 id="ph-title" class="h1">{h1}</h1>
        <p class="h3" style="max-width:30ch">{hook}</p>
        <p class="lead">{desc}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--solid" href="../index.html#contact"><span data-roll-text="Get started"></span><span class="ic">{ARROW}</span></a><a class="btn btn--ghost" href="#approach"><span data-roll-text="See the approach"></span></a></div>
      </div>
      <div class="p-media rv"><img src="../assets/img/{img}.webp" srcset="../assets/img/{img}-900.webp 900w, ../assets/img/{img}.webp 1600w" sizes="100vw" alt="{alt}" width="1600" height="1000" data-speed="-0.15" /></div>
      <div class="facts">{facts}</div>
    </div>
  </section>

  <section class="section" id="approach" aria-labelledby="ap-title">
    <div class="container">
      <div class="head"><p class="mono eyebrow">Approach</p><h2 id="ap-title" class="h2">Two paths. <span class="grad">One engine.</span></h2><p class="lead">The same agent pipeline powers both — tuned for the problem you’re solving.</p></div>
      <div class="two">{panels}</div>
    </div>
  </section>
  <hr class="rule" />

  <section class="section" aria-labelledby="cap-title">
    <div class="container">
      <div class="head"><p class="mono eyebrow">Capabilities</p><h2 id="cap-title" class="h2">What’s inside <span class="grad">this orbit.</span></h2></div>
      <div class="caps">{caps}</div>
    </div>
  </section>
  <hr class="rule" />

  <section class="section" aria-labelledby="pp-title">
    <div class="container" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:64px;align-items:start" data-split>
      <div class="head" style="position:sticky;top:120px"><p class="mono eyebrow">The agentic pipeline</p><h2 id="pp-title" class="h2">From first-line analysis to <span class="grad">production pull request.</span></h2><p class="lead">Specialist agents hand off cleanly between stages, with built-in self-healing at every step.</p></div>
      <div class="timeline"><span class="fill"></span>{steps}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="story-title">
    <div class="container">
      <div class="head"><p class="mono eyebrow">Client story</p><h2 id="story-title" class="h2">Insights behind <span class="grad">the success.</span></h2></div>
      <a class="case spot rv" href="../case-studies/lift-truck-self-service.html" style="grid-template-columns:1.1fr 1fr;grid-template-rows:none" data-story>
        <div class="media" style="aspect-ratio:auto;min-height:340px"><img src="../assets/img/case-lift-truck.webp" alt="Operator driving an orange forklift loaded with timber at a warehouse door" width="1600" height="1200" loading="lazy" data-speed="-0.08" /><span class="chip">Manufacturing · Global</span></div>
        <div class="body" style="padding:44px;align-content:center"><h3 class="h3">Lift-truck manufacturer turns 453,958 support tickets into self-service answers.</h3><p>A grounded AI assistant answers dealer questions in 30–60 seconds, with a source reference on every answer.</p><span class="more">Read the story {ARROW}</span></div>
      </a>
    </div>
  </section>

{cta()}
  <nav class="section" style="padding-top:0" aria-label="More services">
    <div class="container next">
      <a class="spot" href="{prev['slug']}.html"><span>← Previous service</span><b>{prev['name']}</b></a>
      <a class="spot" href="{nxt['slug']}.html"><span>Next service →</span><b>{nxt['name']}</b></a>
    </div>
  </nav>
</main>
<style>@media (max-width: 900px) {{ [data-split] {{ grid-template-columns: 1fr !important; gap: 32px !important; }} [data-split] .head {{ position: static !important; }} [data-story] {{ grid-template-columns: 1fr !important; }} [data-story] .body {{ padding: 28px !important; }} }}</style>
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
    return head("Lift-truck manufacturer self-service AI — Evoke AI Orbit case study", "How a global lift-truck manufacturer turned 453,958 support tickets into self-service answers for its dealer network.") + f"""<body data-root="../" data-page="case">
<main id="main">
  <section class="p-hero" aria-labelledby="ph-title">
    <canvas data-neural="aurora" aria-hidden="true"></canvas>
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#cases">Case studies</a><span aria-hidden="true">/</span><span aria-current="page">Lift-truck manufacturer</span></nav>
      <div class="copy">
        <p class="mono eyebrow">Case study · Manufacturing · 5 min read</p>
        <h1 id="ph-title" class="h1">Lift-truck manufacturer turns <span class="grad">453,958 support tickets</span> into self-service answers.</h1>
        <p class="lead">The client received about 6,000 support tickets a month from dealers and service vendors who could not resolve issues on their own.</p>
      </div>
      <div class="p-media rv"><img src="../assets/img/case-lift-truck.webp" srcset="../assets/img/case-lift-truck-900.webp 900w, ../assets/img/case-lift-truck.webp 1600w" sizes="100vw" alt="Operator driving an orange forklift loaded with timber at a warehouse door" width="1600" height="1200" data-speed="-0.15" /></div>
      <div class="facts"><div><span>Industry</span><b>Manufacturing — industrial lift trucks</b></div><div><span>Region</span><b>Global</b></div><div><span>Technology</span><b>Agent Skills · Multi-agent orchestration · React 18</b></div><div><span>Service line</span><b><a href="../services/enterprise-agents.html" class="grad" style="text-decoration:underline">Enterprise Agents</a></b></div></div>
    </div>
  </section>

  <section class="section">
    <div class="container cs">
      <nav class="toc" aria-label="On this page"><a href="#challenge">Business challenge</a><a href="#approach">Evoke’s approach</a><a href="#outcomes">The outcomes</a><a href="#value">Strategic value</a></nav>
      <article class="prose">
        <div class="kpis"><div><b>453,958</b><span>Historical tickets on record</span></div><div><b>~6,000</b><span>New tickets every month</span></div><div><b>~51 GiB</b><span>Source documents to search</span></div></div>
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
        <div class="kpis"><div><b>142</b><span>Truck series covered</span></div><div><b>5,693</b><span>KB articles unified</span></div><div><b>14,843</b><span>Source files indexed</span></div></div>
        <h2 id="outcomes">The outcomes</h2>
        <p>The assistant meets the client’s core goal of reducing reliance on manufacturer support: dealers and service vendors find answers faster and resolve more issues on their own.</p>
        <div class="tbl" tabindex="0" role="region" aria-label="Before and after outcomes"><table><thead><tr><th scope="col">Outcome</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>{trs}</tbody></table></div>
        <h2 id="value">Strategic value delivered</h2>
        <div class="kpis"><div><b>30–60s</b><span>Time to a cited answer</span></div><div><b>7.41B</b><span>Vector values migrated, zero mismatches</span></div><div><b>100K+</b><span>Tokens-per-minute capacity</span></div></div>
      </article>
    </div>
  </section>

{cta("Ready to steer your next release?", "We’ll show you exactly how AI Orbit solves it — with a scoped proposal, a realistic timeline, and references from clients in your sector.")}</main>
""" + TAIL


if __name__ == "__main__":
    out = ROOT / "v3" / "services"
    out.mkdir(parents=True, exist_ok=True)
    n = len(SERVICES)
    for i, s in enumerate(SERVICES):
        (out / f"{s['slug']}.html").write_text(service(s, SERVICES[(i - 1) % n], SERVICES[(i + 1) % n]), encoding="utf-8")
        print("wrote", f"v3/services/{s['slug']}.html")
    cs = ROOT / "v3" / "case-studies"
    cs.mkdir(parents=True, exist_ok=True)
    (cs / "lift-truck-self-service.html").write_text(case_study(), encoding="utf-8")
    print("wrote v3/case-studies/lift-truck-self-service.html")
