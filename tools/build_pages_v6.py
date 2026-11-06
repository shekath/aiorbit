#!/usr/bin/env python3
"""Generate Version 6 "Signal" (v6/): home, four service pages and the case study.

Version 6 keeps Version 5's text, section order and heading hierarchy (it
imports the same content from tools/build_pages_v5.py) with a new, unique
layout: index-grid header, WebGL neural-network hero, giant ticker, signal
log, numbered service rows, staircase process, spec plate, sticky case stack,
crosshair matrix, editorial knowledge hub, horizon CTA, underline form.
Fonts: PP Neue Montreal + Jura. Dark and light themes. No gradient text/CTAs.
Run from the repo root:  python3 tools/build_pages_v6.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import build_pages_v5 as v5  # noqa: E402
from build_pages_v5 import (FAQ, HOME_CASES, HOME_INDS, HOME_INSIGHTS, HOME_LINKS, HOME_STEPS, HOME_TICKS, LIVE, OFFICES,  # noqa: E402
                            PIPELINE, SERVICES, SVC_ICON)

ic = v5.ic
ARR = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>'
RING = '<svg class="ring" aria-hidden="true" focusable="false"><rect pathLength="100"/></svg>'
GRID = '<div class="gridlines" aria-hidden="true">' + "<i></i>" * 12 + "</div>"


def cta(label, href, kind="black", extra=""):
    ring = RING if kind == "black" else ""
    return f'<a class="cta cta--{kind}" href="{href}"{extra}>{ring}<span>{label}</span>{ARR}</a>'


def head(title, desc, r):
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<meta name="theme-color" content="#0A0A0A" />
<script>(function(){{var d=document.documentElement;d.classList.add("js");try{{var t=localStorage.getItem("orbitc-theme")||localStorage.getItem("orbit-theme");if(t==="light"||t==="dark")d.dataset.theme=t;}}catch(e){{}}}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500;600;700&display=swap" />
<!-- PP Neue Montreal (Pangram Pangram) is a commercial typeface: license it and self-host for production. -->
<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/pp-neue-montreal" />
<link rel="stylesheet" href="{r}assets/css/v6.css" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230A0A0A'/%3E%3Ccircle cx='16' cy='16' r='10' fill='none' stroke='%23F4F4F1' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='4' fill='%2373FFB9'/%3E%3C/svg%3E" />
</head>
"""


def header(r, home=False):
    h = "" if home else f"{r}index.html"
    links = [("Services", f"{h}#services"), ("How it works", f"{h}#how"), ("Case studies", f"{h}#cases"), ("Industries", f"{h}#industries"), ("Insights", f"{h}#insights")]
    nav = "".join(f'<a href="{u}"><span class="n" aria-hidden="true">{i:02d}</span>{t}</a>' for i, (t, u) in enumerate(links, 1))
    dnav = "".join(f'<a href="{u}">{t}<span aria-hidden="true">{i:02d}</span></a>' for i, (t, u) in enumerate(links, 1))
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="hdr">
  <div class="row">
    <div class="cell"><a class="brand" href="{r}index.html" aria-label="AI Orbit by Evoke — home"><span class="mark" aria-hidden="true"><i></i><i></i></span><b>AI Orbit</b><small>by Evoke</small></a></div>
    <nav class="menu" aria-label="Primary">{nav}</nav>
    <div class="v6-actions">
      <button class="icon-btn" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light theme">{ic("sun", 18, "sun")}{ic("moon", 18, "moon")}</button>
      {cta("Talk to us", f"{h}#contact")}
      <button class="icon-btn burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">{ic("menu", 20)}</button>
    </div>
  </div>
  <nav class="drawer" id="drawer" aria-label="Mobile">{dnav}{cta("Talk to us", f"{h}#contact")}</nav>
