#!/usr/bin/env python3
"""Generate Version 5 "Clarity" (v5/): home, four service pages and the case study.

Content-first design that mirrors the Figma MockB "V5" frames. Service data is
shared with the other versions (tools/build_pages.py, tools/build_pages_v3.py).
Run from the repo root:  python3 tools/build_pages_v5.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from build_pages import SERVICES, PIPELINE  # noqa: E402
from build_pages_v3 import LIVE  # noqa: E402

P = {  # 24px stroke icons
    "arrow": '<path d="M4 12h16m-6-6 6 6-6 6"/>', "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>', "plus": '<path d="M12 5v14M5 12h14"/>',
    "agent": '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-30 12 12)"/><circle cx="20" cy="7" r="1.2"/>',
    "code": '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>', "shield": '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    "bulb": '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    "spark": '<path d="M12 3v5M12 16v5M3 12h5M16 12h5"/><circle cx="12" cy="12" r="2"/>', "search": '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    "layers": '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>', "rocket": '<path d="M5 19c0-3 1-5 3-6M12 15l-3-3c1.5-5 5-8 11-9-1 6-4 9.5-9 11z"/><circle cx="15" cy="9" r="1.5"/>',
    "factory": '<path d="M3 20V10l6 4V10l6 4V6h6v14z"/>', "bank": '<path d="M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18"/>', "bolt": '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
    "health": '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 11h6M12 8v6"/>', "cap": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    "mountain": '<path d="M3 19l6-10 4 6 3-4 5 8z"/>', "doc": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>', "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>', "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    "moon": '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', "send": '<path d="M5 12h14m-6-6 6 6-6 6"/>',
}


def ic(name, size=20, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<svg{c} width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{P[name]}</svg>'


A = ic("arrow", 18)
SVC_ICON = {"enterprise-agents": "agent", "ai-first-engineering": "code", "ai-governance": "shield", "ai-advisory": "bulb"}


def head(title, desc, r):
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<meta name="theme-color" content="#0B0D12" />
<script>(function(){{var d=document.documentElement;d.classList.add("js");try{{var t=localStorage.getItem("orbitc-theme")||localStorage.getItem("orbit-theme");if(t==="light"||t==="dark")d.dataset.theme=t;}}catch(e){{}}}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap" />
<link rel="stylesheet" href="{r}assets/css/v5.css" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230B0D12'/%3E%3Cellipse cx='16' cy='16' rx='12' ry='5.5' transform='rotate(-30 16 16)' fill='none' stroke='%238B97FF' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='3.5' fill='%234FD8E8'/%3E%3C/svg%3E" />
</head>
"""


def header(r, home=False):
    h = "" if home else f"{r}index.html"
    links = [("Services", f"{h}#services"), ("How it works", f"{h}#how"), ("Case studies", f"{h}#cases"), ("Industries", f"{h}#industries"), ("Insights", f"{h}#insights")]
    nav = "".join(f'<a href="{u}">{t}</a>' for t, u in links)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="hdr">
  <div class="wrap">
    <a class="brand" href="{r}index.html" aria-label="AI Orbit by Evoke — home"><span class="tile">{ic("agent", 18)}</span><b>AI Orbit</b><small>by Evoke</small></a>
    <nav class="menu" aria-label="Primary">{nav}</nav>
    <div class="v5-actions">
      <button class="icon-btn" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light theme">{ic("sun", 18, "sun")}{ic("moon", 18, "moon")}</button>
      <a class="btn btn--primary" href="{h}#contact">Talk to us {A}</a>
      <button class="icon-btn burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">{ic("menu", 20)}</button>
    </div>
  </div>
  <nav class="drawer" id="drawer" aria-label="Mobile">{nav}<a class="btn btn--primary" href="{h}#contact">Talk to us {A}</a></nav>
