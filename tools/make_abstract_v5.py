#!/usr/bin/env python3
"""Generate the Version 5 hero's abstract artworks (original, licence-free).

Domain-warped fractal noise ("liquid silk") mapped to the AI Orbit palette.
The WebGL hero (v5/assets/js/hero-gl.js) cross-fades and distorts these.
Run from the repo root:  python3 tools/make_abstract_v5.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "v5" / "assets" / "img"
W, H = 1600, 1000


def noise(rng, w, h, cells):
    g = rng.random((cells + 1, int(cells * h / w) + 2)).astype(np.float32)
    img = Image.fromarray((g * 255).astype(np.uint8).T, "L").resize((w, h), Image.BICUBIC)
    return np.asarray(img, np.float32) / 255.0


def fbm(rng, w, h, base=3, octaves=5):
    v, amp, tot = np.zeros((h, w), np.float32), 1.0, 0.0
    for o in range(octaves):
        v += amp * noise(rng, w, h, base * 2 ** o)
        tot += amp
        amp *= 0.5
    return v / tot


def warp(field, dx, dy, s):
    h, w = field.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    x = np.clip(xx + (dx - .5) * s * w, 0, w - 1).astype(np.int32)
    y = np.clip(yy + (dy - .5) * s * h, 0, h - 1).astype(np.int32)
    return field[y, x]


def palette(t, stops):
    t = np.clip(t, 0, 1)[..., None]
    pos = np.array([p for p, _ in stops], np.float32)
    col = np.array([c for _, c in stops], np.float32) / 255.0
    out = np.zeros(t.shape[:2] + (3,), np.float32)
    for i in range(len(stops) - 1):
        a, b = pos[i], pos[i + 1]
        m = ((t[..., 0] >= a) & (t[..., 0] <= b))[..., None]
        k = (t - a) / max(b - a, 1e-6)
        k = k * k * (3 - 2 * k)
        out = np.where(m, col[i] * (1 - k) + col[i + 1] * k, out)
    return out


def make(seed, stops, name, s1=.55, s2=.45, sheen=.35):
    rng = np.random.default_rng(seed)
    q1, q2 = fbm(rng, W, H), fbm(rng, W, H)
    base = fbm(rng, W, H, base=2)
    f = warp(base, q1, q2, s1)
    r1, r2 = fbm(rng, W, H, base=2), fbm(rng, W, H, base=2)
    f = warp(f, r1, r2, s2)
    f = (f - f.min()) / (f.max() - f.min())
    col = palette(f ** 1.15, stops)
    # silk sheen: thin bright ridges where the warped field folds
    ridge = np.abs(np.sin(f * np.pi * 9.0)) ** 18
    col += sheen * ridge[..., None] * np.array([.75, .85, 1.0], np.float32)
    img = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(1.2))
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / f"{name}.webp", "WEBP", quality=80, method=6)
    img.resize((W // 2, H // 2), Image.LANCZOS).save(OUT / f"{name}-800.webp", "WEBP", quality=78, method=6)
    print("wrote", name)


NAVY = (11, 13, 18)
make(11, [(0, NAVY), (.35, (36, 28, 92)), (.6, (108, 130, 255)), (.8, (63, 220, 242)), (1, (232, 240, 255))], "abstract-silk")
make(29, [(0, NAVY), (.3, (58, 22, 102)), (.55, (164, 133, 255)), (.75, (255, 92, 168)), (1, (255, 214, 236))], "abstract-aurora", s1=.7, s2=.5, sheen=.25)
make(47, [(0, NAVY), (.4, (8, 52, 74)), (.65, (63, 220, 242)), (.85, (139, 151, 255)), (1, (240, 250, 255))], "abstract-flow", s1=.45, s2=.6, sheen=.4)