</header>
"""


def footer(r):
    svc = "".join(f'<li><a href="{r}services/{s["slug"]}.html">{s["name"]}</a></li>' for s in SERVICES)
    ind = "".join(f'<li><a href="{r}index.html#industries">{x}</a></li>' for x in ["Manufacturing", "Financial Services", "Energy", "Healthcare", "Higher Education", "Mining"])
    ins = f'<li><a href="{r}case-studies/lift-truck-self-service.html">Case studies</a></li>' + "".join(f'<li><a href="{r}index.html#insights">{x}</a></li>' for x in ["Blog", "Videos", "News &amp; events", "Resource hub"])
    return f"""<footer class="ftr">
  <div class="wrap">
    <div class="cols">
      <div class="about-f"><a class="brand" href="{r}index.html"><span class="mark" aria-hidden="true"><i></i><i></i></span><b>AI Orbit</b></a><p class="small">Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.</p>
        <div class="keys" aria-label="Keyboard shortcuts"><span><kbd>S</kbd> Services</span><span><kbd>C</kbd> Contact</span><span><kbd>/</kbd> Ask the orbit</span><span><kbd>M</kbd> Motion</span></div>
        <button class="motion-switch" type="button" role="switch" aria-checked="true" data-motion aria-keyshortcuts="M">Motion <span class="tr" aria-hidden="true"><span class="kn"></span></span></button></div>
      <div class="c1"><h2>Services</h2><ul>{svc}</ul></div>
      <div class="c2"><h2>Industries</h2><ul>{ind}</ul></div>
      <div class="c3"><h2>Insights</h2><ul>{ins}</ul></div>
    </div>
    <p class="mark-xl" aria-hidden="true">AI Orbit</p>
    <div class="legal"><span>Evoke Technologies Pvt. Ltd. © <span data-year>2026</span> All Rights Reserved.</span><nav aria-label="Legal"><a href="#">Terms of Use</a><a href="#">Privacy Policy</a><a href="#">Cookies Policy</a><a href="#">Disclaimer</a><a href="#">Sitemap</a></nav></div>
  </div>
</footer>
<script src="{r}assets/js/v6.js"></script>
<script type="module" src="{r}assets/js/neural-gl.js"></script>
<script src="{r}../assets/js/version-switch.js?v=7"></script>
</body>
</html>
"""


def shead(n, kicker, tid, title, body=None, aside=None):
    b = f'<p class="body">{body}</p>' if body else ""
    a = f'<div class="aside">{aside}</div>' if aside else ""
    return f'<div class="shead"><div class="n"><span class="idx" aria-hidden="true">{n}</span><p class="label accent">{kicker}</p></div><div class="t"><h2 id="{tid}" class="h2">{title}</h2>{b}</div>{a}</div>'


def signal_log():
    steps = [("Parsed 4,812 business rules", "0.8s"), ("Generated validated MSTX modules", "2m 14s"), ("Ran 1,206 regression tests · 0 failures", "41s")]
    lis = "".join(f'<li><span>{t}</span><span class="code">{tm}</span><span class="st" aria-hidden="true"></span></li>' for t, tm in steps)
    lis += '<li class="run"><span>Policy check · SOX controls, audit trail</span><span class="code run">running</span><span class="st" aria-hidden="true"></span></li>'
    guard = "".join(f'<span class="chip">{ic("shield", 14)}{x}</span>' for x in ["Governed", "Human-in-the-loop", "Audit trail", "PII redacted"])
    return f"""<figure class="log" aria-label="Example: an AI Orbit agent modernization run">
    <div class="q">
      <div class="head"><strong>Orbit Agent · Modernization run</strong><span class="live"><span class="dot" aria-hidden="true"></span>Live</span></div>
      <p class="prompt"><span>Modernize our COBOL tax engine and keep it audit-ready.</span></p>
      <form class="ask"><label class="sr-only" for="ask-in">Ask the orbit a question (demo)</label><input id="ask-in" type="text" placeholder="Ask the orbit about your stack…" autocomplete="off" aria-keyshortcuts="/" /><button type="submit" aria-label="Run the demo question">{ARR}</button></form>
    </div>
    <div class="run">
      <ol class="steps" aria-label="Run steps">{lis}</ol>
      <div class="meter"><span class="label">Run progress</span><div class="track-bar" role="progressbar" aria-label="Run progress" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"><i></i></div><span class="label" style="color:var(--fg)">78%</span></div>
      <div class="guard">{guard}</div>
    </div>
  </figure>"""


def faq():
    qa = ""
    for i, (q, a) in enumerate(FAQ):
        o = "true" if i == 0 else "false"
        qa += f'<div><h3><button type="button" aria-expanded="{o}" aria-controls="qa-{i}" id="qb-{i}"><span>{q}</span><span class="pm" aria-hidden="true"></span></button></h3><div class="ans" id="qa-{i}" role="region" aria-labelledby="qb-{i}"><div><p>{a}</p></div></div></div>'
    return f"""<section class="sec alt" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq">
    <div class="t"><span class="idx" aria-hidden="true">Q/A</span><p class="label accent">FAQ</p><h2 id="faq-title" class="h2">Questions, answered.</h2><p class="body">Straight answers on timelines, governance and ownership. Still curious? Talk to an AI expert.</p><a class="link accent" href="#contact">Ask us anything {ARR}</a></div>
    <div class="qa">{qa}</div>
  </div>