</header>
"""


def footer(r):
    svc = "".join(f'<li><a href="{r}services/{s["slug"]}.html">{s["name"]}</a></li>' for s in SERVICES)
    ind = "".join(f'<li><a href="{r}index.html#industries">{x}</a></li>' for x in ["Manufacturing", "Financial Services", "Energy", "Healthcare", "Higher Education", "Mining"])
    ins = f'<li><a href="{r}case-studies/lift-truck-self-service.html">Case studies</a></li>' + "".join(f'<li><a href="{r}index.html#insights">{x}</a></li>' for x in ["Blog", "Videos", "News &amp; events", "Resource hub"])
    return f"""<footer class="ftr">
  <div class="wrap">
    <div class="cols">
      <div class="about-f"><a class="brand" href="{r}index.html"><span class="tile">{ic("agent", 18)}</span><b>AI Orbit</b></a><p class="small">Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.</p></div>
      <div><h2>Services</h2><ul>{svc}</ul></div>
      <div><h2>Industries</h2><ul>{ind}</ul></div>
      <div><h2>Insights</h2><ul>{ins}</ul></div>
    </div>
    <div class="legal"><span>Evoke Technologies Pvt. Ltd. © <span data-year>2026</span> All Rights Reserved.</span><nav aria-label="Legal"><a href="#">Terms of Use</a><a href="#">Privacy Policy</a><a href="#">Cookies Policy</a><a href="#">Disclaimer</a><a href="#">Sitemap</a></nav></div>
  </div>
</footer>
<script src="{r}assets/js/v5.js"></script>
<script src="{r}../assets/js/version-switch.js?v=7"></script>
</body>
</html>
"""


def console():
    steps = [("Parsed 4,812 business rules", "0.8s"), ("Generated validated MSTX modules", "2m 14s"), ("Ran 1,206 regression tests · 0 failures", "41s")]
    lis = "".join(f'<li>{ic("check", 18, "ic")}<span>{t}</span><span class="code">{tm}</span></li>' for t, tm in steps)
    lis += f'<li class="run">{ic("spark", 18, "ic")}<span>Policy check · SOX controls, audit trail</span><span class="code run">running</span></li>'
    guard = "".join(f"<span>{ic('shield', 14)}{x}</span>" for x in ["Governed", "Human-in-the-loop", "Audit trail", "PII redacted"])
    return f"""<figure class="console" aria-label="Example: an AI Orbit agent modernization run">
        <div class="bar"><span class="tile">{ic("agent", 15)}</span><strong>Orbit Agent · Modernization run</strong><span class="live">Live</span></div>
        <div class="in">
          <p class="prompt">{ic("spark", 18)}<span>Modernize our COBOL tax engine and keep it audit-ready.</span></p>
          <ol class="steps" aria-label="Run steps">{lis}</ol>
          <div class="meter"><div class="row"><span class="label">Run progress</span><span class="label" style="color:var(--fg)">78%</span></div><div class="track" role="progressbar" aria-label="Run progress" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"><i></i></div></div>
          <div class="guard">{guard}</div>
          <form class="ask"><label class="sr-only" for="ask-in">Ask the orbit a question (demo)</label><input id="ask-in" type="text" placeholder="Ask the orbit about your stack…" autocomplete="off" /><button type="submit" aria-label="Run the demo question">{ic("send", 16)}</button></form>
        </div>
      </figure>"""


def cta_panel(h="All in one <span class=\"grad\">orbit.</span>", p="Whether you’re building, modernizing or governing, AI Orbit brings structure, speed and safety to every stage of your AI journey.", r=""):
    return f"""<section class="section tight" aria-labelledby="cta-title">
  <div class="wrap">
    <div class="panel">
      <canvas class="lattice" data-lattice="34" aria-hidden="true"></canvas>
      <div class="copy"><p class="label accent">Build · Modernize · Govern</p><h2 id="cta-title" class="h1">{h}</h2><p class="lead">{p}</p>
        <div class="actions"><a class="btn btn--primary" href="{r}#contact">Launch your AI journey {A}</a><a class="btn btn--secondary" href="{r}#contact">Book a readiness call {A}</a></div></div>
    </div>
  </div>
</section>
"""


def faq(items):
    qa = ""
    for i, (q, a) in enumerate(items):
        open_ = "true" if i == 0 else "false"
        qa += f'<div><h3><button type="button" aria-expanded="{open_}" aria-controls="qa-{i}" id="qb-{i}">{q}{ic("plus", 22)}</button></h3><div class="ans" id="qa-{i}" role="region" aria-labelledby="qb-{i}"><div><p>{a}</p></div></div></div>'
    return f"""<section class="section alt" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq">
    <div class="head"><p class="label accent">FAQ</p><h2 id="faq-title" class="h2">Questions, answered.</h2><p class="body">Straight answers on timelines, governance and ownership. Still curious? Talk to an AI expert.</p><a class="link accent" href="#contact">Ask us anything {A}</a></div>
    <div class="qa">{qa}</div>
  </div>
