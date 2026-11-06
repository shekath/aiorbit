#!/usr/bin/env python3
"""Generate Version 6 "Spatial" (v6/): home, four service pages and the case study.

Version 6 keeps 100% of Version 5's text, section structure and heading
hierarchy (it imports the same content from tools/build_pages_v5.py) and
reimagines the spatial layout: floating dock, section rail, HUD modules,
trajectory timelines, instrument bands, ledgers and a reactive WebGL field.
Parity is verified by the text/heading comparison described in v6/README.md.
Run from the repo root:  python3 tools/build_pages_v6.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import build_pages_v5 as v5  # noqa: E402
from build_pages_v5 import (FAQ, HOME_CASES, HOME_INDS, HOME_INSIGHTS, HOME_LINKS, HOME_STEPS, HOME_TICKS, LIVE, OFFICES,  # noqa: E402
                            PIPELINE, SERVICES, SVC_ICON)

v5.P.update({"bolt2": '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'})
ic = v5.ic
A = ic("arrow", 18)
CORNERS = '<span class="corner tl" aria-hidden="true"></span><span class="corner tr" aria-hidden="true"></span><span class="corner bl" aria-hidden="true"></span><span class="corner br" aria-hidden="true"></span>'
DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="v6grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF653F"/><stop offset=".5" stop-color="#C04CC0"/><stop offset="1" stop-color="#4F4FFF"/></linearGradient></defs></svg>'


def btn(label, href, kind="primary", key=None, extra=""):
    k = f'<kbd aria-hidden="true">{key}</kbd>' if key else ""
    ks = f' aria-keyshortcuts="{key}"' if key else ""
    return f'<a class="btn btn--{kind} magnet" href="{href}"{ks}{extra}>{label} {A}{k}</a>'


def head(title, desc, r):
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<meta name="theme-color" content="#1E104E" />
<script>document.documentElement.classList.add("js");</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="{r}assets/css/v6.css" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23FF653F'/%3E%3Cstop offset='1' stop-color='%232F2FE4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='9' fill='url(%23g)'/%3E%3Cellipse cx='16' cy='16' rx='11' ry='5' transform='rotate(-30 16 16)' fill='none' stroke='white' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='3' fill='white'/%3E%3C/svg%3E" />
</head>
"""


def dock(r, home=False, rail=None):
    h = "" if home else f"{r}index.html"
    links = [("Services", f"{h}#services"), ("How it works", f"{h}#how"), ("Case studies", f"{h}#cases"), ("Industries", f"{h}#industries"), ("Insights", f"{h}#insights")]
    nav = "".join(f'<a class="magnet" data-magnet=".2" href="{u}">{t}</a>' for t, u in links)
    rail_html = ""
    if rail:
        rail_html = '<nav class="rail" aria-label="Sections on this page"><ol>' + "".join(f'<li><a href="#{i}" aria-label="{n:02d} {t}"><i aria-hidden="true"></i><b aria-hidden="true">{n:02d}</b><span aria-hidden="true">&nbsp;{t}</span></a></li>' for n, (i, t) in enumerate(rail, 1)) + "</ol></nav>"
    return f"""{DEFS}
<a class="skip" href="#main">Skip to content</a>
<header class="dock">
  <div class="bar">
    <a class="brand" href="{r}index.html" aria-label="AI Orbit by Evoke — home"><span class="mark">{ic("agent", 18)}</span><b>AI Orbit</b><small>by Evoke</small></a>
    <nav class="menu" aria-label="Primary">{nav}</nav>
    <div class="v6-actions">
      {btn("Talk to us", f"{h}#contact", "primary", "C")}
      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">{ic("menu", 20)}</button>
    </div>
  </div>
  <nav class="drawer" id="drawer" aria-label="Mobile">{"".join(f'<a href="{u}">{t}</a>' for t, u in links)}{btn("Talk to us", f"{h}#contact")}</nav>
</header>
{rail_html}
<div class="telemetry" role="group" aria-label="Interface telemetry">
  <span class="ping" aria-hidden="true"></span><span>Field <b data-t-fps>live</b></span><span class="sep" aria-hidden="true"></span>
  <span>Pts <b data-t-pts>—</b></span><span class="sep" aria-hidden="true"></span><span>Depth <b data-t-depth>00%</b></span><span class="sep" aria-hidden="true"></span>
  <span><b data-t-clock>--:--:-- UTC</b></span><span class="sep" aria-hidden="true"></span>
  <button class="switch" type="button" role="switch" aria-checked="true" data-motion aria-keyshortcuts="M">Motion <span class="track" aria-hidden="true"><span class="knob"></span></span></button>
</div>
"""


