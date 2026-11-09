#!/usr/bin/env python3
"""Generate Version 9 "Pure Network" (v9/): Version 8 with the interactive WebGL globe + AI network hero and the #ff4c0a accent.

Layout system modelled on brainboxai.com's structure and rhythm (full-bleed
black hero with an expanding image-strip slider, product buckets, an impact
globe with stat cards, a dark stat grid, an industry fade section, a charcoal
CTA with a device, outcome and case carousels, a lined footer and a fixed
"Let's talk" tab). All copy is AI Orbit content (shared with Versions 3–7);
imagery is the AI Orbit photo set; type is Inter Tight Light.

Run from the repo root:  python3 tools/build_pages_v9.py
"""
import sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import build_pages_v3 as v3  # noqa: E402
import build_pages_v5 as v5  # noqa: E402

ARW = '<svg class="arw" width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.2"/></svg>'
CHEV_L = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M7.5 2 3.5 6l4 4" stroke="currentColor" stroke-width="1.3"/></svg>'
CHEV_R = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m4.5 2 4 4-4 4" stroke="currentColor" stroke-width="1.3"/></svg>'
SVCS = v3.SERVICES
LIVE = v3.LIVE
LINK_LBL = v5.HOME_LINKS


def img(depth, name, alt="", cls="", sizes="100vw", lazy=True, w=1600, h=1000):
    base = f"{depth}v3/assets/img/{name}"
    return (f'<img{f" class={chr(34)}{cls}{chr(34)}" if cls else ""} src="{base}-900.webp" srcset="{base}-900.webp 900w, {base}.webp 1600w" sizes="{sizes}" '
            f'alt="{escape(alt)}" width="{w}" height="{h}"{" loading=" + chr(34) + "lazy" + chr(34) if lazy else ""} decoding="async" />')


def btn(label, href="#", cls="", talk=False):
    if talk:
        return f'<button type="button" class="btn {cls}" data-talk>{label}{ARW}</button>'
    return f'<a class="btn {cls}" href="{href}">{label}{ARW}</a>'


def head(title, desc, depth):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{escape(desc)}" />
  <meta name="theme-color" content="#000000" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{depth}v9/assets/css/v9.css" />
</head>
"""


def header(depth, here, dark=False):
    """depth: relative path from the page to the repo root ('../' for v9/, '../../' for v9/services/)."""
    r = depth + "v9/"
    mega = "".join(f'<li><a href="{r}services/{s["slug"]}.html"><b>{s["name"]}</b><span>{LIVE[s["slug"]][1]}</span><em>Learn more {ARW}</em></a></li>' for s in SVCS)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="hdr{' hdr--dark' if dark else ''}" data-hdr>
  <div class="hdr-in">
    <a class="logo" href="{r}index.html" aria-label="AI Orbit by Evoke — home"><span class="logo-a">AI</span>&nbsp;ORBIT<small>by Evoke</small></a>
    <nav class="menu" aria-label="Primary">
      <ul>
        <li class="has-mega"><button type="button" aria-expanded="false" aria-controls="mega">Services <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1.5 5 5 5-5" stroke="currentColor" stroke-width="1.2"/></svg></button>
          <div class="mega" id="mega"><ul>{mega}</ul></div></li>
        <li><a href="{r}index.html#cases"{' aria-current="page"' if here == 'case' else ''}>Case studies</a></li>
        <li><a href="{r}index.html#industries">Industries</a></li>
        <li><a href="{r}index.html#insights">Insights</a></li>
      </ul>
    </nav>
    <div class="tools">
      <button type="button" class="burger" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<button type="button" class="talk-tab" data-talk aria-controls="talk" aria-expanded="false">Let's talk</button>
<div class="drawer" id="drawer" hidden>
  <div class="drawer-in">
    <p class="eyebrow">Services</p>
    <ul class="drawer-svcs">{"".join(f'<li><a href="{r}services/{s["slug"]}.html">{s["name"]}</a></li>' for s in SVCS)}</ul>
    <p class="eyebrow">Explore</p>
    <ul class="drawer-links"><li><a href="{r}index.html#cases">Case studies</a></li><li><a href="{r}case-studies/lift-truck-self-service.html">Client story: lift-truck self-service</a></li><li><a href="{r}index.html#industries">Industries</a></li><li><a href="{r}index.html#insights">Knowledge hub</a></li><li><button type="button" data-talk>Contact</button></li></ul>
  </div>
</div>
"""