</section>
"""


def horizon(h='All in one <span class="em">orbit.</span>', p="Whether you’re building, modernizing or governing, AI Orbit brings structure, speed and safety to every stage of your AI journey."):
    return f"""<section class="horizon" id="launch" aria-labelledby="cta-title">
  <canvas class="neural" data-mode="calm" data-x=".7" data-y=".22" data-s=".95" aria-hidden="true"></canvas>
  <div class="mesh" aria-hidden="true"></div>
  <div class="wrap">
    <p class="k label accent">Build · Modernize · Govern</p>
    <h2 id="cta-title" class="giant" data-safe>{h}</h2>
    <p class="lead" data-safe>{p}</p>
    <div class="actions">{cta("Launch your AI journey", "#contact")}{cta("Book a readiness call", "#contact", "glass")}</div>
  </div>
</section>
"""


def contact():
    zones = "".join(f'<div><b><span class="dot" aria-hidden="true"></span>{c}</b><time data-tz="{tz}"></time>' + (f'<a href="tel:{p.replace(" ", "").replace("-", "")}">{p}</a>' if p else "") + "</div>" for c, tz, p in OFFICES)
    opts = "".join(f"<option>{s['name']}</option>" for s in SERVICES) + "<option>Not sure yet</option>"
    return f"""<section class="sec" id="contact" aria-labelledby="ct-title">
  <div class="wrap contact">
    <div class="left">
      <div><span class="idx" aria-hidden="true">Signal in</span><p class="label accent">Get in touch</p></div>
      <h2 id="ct-title" class="h2">Let’s build what’s next.</h2><p class="body">Tell us what you’re solving. An AI specialist replies within one business day.</p>
      <div class="zones">{zones}</div>
      <div class="mail-row"><a class="mail" href="mailto:mktg@evoketechnologies.com">mktg@evoketechnologies.com</a><button class="copy-btn" type="button" data-copy="mktg@evoketechnologies.com" aria-label="Copy email address"><span class="lbl">Copy</span></button><span class="sr-only" id="copy-status" aria-live="polite"></span></div>
    </div>
    <form class="form" novalidate aria-describedby="f-note">
      <div class="field"><label for="f-name">Full name <i aria-hidden="true">*</i></label><input id="f-name" name="name" autocomplete="name" required aria-describedby="f-name-err" /><span class="err" id="f-name-err" aria-live="polite"></span></div>
      <div class="field"><label for="f-email">Work email <i aria-hidden="true">*</i></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err" /><span class="err" id="f-email-err" aria-live="polite"></span></div>
      <div class="field"><label for="f-co">Company</label><input id="f-co" name="company" autocomplete="organization" /></div>
      <div class="field"><label for="f-svc">Interested in</label><select id="f-svc" name="service">{opts}</select></div>
      <div class="field full"><label for="f-msg">What are you solving?</label><textarea id="f-msg" name="message"></textarea></div>
      <div class="foot"><p class="small" id="f-note">Fields marked * are required.</p><button class="cta cta--black" type="submit">{RING}<span>Send request</span>{ARR}</button></div>
      <p class="ok" tabindex="-1" role="status">Thank you — your request is in. We’ll reply within one business day.</p>
    </form>
  </div>