def footer(r):
    svc = "".join(f'<li><a href="{r}services/{s["slug"]}.html">{s["name"]}</a></li>' for s in SERVICES)
    ind = "".join(f'<li><a href="{r}index.html#industries">{x}</a></li>' for x in ["Manufacturing", "Financial Services", "Energy", "Healthcare", "Higher Education", "Mining"])
    ins = f'<li><a href="{r}case-studies/lift-truck-self-service.html">Case studies</a></li>' + "".join(f'<li><a href="{r}index.html#insights">{x}</a></li>' for x in ["Blog", "Videos", "News &amp; events", "Resource hub"])
    return f"""<footer class="ftr">
  <div class="wrap">
    <div class="cols">
      <div class="about-f"><a class="brand" href="{r}index.html"><span class="mark">{ic("agent", 18)}</span><b>AI Orbit</b></a><p class="small">Build, modernize, govern — all in one orbit. Structure, speed and safety at every stage of your AI journey.</p>
        <div class="keys" aria-label="Keyboard shortcuts"><span><kbd>S</kbd> Services</span><span><kbd>C</kbd> Contact</span><span><kbd>/</kbd> Ask the orbit</span><span><kbd>M</kbd> Motion</span></div></div>
      <div><h2>Services</h2><ul>{svc}</ul></div>
      <div><h2>Industries</h2><ul>{ind}</ul></div>
      <div><h2>Insights</h2><ul>{ins}</ul></div>
    </div>
    <div class="legal"><span>Evoke Technologies Pvt. Ltd. © <span data-year>2026</span> All Rights Reserved.</span><nav aria-label="Legal"><a href="#">Terms of Use</a><a href="#">Privacy Policy</a><a href="#">Cookies Policy</a><a href="#">Disclaimer</a><a href="#">Sitemap</a></nav></div>
  </div>
</footer>
<script src="{r}assets/js/v6.js"></script>
<script type="module" src="{r}assets/js/field-gl.js"></script>
<script src="{r}../assets/js/version-switch.js?v=6"></script>
</body>
</html>
"""


def console():
    steps = [("Parsed 4,812 business rules", "0.8s"), ("Generated validated MSTX modules", "2m 14s"), ("Ran 1,206 regression tests · 0 failures", "41s")]
    lis = "".join(f'<li>{ic("check", 18, "ic")}<span>{t}</span><span class="code">{tm}</span></li>' for t, tm in steps)
    lis += f'<li class="run">{ic("spark", 18, "ic")}<span>Policy check · SOX controls, audit trail</span><span class="code run">running</span></li>'
    guard = "".join(f"<span>{ic('shield', 14)}{x}</span>" for x in ["Governed", "Human-in-the-loop", "Audit trail", "PII redacted"])
    return f"""<figure class="console hud edge rv" aria-label="Example: an AI Orbit agent modernization run">{CORNERS}
        <div class="bar"><span class="mark">{ic("agent", 15)}</span><strong>Orbit Agent · Modernization run</strong><span class="live"><span class="ping" aria-hidden="true"></span>Live</span></div>
        <div class="in">
          <p class="prompt">{ic("spark", 18)}<span>Modernize our COBOL tax engine and keep it audit-ready.</span></p>
          <ol class="steps" aria-label="Run steps">{lis}</ol>
          <div class="meter"><div class="row"><span class="label">Run progress</span><span class="label" style="color:var(--fg)">78%</span></div><div class="track-bar" role="progressbar" aria-label="Run progress" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"><i></i></div></div>
          <div class="guard">{guard}</div>
          <form class="ask"><label class="sr-only" for="ask-in">Ask the orbit a question (demo)</label><input id="ask-in" type="text" placeholder="Ask the orbit about your stack…" autocomplete="off" aria-keyshortcuts="/" /><kbd aria-hidden="true">/</kbd><button type="submit" aria-label="Run the demo question">{ic("send", 16)}</button></form>
        </div>
      </figure>"""