</section>
"""


FAQ = [("How fast can we get an agent into production?", "Most teams ship a governed pilot in 6–8 weeks: two weeks of discovery and readiness, then iterative builds with evaluation gates before go-live."),
       ("How do you keep AI governed and auditable?", "Every agent ships with guardrails, evaluation reports and an audit trail. Human review gates sit wherever risk demands them, and every answer can carry a source reference."),
       ("Will this work with our existing stack?", "Yes. Agents connect to ERP, CRM, ITSM and data platforms through governed connectors on Azure, AWS or open-source infrastructure — no rip-and-replace."),
       ("Who owns the code, prompts and models?", "You do. Your engineers own the architecture, compliance and every release; we hand over the code, prompts, skill packs and evaluation sets.")]

OFFICES = [("Dayton, USA", "America/New_York", "+1-937-312-1204"), ("Dallas, USA", "America/Chicago", ""), ("London, UK", "Europe/London", ""), ("Wroclaw, Poland", "Europe/Warsaw", "+48 575 090 055"),
           ("Hyderabad, India", "Asia/Kolkata", "+91-404-050-0900"), ("Bengaluru, India", "Asia/Kolkata", ""), ("Sydney, Australia", "Australia/Sydney", "+61-489-902-554")]


def contact():
    offs = "".join(f'<div><b>{c}</b><time data-tz="{tz}"></time>' + (f'<a href="tel:{p.replace(" ", "").replace("-", "")}">{p}</a>' if p else "") + "</div>" for c, tz, p in OFFICES)
    opts = "".join(f"<option>{s['name']}</option>" for s in SERVICES) + "<option>Not sure yet</option>"
    return f"""<section class="section" id="contact" aria-labelledby="ct-title">
  <div class="wrap contact">
    <div>
      <div class="head"><p class="label accent">Get in touch</p><h2 id="ct-title" class="h2">Let’s build what’s next.</h2><p class="body">Tell us what you’re solving. An AI specialist replies within one business day.</p></div>
      <div class="offices">{offs}</div>
      <a class="mail" href="mailto:mktg@evoketechnologies.com">{ic("mail", 20)}mktg@evoketechnologies.com</a>
    </div>
    <form class="form" novalidate aria-describedby="f-note">
      <div class="field"><label for="f-name">Full name <i aria-hidden="true">*</i></label><input id="f-name" name="name" autocomplete="name" required aria-describedby="f-name-err" /><span class="err" id="f-name-err" aria-live="polite"></span></div>
      <div class="field"><label for="f-email">Work email <i aria-hidden="true">*</i></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err" /><span class="err" id="f-email-err" aria-live="polite"></span></div>
      <div class="field"><label for="f-co">Company</label><input id="f-co" name="company" autocomplete="organization" /></div>
      <div class="field"><label for="f-svc">Interested in</label><select id="f-svc" name="service">{opts}</select></div>
      <div class="field full"><label for="f-msg">What are you solving?</label><textarea id="f-msg" name="message"></textarea></div>
      <div class="foot"><p class="small" id="f-note">Fields marked * are required.</p><button class="btn btn--primary" type="submit">Send request {A}</button></div>
      <p class="ok" tabindex="-1" role="status">Thank you — your request is in. We’ll reply within one business day.</p>
    </form>
  </div>
