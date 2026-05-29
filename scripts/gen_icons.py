"""Generate PerkPop extension icons at 16, 48, and 128px.

Design:
  - Transparent background
  - Solid navy circle (#0d2b5e)
  - Clean silver-white ring border
  - Bold white dollar sign, optically centred
  - Rendered at 4x then downsampled (LANCZOS) for clean anti-aliasing
"""
from __future__ import annotations
import os
from PIL import Image, ImageDraw, ImageFont

# Brand palette
NAVY   = (13, 43, 94, 255)       # #0d2b5e — circle fill
RING   = (185, 200, 220, 255)    # silver ring
DOLLAR = (240, 243, 250, 255)    # near-white dollar sign
CLEAR  = (0, 0, 0, 0)           # transparent background

# Font preference list (first available wins)
FONT_CANDIDATES = [
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]

def load_font(px: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, px)
        except OSError:
            continue
    return ImageFont.load_default(px)


def make_icon(output_px: int) -> Image.Image:
    scale = 4
    s = output_px * scale           # working canvas size

    img  = Image.new("RGBA", (s, s), CLEAR)
    draw = ImageDraw.Draw(img)

    # Geometry
    margin    = round(s * 0.02)     # tiny outer gap so ring isn't clipped
    ring_w    = round(s * 0.05)     # ring thickness ~5 % of canvas
    inset     = margin + ring_w

    # 1. Silver ring (full circle)
    draw.ellipse([margin, margin, s - margin - 1, s - margin - 1], fill=RING)

    # 2. Navy fill (inset from ring)
    draw.ellipse([inset, inset, s - inset - 1, s - inset - 1], fill=NAVY)

    # 3. Dollar sign — font size tuned to sit well inside the navy disc
    font_px = round(s * 0.50)
    font    = load_font(font_px)

    # Measure with a dummy draw so we can centre precisely
    bbox = draw.textbbox((0, 0), "$", font=font)
    glyph_w = bbox[2] - bbox[0]
    glyph_h = bbox[3] - bbox[1]

    tx = (s - glyph_w) / 2 - bbox[0]
    ty = (s - glyph_h) / 2 - bbox[1] - round(s * 0.015)  # tiny optical upward nudge

    draw.text((tx, ty), "$", font=font, fill=DOLLAR)

    # 4. Downsample to final size
    return img.resize((output_px, output_px), Image.LANCZOS)


if __name__ == "__main__":
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    icons_dir = os.path.join(root, "public", "icons")

    for size in (128, 48, 16):
        path = os.path.join(icons_dir, f"icon{size}.png")
        make_icon(size).save(path, optimize=True)
        print(f"  ✓ icon{size}.png → {os.path.getsize(path):,} bytes")

    print("Done.")