def portal(h="All in one <span class=\"grad\">orbit.</span>", p="Whether you’re building, modernizing or governing, AI Orbit brings structure, speed and safety to every stage of your AI journey."):
    return f"""<section class="sec" id="launch" aria-labelledby="cta-title">
  <div class="wrap">
    <div class="portal">
      <canvas class="field" data-density="calm" aria-hidden="true"></canvas>
      <div class="substrate" aria-hidden="true"></div>
      <p class="kicker accent">Build · Modernize · Govern</p><h2 id="cta-title" class="h1">{h}</h2><p class="lead">{p}</p>
      <div class="actions">{btn("Launch your AI journey", "#contact", "primary", "C")}{btn("Book a readiness call", "#contact", "ghost")}</div>
    </div>
  </div>
</section>
"""


def faq():
    qa = ""
    for i, (q, a) in enumerate(FAQ):
        o = "true" if i == 0 else "false"
        qa += f'<div><h3><button type="button" aria-expanded="{o}" aria-controls="qa-{i}" id="qb-{i}">{q}<span class="pm" aria-hidden="true"></span></button></h3><div class="ans" id="qa-{i}" role="region" aria-labelledby="qb-{i}"><div><p>{a}</p></div></div></div>'
    return f"""<section class="sec deep" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq">
    <div class="t"><p class="kicker accent">FAQ</p><h2 id="faq-title" class="h2">Questions, answered.</h2><p class="body">Straight answers on timelines, governance and ownership. Still curious? Talk to an AI expert.</p><a class="link accent" href="#contact">Ask us anything {A}</a></div>
    <div class="qa">{qa}</div>
  </div>
</section>
"""


def contact():
    offs = "".join(f'<div><span class="ping" aria-hidden="true"></span><b>{c}</b><time data-tz="{tz}"></time>' + (f'<a href="tel:{p.replace(" ", "").replace("-", "")}">{p}</a>' if p else "") + "</div>" for c, tz, p in OFFICES)
    opts = "".join(f"<option>{s['name']}</option>" for s in SERVICES) + "<option>Not sure yet</option>"
    return f"""<section class="sec" id="contact" aria-labelledby="ct-title">
  <div class="wrap contact">
    <div>
      <div class="t"><p class="kicker accent">Get in touch</p><h2 id="ct-title" class="h2">Let’s build what’s next.</h2><p class="body">Tell us what you’re solving. An AI specialist replies within one business day.</p></div>
      <div class="clocks">{offs}</div>
      <div class="mail-row"><a class="mail" href="mailto:mktg@evoketechnologies.com">{ic("mail", 20)}mktg@evoketechnologies.com</a><button class="copy-btn" type="button" data-copy="mktg@evoketechnologies.com" aria-label="Copy email address">{ic("doc", 14)}<span class="lbl">Copy</span></button><span class="sr-only" id="copy-status" aria-live="polite"></span></div>
    </div>
    <form class="form glass hud edge" novalidate aria-describedby="f-note">{CORNERS}
      <div class="field"><label for="f-name">Full name <i aria-hidden="true">*</i></label><input id="f-name" name="name" autocomplete="name" required aria-describedby="f-name-err" /><span class="err" id="f-name-err" aria-live="polite"></span></div>
      <div class="field"><label for="f-email">Work email <i aria-hidden="true">*</i></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err" /><span class="err" id="f-email-err" aria-live="polite"></span></div>
      <div class="field"><label for="f-co">Company</label><input id="f-co" name="company" autocomplete="organization" /></div>
      <div class="field"><label for="f-svc">Interested in</label><select id="f-svc" name="service">{opts}</select></div>
      <div class="field full"><label for="f-msg">What are you solving?</label><textarea id="f-msg" name="message"></textarea></div>
      <div class="foot"><p class="small" id="f-note">Fields marked * are required.</p><button class="btn btn--primary magnet" type="submit">Send request {A}</button></div>
      <p class="ok" tabindex="-1" role="status">Thank you — your request is in. We’ll reply within one business day.</p>
    </form>
  </div>
</section>
"""