</section>
"""


def metric(label, val, g, desc, bars):
    b = "".join(f'<i style="--h:{h}%;--o:{.35 + .65 * k / len(bars):.2f}"></i>' for k, h in enumerate(bars))
    v = val.replace(g, f'<em class="grad">{g}</em>', 1) if g else val
    return f'<div class="card metric"><p class="label">{label}</p><p class="num">{v}</p><p class="small">{desc}</p><div class="bars" aria-hidden="true">{b}</div></div>'


# ---------------------------------------------------------------- HOME
# ---- Home page content (shared with Version 6 via tools/build_pages_v6.py) ----
HOME_TICKS = {"enterprise-agents": ["Custom agents for complex workflows", "Evaluation gates before go-live", "Human-in-the-loop controls"],
         "ai-first-engineering": ["Agentic SDLC with 150+ skill packs", "Legacy modernization (COBOL, ExtJS)", "Up to 65% delivery time saved"],
         "ai-governance": ["Guardrails and policy controls", "Model risk and bias testing", "Audit-ready evidence trails"],
         "ai-advisory": ["AI readiness assessment", "Prioritized use-case roadmap", "Business case and value model"]}
HOME_LINKS = {"enterprise-agents": "Explore AI Apps", "ai-first-engineering": "Explore SDLC AI", "ai-governance": "Explore AI Governance", "ai-advisory": "Explore AI Advisory"}
HOME_STEPS = [("search", "Discover", "Readiness, data and risk assessed in two weeks."), ("layers", "Design", "Use cases prioritized and the target architecture agreed."), ("code", "Build", "Agents built with evaluation gates at every step."), ("shield", "Govern", "Guardrails, audit trails and human review in place."), ("rocket", "Scale", "Reusable skill packs roll the win out across teams.")]
HOME_CASES = [("Pharmaceutical", "Sencha Migration", "AI-orchestrated ExtJS to React modernization for a regulated pharmaceutical enterprise.", "ExtJS → React", "modernized under regulatory controls", "https://www.evoketechnologies.com/insights/case-studies/"),
         ("Tax technology &amp; compliance", "COBOL Conversion", "Multi-agent modernization that transforms complex COBOL tax engines into validated MSTX with full compliance.", "Minutes", "not months, with zero errors", "https://www.evoketechnologies.com/insights/case-studies/"),
         ("Manufacturing", "Production Optimization Agent", "An AI assistant that gives plant managers real-time analysis and visual insights on production data for better planning.", "Real-time", "production insight for planners", "https://www.evoketechnologies.com/insights/case-studies/"),
         ("Manufacturing · Global", "Lift-truck self-service AI", "A grounded assistant turns 453,958 historical support tickets into cited, self-service answers for a global dealer network.", "30–60s", "to a cited answer, down from 1–2 days", "case-studies/lift-truck-self-service.html")]
HOME_INDS = [("factory", "Manufacturing &amp; Industrial", "From shop floor to boardroom — AI that runs on operational reality.", ["Production optimization", "Predictive maintenance", "Supply-chain risk"]),
        ("bank", "Financial Services (BFSI)", "Built for audit, scale, and scrutiny.", ["Incident triage", "Tax compliance copilots", "Portfolio risk scoring"]),
        ("bolt", "Energy (Oil &amp; Gas)", "Decades of unstructured history, turned into operational decisions.", ["Field knowledge assistants", "Demand forecasting", "Storage intelligence"]),
        ("health", "Healthcare &amp; Life Sciences", "HIPAA-aware AI that earns clinician trust.", ["Clinical knowledge chatbots", "Predictive reliability"]),
        ("cap", "Higher Education", "A stress-free admissions journey.", ["Document verification", "Admissions intelligence"]),
        ("mountain", "Mining &amp; Natural Resources", "Modernization without disruption.", ["Spend analytics", "Legacy system assistants"])]
HOME_INSIGHTS = [("Knowledge paper", "Hyper Programming: A New SDLC Paradigm", "Just-in-time software engineering through agentic AI."),
       ("Knowledge paper", "Role Convergence in the AI SDLC (ADLC)", "Efficient, governed convergence through a layered skill architecture."),
       ("Article", "See the System: Why AI Projects Fail When You Map the Symptom Instead of the System", "Why every AI-native build must map the full system before a solution is designed."),
       ("Article", "Deconstruct: Stage 1 of First Principles Delivery", "How six questions turned a $680,000 routing contract into an $8.3 million finding."),
       ("Article", "Build: How We Construct AI Systems That Work in Production", "How five principles and two failed build gates cut underwriting time from 4.2 hours to 1.4.")]


def home():
    r = ""
    svc_cards = ""
    extra = HOME_TICKS
    links = HOME_LINKS
    for s in SERVICES:
        tag, hook, desc, _, _ = LIVE[s["slug"]]
        ticks = "".join(f"<li>{x}</li>" for x in extra[s["slug"]])
        svc_cards += f"""<article class="card svc lift rv"><div class="top"><span class="tile">{ic(SVC_ICON[s['slug']], 24)}</span><span class="label">{s['idx']}</span></div>
          <h3 class="h3">{s['name']}</h3><p class="tagline">{tag} — {hook}</p><p class="body">{desc}</p><ul class="ticks">{ticks}</ul>
          <a class="link push" href="services/{s['slug']}.html">{links[s['slug']]} {A}<span class="sr-only"> — {s['name']}</span></a></article>"""
    steps = HOME_STEPS
    pipe = "".join(f'<li class="rv"><div class="idx"><b>{i + 1:02d}</b><i></i></div>{ic(k, 22)}<h3 class="h3">{t}</h3><p class="small">{d}</p></li>' for i, (k, t, d) in enumerate(steps))
    cases = HOME_CASES
    case_html = ""
    for ind, t, b, m, ml, u in cases:
        ext = u.startswith("http")
        attrs = ' target="_blank" rel="noopener"' if ext else ""
        sr = '<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>' if ext else ""
        case_html += f'<a class="card case rv" href="{u}"{attrs}><span class="tag" style="align-self:flex-start">{ind}</span><h3 class="h3">{t}</h3><p class="small">{b}</p><div class="outcome"><b class="grad">{m}</b><span>{ml}</span></div><span class="link push">Read case study {A}{sr}</span></a>'
    inds = HOME_INDS
    ind_html = "".join(f'<article class="card ind rv"><span class="tile">{ic(k, 22)}</span><h3 class="h3">{t}</h3><p class="small">{d}</p><div class="pills">' + "".join(f'<span class="pill">{x}</span>' for x in tags) + "</div></article>" for k, t, d, tags in inds)
    ins = HOME_INSIGHTS
    ins_html = "".join(f'<a href="https://www.evoketechnologies.com/ai-orbit/" target="_blank" rel="noopener"><span class="type">{ic("doc", 18)}<span class="label">{ty}</span></span><div><h3 class="h3">{t}</h3><p class="small">{d}</p></div><span class="label meta">Read</span>{ic("arrow", 20)}<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span></a>' for ty, t, d in ins)
    return head("AI Orbit — Enterprise AI with structure, speed and security | Evoke · V5", "Evoke AI Orbit: build, modernize and govern enterprise AI — custom agents, AI-first engineering, governance and advisory.", r) + f"""<body>
{header(r, True)}
<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <canvas class="lattice" data-lattice="54" aria-hidden="true"></canvas>
    <span class="glow" aria-hidden="true"></span>
    <div class="wrap">
      <div class="copy">
        <p class="eyebrow">New · Evoke AI Orbit</p>
        <h1 id="hero-title" class="display">AI that powers <span class="grad">your trajectory.</span></h1>
        <p class="lead">From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to measurable impact.</p>
        <div class="actions"><a class="btn btn--primary" href="#contact">Launch your AI journey {A}</a><a class="btn btn--secondary" href="#services">Explore services {A}</a></div>
        <div class="proof"><div><b>65%</b><span>faster delivery with agentic engineering</span></div><div><b>150+</b><span>reusable, tested skill packs</span></div><div><b>10+</b><span>specialized agents in production</span></div></div>
      </div>
      {console()}
    </div>
  </section>

  <section class="strip" aria-label="Platforms we build on">
    <div class="wrap"><p class="label">Built on platforms you trust</p><ul><li>Microsoft</li><li>AWS</li><li>Salesforce</li><li>ServiceNow</li><li>Oracle</li><li>UiPath</li></ul></div>
  </section>

  <section class="section" aria-labelledby="ab-title">
    <div class="wrap about">
      <div class="head"><p class="label accent">About AI Orbit</p><h2 id="ab-title" class="h2">From strategy to execution, one accountable partner.</h2></div>
      <div class="detail">
        <p class="lead strong">We help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.</p>
        <div class="pillars">
          <div class="rv"><span class="tile">{ic("agent", 22)}</span><h3 class="h3">Build</h3><p class="small">Custom agents and AI apps that reason, not just automate.</p></div>
          <div class="rv"><span class="tile">{ic("layers", 22)}</span><h3 class="h3">Modernize</h3><p class="small">Agentic engineering that moves legacy estates forward safely.</p></div>
          <div class="rv"><span class="tile">{ic("shield", 22)}</span><h3 class="h3">Govern</h3><p class="small">Guardrails, evaluation and audit evidence by design.</p></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section alt" id="services" aria-labelledby="sv-title">
    <div class="wrap">
      <div class="head-row"><div class="head"><p class="label accent">Our services</p><h2 id="sv-title" class="h2">Enterprise AI with <span class="grad">structure, speed, and security.</span></h2></div>
        <div class="aside"><p class="body">Four disciplines, one orbit. Start anywhere and connect the rest as your AI programme grows.</p><a class="btn btn--secondary" href="#how">See how we deliver {A}</a></div></div>
      <div class="grid g2">{svc_cards}</div>
    </div>
  </section>

  <section class="section" id="how" aria-labelledby="hw-title">
    <div class="wrap">
      <div class="head"><p class="label accent">How it works</p><h2 id="hw-title" class="h2">From first question to <span class="grad">governed production.</span></h2><p class="body">A delivery rhythm built for regulated enterprises: every stage ends with evidence you can show an auditor.</p></div>
      <ol class="grid g5 pipe">{pipe}</ol>
    </div>
  </section>

  <section class="section alt" aria-labelledby="kf-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Key facts</p><h2 id="kf-title" class="h2">Driving <span class="grad">measurable</span> outcomes.</h2><p class="body">Numbers from live client programmes, not lab benchmarks.</p></div>
      <div class="grid g3">
        {metric("Delivery time saved", "65%", "%", "Average time saved with agentic engineering across delivery teams.", [24, 33, 42, 55, 67, 82, 100])}
        {metric("Skill packs", "150+", "+", "Reusable, tested agent skills that standardise behaviour across projects.", [18, 30, 45, 58, 70, 85, 97])}
        {metric("Agents in production", "10+", "+", "Specialized agents running in production today, governed end to end.", [15, 21, 33, 45, 64, 76, 91])}
      </div>
    </div>
  </section>

  <section class="section" id="cases" aria-labelledby="cs-title">
    <div class="wrap">
      <div class="head-row"><div class="head"><p class="label accent">Case studies</p><h2 id="cs-title" class="h2">Stories of <span class="grad">transformation.</span></h2></div>
        <a class="btn btn--secondary" href="https://www.evoketechnologies.com/insights/case-studies/" target="_blank" rel="noopener">All case studies {A}<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span></a></div>
      <div class="grid g2">{case_html}</div>
    </div>
  </section>

  <section class="section alt" id="industries" aria-labelledby="in-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Industries</p><h2 id="in-title" class="h2">AI that speaks <span class="grad">your industry.</span></h2><p class="body">Industry-specific AI that understands your regulations, your workflows and your competitive pressures.</p></div>
      <div class="grid g3">{ind_html}</div>
    </div>
  </section>

  <section class="section" id="insights" aria-labelledby="kn-title">
    <div class="wrap">
      <div class="head-row"><div class="head"><p class="label accent">Knowledge hub</p><h2 id="kn-title" class="h2">From brainstorming to execution — <span class="grad">all in one place.</span></h2></div>
        <a class="btn btn--secondary" href="https://www.evoketechnologies.com/ai-orbit/" target="_blank" rel="noopener">Browse all insights {A}<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span></a></div>
      <div class="list">{ins_html}</div>
    </div>
  </section>