def talk_panel():
    offices = "".join(f'<li><b>{c}</b><time data-tz="{tz}"></time>{f"<span>{ph}</span>" if ph else ""}</li>' for c, tz, ph in v5.OFFICES)
    return f"""<div class="talk" id="talk" role="dialog" aria-modal="true" aria-labelledby="talk-title" hidden>
  <div class="talk-scrim" data-close></div>
  <div class="talk-panel" tabindex="-1">
    <button type="button" class="talk-close" data-close aria-label="Close">×</button>
    <p class="eyebrow red">Let’s talk</p>
    <h2 id="talk-title">Tell us what you’re solving.</h2>
    <p class="muted">An AI specialist replies within one business day. Prefer email? <span class="sel">mktg@evoketechnologies.com</span></p>
    <form class="form" novalidate>
      <div class="fld"><label for="t-name">Full name *</label><input id="t-name" name="name" autocomplete="name" required aria-describedby="t-name-e" /><span class="err" id="t-name-e" aria-live="polite"></span></div>
      <div class="fld"><label for="t-mail">Work email *</label><input id="t-mail" name="email" type="email" autocomplete="email" required aria-describedby="t-mail-e" /><span class="err" id="t-mail-e" aria-live="polite"></span></div>
      <div class="fld"><label for="t-co">Company</label><input id="t-co" name="company" autocomplete="organization" /></div>
      <div class="fld"><label for="t-svc">Interested in</label><select id="t-svc" name="service">{"".join(f"<option>{s['name']}</option>" for s in SVCS)}<option>Not sure yet</option></select></div>
      <div class="fld full"><label for="t-msg">What are you solving?</label><textarea id="t-msg" name="message" rows="4"></textarea></div>
      <button class="btn btn--red" type="submit">Send request{ARW}</button>
      <p class="ok" role="status" tabindex="-1">Thank you — your request is in. We’ll reply within one business day.</p>
    </form>
    <p class="eyebrow">Offices</p>
    <ul class="offices">{offices}</ul>
  </div>
</div>
"""


def footer(depth):
    r = depth + "v9/"
    col = lambda h, items: f'<div class="fcol"><h3>{h}</h3><ul>{"".join(f"<li>{i}</li>" for i in items)}</ul></div>'
    svc = [f'<a href="{r}services/{s["slug"]}.html">{s["name"]}</a>' for s in SVCS]
    ind = [f'<a href="{r}index.html#industries">{n.replace("&amp;", "&amp;")}</a>' for _, n, _, _ in v5.HOME_INDS]
    ins = [f'<a href="{r}index.html#cases">Case studies</a>', f'<a href="{r}case-studies/lift-truck-self-service.html">Client story</a>', f'<a href="{r}index.html#insights">Knowledge papers</a>', f'<a href="{r}index.html#insights">Articles</a>']
    abt = ['<a href="https://www.evoketechnologies.com/" target="_blank" rel="noopener">Evoke Technologies<span class="sr-only"> (opens in a new tab)</span></a>', '<button type="button" data-talk>Contact us</button>', '<span class="sel">mktg@evoketechnologies.com</span>']
    legal = "".join(f'<a href="#">{x}</a>' for x in ["Terms of Use", "Privacy Policy", "Cookies Policy", "Disclaimer", "Sitemap", "Modern Slavery Statement"])
    return f"""<footer class="ftr">
  <div class="ftr-grid">
    <div class="ftr-new"><h2>What’s new at <span class="red">AI Orbit</span></h2><p>The latest thinking and client work from Evoke’s AI practice: agents, AI-first engineering, governance and advisory.</p></div>
    <div class="ftr-cols">{col("Services", svc)}{col("Industries", ind)}{col("Insights", ins)}{col("About", abt)}</div>
    <div class="ftr-blank" aria-hidden="true"></div>
    <div class="ftr-legal"><nav aria-label="Legal">{legal}</nav></div>
  </div>
  <p class="ftr-copy">© <span data-year>2026</span> Evoke Technologies Pvt. Ltd. All Rights Reserved.</p>
</footer>
"""


def tail(depth):
    return f"""{talk_panel()}<script src="{depth}v9/assets/js/v9.js"></script>
<script src="{depth}assets/js/version-switch.js?v=9"></script>
</body>
</html>
"""


# ------------------------------------------------------------------ home
HERO_SLIDES = [
    ("Service", "Build what thinks: enterprise agents that reason", "svc-agents", "services/enterprise-agents.html", "Explore"),
    ("Client story", "Lift-truck maker turns 453,958 tickets into self-service answers", "case-lift-truck", "case-studies/lift-truck-self-service.html", "Read more"),
    ("Service", "Intelligence in every sprint with AI-first engineering", "svc-engineering", "services/ai-first-engineering.html", "Explore"),
    ("Knowledge paper", "Hyper Programming: a new SDLC paradigm", "insight", "#insights", "Read more"),
    ("Service", "Move fast. Sleep well. Governance built in", "svc-governance", "services/ai-governance.html", "Explore"),
    ("Service", "Know before you build with AI advisory", "svc-advisory", "services/ai-advisory.html", "Explore"),
]
ROT = ["structure", "speed", "security"]
BUCKET_META = {"enterprise-agents": "Typical pilot in 6–8 weeks", "ai-first-engineering": "Greenfield + brownfield",
               "ai-governance": "Aligned to EU AI Act · NIST AI RMF", "ai-advisory": "4–6 week advisory sprint"}