def inst(label, val, g, desc, bars, v):
    b = "".join(f'<i style="--h:{h}%;--o:{.35 + .65 * k / len(bars):.2f}"></i>' for k, h in enumerate(bars))
    shown = val.replace(g, f'<em class="grad">{g}</em>', 1) if g else val
    cnt = ' data-count' if val[:1].isdigit() and "–" not in val else ""
    return f"""<div class="inst" style="--v:{v}"><div class="gauge" aria-hidden="true"><span class="ticks-ring"></span><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="50"/><circle class="val" cx="60" cy="60" r="50"/></svg></div>
      <p class="label">{label}</p><p class="value"{cnt}>{shown}</p><p class="small">{desc}</p><div class="spark" aria-hidden="true">{b}</div></div>"""


def trajectory(items, icons=None):
    n = len(items)
    pts = []
    for i in range(n):
        x = (i + .5) / n * 1000
        y = 26 if i % 2 == 0 else 90
        pts.append((x, y))
    d = f"M{pts[0][0] - 1000 / n / 2:.0f},{pts[0][1]}" + "".join(f" C{(pts[i - 1][0] + pts[i][0]) / 2:.0f},{pts[i - 1][1]} {(pts[i - 1][0] + pts[i][0]) / 2:.0f},{pts[i][1]} {pts[i][0]:.0f},{pts[i][1]}" for i in range(1, n))
    svg = f'<svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path class="base" d="{d}"/><path class="lit" d="{d}"/></svg>'
    lis = ""
    for i, it in enumerate(items):
        k, t, dsc = it
        lis += f'<li><span class="node" aria-hidden="true">{i + 1:02d}</span>{ic(k, 22)}<h3 class="h3">{t}</h3><p class="small">{dsc}</p></li>'
    return f'<ol class="trajectory" style="--n:{n}">{svg}{lis}</ol>'


def sec_head(kicker, title_id, title, body=None, aside=None, solo=False):
    b = f'<p class="body">{body}</p>' if body else ""
    cls = "sec-head solo" if solo and not aside else "sec-head"
    a = f'<div class="aside">{aside}</div>' if aside else ""
    return f'<div class="{cls}"><div class="t"><p class="kicker accent">{kicker}</p><h2 id="{title_id}" class="h2">{title}</h2>{b}</div>{a}</div>'