{faq(FAQ)}
{cta_panel()}
{contact()}
</main>
{footer(r)}"""


# ---------------------------------------------------------------- SERVICE
def service(s, prev, nxt):
    r = "../"
    tag, hook, desc, _, _ = LIVE[s["slug"]]
    words = s["name"].split(" ")
    h1 = " ".join(words[:-2]) + (" " if len(words) > 2 else "") + '<span class="grad">' + " ".join(words[-2:]) + "</span>"
    meta = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in s["meta"])
    panels = ""
    for eb, h, p, checks, fit in s["panels"]:
        lis = "".join(f"<li>{c}</li>" for c in checks)
        panels += f'<article class="card rv"><p class="label accent">{eb}</p><h3 class="h3">{h}</h3><p class="body">{p}</p><ul class="ticks">{lis}</ul><div class="fit push"><span class="label">Fit for</span><p class="small">{fit}</p></div></article>'
    caps = "".join(f'<article class="card rv"><span class="label">{i + 1:02d}</span><h3 class="h3">{h}</h3><p class="small">{p}</p></article>' for i, (h, p) in enumerate(s["caps"]))
    pipe_ic = ["search", "layers", "code", "check", "shield", "rocket"]
    pipe = "".join(f'<li class="card rv"><div class="idx"><b>{i + 1:02d}</b></div>{ic(pipe_ic[i % 6], 22)}<h3 class="h3">{h}</h3><p class="small">{p}</p></li>' for i, (h, p) in enumerate(PIPELINE))
    flow_nodes = [("doc", "Your data", "Documents, apps and APIs"), ("layers", "Retrieval", "Permission-aware context"), ("agent", "Agent core", "Plans, reasons, calls tools"), ("shield", "Guardrails", "Policy, PII and evaluation"), ("check", "Human review", "Approve or correct"), ("rocket", "Action", "Systems of record")]
    flow = ""
    for i, (k, t, d) in enumerate(flow_nodes):
        flow += f'<li class="node{" core" if i == 2 else ""}">{ic(k, 22)}<b>{t}</b><span class="small">{d}</span></li>'
        if i < len(flow_nodes) - 1:
            flow += f'<li class="edge" aria-hidden="true">{ic("arrow", 16)}</li>'
    mets = ""
    for k, (v, u, l) in enumerate(s["stats"]):
        mets += metric(l, f"{v}{' ' if u.isalpha() else ''}{u}", u, "Measured on live client programmes.", [[20, 30, 42, 55, 68, 82, 100], [18, 28, 40, 52, 66, 80, 96], [14, 22, 34, 48, 62, 78, 92]][k % 3])
    return head(f"{s['name']} — {tag} | Evoke AI Orbit · V5", hook, r) + f"""<body>
{header(r)}
<main id="main">
  <section class="hero" aria-labelledby="ph-title">
    <canvas class="lattice" data-lattice="40" aria-hidden="true"></canvas>
    <div class="wrap">
      <div class="copy">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s['name']}</span></nav>
        <p class="eyebrow">Service {s['idx']} · {tag}</p>
        <h1 id="ph-title" class="h1">{h1}</h1>
        <p class="lead strong">{hook}</p>
        <p class="body">{desc}</p>
        <div class="actions"><a class="btn btn--primary" href="#contact">Get started {A}</a><a class="btn btn--secondary" href="#approach">See the approach {A}</a></div>
      </div>
      <aside class="card glance" aria-label="At a glance"><p class="label">At a glance</p><dl>{meta}</dl><a class="btn btn--primary" href="#contact">Talk to a specialist {A}</a></aside>
    </div>
  </section>

  <section class="section alt" id="approach" aria-labelledby="ap-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Approach</p><h2 id="ap-title" class="h2">Two paths. <span class="grad">One engine.</span></h2><p class="body">The same agent pipeline powers both — tuned for the problem you’re solving.</p></div>
      <div class="grid g2 panels2">{panels}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="cap-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Capabilities</p><h2 id="cap-title" class="h2">What’s inside <span class="grad">this orbit.</span></h2></div>
      <div class="grid g3">{caps}</div>
    </div>
  </section>

  <section class="section alt" aria-labelledby="ar-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Reference architecture</p><h2 id="ar-title" class="h2">Governed <span class="grad">by design</span>, not bolted on.</h2><p class="body">Every agent follows the same accountable path from your data to your systems of record.</p></div>
      <ol class="flow" aria-label="Agent architecture, in order">{flow}</ol>
    </div>
  </section>

  <section class="section" aria-labelledby="pp-title">
    <div class="wrap">
      <div class="head"><p class="label accent">The agentic pipeline</p><h2 id="pp-title" class="h2">From first-line analysis to <span class="grad">production pull request.</span></h2><p class="body">Specialist agents hand off cleanly between stages, with built-in self-healing at every step.</p></div>
      <ol class="grid g3 pipe">{pipe}</ol>
    </div>
  </section>

  <section class="section alt" aria-labelledby="mt-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Results</p><h2 id="mt-title" class="h2">What clients <span class="grad">measure.</span></h2></div>
      <div class="grid g3">{mets}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="story-title">
    <div class="wrap">
      <div class="head"><p class="label accent">Client story</p><h2 id="story-title" class="h2">Insights behind <span class="grad">the success.</span></h2></div>
      <a class="card case rv" href="../case-studies/lift-truck-self-service.html"><span class="tag" style="align-self:flex-start">Manufacturing · Global</span><h3 class="h3">Lift-truck manufacturer turns 453,958 support tickets into self-service answers.</h3><p class="body">A grounded AI assistant answers dealer questions in 30–60 seconds, with a source reference on every answer.</p><div class="outcome"><b class="grad">30–60s</b><span>to a cited answer, down from 1–2 days</span></div><span class="link push">Read the story {A}</span></a>
    </div>
  </section>