IMPACT = [("chart", "65", "%", "Delivery time saved with agentic engineering"), ("layers", "150", "+", "Reusable, tested agent skill packs"), ("agent", "10", "+", "Specialized agents in production")]
ENGINE = [("30–60s", "Time to a cited answer, down from 1–2 days per ticket"), ("453,958", "Historical support tickets turned into self-service answers"),
          ("7.41B", "Vector values migrated with zero mismatches"), ("Minutes", "To convert COBOL tax engines into validated MSTX, not months")]
IND_IMG = ["ind-manufacturing", "ind-financial", "ind-energy", "ind-healthcare", "ind-education", "ind-mining"]
CASES = [("Pharmaceutical", "Sencha Migration: AI-orchestrated ExtJS to React for a regulated enterprise", "case-pharma", "https://www.evoketechnologies.com/insights/case-studies/", True),
         ("Tax & compliance", "COBOL Conversion: multi-agent modernization into validated MSTX", "case-tax", "https://www.evoketechnologies.com/insights/case-studies/", True),
         ("Manufacturing", "Production Optimization Agent gives plant managers real-time insight", "case-production", "https://www.evoketechnologies.com/insights/case-studies/", True),
         ("Legal & compliance", "Incident Triage Agent classifies and routes ITSM incidents in real time", "case-triage", "https://www.evoketechnologies.com/casestudies/ai-driven-itsm-incident-triage-automation-case-study/", True),
         ("Manufacturing · Global", "Lift-truck self-service AI answers dealers in 30–60 seconds", "case-lift-truck", "case-studies/lift-truck-self-service.html", False)]
OUTCOMES = [("Manufacturing · Global", "A grounded assistant turns 453,958 historical support tickets into cited, self-service answers for a global dealer network.", "30–60s", "to a cited answer, down from 1–2 days", "case-studies/lift-truck-self-service.html"),
            ("Tax technology & compliance", "Multi-agent modernization transforms complex COBOL tax engines into validated MSTX with full compliance and zero errors.", "Minutes", "not months, with zero errors", "https://www.evoketechnologies.com/insights/case-studies/"),
            ("Pharmaceutical", "AI-orchestrated ExtJS to React modernization for a regulated pharmaceutical enterprise, delivered under regulatory controls.", "ExtJS → React", "modernized under regulatory controls", "https://www.evoketechnologies.com/insights/case-studies/"),
            ("Manufacturing", "An AI assistant gives plant managers real-time analysis and visual insights on production data for better planning.", "Real-time", "production insight for planners", "https://www.evoketechnologies.com/insights/case-studies/")]


def icon(name):
    p = {"chart": '<path d="M5 27V15m7 12V9m7 18v-8m7 8V5" />', "layers": '<path d="m16 4 12 6-12 6L4 10z" /><path d="m4 16 12 6 12-6M4 22l12 6 12-6" />',
         "agent": '<circle cx="16" cy="12" r="6" /><path d="M5 28c1.5-6 6-9 11-9s9.5 3 11 9" /><path d="M16 2v4" />', "check": '<path d="m6 16 6 6 14-14" />',
         "search": '<circle cx="14" cy="14" r="8" /><path d="m20 20 7 7" />', "shield": '<path d="M16 3 27 7v9c0 7-5 11-11 13C10 27 5 23 5 16V7z" />',
         "code": '<path d="m11 9-7 7 7 7M21 9l7 7-7 7" />', "bolt": '<path d="M18 3 7 18h8l-2 11 11-15h-8z" />', "cpu": '<rect x="8" y="8" width="16" height="16" rx="2" /><path d="M12 4v4m8-4v4m-8 16v4m8-4v4M4 12h4m-4 8h4m16-8h4m-4 8h4" />',
         "grid": '<rect x="5" y="5" width="9" height="9" /><rect x="18" y="5" width="9" height="9" /><rect x="5" y="18" width="9" height="9" /><rect x="18" y="18" width="9" height="9" />'}[name]
    return f'<svg class="ico" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">{p}</svg>'


CAP_ICONS = ["search", "layers", "grid", "check", "shield", "bolt"]