</section>
"""


def fact(label, val, g, desc, bars):
    b = "".join(f'<i style="--h:{h}%;--o:{.3 + .5 * k / len(bars):.2f}"></i>' for k, h in enumerate(bars))
    shown = val.replace(g, f"<em>{g}</em>", 1) if g else val
    cnt = " data-count" if val[:1].isdigit() and "–" not in val else ""
    return f'<div class="fact"><p class="label">{label}</p><p class="big"{cnt}>{shown}</p><p class="small">{desc}</p><div class="bars" aria-hidden="true">{b}</div></div>'


def stairs(items):
    lis = "".join(f'<li style="--i:{i}"><div class="node"><b aria-hidden="true">{i + 1:02d}</b><i aria-hidden="true"></i></div>{ic(k, 22)}<h3 class="h3">{t}</h3><p class="small">{d}</p></li>' for i, (k, t, d) in enumerate(items))
    return f'<ol class="stairs" style="--n:{len(items)}"><svg aria-hidden="true" focusable="false" preserveAspectRatio="none"><path class="base"/><path class="lit" pathLength="1"/></svg>{lis}</ol>'


def case_panel(i, ind, t, b, m, ml, u, link="Read case study"):
    ext = u.startswith("http")
    attrs = ' target="_blank" rel="noopener"' if ext else ""
    sr = '<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>' if ext else ""
    return f'<a class="case" style="--i:{i}" href="{u}"{attrs}><span class="plus tl" aria-hidden="true"></span><span class="plus br" aria-hidden="true"></span><span class="no"><b aria-hidden="true">{i + 1:02d}</b><span class="chip">{ind}</span></span><span class="what"><h3 class="h3">{t}</h3><span class="body">{b}</span><span class="link">{link} {ARR}{sr}</span></span><span class="res"><b>{m}</b><span>{ml}</span></span></a>'


# (file, name, height px at desktop, original wordmark ink used in light mode; None = no ink to adapt)
LOGOS = [("microsoft", "Microsoft", 27, "#706d6e"), ("aws", "AWS", 34, "#252f3e"), ("salesforce", "Salesforce", 44, None),
         ("servicenow", "ServiceNow", 22, "#000000"), ("oracle", "Oracle", 18, None), ("uipath", "UiPath", 30, None)]
INK = {"microsoft": 'fill="#706d6e"', "aws": 'fill="#252f3e"'}


def logo_svg(f, h):
    """Inline the original-colour partner SVG. Brand colours stay as they are; the dark
    wordmark ink becomes currentColor so it reads on dark (white) and light (original ink)."""
    import re
    svg = (ROOT / "assets" / "partners" / f"{f}.svg").read_text(encoding="utf-8").strip()
    svg = re.sub(r'\s(width|height)="[^"]*"', "", svg, count=2)
    if f in INK:
        svg = svg.replace(INK[f], 'fill="currentColor"')
    if f == "servicenow":  # wordmark paths carry no fill (default black)
        svg = svg.replace("<svg ", '<svg fill="currentColor" ', 1)
    svg = svg.replace(' role="img"', "")
    return svg.replace("<svg ", f'<svg class="logo" style="--h:{h}px" aria-hidden="true" focusable="false" ', 1)


def logo_rail(r):
    """Original-colour partner logos in fixed-width cells. Six fill the row exactly;
    any extra logos make the rail scroll (snap, edge fades, prev/next buttons)."""
    lis = "".join(f'<li style="--ink:{ink or "currentColor"}">{logo_svg(f, h)}<span class="sr-only">{n}</span></li>' for f, n, h, ink in LOGOS)
    nav = f'<div class="rail-nav" hidden><button type="button" class="icon-btn" data-dir="-1" aria-label="Scroll partner logos left">{ic("arrow", 16)}</button><button type="button" class="icon-btn" data-dir="1" aria-label="Scroll partner logos right">{ic("arrow", 16)}</button></div>'
    return f'<div class="logo-rail" role="region" aria-label="Partner logos" tabindex="0"><ul>{lis}</ul></div>{nav}'


# ---------------------------------------------------------------- HOME
def home():
    r = ""
    rows = ""
    for s in SERVICES:
        tag, hook, desc, _, _ = LIVE[s["slug"]]
        ticks = "".join(f"<li>{x}</li>" for x in HOME_TICKS[s["slug"]])
        rows += f"""<article class="srow rv"><span class="n">{s['idx']}</span>
          <div class="name"><h3 class="h3">{s['name']}</h3><p class="tag">{tag} — {hook}</p></div>
          <div class="detail"><p class="body">{desc}</p><ul class="ticks">{ticks}</ul></div>
          <div class="more"><span class="sym" aria-hidden="true">{ic(SVC_ICON[s['slug']], 22)}</span><a class="link" href="services/{s['slug']}.html">{HOME_LINKS[s['slug']]} {ARR}<span class="sr-only"> — {s['name']}</span></a></div></article>"""
    cases = "".join(case_panel(i, *c) for i, c in enumerate(HOME_CASES))
    mat = "".join(f'<article class="rv"><span class="plus" aria-hidden="true"></span>{ic(k, 24, "sym")}<h3 class="h3">{t}</h3><p class="small">{d}</p><div class="pills">' + "".join(f'<span class="chip">{x}</span>' for x in tags) + "</div></article>" for k, t, d, tags in HOME_INDS)
    edit = "".join(f'<a href="https://www.evoketechnologies.com/ai-orbit/" target="_blank" rel="noopener"><span class="top"><span class="label">{ty}</span><span class="go">Read {ARR}</span></span><h3 class="h3">{t}</h3><p class="small">{d}</p><span class="sr-only"> (opens evoketechnologies.com in a new tab)</span></a>' for ty, t, d in HOME_INSIGHTS)
    tick_item = '<span class="item">AI Orbit <span class="star" aria-hidden="true"></span> <span class="o">Build</span> <span class="star" aria-hidden="true"></span> Modernize <span class="star" aria-hidden="true"></span> <span class="o">Govern</span> <span class="star" aria-hidden="true"></span></span>'
    return head("AI Orbit — Enterprise AI with structure, speed and security | Evoke · V6", "Evoke AI Orbit: build, modernize and govern enterprise AI — custom agents, AI-first engineering, governance and advisory.", r) + f"""<body>
{header(r, True)}
<main id="main">
  <section class="hero" id="top" aria-labelledby="hero-title">
    <canvas class="neural" aria-hidden="true"></canvas>
    {GRID}
    <div class="wrap meta">
      <div class="a" data-safe><p class="tagline label accent"><span class="dot" aria-hidden="true"></span>New · Evoke AI Orbit</p><ol class="idx" aria-hidden="true"><li class="on">01. Build</li><li>02. Modernize</li><li>03. Govern</li></ol></div>
      <div class="b label" aria-hidden="true"><span>ST/06 — Neural signal</span><span>Layers 6 · live</span></div>
      <div class="c label" aria-hidden="true" data-safe><span>Evoke HQ · Dayton</span><span>39.7589° N · 84.1916° W</span><span>©2026 : V.06</span></div>
    </div>
    <div class="wrap stage">
      <div class="copy" data-safe><h1 id="hero-title" class="giant"><span class="ln"><span>AI that powers</span></span> <span class="ln"><span class="em">your trajectory.</span></span></h1></div>
      <div class="side" data-safe>
        <p class="lead">From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to measurable impact.</p>
        <div class="actions">{cta("Launch your AI journey", "#contact")}{cta("Explore services", "#services", "glass")}</div>
        <p class="hint" aria-hidden="true">Hover the network · click to fire a layer</p>
      </div>
    </div>
    <div class="proof"><div><b data-count>65%</b><span>faster delivery with agentic engineering</span></div><div><b data-count>150+</b><span>reusable, tested skill packs</span></div><div><b data-count>10+</b><span>specialized agents in production</span></div></div>
  </section>

  <div class="ticker" aria-hidden="true"><div class="track">{tick_item * 2}</div></div>

  <section class="platforms" aria-label="Platforms we build on">
    <p class="label">Built on platforms you trust</p>{logo_rail(r)}
  </section>

  {signal_log()}

  <section class="sec" id="about" aria-labelledby="ab-title">
    <div class="wrap">
      {shead("001.", "About AI Orbit", "ab-title", "From strategy to execution, one accountable partner.")}
      <div class="about">
        <p class="lead strong">We help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.</p>
        <div class="cols3">
          <div><span class="num" aria-hidden="true">01</span><h3 class="h3">Build</h3><p class="small">Custom agents and AI apps that reason, not just automate.</p></div>
          <div><span class="num" aria-hidden="true">02</span><h3 class="h3">Modernize</h3><p class="small">Agentic engineering that moves legacy estates forward safely.</p></div>
          <div><span class="num" aria-hidden="true">03</span><h3 class="h3">Govern</h3><p class="small">Guardrails, evaluation and audit evidence by design.</p></div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec alt" id="services" aria-labelledby="sv-title">
    <div class="wrap">
      {shead("002.", "Our services", "sv-title", 'Enterprise AI with <span class="em">structure, speed, and security.</span>', aside=f'<p class="body">Four disciplines, one orbit. Start anywhere and connect the rest as your AI programme grows.</p>{cta("See how we deliver", "#how", "glass")}')}
      <div class="rows">{rows}</div>
    </div>
  </section>

  <section class="sec" id="how" aria-labelledby="hw-title">
    <div class="wrap">
      {shead("003.", "How it works", "hw-title", 'From first question to <span class="em">governed production.</span>', "A delivery rhythm built for regulated enterprises: every stage ends with evidence you can show an auditor.")}
      {stairs(HOME_STEPS)}
    </div>
  </section>

  <section class="sec alt" id="facts" aria-labelledby="kf-title">
    <div class="wrap">
      {shead("004.", "Key facts", "kf-title", 'Driving <span class="em">measurable</span> outcomes.', "Numbers from live client programmes, not lab benchmarks.")}
      <div class="plate"><div class="mesh" aria-hidden="true"></div>
        {fact("Delivery time saved", "65%", "%", "Average time saved with agentic engineering across delivery teams.", [24, 33, 42, 55, 67, 82, 100])}
        {fact("Skill packs", "150+", "+", "Reusable, tested agent skills that standardise behaviour across projects.", [18, 30, 45, 58, 70, 85, 97])}
        {fact("Agents in production", "10+", "+", "Specialized agents running in production today, governed end to end.", [15, 21, 33, 45, 64, 76, 91])}
      </div>
    </div>
  </section>

  <section class="sec" id="cases" aria-labelledby="cs-title">
    <div class="wrap">
      {shead("005.", "Case studies", "cs-title", 'Stories of <span class="em">transformation.</span>', aside=cta('All case studies<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>', "https://www.evoketechnologies.com/insights/case-studies/", "glass", ' target="_blank" rel="noopener"'))}
      <div class="stack">{cases}</div>
    </div>
  </section>

  <section class="sec alt" id="industries" aria-labelledby="in-title">
    <div class="wrap">
      {shead("006.", "Industries", "in-title", 'AI that speaks <span class="em">your industry.</span>', "Industry-specific AI that understands your regulations, your workflows and your competitive pressures.")}
      <div class="matrix">{mat}</div>
    </div>
  </section>

  <section class="sec" id="insights" aria-labelledby="kn-title">
    <div class="wrap">
      {shead("007.", "Knowledge hub", "kn-title", 'From brainstorming to execution — <span class="em">all in one place.</span>', aside=cta('Browse all insights<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>', "https://www.evoketechnologies.com/ai-orbit/", "glass", ' target="_blank" rel="noopener"'))}
      <div class="edit">{edit}</div>
    </div>
  </section>

