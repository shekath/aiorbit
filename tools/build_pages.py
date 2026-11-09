#!/usr/bin/env python3
"""Generate the AI Orbit service pages from one template.

Run from the repo root:  python3 tools/build_pages.py
Edit SERVICES below, then re-run; the four files in /services are overwritten.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.3"/></svg>'
CAP_ICON = '<svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor"/><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-dasharray="2 2.5"/></svg>'

PIPELINE = [
    ("Discovery", "Agents read the legacy code or requirements and build a skills library."),
    ("Domain specialists", "Design domain specialists specific to application patterns."),
    ("Generation", "Specialist agents generate code, APIs, UI and rules — simultaneously."),
    ("Validation", "Dual-engine validation with up to 3 self-healing auto-fix cycles."),
    ("Test", "Security, audit and regulatory checks with full traceability."),
    ("Deployment", "Staged pull request, automated deploy."),
]

SERVICES = [
    dict(
        slug="enterprise-agents", idx="01", name="Enterprise Agent Solutions", short="Agents",
        title="Agents that don’t just automate. <span class='serif-i'>They reason.</span>",
        lead="We design, build and deploy enterprise AI agents that solve high-stakes business problems. Every agent we build is production-ready, scalable, edge-case-tested and governance-ready.",
        meta=[("Service line", "01 / 04"), ("Delivery", "Production agents"), ("Typical time to pilot", "6–8 weeks"), ("Stack", "Azure · AWS · OSS")],
        panels=[
            ("What we build", "Intelligent applications for the work that matters.", "Agents grounded in your approved knowledge, connected to your systems and accountable for every answer they give.",
             ["Grounded assistants with a source reference on every answer", "Multi-agent orchestration across tools and data", "Copilots for support, operations and compliance teams", "Out-of-scope questions declined — not guessed"],
             "Support deflection · Knowledge assistants · Operations copilots"),
            ("How it ships", "Built for production, not for the demo.", "We treat an agent like any other critical system: tested, observable, secured and owned by your team.",
             ["Edge-case test suites graded against ground-truth questions", "RBAC, tenant isolation and managed identity by default", "Automatic ingestion keeps answers current", "Observability and cost controls from day one"],
             "Regulated enterprises · Multi-tenant platforms"),
        ],
        caps=[("Retrieval & grounding", "Hybrid search over manuals, tickets and knowledge bases with inline citations."),
              ("Agent skill packs", "150+ reusable skills that cut build time and standardise behaviour."),
              ("Tool use & integration", "Agents act inside ERP, CRM, ITSM and data platforms through governed connectors."),
              ("Evaluation harness", "Ground-truth question sets track accuracy release over release."),
              ("Security by design", "Entra ID RBAC, private networking and no secrets in configuration."),
              ("Scale & cost", "Throughput safeguards and token budgets tuned for production peaks.")],
        stats=[("30–60", "sec", "Time to a cited answer"), ("65", "%", "Time saved"), ("10", "+", "Specialized agents")],
    ),
    dict(
        slug="ai-first-engineering", idx="02", name="AI-First Software Engineering", short="Engineering",
        title="Your next release ships with a <span class='serif-i'>team of agents.</span>",
        lead="Evoke integrates specialist AI agents into your SDLC for both modern and legacy systems — while your teams retain full control over architecture, compliance and releases.",
        meta=[("Service line", "02 / 04"), ("Model", "Agentic-first SDLC"), ("Scope", "Greenfield + brownfield"), ("Validation", "Dual-engine")],
        panels=[
            ("Greenfield · Build new", "Net-new products, shipped at agent speed.", "From idea to production without the usual sprint overhead — agents parallelise UI, APIs, tests and docs while your architects steer.",
             ["Requirements to working code in weeks, not months", "Agents generate UI, APIs, tests and docs in parallel", "Humans steer architecture, UX and business rules", "Governance and observability built in from day one"],
             "Digital products · MVPs · Platform expansions · SaaS applications"),
            ("Brownfield · Modernization", "Agents decode, translate and validate decades of legacy.", "No specialist bottlenecks. No compliance compromise. Mainframe, monolith or messy front-end — all in scope.",
             ["Legacy source analysed, re-platformed and re-tested autonomously", "COBOL, VB.NET, ExtJS, mainframe and monoliths — all in scope", "Dual-engine validation, auto-fix loops and full audit trails", "Eliminates dependency on scarce senior SMEs"],
             "Legacy migration · UX modernization"),
        ],
        caps=[("Code generation", "Specialist agents produce code, APIs, UI and rules simultaneously."),
              ("Legacy comprehension", "Agents map business rules buried in decades-old code into a skills library."),
              ("Self-healing validation", "Up to 3 automatic fix cycles before a human ever reviews."),
              ("Test automation", "Unit, integration and regression suites generated alongside the code."),
              ("Strangler-fig cutover", "Old and new run side by side, route by route, with zero downtime."),
              ("Traceable releases", "Every change linked to its requirement, test and approval.")],
        stats=[("65", "%", "Time saved"), ("150", "+", "Skill packs"), ("87", "K+", "Legacy LOC migrated")],
    ),
    dict(
        slug="ai-governance", idx="03", name="AI Governance", short="Governance",
        title="The seatbelt that lets you <span class='serif-i'>go faster.</span>",
        lead="Responsible AI isn’t a brake on innovation. We embed governance into your AI lifecycle through frameworks for guardrails, quality assurance, ethics and regulatory audit readiness.",
        meta=[("Service line", "03 / 04"), ("Focus", "Lifecycle governance"), ("Outputs", "Policies · controls · evidence"), ("Alignment", "EU AI Act · NIST AI RMF")],
        panels=[
            ("Guardrails & quality", "Controls that run with the system, not after it.", "Policy becomes code: inputs, outputs and actions are checked continuously, and every exception leaves evidence.",
             ["Input and output guardrails for PII, toxicity and scope", "Quality gates graded against ground-truth sets", "Human-in-the-loop approvals for high-risk actions", "Immutable, append-only audit trails"],
             "Agents · Copilots · Generative workflows"),
            ("Ethics & audit readiness", "Be ready for the regulator before they ask.", "We map your AI estate, classify risk and assemble the evidence your auditors and regulators will expect.",
             ["AI inventory and risk classification", "Model cards, data lineage and decision logs", "Bias and fairness testing with remediation plans", "Audit packs aligned to your regulatory regime"],
             "BFSI · Pharma & life sciences · Public sector"),
        ],
        caps=[("AI inventory", "One register of every model, agent and use case across the enterprise."),
              ("Risk classification", "Tiered controls that match the risk level of each use case."),
              ("Guardrail engineering", "Runtime policies enforced at the prompt, tool and output layer."),
              ("Evaluation & red-teaming", "Adversarial testing before and after every release."),
              ("Observability", "Drift, cost, latency and incident telemetry in one view."),
              ("Regulatory evidence", "Continuously generated artefacts for audit and certification.")],
        stats=[("100", "%", "Actions traced"), ("0", "", "PHI in logs, URLs or errors"), ("3", "", "Lines of defence covered")],
    ),
    dict(
        slug="ai-advisory", idx="04", name="AI Advisory", short="Advisory",
        title="Every successful AI project begins with the <span class='serif-i'>right questions.</span>",
        lead="We cut through the noise — defining AI strategy, assessing readiness, prioritising use cases and building the foundation for what comes next.",
        meta=[("Service line", "04 / 04"), ("Format", "Advisory sprint"), ("Duration", "4–6 weeks"), ("Output", "Prioritised roadmap")],
        panels=[
            ("Strategy & readiness", "Know where you stand before you invest.", "A clear view of data, platform, skills and governance maturity — and what it takes to close the gaps.",
             ["AI strategy aligned to business outcomes", "Data, platform and talent readiness assessment", "Operating model and governance baseline", "Build, buy or partner recommendations"],
             "C-suite · Transformation offices · IT leadership"),
            ("Use cases & roadmap", "Map the system, not the symptom.", "We score opportunities on value, feasibility and risk, then sequence them into a roadmap you can fund.",
             ["Use-case discovery workshops with business owners", "Value, feasibility and risk scoring", "First-principles deconstruction of the real problem", "Funded 90-day plan with measurable milestones"],
             "Enterprises starting or resetting their AI programme"),
        ],
        caps=[("Discovery workshops", "Structured sessions that surface the problems worth solving."),
              ("Readiness assessment", "Data, platform, skills and governance maturity scored."),
              ("Use-case portfolio", "A ranked backlog with business cases attached."),
              ("Architecture blueprint", "Reference architecture for your cloud and data estate."),
              ("Operating model", "Roles, ownership and the AI centre of excellence."),
              ("Roadmap & business case", "Sequenced delivery plan with ROI and risk.")],
        stats=[("6", "", "Questions that reframe the problem"), ("90", "day", "Funded action plan"), ("4", "wk", "To a prioritised roadmap")],
    ),
]

HEAD = """<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{name} — AI Orbit by Evoke</title>
  <meta name="description" content="{desc}" />
  <script>try{{var t=localStorage.getItem("orbit-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}}catch(e){{}}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
"""


def page(s, prev, nxt):
    meta = "".join(f'<div><span class="mono">{k}</span>{v}</div>' for k, v in s["meta"])
    panels = ""
    for i, (eb, h, p, checks, fit) in enumerate(s["panels"]):
        lis = "".join(f"<li>{c}</li>" for c in checks)
        panels += f'''<div class="panel reveal" data-d="{i}"><span class="eyebrow">{eb}</span><h3>{h}</h3><p>{p}</p><ul class="checks">{lis}</ul><div class="fit"><span class="mono">Fit for</span><p style="margin-top:8px">{fit}</p></div></div>'''
    caps = "".join(f'<div class="cap"><span class="ic">{CAP_ICON}</span><h3>{h}</h3><p>{p}</p></div>' for h, p in s["caps"])
    stats = "".join(
        f'<div class="stat reveal" data-d="{i}"><span class="arc"></span><div class="num"><span data-count="{n}">0</span><sup>{u}</sup></div><div class="lbl mono"><span>{l}</span></div></div>'
        if n.isdigit() else
        f'<div class="stat reveal" data-d="{i}"><span class="arc"></span><div class="num">{n}<sup>{u}</sup></div><div class="lbl mono"><span>{l}</span></div></div>'
        for i, (n, u, l) in enumerate(s["stats"]))
    stages = "".join(f'<div class="stage"><span class="mono">{i+1:02d}</span><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(PIPELINE))
    import re
    desc = re.sub("<[^>]+>", "", s["lead"])
    return HEAD.format(name=s["name"], desc=desc) + f'''<body data-root="../" data-page="svc-{s["slug"]}">
<main id="main">
  <section class="page-hero grid-bg" aria-labelledby="ph-title">
    <canvas class="hero-canvas" data-orbit="page" aria-hidden="true"></canvas>
    <div class="container">
      <nav class="crumbs mono" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="../index.html#services">Services</a><span>/</span><span aria-current="page">{s["name"]}</span></nav>
      <span class="eyebrow"><span class="idx">[{s["idx"]}]</span> {s["name"]}</span>
      <h1 id="ph-title" class="h1" style="margin-top:24px">{s["title"]}</h1>
      <p class="lead">{s["lead"]}</p>
      <div class="hero-ctas" style="margin-top:40px"><a class="btn btn--primary magnetic" href="../index.html#contact">Get started <span class="orb"></span></a><a class="btn btn--ghost" href="#approach">See the approach</a></div>
      <div class="meta-row">{meta}</div>
    </div>
  </section>

  <section class="section section--tight" aria-label="Impact"><div class="container"><div class="stats">{stats}</div></div></section>

  <section class="section" id="approach" aria-labelledby="ap-title">
    <div class="container">
      <div class="section-head"><span class="eyebrow"><span class="idx">[01]</span> Approach</span>
        <div><h2 id="ap-title" class="h2">Two paths. One engine.</h2><p class="lead">The same agent pipeline powers both — tuned for the problem you’re solving.</p></div></div>
      <div class="split">{panels}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="cap-title">
    <div class="container">
      <div class="section-head"><span class="eyebrow"><span class="idx">[02]</span> Capabilities</span>
        <div><h2 id="cap-title" class="h2">What’s inside this orbit.</h2></div></div>
      <div class="cap-grid">{caps}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="pp-title">
    <div class="container">
      <div class="section-head"><span class="eyebrow"><span class="idx">[03]</span> The agentic pipeline</span>
        <div><h2 id="pp-title" class="h2">Evoke agentic modernization accelerator.</h2><p class="lead">From first-line analysis to production pull request — specialist agents hand off cleanly between stages.</p></div></div>
      <div class="pipeline"><span class="track"></span><span class="sat"></span>{stages}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="rel-title">
    <div class="container">
      <div class="section-head"><span class="eyebrow"><span class="idx">[04]</span> Client story</span>
        <div><h2 id="rel-title" class="h2">Insights behind the success.</h2></div></div>
      <a class="card reveal" href="../case-studies/lift-truck-self-service.html" style="display:grid;grid-template-columns:1.1fr 1fr">
        <div class="art" style="aspect-ratio:auto;min-height:320px;border-bottom:0;border-right:1px solid var(--line)"><canvas data-art="2"></canvas><div class="meta mono"><span>Manufacturing · Global</span><span>5 min read</span></div></div>
        <div class="body" style="padding:48px;align-content:center">
          <span class="mono accent">Case study</span>
          <h3 style="font-size:30px">Lift-truck manufacturer turns 453,958 support tickets into self-service answers.</h3>
          <p>A grounded AI assistant answers dealer questions in 30–60 seconds, with a source reference on every answer.</p>
          <span class="link-arrow" style="margin-top:16px">Read the story {ARROW}</span>
        </div>
      </a>
    </div>
  </section>

  <section class="cta" aria-labelledby="cta-title">
    <div class="rings" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="container">
      <span class="eyebrow">Ready when you are</span>
      <h2 id="cta-title" class="h1">Ready to steer your next <span class="serif-i">release?</span></h2>
      <p class="lead">A scoped proposal, a realistic timeline and references from clients in your sector. No pitch decks.</p>
      <a class="btn btn--primary magnetic" href="../index.html#contact">Talk to an architect <span class="orb"></span></a>
    </div>
  </section>

  <nav class="container next-svc" aria-label="More services">
    <a href="{prev["slug"]}.html"><span class="mono">← Previous orbit · {prev["idx"]}</span><span class="h2">{prev["name"]}</span></a>
    <a href="{nxt["slug"]}.html"><span class="mono">Next orbit · {nxt["idx"]} →</span><span class="h2">{nxt["name"]}</span></a>
  </nav>
</main>
<script src="../assets/js/site.js"></script>
<script src="../assets/js/version-switch.js?v=8"></script>
<script type="module" src="../assets/js/orbit-gl.js"></script>
</body>
</html>
'''


if __name__ == "__main__":
    out = ROOT / "services"
    out.mkdir(exist_ok=True)
    n = len(SERVICES)
    for i, s in enumerate(SERVICES):
        (out / f"{s['slug']}.html").write_text(page(s, SERVICES[(i - 1) % n], SERVICES[(i + 1) % n]), encoding="utf-8")
        print("wrote", f"services/{s['slug']}.html")
