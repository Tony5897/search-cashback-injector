"""
Generate Chrome Web Store graphic assets for PerkPop:
  - screenshot_1280x800.png   (required, shows extension in action)
  - promo_small_440x280.png   (optional small tile)
  - promo_marquee_1400x560.png (optional marquee tile)
"""
from __future__ import annotations
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "store_assets")
os.makedirs(OUT, exist_ok=True)

# ── Brand palette ──────────────────────────────────────────────────────────────
NAVY        = (13,  43,  94)
NAVY_DARK   = (8,   26,  58)
SILVER      = (185, 200, 220)
BRAND_LIGHT = (232, 237, 248)
WHITE       = (255, 255, 255)
LIGHT_GRAY  = (248, 249, 250)
MID_GRAY    = (218, 220, 224)
TEXT_DARK   = (32,  33,  36)
TEXT_MED    = (95,  99,  104)
TEXT_LIGHT  = (154, 160, 166)
GOOGLE_BLUE = (26,  115, 232)
BANNER_BG   = (232, 237, 248)
BANNER_BDR  = (122, 159, 212)

# ── Font helpers ───────────────────────────────────────────────────────────────
FONT_PATHS = {
    "regular": [
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ],
    "bold": [
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ],
}

def font(style: str, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for p in FONT_PATHS.get(style, FONT_PATHS["regular"]):
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            pass
    return ImageFont.load_default(size)

def text_w(draw: ImageDraw.ImageDraw, txt: str, fnt) -> int:
    bb = draw.textbbox((0, 0), txt, font=fnt)
    return bb[2] - bb[0]

def rounded_rect(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, outline_w=1):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill,
                            outline=outline, width=outline_w)