# ---------------------------------------------------------------- HOME
def home():
    r = ""
    tabs, panels = "", ""
    for i, s in enumerate(SERVICES):
        tag, hook, desc, _, _ = LIVE[s["slug"]]
        ticks = "".join(f"<li>{x}</li>" for x in HOME_TICKS[s["slug"]])
        sel = "true" if i == 0 else "false"
        tabs += f'<button type="button" role="tab" id="tab-{s["slug"]}" aria-controls="panel-{s["slug"]}" aria-selected="{sel}" tabindex="{0 if i == 0 else -1}"><span class="n">{s["idx"]}</span><b>{s["name"]}</b><kbd aria-hidden="true">{i + 1}</kbd></button>'
        panels += f"""<article class="panel glass hud edge" role="tabpanel" id="panel-{s['slug']}" aria-labelledby="tab-{s['slug']}"{'' if i == 0 else ' hidden'}>{CORNERS}
          <div class="top"><span class="glyph">{ic(SVC_ICON[s['slug']], 24)}</span><span class="label">{s['idx']}</span></div>
          <h3 class="h3">{s['name']}</h3><p class="tagline">{tag} — {hook}</p><p class="body">{desc}</p><ul class="ticks">{ticks}</ul>
          <div class="foot"><a class="link" href="services/{s['slug']}.html">{HOME_LINKS[s['slug']]} {A}<span class="sr-only"> — {s['name']}</span></a><span class="chip energy">Service {s['idx']} / 04</span></div></article>"""
    led = ""
    for ind, t, b, m, ml, u in HOME_CASES:
        ext = u.startswith("http")
        attrs = ' target="_blank" rel="noopener"' if ext else ""
        sr = '<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>' if ext else ""
        led += f'<a class="rv" href="{u}"{attrs}><span class="tagc"><span class="chip energy">{ind}</span></span><span class="what"><h3 class="h3">{t}</h3><span class="small">{b}</span><span class="link">Read case study {A}{sr}</span></span><span class="out"><b class="grad">{m}</b><span>{ml}</span></span><span class="arrow-btn" aria-hidden="true">{A}</span></a>'
    mat = "".join(f'<article class="rv"><span class="glyph">{ic(k, 22)}</span><h3 class="h3">{t}</h3><p class="small">{d}</p><div class="pills">' + "".join(f'<span class="chip">{x}</span>' for x in tags) + "</div></article>" for k, t, d, tags in HOME_INDS)
    feed = "".join(f'<a href="https://www.evoketechnologies.com/ai-orbit/" target="_blank" rel="noopener"><span class="type">{ic("doc", 18)}<span class="label">{ty}</span></span><div><h3 class="h3">{t}</h3><p class="small">{d}</p></div><span class="label meta">Read</span>{ic("arrow", 20)}<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span></a>' for ty, t, d in HOME_INSIGHTS)
    rail = [("top", "Overview"), ("about", "About"), ("services", "Services"), ("how", "How it works"), ("facts", "Key facts"), ("cases", "Case studies"), ("industries", "Industries"), ("insights", "Knowledge hub"), ("faq", "FAQ"), ("contact", "Contact")]
    return head("AI Orbit — Enterprise AI with structure, speed and security | Evoke · V6", "Evoke AI Orbit: build, modernize and govern enterprise AI — custom agents, AI-first engineering, governance and advisory.", r) + f"""<body>
{dock(r, True, rail)}
<main id="main">
  <section class="hero" id="top" aria-labelledby="hero-title">
    <canvas class="field" aria-hidden="true"></canvas>
    <div class="substrate" aria-hidden="true"></div>
    <div class="wrap">
      <div class="hero-grid">
        <div class="copy" data-safe>
          <p class="tele"><span class="ping" aria-hidden="true"></span>New · Evoke AI Orbit</p>
          <h1 id="hero-title" class="mega">AI that powers <span class="grad">your trajectory.</span></h1>
          <p class="lead">From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to measurable impact.</p>
          <div class="actions">{btn("Launch your AI journey", "#contact", "primary", "C")}{btn("Explore services", "#services", "ghost", "S")}</div>
          <p class="hint" aria-hidden="true">Move to bend the field · click to send a pulse</p>
        </div>
        {console()}
      </div>
      <div class="readout"><div><b data-count>65%</b><span>faster delivery with agentic engineering</span></div><div><b data-count>150+</b><span>reusable, tested skill packs</span></div><div><b data-count>10+</b><span>specialized agents in production</span></div></div>
    </div>
  </section>

  <section class="ticker" aria-label="Platforms we build on">
    <div class="wrap"><p class="label">Built on platforms you trust</p><ul><li>Microsoft</li><li>AWS</li><li>Salesforce</li><li>ServiceNow</li><li>Oracle</li><li>UiPath</li></ul></div>
  </section>

  <section class="sec" id="about" aria-labelledby="ab-title">
    <div class="wrap manifesto">
      <div class="t"><p class="kicker accent">About AI Orbit</p><h2 id="ab-title" class="h2">From strategy to execution, one accountable partner.</h2></div>
      <div>
        <p class="lead strong">We help enterprises build custom agents, scale AI engineering, and enforce governance. This end-to-end expertise turns AI into a measurable win for your business.</p>
        <ol class="axis">
          <li class="rv"><span class="glyph">{ic("agent", 22)}</span><div><h3 class="h3">Build</h3><p class="small">Custom agents and AI apps that reason, not just automate.</p></div></li>
          <li class="rv"><span class="glyph">{ic("layers", 22)}</span><div><h3 class="h3">Modernize</h3><p class="small">Agentic engineering that moves legacy estates forward safely.</p></div></li>
          <li class="rv"><span class="glyph">{ic("shield", 22)}</span><div><h3 class="h3">Govern</h3><p class="small">Guardrails, evaluation and audit evidence by design.</p></div></li>
        </ol>
      </div>
    </div>
  </section>

  <section class="sec deep" id="services" aria-labelledby="sv-title">
    <div class="wrap">
      {sec_head("Our services", "sv-title", 'Enterprise AI with <span class="grad">structure, speed, and security.</span>', aside=f'<p class="body">Four disciplines, one orbit. Start anywhere and connect the rest as your AI programme grows.</p>{btn("See how we deliver", "#how", "ghost")}')}
      <div class="orbit" data-tabs>
        <div class="tabs" role="tablist" aria-label="Services" aria-orientation="vertical"><span class="ind" aria-hidden="true"></span>{tabs}</div>
        <div class="panels">{panels}</div>
      </div>
    </div>
  </section>

  <section class="sec" id="how" aria-labelledby="hw-title">
    <div class="wrap">
      {sec_head("How it works", "hw-title", 'From first question to <span class="grad">governed production.</span>', "A delivery rhythm built for regulated enterprises: every stage ends with evidence you can show an auditor.", solo=True)}
      {trajectory(HOME_STEPS)}
    </div>
  </section>

  <section class="sec deep" id="facts" aria-labelledby="kf-title">
    <div class="wrap">
      {sec_head("Key facts", "kf-title", 'Driving <span class="grad">measurable</span> outcomes.', "Numbers from live client programmes, not lab benchmarks.", solo=True)}
      <div class="instruments">
        {inst("Delivery time saved", "65%", "%", "Average time saved with agentic engineering across delivery teams.", [24, 33, 42, 55, 67, 82, 100], .65)}
        {inst("Skill packs", "150+", "+", "Reusable, tested agent skills that standardise behaviour across projects.", [18, 30, 45, 58, 70, 85, 97], .82)}
        {inst("Agents in production", "10+", "+", "Specialized agents running in production today, governed end to end.", [15, 21, 33, 45, 64, 76, 91], .5)}
      </div>
    </div>
  </section>

  <section class="sec" id="cases" aria-labelledby="cs-title">
    <div class="wrap">
      {sec_head("Case studies", "cs-title", 'Stories of <span class="grad">transformation.</span>', aside=btn('All case studies<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>', "https://www.evoketechnologies.com/insights/case-studies/", "ghost", extra=' target="_blank" rel="noopener"'))}
      <div class="ledger">{led}</div>
    </div>
  </section>

  <section class="sec deep" id="industries" aria-labelledby="in-title">
    <div class="wrap">
      {sec_head("Industries", "in-title", 'AI that speaks <span class="grad">your industry.</span>', "Industry-specific AI that understands your regulations, your workflows and your competitive pressures.", solo=True)}
      <div class="matrix">{mat}</div>
    </div>
  </section>

  <section class="sec" id="insights" aria-labelledby="kn-title">
    <div class="wrap">
      {sec_head("Knowledge hub", "kn-title", 'From brainstorming to execution — <span class="grad">all in one place.</span>', aside=btn('Browse all insights<span class="sr-only"> (opens evoketechnologies.com in a new tab)</span>', "https://www.evoketechnologies.com/ai-orbit/", "ghost", extra=' target="_blank" rel="noopener"'))}
      <div class="feed">{feed}</div>
    </div>
  </section>

{faq()}
{portal()}
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
        panels += f'<article class="rv"><p class="label accent">{eb}</p><h3 class="h3">{h}</h3><p class="body">{p}</p><ul class="ticks">{lis}</ul><div class="fit"><span class="label">Fit for</span><p class="small">{fit}</p></div></article>'
    caps = "".join(f'<div class="rv"><span class="n">{i + 1:02d}</span><h3 class="h3">{h}</h3><p class="small">{p}</p></div>' for i, (h, p) in enumerate(s["caps"]))
    pipe_ic = ["search", "layers", "code", "check", "shield", "rocket"]
    pipe = trajectory([(pipe_ic[i % 6], h, p) for i, (h, p) in enumerate(PIPELINE)])
    nodes = [("doc", "Your data", "Documents, apps and APIs"), ("layers", "Retrieval", "Permission-aware context"), ("agent", "Agent core", "Plans, reasons, calls tools"), ("shield", "Guardrails", "Policy, PII and evaluation"), ("check", "Human review", "Approve or correct"), ("rocket", "Action", "Systems of record")]
    flow = "".join(f'<li class="{"core glass" if i == 2 else "glass edge"}">{ic(k, 22)}<b>{t}</b><span class="small">{d}</span></li>' for i, (k, t, d) in enumerate(nodes))
    bars = [[20, 30, 42, 55, 68, 82, 100], [18, 28, 40, 52, 66, 80, 96], [14, 22, 34, 48, 62, 78, 92]]
    mets = "".join(inst(l, f"{v}{' ' if u.isalpha() else ''}{u}", u, "Measured on live client programmes.", bars[k % 3], [.72, .6, .5][k % 3]) for k, (v, u, l) in enumerate(s["stats"]))
    rail = [("top", "Overview"), ("approach", "Approach"), ("capabilities", "Capabilities"), ("architecture", "Architecture"), ("pipeline", "Pipeline"), ("results", "Results"), ("story", "Client story"), ("faq", "FAQ"), ("contact", "Contact")]
    return head(f"{s['name']} — {tag} | Evoke AI Orbit · V6", hook, r) + f"""<body>
{dock(r, False, rail)}
<main id="main">
  <section class="p-hero" id="top" aria-labelledby="ph-title">
    <canvas class="field" data-density="calm" aria-hidden="true"></canvas>
    <div class="substrate" aria-hidden="true"></div>
    <div class="wrap">
      <div class="hero-grid">
        <div class="copy" data-safe style="display:grid;gap:22px;justify-items:start">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s['name']}</span></nav>
          <p class="tele"><span class="ping" aria-hidden="true"></span>Service {s['idx']} · {tag}</p>
          <h1 id="ph-title" class="h1">{h1}</h1>
          <p class="lead strong">{hook}</p>
          <p class="body">{desc}</p>
          <div class="actions">{btn("Get started", "#contact", "primary", "C")}{btn("See the approach", "#approach", "ghost", "S")}</div>
        </div>
        <aside class="glance glass hud edge" aria-label="At a glance">{CORNERS}<p class="label">At a glance</p><dl>{meta}</dl>{btn("Talk to a specialist", "#contact")}</aside>
      </div>
    </div>
  </section>

  <section class="sec deep" id="approach" aria-labelledby="ap-title">
    <div class="wrap">
      {sec_head("Approach", "ap-title", 'Two paths. <span class="grad">One engine.</span>', "The same agent pipeline powers both — tuned for the problem you’re solving.", solo=True)}
      <div class="split2">{panels}</div>
    </div>
  </section>

  <section class="sec" id="capabilities" aria-labelledby="cap-title">
    <div class="wrap">
      {sec_head("Capabilities", "cap-title", 'What’s inside <span class="grad">this orbit.</span>', solo=True)}
      <div class="spec">{caps}</div>
    </div>
  </section>

  <section class="sec deep" id="architecture" aria-labelledby="ar-title">
    <div class="wrap">
      {sec_head("Reference architecture", "ar-title", 'Governed <span class="grad">by design</span>, not bolted on.', "Every agent follows the same accountable path from your data to your systems of record.", solo=True)}
      <ol class="flow" aria-label="Agent architecture, in order">{flow}</ol>
    </div>
  </section>

  <section class="sec" id="pipeline" aria-labelledby="pp-title">
    <div class="wrap">
      {sec_head("The agentic pipeline", "pp-title", 'From first-line analysis to <span class="grad">production pull request.</span>', "Specialist agents hand off cleanly between stages, with built-in self-healing at every step.", solo=True)}
      {pipe}
    </div>
  </section>

  <section class="sec deep" id="results" aria-labelledby="mt-title">
    <div class="wrap">
      {sec_head("Results", "mt-title", 'What clients <span class="grad">measure.</span>', solo=True)}
      <div class="instruments">{mets}</div>
    </div>
  </section>

  <section class="sec" id="story" aria-labelledby="story-title">
    <div class="wrap">
      {sec_head("Client story", "story-title", 'Insights behind <span class="grad">the success.</span>', solo=True)}
      <div class="ledger"><a class="rv" href="../case-studies/lift-truck-self-service.html"><span class="tagc"><span class="chip energy">Manufacturing · Global</span></span><span class="what"><h3 class="h3">Lift-truck manufacturer turns 453,958 support tickets into self-service answers.</h3><span class="body">A grounded AI assistant answers dealer questions in 30–60 seconds, with a source reference on every answer.</span><span class="link">Read the story {A}</span></span><span class="out"><b class="grad">30–60s</b><span>to a cited answer, down from 1–2 days</span></span><span class="arrow-btn" aria-hidden="true">{A}</span></a></div>
    </div>
  </section>

