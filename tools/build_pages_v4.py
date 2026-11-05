#!/usr/bin/env python3
"""Generate Version 4 (v4/) service pages and the case study.

V4 sub-pages share V3's page structure and copy (tools/build_pages_v3.py) and
re-skin it with the V4 stylesheet, V4 shard WebGL and the V4 motion layer.
Run from the repo root:  python3 tools/build_pages_v4.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import build_pages_v3 as v3  # noqa: E402

SVG_DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="v4grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A485FF"/><stop offset=".5" stop-color="#6C82FF"/><stop offset="1" stop-color="#3FDCF2"/></linearGradient></defs></svg>'


def to_v4(html: str) -> str:
    rep = [
        # sub-page hero + CTA canvases → V4 shards (calm), copy marked as safe zone
        ('<canvas data-neural="aurora" aria-hidden="true"></canvas>', '<canvas data-shards="calm" aria-hidden="true"></canvas>'),
        ('<div class="copy">', '<div class="copy" data-safe>'),
        ('<div class="in"><p class="mono eyebrow">', '<div class="in" data-safe><p class="mono eyebrow">'),
        # assets: images live in v3, chrome script from v3, V4 motion + WebGL
        ('../assets/img/', '../../v3/assets/img/'),
        ('<script src="../assets/js/app.js"></script>', '<script src="../../v3/assets/js/app.js"></script>\n<script src="../assets/js/fx.js"></script>'),
        ('<script type="module" src="../assets/js/neural-gl.js"></script>', '<script type="module" src="../assets/js/shards-gl.js"></script>'),
        ('family=Sora:wght@300;400', 'family=Sora:wght@200;300;400'),
        ('| Evoke AI Orbit', '| Evoke AI Orbit · V4'),
    ]
    for a, b in rep:
        html = html.replace(a, b)
    html = html.replace('data-page="', 'data-img-root="../../v3/assets/img/" data-page="', 1)
    html = html.replace('<main id="main">', SVG_DEFS + '\n<main id="main">', 1)
    return html


if __name__ == "__main__":
    out = ROOT / "v4" / "services"
    out.mkdir(parents=True, exist_ok=True)
    n = len(v3.SERVICES)
    for i, s in enumerate(v3.SERVICES):
        (out / f"{s['slug']}.html").write_text(to_v4(v3.service(s, v3.SERVICES[(i - 1) % n], v3.SERVICES[(i + 1) % n])), encoding="utf-8")
        print("wrote", f"v4/services/{s['slug']}.html")
    cs = ROOT / "v4" / "case-studies"
    cs.mkdir(parents=True, exist_ok=True)
    (cs / "lift-truck-self-service.html").write_text(to_v4(v3.case_study()), encoding="utf-8")
    print("wrote v4/case-studies/lift-truck-self-service.html")