# ══════════════════════════════════════════════════════════════════════════════
#  SCREENSHOT  1280 × 800
# ══════════════════════════════════════════════════════════════════════════════
def make_screenshot() -> Image.Image:
    W, H = 1280, 800
    img  = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # ── Chrome browser chrome ──────────────────────────────────────────────────
    CHROME_H = 88
    draw.rectangle([0, 0, W, CHROME_H], fill=(242, 242, 242))
    draw.line([0, CHROME_H, W, CHROME_H], fill=MID_GRAY, width=1)

    # Tab
    draw.rounded_rectangle([80, 8, 340, 46], radius=6, fill=WHITE)
    fav_r = 10
    draw.ellipse([92, 18, 92 + fav_r*2, 18 + fav_r*2], fill=NAVY)  # favicon dot
    draw.text((116, 20), "Google Search", font=font("regular", 13), fill=TEXT_DARK)

    # Omnibar
    draw.rounded_rectangle([80, 54, W - 160, 82], radius=20, fill=WHITE,
                            outline=MID_GRAY, width=1)
    draw.text((104, 60), "amazon headphones", font=font("regular", 15), fill=TEXT_DARK)

    # Extension icon (small pill in toolbar area)
    ix, iy = W - 110, 54
    draw.ellipse([ix, iy, ix + 28, iy + 28], fill=NAVY)
    draw.ellipse([ix + 2, iy + 2, ix + 26, iy + 26], fill=NAVY)
    draw.text((ix + 4, iy + 4), "$", font=font("bold", 16), fill=BRAND_LIGHT)

    # ── Google search page ─────────────────────────────────────────────────────
    PAGE_TOP = CHROME_H + 1
    draw.rectangle([0, PAGE_TOP, W, H], fill=WHITE)

    # Google logo area (simplified)
    draw.text((160, PAGE_TOP + 18), "Google", font=font("bold", 22), fill=TEXT_DARK)

    # Search bar on page
    draw.rounded_rectangle([130, PAGE_TOP + 50, 820, PAGE_TOP + 88],
                            radius=24, fill=WHITE, outline=MID_GRAY, width=1)
    draw.text((160, PAGE_TOP + 62), "amazon headphones",
              font=font("regular", 16), fill=TEXT_DARK)

    # Separator
    draw.line([0, PAGE_TOP + 108, W, PAGE_TOP + 108], fill=MID_GRAY, width=1)

    # "About X results" line
    draw.text((160, PAGE_TOP + 118), "About 412,000,000 results (0.47 seconds)",
              font=font("regular", 12), fill=TEXT_MED)

    # ── Search results ─────────────────────────────────────────────────────────
    results = [
        {
            "url":   "amazon.com",
            "title": "Amazon.com: Headphones",
            "desc":  "Shop headphones, earbuds, and more. Free shipping on eligible orders over $35. "
                     "Huge selection from top brands.",
            "banner": "💰  Earn 4% cashback at Amazon",
            "has_banner": True,
        },
        {
            "url":   "bestbuy.com",
            "title": "Headphones & Earbuds | Best Buy",
            "desc":  "Find the best deals on headphones, wireless earbuds, noise-cancelling headphones "
                     "and more at Best Buy.",
            "banner": "💰  Earn 3% cashback at Best Buy",
            "has_banner": True,
        },
        {
            "url":   "rtings.com",
            "title": "Best Headphones of 2026 – Reviews – RTINGS.com",
            "desc":  "We buy our own products to test. No cherry-picked units. Updated daily with the "
                     "latest recommendations and comparisons.",
            "has_banner": False,
        },
    ]

    y = PAGE_TOP + 148
    for r in results:
        # ── PerkPop banner (injected above result) ──────────────────────────
        if r.get("has_banner"):
            bx0, bx1 = 160, 680
            by0, by1 = y, y + 26
            draw.rounded_rectangle([bx0, by0, bx1, by1], radius=4,
                                    fill=BANNER_BG, outline=BANNER_BDR, width=1)
            draw.text((bx0 + 10, by0 + 5), r["banner"],
                      font=font("regular", 13), fill=NAVY)
            y += 32

        # URL breadcrumb
        draw.text((160, y), r["url"], font=font("regular", 13), fill=TEXT_MED)
        y += 20

        # Title (blue link)
        draw.text((160, y), r["title"], font=font("bold", 20), fill=GOOGLE_BLUE)
        y += 28

        # Description snippet
        draw.text((160, y), r["desc"], font=font("regular", 14), fill=TEXT_DARK)
        y += 44

    # ── Callout label ──────────────────────────────────────────────────────────
    lx, ly = 720, PAGE_TOP + 160
    draw.rounded_rectangle([lx, ly, lx + 390, ly + 70], radius=8,
                            fill=NAVY, outline=None)
    draw.text((lx + 20, ly + 10), "PerkPop adds this →",
              font=font("bold", 16), fill=WHITE)
    draw.text((lx + 20, ly + 36), "Cashback offers, right in your results",
              font=font("regular", 13), fill=BRAND_LIGHT)

    # Arrow pointing left toward the banner
    ax = lx - 4
    ay = ly + 35
    draw.polygon([(ax, ay), (ax - 18, ay - 10), (ax - 18, ay + 10)], fill=NAVY)

    return img