def home():
    d = "../"
    slides = "".join(f"""<article class="strip{' is-on' if i == 0 else ''}" data-i="{i}">
        <a class="strip-link" href="{href}" tabindex="{0 if i == 0 else -1}"{'' if i == 0 else ' aria-hidden="true"'}>{img(d, im, "", "strip-img", "(max-width: 900px) 80vw, 40vw", i > 1)}
          <span class="strip-txt"><span class="cat">{cat}</span><span class="t">{t}</span><span class="more">{more}</span></span></a>
      </article>""" for i, (cat, t, im, href, more) in enumerate(HERO_SLIDES))
    rot = "".join(f'<span{" class=" + chr(34) + "on" + chr(34) if i == 0 else ""}>{w}</span>' for i, w in enumerate(ROT))
    buckets = "".join(f"""<article class="bucket{' is-on' if i == 0 else ''}">
          <h3>{s["name"]}</h3>
          <p>{LIVE[s["slug"]][0]}. {LIVE[s["slug"]][1]}</p>
          <p class="bucket-meta"><span class="dot-ico" aria-hidden="true"></span>{BUCKET_META[s["slug"]]}</p>
          {btn(LINK_LBL[s["slug"]], f'services/{s["slug"]}.html', 'btn--sm')}
        </article>""" for i, s in enumerate(SVCS))
    stats = "".join(f"""<div class="stat">{icon(ic)}<p class="num"><span data-count="{n}">{n}</span><span class="red">{suf}</span></p><p class="lbl">{lbl}</p></div>""" for ic, n, suf, lbl in IMPACT)
    logos = "".join(f'<li><img src="../assets/partners/{f}.svg" alt="{n}" style="--h:{h}px" loading="lazy" /></li>' for f, n, h in
                    [("microsoft", "Microsoft", 26), ("aws", "AWS", 30), ("salesforce", "Salesforce", 40), ("servicenow", "ServiceNow", 22), ("oracle", "Oracle", 18), ("uipath", "UiPath", 28)])
    engine = "".join(f'<div class="ebox"><p class="big">{n}</p><p>{t}</p></div>' for n, t in ENGINE)
    inds = "".join(f'<li><button type="button" class="{"on" if i == 0 else ""}" aria-pressed="{"true" if i == 0 else "false"}" data-i="{i}"><span class="n">0{i + 1}</span>{n}</button></li>' for i, (_, n, _, _) in enumerate(v5.HOME_INDS))
    ind_imgs = "".join(f"""<figure class="{'on' if i == 0 else ''}" data-i="{i}">{img(d, IND_IMG[i], "", "", "(max-width: 900px) 100vw, 50vw")}<figcaption><b>{n}</b><span>{desc}</span><em>{' · '.join(tags)}</em></figcaption></figure>"""
                       for i, (_, n, desc, tags) in enumerate(v5.HOME_INDS))
    outs = "".join(f"""<article class="out{' on' if i == 0 else ''}" data-i="{i}" aria-hidden="{'false' if i == 0 else 'true'}">
          <p class="out-sector">{sec}</p><blockquote><p>{q}</p></blockquote>
          <div class="out-metric"><b>{m}</b><span>{mc}</span></div>
          <a class="lnk" href="{href}"{' target="_blank" rel="noopener"' if href.startswith('http') else ''}>Read the story{ARW}{'<span class="sr-only"> (opens in a new tab)</span>' if href.startswith('http') else ''}</a>
        </article>""" for i, (sec, q, m, mc, href) in enumerate(OUTCOMES))
    cases = "".join(case_card(d, *c) for c in CASES)
    insights = "".join(f'<li><span class="k">{k}</span><b>{t}</b></li>' for k, t, _ in v5.HOME_INSIGHTS[:3])
    return head("Evoke AI Orbit — AI That Powers Your Trajectory · V9", "From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to a measurable impact.", d) + f"""<body class="home">
{header(d, 'home', dark=True)}
<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-globe" aria-hidden="true"></div>
    <div class="hero-in">
      <div class="hero-copy">
        <p class="eyebrow light">Evoke AI Orbit</p>
        <h1 id="hero-title">AI that powers your trajectory</h1>
        <p class="hero-lead">From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to a measurable impact.</p>
        <div class="btns">{btn("Explore services", "#services", "btn--light")}{btn("Let’s talk", cls="btn--line-light", talk=True)}</div>
      </div>
      <div class="hero-ctrl">
        <button type="button" class="circ" data-prev aria-label="Previous story">{CHEV_L}</button><button type="button" class="circ" data-next aria-label="Next story">{CHEV_R}</button>
        <p class="count" aria-live="polite"><span class="cur">1</span><i aria-hidden="true"></i><span class="tot">{len(HERO_SLIDES)}</span><span class="sr-only"> of {len(HERO_SLIDES)} stories</span></p>
      </div>
      <div class="strips" role="group" aria-roledescription="carousel" aria-label="Featured stories">{slides}</div>
    </div>
  </section>
  <script type="module" src="{d}v9/assets/js/globe9.js"></script>

  <section class="sec off" id="services" aria-labelledby="svc-title">
    <div class="wrap">
      <div class="intro">
        <h2 id="svc-title">Enterprise AI with <b class="rot" aria-hidden="true">{rot}</b><span class="sr-only">structure, speed and security</span></h2>
        <p>From strategy to execution, we help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.</p>
      </div>
      <div class="buckets">{buckets}</div>
    </div>
  </section>

  <section class="sec impact" aria-labelledby="imp-title">
    <div class="wrap">
      <h2 id="imp-title" class="display">Our impact</h2>
      <div class="globe-wrap">
        <canvas class="globe" aria-hidden="true"></canvas>
        <p class="globe-txt">With AI Orbit, enterprises across seven offices and four continents are moving from AI ambition to measurable impact.</p>
      </div>
      <div class="stats">{stats}</div>
    </div>
  </section>

  <section class="trusted" aria-labelledby="tr-title">
    <div class="wrap"><h2 id="tr-title">Built on platforms you trust:</h2><ul class="logos">{logos}</ul></div>
  </section>

  <section class="sec dark" aria-labelledby="eng-title">
    <div class="wrap">
      <div class="eng-head"><h2 id="eng-title" class="h3">The AI delivery engine behind every orbit</h2>{btn("Learn more", "services/ai-first-engineering.html", "btn--light")}</div>
      <div class="egrid">{engine}</div>
    </div>
  </section>

  <section class="sec fade" id="industries" aria-labelledby="ind-title">
    <div class="wrap fade-grid">
      <div class="fade-copy">
        <h2 id="ind-title">Different industries, same results</h2>
        <p>Industry-specific AI that understands your regulations, your workflows and your competitive pressures. From shop floors and trading desks to clinics and campuses, the same governed delivery engine turns AI ambition into measurable outcomes.</p>
        <ul class="ind-list">{inds}</ul>
      </div>
      <div class="fade-media" aria-live="polite">{ind_imgs}</div>
    </div>
  </section>

  <section class="sec cta-dark" id="insights" aria-labelledby="kn-title">
    <div class="wrap cta-grid">
      <div class="cta-copy">
        <h2 id="kn-title">From brainstorming to execution – all in one place.</h2>
        <p>Knowledge papers and articles from Evoke’s AI practice, from Hyper Programming to First Principles Delivery.</p>
        <div class="btns">{btn("Explore the knowledge hub", "https://www.evoketechnologies.com/insights/", "btn--light")}{btn("Let’s talk", cls="btn--line-light", talk=True)}</div>
      </div>
      <div class="device" aria-hidden="true">
        <div class="phone"><div class="screen">
          <p class="scr-top"><span class="logo-a">AI</span> ORBIT · Knowledge hub</p>
          {img(d, "insight", "", "scr-img", "240px")}
          <ul class="scr-list">{insights}</ul>
        </div></div>
      </div>
    </div>
    <div class="wedge" aria-hidden="true"></div>
  </section>

  <section class="sec outcomes" aria-labelledby="out-title">
    <div class="wrap out-grid">
      <div class="out-side">
        <h2 id="out-title" class="small">See what AI Orbit delivers for clients across sectors.</h2>
        <div class="pager"><button type="button" class="circ dark" data-prev aria-label="Previous outcome">{CHEV_L}</button><button type="button" class="circ dark" data-next aria-label="Next outcome">{CHEV_R}</button></div>
      </div>
      <div class="out-track">{outs}</div>
    </div>
  </section>

  <section class="sec off cases" id="cases" aria-labelledby="cs-title">
    <div class="wrap">
      <div class="cases-head">
        <h2 id="cs-title" class="h1">AI Orbit brings value to every kind of enterprise.</h2>
        <div class="cases-side"><p>Explore our case studies.</p><div class="pager"><button type="button" class="circ dark" data-prev aria-label="Scroll case studies left">{CHEV_L}</button><button type="button" class="circ dark" data-next aria-label="Scroll case studies right">{CHEV_R}</button></div></div>
      </div>
      <ul class="rail">{cases}</ul>
    </div>
  </section>
</main>
{footer(d)}{tail(d)}"""