{faq()}
{horizon()}
{contact()}
</main>
{footer(r)}"""


# ---------------------------------------------------------------- SERVICE
def service(s, prev, nxt):
    r = "../"
    tag, hook, desc, _, _ = LIVE[s["slug"]]
    words = s["name"].split(" ")
    h1 = " ".join(words[:-2]) + (" " if len(words) > 2 else "") + '<span class="em">' + " ".join(words[-2:]) + "</span>"
    meta = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in s["meta"])
    paths = ""
    for eb, h, p, checks, fit in s["panels"]:
        lis = "".join(f"<li>{c}</li>" for c in checks)
        paths += f'<article class="rv"><p class="label accent">{eb}</p><h3 class="h3">{h}</h3><p class="body">{p}</p><ul class="ticks">{lis}</ul><div class="fit"><span class="label">Fit for</span><p class="small">{fit}</p></div></article>'
    caps = "".join(f'<div class="rv"><span class="n">{i + 1:02d}</span><h3 class="h3">{h}</h3><p class="small">{p}</p></div>' for i, (h, p) in enumerate(s["caps"]))
    pipe_ic = ["search", "layers", "code", "check", "shield", "rocket"]
    nodes = [("doc", "Your data", "Documents, apps and APIs"), ("layers", "Retrieval", "Permission-aware context"), ("agent", "Agent core", "Plans, reasons, calls tools"), ("shield", "Guardrails", "Policy, PII and evaluation"), ("check", "Human review", "Approve or correct"), ("rocket", "Action", "Systems of record")]
    chain = "".join(f'<li class="{"core" if i == 2 else ""}">{ic(k, 24)}<b>{t}</b><span class="small">{d}</span></li>' for i, (k, t, d) in enumerate(nodes))
    bars = [[20, 30, 42, 55, 68, 82, 100], [18, 28, 40, 52, 66, 80, 96], [14, 22, 34, 48, 62, 78, 92]]
    facts = "".join(fact(l, f"{v}{' ' if u.isalpha() else ''}{u}", u, "Measured on live client programmes.", bars[k % 3]) for k, (v, u, l) in enumerate(s["stats"]))
    story = case_panel(0, "Manufacturing · Global", "Lift-truck manufacturer turns 453,958 support tickets into self-service answers.", "A grounded AI assistant answers dealer questions in 30–60 seconds, with a source reference on every answer.", "30–60s", "to a cited answer, down from 1–2 days", "../case-studies/lift-truck-self-service.html", "Read the story")
    return head(f"{s['name']} — {tag} | Evoke AI Orbit · V6", hook, r) + f"""<body>
{header(r)}
<main id="main">
  <section class="p-hero" id="top" aria-labelledby="ph-title">
    <canvas class="neural" data-mode="calm" aria-hidden="true"></canvas>
    {GRID}
    <div class="wrap">
      <div class="copy" data-safe>
        <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s['name']}</span></nav>
        <p class="tagline label accent"><span class="dot" aria-hidden="true"></span>Service {s['idx']} · {tag}</p>
        <h1 id="ph-title" class="h1">{h1}</h1>
        <p class="lead strong">{hook}</p>
        <p class="body">{desc}</p>
        <div class="actions">{cta("Get started", "#contact")}{cta("See the approach", "#approach", "glass")}</div>
      </div>
      <aside class="spec-sheet" aria-label="At a glance" data-safe><p class="label">At a glance</p><dl>{meta}</dl>{cta("Talk to a specialist", "#contact")}</aside>
    </div>
  </section>

  <section class="sec" id="approach" aria-labelledby="ap-title">
    <div class="wrap">{shead("001.", "Approach", "ap-title", 'Two paths. <span class="em">One engine.</span>', "The same agent pipeline powers both — tuned for the problem you’re solving.")}<div class="paths">{paths}</div></div>
  </section>

  <section class="sec alt" id="capabilities" aria-labelledby="cap-title">
    <div class="wrap">{shead("002.", "Capabilities", "cap-title", 'What’s inside <span class="em">this orbit.</span>')}<div class="caplist">{caps}</div></div>
  </section>

  <section class="sec" id="architecture" aria-labelledby="ar-title">
    <div class="wrap">{shead("003.", "Reference architecture", "ar-title", 'Governed <span class="em">by design</span>, not bolted on.', "Every agent follows the same accountable path from your data to your systems of record.")}
      <div class="chain-wrap"><span class="sig" aria-hidden="true"></span><ol class="chain" aria-label="Agent architecture, in order">{chain}</ol></div></div>
  </section>

  <section class="sec alt" id="pipeline" aria-labelledby="pp-title">
    <div class="wrap">{shead("004.", "The agentic pipeline", "pp-title", 'From first-line analysis to <span class="em">production pull request.</span>', "Specialist agents hand off cleanly between stages, with built-in self-healing at every step.")}
      {stairs([(pipe_ic[i % 6], h, p) for i, (h, p) in enumerate(PIPELINE)])}</div>
  </section>

  <section class="sec" id="results" aria-labelledby="mt-title">
    <div class="wrap">{shead("005.", "Results", "mt-title", 'What clients <span class="em">measure.</span>')}<div class="plate"><div class="mesh" aria-hidden="true"></div>{facts}</div></div>
  </section>

  <section class="sec alt" id="story" aria-labelledby="story-title">
    <div class="wrap">{shead("006.", "Client story", "story-title", 'Insights behind <span class="em">the success.</span>')}<div class="stack">{story}</div></div>
  </section>

