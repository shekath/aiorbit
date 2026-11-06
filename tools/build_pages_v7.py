#!/usr/bin/env python3
"""Generate Version 7 "Neural Ember" (v7/) from Version 4.

V7 keeps V4's monolith layout, copy and motion layer, and changes:
- the home hero: a full-width WebGL neural network (v7/assets/js/neural7.js)
  with the copy in front, plus a quick-link strip to the four services;
- sub-page heroes and CTA bands: the calm neural network instead of shards;
- the brand gradient: ember #FF5B42 -> #EB7F31 (v7/assets/css/v7.css);
- photos on the service cards and sector thumbnails on the industry rows;
- extra micro-interactions (v7/assets/js/micro7.js).

Run from the repo root:  python3 tools/build_pages_v7.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import build_pages_v3 as v3  # noqa: E402
import build_pages_v4 as v4  # noqa: E402

V4_DEFS = 'stop-color="#A485FF"/><stop offset=".5" stop-color="#6C82FF"/><stop offset="1" stop-color="#3FDCF2"/>'
V7_DEFS = 'stop-color="#FF5B42"/><stop offset=".5" stop-color="#F46D3A"/><stop offset="1" stop-color="#EB7F31"/>'
ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CALM = '<div class="nn7" data-neural7="calm" aria-hidden="true"></div>'

HERO = f'''  <!-- ================= HERO: neural network ================= -->
  <section class="h7 band" aria-labelledby="hero-title" data-cursor="Hold">
    <div class="nn7" data-neural7="hero" aria-hidden="true"></div>
    <div class="veil" aria-hidden="true"></div>
    <div class="hud lbl" aria-hidden="true"><span>Layers <em data-nn-layers>8</em></span><span>Neurons <em data-nn-neurons>130</em></span><span>Charge <em data-nn-charge>0%</em></span></div>
    <div class="stage container">
      <div class="copy" data-safe>
        <div class="kicker"><span class="tag"><b>New</b>Introducing Evoke AI Orbit</span><span class="lbl">Build · Modernize · Govern</span></div>
        <h1 id="hero-title"><span class="ln">AI that powers</span> <span class="ln"><span class="grad">your trajectory.</span></span></h1>
        <p class="lead">From intelligent solutions to governed deployments, one orbit connects every capability your enterprise needs to move from AI ambition to a measurable impact.</p>
        <div class="ctas">
          <a class="btn btn--solid magnet" href="#contact"><span data-roll-text="Launch your AI journey"></span><span class="ic">{ARROW}</span></a>
          <a class="btn btn--ghost magnet" href="#services"><span data-roll-text="Explore services"></span></a>
        </div>
        <p class="hint lbl"><span class="dot" aria-hidden="true"></span>Hold to charge the network · release to fire a forward pass <span class="meter" aria-hidden="true"><i></i></span></p>
      </div>
    </div>
    <nav class="strip container" aria-label="Services">
      <a href="services/enterprise-agents.html"><span class="lbl">01 · Build</span><span class="t"><span>Enterprise Agent Solutions</span><span aria-hidden="true">↗</span></span><p>Agents that reason, built for production.</p></a>
      <a href="services/ai-first-engineering.html"><span class="lbl">02 · Modernize</span><span class="t"><span>AI-First Software Engineering</span><span aria-hidden="true">↗</span></span><p>Code at the speed of thought.</p></a>
      <a href="services/ai-governance.html"><span class="lbl">03 · Govern</span><span class="t"><span>AI Governance</span><span aria-hidden="true">↗</span></span><p>Move fast. Sleep well.</p></a>
      <a href="services/ai-advisory.html"><span class="lbl">04 · Plan</span><span class="t"><span>AI Advisory</span><span aria-hidden="true">↗</span></span><p>Know before you build.</p></a>
    </nav>
  </section>

'''

# service card photos (one per service line) and industry thumbnails (one per sector)
SVC_IMG = [("svc-agents", "Team reviewing an AI agent build together"), ("svc-engineering", "Engineer coding at a multi-monitor workstation"),
           ("svc-governance", "Close-up of server hardware in a secure data centre"), ("svc-advisory", "Advisors discussing strategy around a table")]
IND_IMG = ["ind-manufacturing", "ind-financial", "ind-energy", "ind-healthcare", "ind-education", "ind-mining"]


def common(html: str, depth: str) -> str:
    """Rewrites shared by the home page and sub-pages. depth = '' (v7/) or '../' (v7/services/)."""
    html = html.replace(V4_DEFS, V7_DEFS).replace('id="v4grad"', 'id="v4grad"')
    html = html.replace('<canvas data-shards="calm" aria-hidden="true"></canvas>', CALM)
    html = html.replace(f'href="{depth}assets/css/main.css"', f'href="{depth}assets/css/v7.css"')
    html = html.replace(f'<script src="{depth}assets/js/fx.js"></script>', f'<script src="{depth}../v4/assets/js/fx.js"></script>\n<script src="{depth}assets/js/micro7.js"></script>')
    html = html.replace(f'<script type="module" src="{depth}assets/js/shards-gl.js"></script>', f'<script type="module" src="{depth}assets/js/neural7.js"></script>')
    html = html.replace('content="#0A0A0B"', 'content="#0A0A0B"')
    return html


def home() -> str:
    html = (ROOT / "v4" / "index.html").read_text(encoding="utf-8")
    a, b = html.index("  <!-- ================= HERO"), html.index("  <!-- ================= STATEMENT")
    html = html[:a] + HERO + html[b:]
    html = common(html, "")
    # services core still uses V4's shard crystal; load it from v4 alongside the neural module
    html = html.replace('<script type="module" src="assets/js/neural7.js"></script>', '<script type="module" src="assets/js/neural7.js"></script>\n<script type="module" src="../v4/assets/js/shards-gl.js"></script>')
    html = html.replace("<title>Evoke AI Orbit — AI That Powers Your Trajectory</title>", "<title>Evoke AI Orbit — AI That Powers Your Trajectory · V7</title>")
    # photo column on each service card
    cards = list(re.finditer(r'<article class="scard">', html))
    for i, m in reversed(list(enumerate(cards))):
        img, alt = SVC_IMG[i]
        html = html[:m.start()] + f'<article class="scard ph7"><div class="ph"><img src="../v3/assets/img/{img}-900.webp" alt="{alt}" width="900" height="600" loading="lazy" /></div>' + html[m.end():]
    # sector thumbnail on each industry row
    rows = list(re.finditer(r'(<li><a href="#contact"><span class="n">0\d</span>)', html))
    for i, m in reversed(list(enumerate(rows))):
        html = html[:m.end()] + f'<span class="th"><img src="../v3/assets/img/{IND_IMG[i]}-900.webp" alt="" width="900" height="675" loading="lazy" /></span>' + html[m.end():]
    return html


def sub(html: str) -> str:
    html = common(v4.to_v4(html), "../")
    return html.replace("| Evoke AI Orbit · V4", "| Evoke AI Orbit · V7")


if __name__ == "__main__":
    out = ROOT / "v7"
    (out / "services").mkdir(parents=True, exist_ok=True)
    (out / "case-studies").mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(home(), encoding="utf-8"); print("wrote v7/index.html")
    n = len(v3.SERVICES)
    for i, s in enumerate(v3.SERVICES):
        (out / "services" / f"{s['slug']}.html").write_text(sub(v3.service(s, v3.SERVICES[(i - 1) % n], v3.SERVICES[(i + 1) % n])), encoding="utf-8")
        print("wrote", f"v7/services/{s['slug']}.html")
    (out / "case-studies" / "lift-truck-self-service.html").write_text(sub(v3.case_study()), encoding="utf-8")
    print("wrote v7/case-studies/lift-truck-self-service.html")