def case_card(d, tag, title, im, href, ext, prefix=""):
    tgt = ' target="_blank" rel="noopener"' if ext else ""
    sr = '<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>' if ext else ""
    return f"""<li class="card"><a href="{prefix if not ext else ''}{href}"{tgt}>
      <span class="card-img">{img(d, im, "", "", "340px")}<span class="tag">{tag}</span></span>
      <span class="card-t">{title}</span><span class="more">Read more{ARW}</span>{sr}</a></li>"""


# ------------------------------------------------------------------ service pages
AGENT_MSG = {"enterprise-agents": ("Orbit agent", "Answer drafted from 3 approved sources. Out-of-scope question declined."),
             "ai-first-engineering": ("Orbit SDLC agent", "Pull request staged: tests green, audit trail attached."),
             "ai-governance": ("Orbit guardrail", "Policy check passed: PII redacted, decision logged for audit."),
             "ai-advisory": ("Orbit advisor", "Use case scored: high value, medium feasibility, low risk.")}
PATH_IMG = {"enterprise-agents": ("svc-agents", "case-lift-truck"), "ai-first-engineering": ("svc-engineering", "case-tax"),
            "ai-governance": ("svc-governance", "case-triage"), "ai-advisory": ("svc-advisory", "insight")}
PIPE_ICONS = ["search", "cpu", "code", "check", "shield", "bolt"]