{faq()}
{horizon()}
{contact()}
  <nav class="sec" style="padding-top:0" aria-label="More services"><div class="wrap"><div class="next2"><a href="{prev['slug']}.html"><span class="label">← Previous service</span><b class="h3">{prev['name']}</b></a><a href="{nxt['slug']}.html"><span class="label">Next service →</span><b class="h3">{nxt['name']}</b></a></div></div></nav>
</main>
{footer(r)}"""


# ---------------------------------------------------------------- CASE STUDY
def case_study():
    r = "../"
    src = v5.case_study()
    art = src[src.index('<article class="prose">'):src.index("</article>") + len("</article>")]
    toc = src[src.index('<nav class="toc"'):src.index("</nav>", src.index('<nav class="toc"')) + len("</nav>")]
    meta = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in [("Industry", "Manufacturing — industrial lift trucks"), ("Region", "Global"), ("Technology", "Agent Skills · Multi-agent orchestration · React 18"), ("Service line", '<a class="link accent" href="../services/enterprise-agents.html">Enterprise Agent Solutions</a>')])
    return head("Lift-truck manufacturer self-service AI — Evoke AI Orbit case study · V6", "How a global lift-truck manufacturer turned 453,958 support tickets into self-service answers for its dealer network.", r) + f"""<body>
{header(r)}
<main id="main">
  <section class="p-hero" id="top" aria-labelledby="ph-title">
    <canvas class="neural" data-mode="calm" aria-hidden="true"></canvas>
    {GRID}
    <div class="wrap">
      <div class="copy" data-safe>
        <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#cases">Case studies</a><span aria-hidden="true">/</span><span aria-current="page">Lift-truck manufacturer</span></nav>
        <p class="tagline label accent"><span class="dot" aria-hidden="true"></span>Case study · Manufacturing · 5 min read</p>
        <h1 id="ph-title" class="h1">Lift-truck manufacturer turns <span class="em">453,958 support tickets</span> into self-service answers.</h1>
        <p class="lead">The client received about 6,000 support tickets a month from dealers and service vendors who could not resolve issues on their own.</p>
      </div>
      <aside class="spec-sheet" aria-label="Project facts" data-safe><p class="label">Project facts</p><dl>{meta}</dl></aside>
    </div>
  </section>

  <section class="sec" id="story">
    <div class="wrap cs-grid">
      {toc}
      {art}
    </div>
  </section>

{horizon("Ready to steer your <span class=\"em\">next release?</span>", "We’ll show you exactly how AI Orbit solves it — with a scoped proposal, a realistic timeline, and references from clients in your sector.")}
{contact()}
</main>
{footer(r)}"""


if __name__ == "__main__":
    out = ROOT / "v6"
    (out / "services").mkdir(parents=True, exist_ok=True)
    (out / "case-studies").mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(home(), encoding="utf-8")
    print("wrote v6/index.html")
    n = len(SERVICES)
    for i, s in enumerate(SERVICES):
        (out / "services" / f"{s['slug']}.html").write_text(service(s, SERVICES[(i - 1) % n], SERVICES[(i + 1) % n]), encoding="utf-8")
        print("wrote", f"v6/services/{s['slug']}.html")
    (out / "case-studies" / "lift-truck-self-service.html").write_text(case_study(), encoding="utf-8")
    print("wrote v6/case-studies/lift-truck-self-service.html")