{faq(FAQ)}
{cta_panel(r="")}
{contact()}
  <nav class="section tight" aria-label="More services"><div class="wrap next2"><a href="{prev['slug']}.html"><span class="label">← Previous service</span><b class="h3">{prev['name']}</b></a><a href="{nxt['slug']}.html"><span class="label">Next service →</span><b class="h3">{nxt['name']}</b></a></div></nav>
</main>
{footer(r)}"""


# ---------------------------------------------------------------- CASE STUDY
def case_study():
    r = "../"
    rows = [("Ticket load", "~6,000 new service tickets a month raised to the manufacturer", "Dealers and vendors self-serve fixes across 14,843 indexed source files"),
            ("Time to answer", "1–2 days per ticket", "30–60 seconds per cited answer"),
            ("Answer trust", "No traceability; plausible but wrong answers possible", "Inline citations on every answer; out-of-scope questions declined; 0/22 → 11/22 fully correct after tuning"),
            ("Content freshness", "Manual reloading; stale answers", "0 manual re-ingestion steps; uploads and deletes reach the index automatically"),
            ("Isolation &amp; release", "Isolation not yet architected", "1 codebase, 6 environments, 2 tenants; RBAC-secured and live in production"),
            ("State &amp; credentials", "File-based SQLite store", "Azure SQL with Managed Identity; no SQL password in configuration"),
            ("Search scoping", "Slow to narrow across 142 series", "4 filter dimensions; 1-click saved presets per user")]
    trs = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in rows)
    meta = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in [("Industry", "Manufacturing — industrial lift trucks"), ("Region", "Global"), ("Technology", "Agent Skills · Multi-agent orchestration · React 18"), ("Service line", '<a class="link accent" href="../services/enterprise-agents.html">Enterprise Agent Solutions</a>')])
    return head("Lift-truck manufacturer self-service AI — Evoke AI Orbit case study · V5", "How a global lift-truck manufacturer turned 453,958 support tickets into self-service answers for its dealer network.", r) + f"""<body>
{header(r)}
<main id="main">
  <section class="hero" aria-labelledby="ph-title">
    <canvas class="lattice" data-lattice="40" aria-hidden="true"></canvas>
    <div class="wrap">
      <div class="copy">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#cases">Case studies</a><span aria-hidden="true">/</span><span aria-current="page">Lift-truck manufacturer</span></nav>
        <p class="eyebrow">Case study · Manufacturing · 5 min read</p>
        <h1 id="ph-title" class="h1">Lift-truck manufacturer turns <span class="grad">453,958 support tickets</span> into self-service answers.</h1>
        <p class="lead">The client received about 6,000 support tickets a month from dealers and service vendors who could not resolve issues on their own.</p>
      </div>
      <aside class="card glance" aria-label="Project facts"><p class="label">Project facts</p><dl>{meta}</dl></aside>
    </div>
  </section>

  <section class="section">
    <div class="wrap cs-grid">
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
        <p>Evoke partnered with the client to create a trusted self-service support system that reduces dependence on manufacturer support and enables faster fixes. Dealers and service partners ask questions in natural language and get answers grounded in approved company knowledge, each with source references they can check before acting.</p>
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

{cta_panel("Ready to steer your <span class=\"grad\">next release?</span>", "We’ll show you exactly how AI Orbit solves it — with a scoped proposal, a realistic timeline, and references from clients in your sector.")}
{contact()}
</main>
{footer(r)}"""


if __name__ == "__main__":
    out = ROOT / "v5"
    (out / "services").mkdir(parents=True, exist_ok=True)
    (out / "case-studies").mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(home(), encoding="utf-8")
    print("wrote v5/index.html")
    n = len(SERVICES)
    for i, s in enumerate(SERVICES):
        (out / "services" / f"{s['slug']}.html").write_text(service(s, SERVICES[(i - 1) % n], SERVICES[(i + 1) % n]), encoding="utf-8")
        print("wrote", f"v5/services/{s['slug']}.html")
    (out / "case-studies" / "lift-truck-self-service.html").write_text(case_study(), encoding="utf-8")
    print("wrote v5/case-studies/lift-truck-self-service.html")