{faq()}
{portal()}
{contact()}
  <nav class="sec" style="padding-top:0" aria-label="More services"><div class="wrap"><div class="next2"><a href="{prev['slug']}.html"><span class="label">← Previous service</span><b class="h3">{prev['name']}</b></a><a href="{nxt['slug']}.html"><span class="label">Next service →</span><b class="h3">{nxt['name']}</b></a></div></div></nav>
</main>
{footer(r)}"""


# ---------------------------------------------------------------- CASE STUDY
def case_study():
    r = "../"
    src = v5.case_study()
    # Reuse Version 5's article body verbatim (text parity), re-skinned by V6 CSS.
    art = src[src.index('<article class="prose">'):src.index("</article>") + len("</article>")]
    toc = src[src.index('<nav class="toc"'):src.index("</nav>", src.index('<nav class="toc"')) + len("</nav>")]
    meta = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in [("Industry", "Manufacturing — industrial lift trucks"), ("Region", "Global"), ("Technology", "Agent Skills · Multi-agent orchestration · React 18"), ("Service line", '<a class="link accent" href="../services/enterprise-agents.html">Enterprise Agent Solutions</a>')])
    rail = [("top", "Overview"), ("story", "Story"), ("launch", "Next step"), ("contact", "Contact")]
    return head("Lift-truck manufacturer self-service AI — Evoke AI Orbit case study · V6", "How a global lift-truck manufacturer turned 453,958 support tickets into self-service answers for its dealer network.", r) + f"""<body>
{dock(r, False, rail)}
<main id="main">
  <section class="p-hero" id="top" aria-labelledby="ph-title">
    <canvas class="field" data-density="calm" aria-hidden="true"></canvas>
    <div class="substrate" aria-hidden="true"></div>
    <div class="wrap">
      <div class="hero-grid">
        <div class="copy" data-safe style="display:grid;gap:22px;justify-items:start">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#cases">Case studies</a><span aria-hidden="true">/</span><span aria-current="page">Lift-truck manufacturer</span></nav>
          <p class="tele"><span class="ping" aria-hidden="true"></span>Case study · Manufacturing · 5 min read</p>
          <h1 id="ph-title" class="h1">Lift-truck manufacturer turns <span class="grad">453,958 support tickets</span> into self-service answers.</h1>
          <p class="lead">The client received about 6,000 support tickets a month from dealers and service vendors who could not resolve issues on their own.</p>
        </div>
        <aside class="glance glass hud edge" aria-label="Project facts">{CORNERS}<p class="label">Project facts</p><dl>{meta}</dl></aside>
      </div>
    </div>
  </section>

  <section class="sec" id="story">
    <div class="wrap cs-grid">
      {toc}
      {art}
    </div>
  </section>

{portal("Ready to steer your <span class=\"grad\">next release?</span>", "We’ll show you exactly how AI Orbit solves it — with a scoped proposal, a realistic timeline, and references from clients in your sector.")}
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