# ══════════════════════════════════════════════════════════════════════════════
#  SMALL PROMO TILE  440 × 280
# ══════════════════════════════════════════════════════════════════════════════
def make_small_promo() -> Image.Image:
    W, H = 440, 280
    img  = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Subtle gradient effect via banded rectangles
    for i in range(H):
        t = i / H
        r = int(NAVY[0] + (NAVY_DARK[0] - NAVY[0]) * t)
        g = int(NAVY[1] + (NAVY_DARK[1] - NAVY[1]) * t)
        b = int(NAVY[2] + (NAVY_DARK[2] - NAVY[2]) * t)
        draw.line([0, i, W, i], fill=(r, g, b))

    # Icon
    cx, cy, ir = W // 2, 90, 44
    draw.ellipse([cx - ir - 3, cy - ir - 3, cx + ir + 3, cy + ir + 3], fill=SILVER)
    draw.ellipse([cx - ir, cy - ir, cx + ir, cy + ir], fill=NAVY_DARK)
    dollar_f = font("bold", 52)
    dw = text_w(draw, "$", dollar_f)
    bb = draw.textbbox((0, 0), "$", font=dollar_f)
    dh = bb[3] - bb[1]
    draw.text((cx - dw // 2 - bb[0], cy - dh // 2 - bb[1] - 2),
              "$", font=dollar_f, fill=BRAND_LIGHT)

    # Wordmark
    name_f = font("bold", 34)
    nw = text_w(draw, "PerkPop", name_f)
    draw.text(((W - nw) // 2, 148), "PerkPop", font=name_f, fill=WHITE)

    # Tagline
    tag = "Cashback on every search"
    tag_f = font("regular", 17)
    tw = text_w(draw, tag, tag_f)
    draw.text(((W - tw) // 2, 192), tag, font=tag_f, fill=BRAND_LIGHT)

    # Bottom accent pill
    pill_w, pill_h = 200, 34
    px = (W - pill_w) // 2
    py = H - 50
    draw.rounded_rectangle([px, py, px + pill_w, py + pill_h],
                            radius=17, fill=(255, 255, 255, 30))
    label = "Free  ·  No account needed"
    lf = font("regular", 13)
    lw = text_w(draw, label, lf)
    draw.text(((W - lw) // 2, py + 9), label, font=lf, fill=BRAND_LIGHT)

    return img


# ══════════════════════════════════════════════════════════════════════════════
#  MARQUEE PROMO TILE  1400 × 560
# ══════════════════════════════════════════════════════════════════════════════
def make_marquee_promo() -> Image.Image:
    W, H = 1400, 560
    img  = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Background gradient
    for i in range(H):
        t = i / H
        r = int(NAVY[0] + (NAVY_DARK[0] - NAVY[0]) * t)
        g = int(NAVY[1] + (NAVY_DARK[1] - NAVY[1]) * t)
        b = int(NAVY[2] + (NAVY_DARK[2] - NAVY[2]) * t)
        draw.line([0, i, W, i], fill=(r, g, b))

    # Left side: icon + brand
    cx, cy, ir = 220, H // 2 - 20, 72
    draw.ellipse([cx - ir - 4, cy - ir - 4, cx + ir + 4, cy + ir + 4], fill=SILVER)
    draw.ellipse([cx - ir, cy - ir, cx + ir, cy + ir], fill=NAVY_DARK)
    df = font("bold", 86)
    dw = text_w(draw, "$", df)
    bb = draw.textbbox((0, 0), "$", font=df)
    dh = bb[3] - bb[1]
    draw.text((cx - dw // 2 - bb[0], cy - dh // 2 - bb[1] - 3),
              "$", font=df, fill=BRAND_LIGHT)

    name_f = font("bold", 60)
    draw.text((360, cy - 80), "PerkPop", font=name_f, fill=WHITE)

    tag_f = font("regular", 26)
    draw.text((364, cy - 8), "Cashback offers on Google Search", font=tag_f, fill=BRAND_LIGHT)

    sub_f = font("regular", 18)
    draw.text((364, cy + 44), "Free  ·  No sign-in  ·  Privacy-first  ·  20+ merchants",
              font=sub_f, fill=SILVER)

    # Vertical divider
    draw.line([W // 2 - 20, 60, W // 2 - 20, H - 60], fill=(255, 255, 255, 40), width=1)

    # Right side: mock banner previews
    rx = W // 2 + 40
    ry = 80
    mock_results = [
        ("amazon.com › ...",         "Amazon.com: Headphones",      "💰  Earn 4% cashback at Amazon"),
        ("nike.com › ...",           "Nike Official Site",           "💰  Earn 5% cashback at Nike"),
        ("bestbuy.com › ...",        "Headphones | Best Buy",        "💰  Earn 3% cashback at Best Buy"),
    ]

    for (url, title, banner) in mock_results:
        # Banner badge
        bw = W - rx - 60
        draw.rounded_rectangle([rx, ry, rx + bw, ry + 26],
                                radius=4, fill=BANNER_BG, outline=BANNER_BDR, width=1)
        draw.text((rx + 10, ry + 5), banner, font=font("regular", 13), fill=NAVY)
        ry += 32
        draw.text((rx, ry), url, font=font("regular", 12), fill=(160, 170, 185))
        ry += 18
        draw.text((rx, ry), title, font=font("bold", 18), fill=WHITE)
        ry += 52

    return img


# ── Write files ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    assets = [
        ("screenshot_1280x800.png", make_screenshot),
        ("promo_small_440x280.png",  make_small_promo),
        ("promo_marquee_1400x560.png", make_marquee_promo),
    ]
    for name, fn in assets:
        path = os.path.join(OUT, name)
        fn().save(path, optimize=True)
        print(f"  ✓ {name}  ({os.path.getsize(path):,} bytes)")
    print(f"\nSaved to {OUT}/")