def service(s, others):
    d = "../../"
    slug = s["slug"]; tag, hook, desc, im, alt = LIVE[slug]
    who, msg = AGENT_MSG[slug]
    caps = "".join(f"""<li><button type="button" class="cap{' on' if i == 0 else ''}" aria-pressed="{'true' if i == 0 else 'false'}" data-cap="{escape(c[1])}" data-t="{escape(c[0])}">{icon(CAP_ICONS[i])}<span>{c[0]}</span></button></li>""" for i, c in enumerate(s["caps"]))
    paths = "".join(f"""<article class="col">
        <div class="col-img">{img(d, PATH_IMG[slug][i], "", "", "(max-width: 900px) 100vw, 45vw")}</div>
        <p class="eyebrow red">{lbl}</p><h3>{t}</h3><p>{p}</p>
        <ul class="ticks">{"".join(f"<li>{b}</li>" for b in bl)}</ul>
        <p class="fit"><span>Fit for</span>{fit}</p>
      </article>""" for i, (lbl, t, p, bl, fit) in enumerate(s["panels"]))
    pipe = "".join(f'<li class="pcard" style="--i:{i}">{icon(PIPE_ICONS[i])}<div><b>{n}</b><span>{t}</span></div></li>' for i, (n, t) in enumerate(v5.PIPELINE))
    stats = "".join(f'<div><b>{n}<span>{u}</span></b><span>{l}</span></div>' for n, u, l in s["stats"])
    faq = "".join(f"""<li><h3><button type="button" aria-expanded="false" aria-controls="fq{i}" id="fqb{i}"><span class="ck" aria-hidden="true">✓</span>{q}<span class="pl" aria-hidden="true"></span></button></h3>
        <div class="fa" id="fq{i}" role="region" aria-labelledby="fqb{i}" hidden><p>{a}</p></div></li>""" for i, (q, a) in enumerate(v5.FAQ))
    rel = "".join(f"""<li class="card"><a href="{o['slug']}.html"><span class="card-img">{img(d, LIVE[o['slug']][3], "", "", "340px")}<span class="tag">Service</span></span>
      <span class="card-t">{o['name']}: {LIVE[o['slug']][0]}</span><span class="more">Learn more{ARW}</span></a></li>""" for o in others)
    return head(f"{s['name']} — {tag} | Evoke AI Orbit · V9", hook, d) + f"""<body class="sub">
{header(d, 'svc')}
<main id="main">
  <section class="sv-hero" aria-labelledby="sv-title">
    <div class="wrap sv-grid">
      <div class="sv-copy">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s['name']}</span></nav>
        <h1 id="sv-title">{s['name']}</h1>
        <p class="sv-sub">{tag}. {hook}</p>
        <p>{desc}</p>
        <div class="btns">{btn("Let’s talk", cls="btn--red", talk=True)}{btn("See capabilities", "#capabilities", "btn--line")}</div>
      </div>
      <div class="sv-visual" aria-hidden="true">
        <div class="ring">{img(d, im, "", "ring-img", "420px", False)}</div>
        <div class="bubble"><span class="who"><i></i>{who}</span><span>{msg}</span></div>
      </div>
    </div>
  </section>

  <section class="sec off" id="capabilities" aria-labelledby="cap-title">
    <div class="wrap">
      <div class="intro"><h2 id="cap-title">What’s inside this orbit.</h2><p>Six capabilities, one accountable delivery engine. Select one to see what it does.</p></div>
      <div class="tabs">
        <figure class="tab-media">{img(d, im, alt, "", "(max-width: 900px) 100vw, 55vw")}<figcaption aria-live="polite"><b>{s['caps'][0][0]}</b><span>{s['caps'][0][1]}</span></figcaption></figure>
        <ul class="caps">{caps}</ul>
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="paths-title">
    <div class="wrap">
      <div class="intro"><h2 id="paths-title">Two paths. One engine.</h2><p>The same agent pipeline powers both — tuned for the problem you’re solving.</p></div>
      <div class="cols">{paths}</div>
    </div>
  </section>

  <section class="sec off pipeline" aria-labelledby="pp-title">
    <div class="wrap">
      <div class="intro center"><h2 id="pp-title">From first-line analysis to production pull request.</h2><p>Specialist agents hand off cleanly between stages, with built-in self-healing at every step.</p></div>
      <div class="orbit-map"><div class="core" aria-hidden="true"><span></span><b>AI Orbit</b></div><ol class="pcards">{pipe}</ol></div>
    </div>
  </section>

  <section class="cta-red" aria-labelledby="cr-title">
    <div class="wrap cr-grid">
      <div><h2 id="cr-title">Ready to steer your next release?</h2><p>A scoped proposal, a realistic timeline, and references from clients in your sector. No pitch decks, no vague “AI transformation” talk.</p>
        <div class="btns">{btn("Let’s talk", cls="btn--light", talk=True)}{btn("Read the client story", "../case-studies/lift-truck-self-service.html", "btn--line-light")}</div></div>
      <div class="cr-stats">{stats}</div>
    </div>
  </section>

  <section class="sec faq" aria-labelledby="faq-title">
    <div class="wrap faq-grid"><h2 id="faq-title">Frequently asked questions</h2><ul class="acc">{faq}</ul></div>
  </section>

  <section class="sec off cases" aria-labelledby="rel-title">
    <div class="wrap">
      <div class="cases-head"><h2 id="rel-title" class="h1">You would also like</h2>
        <div class="cases-side"><div class="pager"><button type="button" class="circ dark" data-prev aria-label="Scroll left">{CHEV_L}</button><button type="button" class="circ dark" data-next aria-label="Scroll right">{CHEV_R}</button></div></div></div>
      <ul class="rail">{rel}</ul>
    </div>
  </section>
</main>
{footer(d)}{tail(d)}"""


