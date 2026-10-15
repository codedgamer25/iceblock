"""Draw the wordmark's initial and rasterise it, so it can be judged before it ships.

The K is a monogram rather than a letter from a typeface: a didone where every stroke of the
K is split into a hairline and a heavy stroke, which is what makes it read as two overlapping
Ks. Nothing in Archivo or any other loaded face does that, so it is drawn.

The geometry lives here rather than in the component because a curve needs looking at, and
the preview pane on this machine will not composite an injected overlay. This flattens the
two cubics, fills everything even-odd with 4x supersampling, and writes a PNG at three sizes
— display, mid, and the 26px the header actually renders — plus the `d` strings to paste into
KoolinkLogo.tsx.

Run: python scripts/draw_wordmark_k.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / ".impeccable"

# One 100 x 104 box. y=2 is the cap line and y=102 the baseline, leaving 2 units of air so a
# serif never sits flush against the edge of the viewBox.
CAP, BASE = 2.0, 102.0

# ---------------------------------------------------------------------------------------
# The stem. A didone I-beam, except the stem is split: a hairline at the left edge, a gap,
# then the heavy stroke. The serifs are flat and unbracketed, which is what makes it didone
# rather than transitional, and they span both strokes so the two read as one letter.
HAIR = 7.0
STEM_L, STEM_R = 26.0, 38.5
SERIF_L, SERIF_R = 8.0, 50.0
SERIF_H = 7.0

# The leg, also split: heavy stroke plus a hairline running outside it to the baseline.
LEG_TOP_Y = 42.0
LEG_TOP_L, LEG_TOP_R = 33.0, 46.5
LEG_FOOT_L, LEG_FOOT_R = 70.0, 87.0
FOOT_L, FOOT_R = 66.0, 92.0
LEG_HAIR_TOP = (54.0, 31.0)
LEG_HAIR_FOOT = 97.0

# The arm is a single hairline, curved like a swash rather than run straight, because a
# straight hairline at this contrast reads as a hairline rule instead of a stroke. It leaves
# the apex on a shallow slope and steepens into the stem, which is the whole gesture, and it
# tapers: 2.8 units at the tip against 5 where it lands on the stem. It stops short of the
# leg's foot on purpose — an arm and a leg both reaching the full width make a letter that
# reads as wide rather than as tall.
ARM_TIP_X, ARM_TIP_W = 88.0, 8.0
ARM_JOIN_X, ARM_JOIN_TOP, ARM_JOIN_BOT = 38.5, 34.0, 42.0
ARM_C1, ARM_C2 = (66.0, 16.0), (48.0, 30.0)
ARM_D1, ARM_D2 = (64.0, 12.0), (46.0, 25.0)


def cubic(p0, p1, p2, p3, steps=64):
    t = np.linspace(0, 1, steps)[:, None]
    p = np.array([p0, p1, p2, p3], dtype=float)
    b = np.hstack([(1 - t) ** 3, 3 * t * (1 - t) ** 2, 3 * t**2 * (1 - t), t**3])
    return [tuple(row) for row in b @ p]


def shapes():
    stem_outer = [
        (SERIF_L, CAP), (SERIF_R, CAP), (SERIF_R, CAP + SERIF_H), (STEM_R, CAP + SERIF_H),
        (STEM_R, BASE - SERIF_H), (SERIF_R, BASE - SERIF_H), (SERIF_R, BASE), (SERIF_L, BASE),
    ]
    stem_gap = [
        (SERIF_L + HAIR, CAP + SERIF_H), (STEM_L, CAP + SERIF_H),
        (STEM_L, BASE - SERIF_H), (SERIF_L + HAIR, BASE - SERIF_H),
    ]
    arm = (
        [(ARM_TIP_X, CAP)]
        + cubic((ARM_TIP_X, CAP), ARM_C1, ARM_C2, (ARM_JOIN_X, ARM_JOIN_BOT))
        + [(ARM_JOIN_X, ARM_JOIN_TOP)]
        + cubic((ARM_JOIN_X, ARM_JOIN_TOP), ARM_D2, ARM_D1, (ARM_TIP_X - ARM_TIP_W, CAP))
    )
    leg = [
        (LEG_TOP_L, LEG_TOP_Y), (LEG_TOP_R, LEG_TOP_Y),
        (LEG_FOOT_R, BASE - SERIF_H), (LEG_FOOT_L, BASE - SERIF_H),
    ]
    leg_hair = [
        LEG_HAIR_TOP,
        (LEG_HAIR_TOP[0] + HAIR, LEG_HAIR_TOP[1]),
        (LEG_HAIR_FOOT, BASE - SERIF_H),
        (LEG_HAIR_FOOT - HAIR, BASE - SERIF_H),
    ]
    foot = [(FOOT_L, BASE - SERIF_H), (FOOT_R, BASE - SERIF_H), (FOOT_R, BASE), (FOOT_L, BASE)]
    return [stem_outer, stem_gap, arm, leg, foot]


def to_path(polys):
    out = []
    for poly in polys:
        pts = " ".join(f"{x:.2f} {y:.2f}" for x, y in poly)
        out.append("M" + pts.replace(" ", ",", 1).replace(" ", "L", 0))
    return out


def d_string(polys):
    """One `d` covering every subpath, for fill-rule=evenodd."""
    parts = []
    for poly in polys:
        head = f"M{poly[0][0]:.2f} {poly[0][1]:.2f}"
        rest = "".join(f"L{x:.2f} {y:.2f}" for x, y in poly[1:])
        parts.append(head + rest + "Z")
    return "".join(parts)


def raster(polys, height, ss=4, bg=(228, 228, 220)):
    """Even-odd scanline fill at `ss` times the target size, then box-filtered down."""
    w = int(round(100 / 104 * height))
    W, H = w * ss, height * ss
    sx, sy = W / 100.0, H / 104.0
    acc = np.zeros((H, W), dtype=np.int32)
    for poly in polys:
        pts = np.array(poly, dtype=float)
        pts[:, 0] *= sx
        pts[:, 1] *= sy
        for y in range(H):
            yc = y + 0.5
            xs = []
            for i in range(len(pts)):
                x0, y0 = pts[i]
                x1, y1 = pts[(i + 1) % len(pts)]
                if (y0 <= yc < y1) or (y1 <= yc < y0):
                    xs.append(x0 + (yc - y0) * (x1 - x0) / (y1 - y0))
            if not xs:
                continue
            xs.sort()
            for a, b in zip(xs[0::2], xs[1::2]):
                acc[y, max(0, int(np.ceil(a - 0.5))) : max(0, int(np.ceil(b - 0.5)))] += 1
    cov = ((acc % 2) == 1).reshape(height, ss, w, ss).mean(axis=(1, 3))
    ink = np.array([18, 16, 14], dtype=float)
    paper = np.array(bg, dtype=float)
    rgb = paper[None, None, :] * (1 - cov[:, :, None]) + ink[None, None, :] * cov[:, :, None]
    return Image.fromarray(np.uint8(rgb), "RGB")


def compact_d():
    """The `d` that ships: the arm stays two cubics instead of 130 flattened line segments."""
    return (
        f"M{SERIF_L} {CAP}H{SERIF_R}V{CAP + SERIF_H}H{STEM_R}V{BASE - SERIF_H}"
        f"H{SERIF_R}V{BASE}H{SERIF_L}Z"
        f"M{SERIF_L + HAIR} {CAP + SERIF_H}H{STEM_L}V{BASE - SERIF_H}H{SERIF_L + HAIR}Z"
        f"M{ARM_TIP_X} {CAP}C{ARM_C1[0]} {ARM_C1[1]} {ARM_C2[0]} {ARM_C2[1]}"
        f" {ARM_JOIN_X} {ARM_JOIN_BOT}L{ARM_JOIN_X} {ARM_JOIN_TOP}"
        f"C{ARM_D2[0]} {ARM_D2[1]} {ARM_D1[0]} {ARM_D1[1]} {ARM_TIP_X - ARM_TIP_W} {CAP}Z"
        f"M{LEG_TOP_L} {LEG_TOP_Y}H{LEG_TOP_R}L{LEG_FOOT_R} {BASE - SERIF_H}H{LEG_FOOT_L}Z"
        f"M{FOOT_L} {BASE - SERIF_H}H{FOOT_R}V{BASE}H{FOOT_L}Z"
    ).replace(".0", "")


polys = shapes()
OUT.mkdir(exist_ok=True)

# Two rows. The top row is the drawing at display size; the bottom is the sizes the site
# actually renders, magnified 6x with nearest-neighbour so the pixel grid is visible. A
# monogram is only as good as its worst rendering, and this one needs 34px before the
# hairlines survive at all — which is why the header sets it at nearly 2em.
sheet = Image.new("RGB", (900, 640), (228, 228, 220))
x = 40
for h in (300, 120):
    im = raster(polys, h)
    sheet.paste(im, (x, 30 + (300 - h) // 2))
    x += im.width + 50
x = 40
for h in (21, 18, 14):
    im = raster(polys, h)
    sheet.paste(im, (x, 360))
    big = im.resize((im.width * 9, im.height * 9), Image.NEAREST)
    sheet.paste(big, (x, 360 + h + 14))
    x += max(big.width, im.width) + 40
sheet.save(OUT / "k-proto.png")
print(f"wrote {OUT / 'k-proto.png'}  (top: 300 / 120px.  bottom: 56 / 44 / 34px, magnified 6x)")
print(f'\nviewBox="4 0 95 {BASE:g}"')
print(f"\nd={compact_d()}")
