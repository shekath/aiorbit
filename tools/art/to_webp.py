#!/usr/bin/env python3
"""Convert rendered PNGs in mockb/assets/img/_png to WebP (+ a 900px-wide variant) and delete the PNGs."""
from pathlib import Path
from PIL import Image

src = Path(__file__).resolve().parents[2] / "mockb" / "assets" / "img" / "_png"
dst = src.parent
for png in sorted(src.glob("*.png")):
    im = Image.open(png).convert("RGB")
    im.save(dst / f"{png.stem}.webp", "WEBP", quality=82, method=6)
    small = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
    small.save(dst / f"{png.stem}-900.webp", "WEBP", quality=80, method=6)
    png.unlink()
    print("wrote", png.stem)
src.rmdir()