# ------------------------------------------------------------------ case study
def case_study():
    d = "../../"
    rows = [("Industry", "Manufacturing — industrial lift trucks"), ("Region", "Global"), ("Technology", "Agent Skills · Multi-agent orchestration · React 18"),
            ("Service line", '<a href="../services/enterprise-agents.html">Enterprise Agent Solutions</a>'), ("Historical tickets on record", "453,958"),
            ("New tickets every month", "~6,000"), ("Source documents to search", "~51 GiB")]
    ov = "".join(f"<tr><th scope=\"row\">{a}</th><td>{b}</td></tr>" for a, b in rows)
    out = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in [
        ("Ticket load", "~6,000 new service tickets a month raised to the manufacturer", "Dealers and vendors self-serve fixes across 14,843 indexed source files"),
        ("Time to answer", "1–2 days per ticket", "30–60 seconds per cited answer"),
        ("Answer trust", "No traceability; plausible but wrong answers possible", "Inline citations on every answer; out-of-scope questions declined; 0/22 → 11/22 fully correct after tuning"),
        ("Content freshness", "Manual reloading; stale answers", "0 manual re-ingestion steps; uploads and deletes reach the index automatically"),
        ("Isolation & release", "Isolation not yet architected", "1 codebase, 6 environments, 2 tenants; RBAC-secured and live in production"),
        ("State & credentials", "File-based SQLite store", "Azure SQL with Managed Identity; no SQL password in configuration"),
        ("Search scoping", "Slow to narrow across 142 series", "4 filter dimensions; 1-click saved presets per user")])
    res = "".join(f'<div class="rcard"><p class="rlbl">{l}</p><p class="rnum"><span class="red" aria-hidden="true">{a}</span>{n}</p><p class="rcap">{c}</p></div>' for l, a, n, c in [
        ("Time to answer", "↓", "30–60s", "Per cited answer, down from 1–2 days per ticket"), ("Source files", "↑", "14,843", "Indexed and searchable across 142 truck series"),
        ("Migration", "✓", "7.41B", "Vector values migrated with zero mismatches"), ("Capacity", "↑", "100K+", "Tokens per minute, with safeguards for production peaks")])
    li = lambda xs: "".join(f"<li><strong>{a}</strong> {b}</li>" for a, b in xs)
    others = "".join(case_card(d, t, ti, im, h, ext) for t, ti, im, h, ext in CASES[:4])
    return head("Lift-truck manufacturer self-service AI — Evoke AI Orbit case study · V9", "How a global lift-truck manufacturer turned 453,958 support tickets into self-service answers for its dealer network.", d) + f"""<body class="sub">
{header(d, 'case')}
<main id="main">
  <section class="cs-hero" aria-labelledby="cs-h1">
    <div class="wrap cs-top"><a class="back" href="../index.html#cases">{CHEV_L} Case studies</a><p class="client">Client — Global lift-truck manufacturer</p></div>
    <div class="wrap"><h1 id="cs-h1">Lift-truck manufacturer turns 453,958 support tickets into self-service answers</h1></div>
    <div class="cs-media">{img(d, "case-lift-truck", "Operator driving an orange forklift loaded with timber at a warehouse door", "", "100vw", False)}
      <div class="client-card"><p class="cc-sector">Manufacturing</p><p>Global industrial lift-truck manufacturer and dealer network</p></div></div>
    <div class="wrap cs-bar"><nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#cases">Case studies</a><span aria-hidden="true">/</span><span aria-current="page">Lift-truck self-service AI</span></nav>{btn("Talk to an architect", cls="btn--red btn--sm", talk=True)}</div>
  </section>

  <section class="sec narrow" aria-labelledby="ctx">
    <div class="wrap prose">
      <h2 id="ctx" class="eyebrow red">Context</h2>
      <p class="lede">The client received about 6,000 support tickets a month from dealers and service vendors who could not resolve issues on their own.</p>
      <p class="lede">Every issue a dealer or service vendor could not fix on site became a ticket for the manufacturer. The answers usually already existed across thousands of manuals, technical documents, knowledge base articles and past cases, but finding the right one quickly and confidently was hard.</p>
      <p>As the product portfolio and documentation grew, service teams spent more time searching, escalating and waiting for manufacturer support. This led to:</p>
      <ul class="dash">{li([("Rising ticket volume:", "more escalations to the manufacturer and higher support costs."), ("Slow resolution:", "most tickets took 1–2 days to close, delaying dealers and service vendors."), ("Unused knowledge:", "institutional know-how spread across multiple repositories."), ("Stretched support teams:", "lower productivity under growing pressure from escalations."), ("Compliance risk:", "no easy way to confirm teams followed approved maintenance and repair guidance.")])}</ul>
    </div>
  </section>

  <section class="sec tight" aria-labelledby="ov-title">
    <div class="wrap"><div class="overview"><h2 id="ov-title" class="h4">Project overview</h2><table class="ov">{ov}</table></div></div>
  </section>

  <section class="sec narrow" aria-labelledby="ap-title">
    <div class="wrap prose">
      <h2 id="ap-title" class="eyebrow red">Approach</h2>
      <p><strong>A trusted self-service support system, grounded in approved knowledge.</strong><br />Evoke partnered with the client to create a self-service support system that reduces dependence on manufacturer support and enables faster fixes. Dealers and service partners ask questions in natural language and get answers grounded in approved company knowledge, each with source references they can check before acting. Five requirements shaped the build.</p>
      <ul class="dash">{li([("Trusted answers:", "responses draw only on approved manuals, tickets and KB content; out-of-scope questions are declined."), ("Always current:", "new and revised manuals reach users automatically via Azure Event Grid and Azure Functions."), ("Secure access:", "Microsoft Entra ID RBAC limits the assistant to authorised users; demo and client environments never share a data plane."), ("Faster discovery:", "filters by product line, brand, region and content type, with one-click saved presets."), ("Proven at production scale:", "2,413,646 search records migrated with zero mismatches; safeguards added after test peaks hit 208,534 tokens per minute.")])}</ul>
    </div>
  </section>

  <section class="sec off" aria-labelledby="rs-title">
    <div class="wrap"><h2 id="rs-title" class="h3 rs-h">Self-service answers that dealers and vendors can trust.</h2><div class="rgrid">{res}</div></div>
  </section>

  <section class="sec narrow" aria-labelledby="out-title">
    <div class="wrap prose">
      <h2 id="out-title" class="eyebrow red">Results</h2>
      <p><strong>The assistant meets the client’s core goal of reducing reliance on manufacturer support.</strong> Dealers and service vendors find answers faster and resolve more issues on their own.</p>
      <div class="tbl" tabindex="0" role="region" aria-label="Before and after outcomes"><table><thead><tr><th scope="col">Outcome</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>{out}</tbody></table></div>
    </div>
  </section>

  <section class="cs-cta" aria-labelledby="cc-title">
    <div class="cs-cta-img">{img(d, "svc-agents", "", "", "100vw")}</div>
    <div class="cs-cta-card"><h2 id="cc-title">Ready to steer your next release?</h2><p>We’ll show you exactly how AI Orbit solves it — with a scoped proposal, a realistic timeline, and references from clients in your sector.</p>{btn("Let’s talk", cls="btn--line-light", talk=True)}</div>
  </section>

  <section class="sec off cases" aria-labelledby="rel-title">
    <div class="wrap">
      <div class="cases-head"><h2 id="rel-title" class="h1">You would also like</h2>
        <div class="cases-side"><div class="pager"><button type="button" class="circ dark" data-prev aria-label="Scroll left">{CHEV_L}</button><button type="button" class="circ dark" data-next aria-label="Scroll right">{CHEV_R}</button></div></div></div>
      <ul class="rail">{others.replace('href="case-studies/lift-truck-self-service.html"', 'href="lift-truck-self-service.html"')}</ul>
    </div>
  </section>
</main>
{footer(d)}{tail(d)}"""


if __name__ == "__main__":
    out = ROOT / "v9"
    for sub in ("services", "case-studies"):
        (out / sub).mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(home(), encoding="utf-8"); print("wrote v9/index.html")
    for s in SVCS:
        others = [o for o in SVCS if o["slug"] != s["slug"]]
        html = service(s, others)
        (out / "services" / f"{s['slug']}.html").write_text(html, encoding="utf-8"); print(f"wrote v9/services/{s['slug']}.html")
    cs = case_study()
    # case cards inside a sub-page point back up to the home-relative paths
    cs = cs.replace('href="case-studies/', 'href="')
    (out / "case-studies" / "lift-truck-self-service.html").write_text(cs, encoding="utf-8"); print("wrote v9/case-studies/lift-truck-self-service.html")
