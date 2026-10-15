"""Contact sheets of the built catalogue frames, labelled with their slug and caption.

Written because a caption is the one thing in the gallery that no test can check: `tests/
content.test.ts` can prove the captions are unique and that every slug has one, but not that
the sentence describes the photograph it sits under. The first pass at this set captioned a
nylon trough as "a chiller's channels packed with bottled drinks", which is a sentence about
a product line the client had already dropped.

So: lay each group out in the order the page renders it, stamp the slug and the current
caption onto each frame, and look.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
GALLERY = ROOT / "public" / "gallery"
OUT = ROOT / "tmp-sheets"

CELL_W = 300
COLS = 4
PAD = 8
LABEL_H = 44


def font(size: int) -> ImageFont.FreeTypeFont:
    for name in ("arial.ttf", "DejaVuSans.ttf", "segoeui.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=f) <= width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines[:2]


def sheet(group: str, entries: list[tuple[str, str]]) -> Path:
    slug_font, cap_font = font(15), font(13)
    rows = (len(entries) + COLS - 1) // COLS

    # Every frame is scaled into the same cell so the grid is regular; heights vary, so measure
    # the tallest cell in each row rather than assuming one cell height for the whole sheet.
    cells: list[tuple[str, str, Image.Image]] = []
    for slug, caption in entries:
        src = GALLERY / f"{slug}.webp"
        img = Image.open(src).convert("RGB")
        scale = CELL_W / img.width
        cells.append((slug, caption, img.resize((CELL_W, round(img.height * scale)), Image.LANCZOS)))

    row_h = [
        max(c[2].height for c in cells[r * COLS : (r + 1) * COLS]) + LABEL_H + PAD for r in range(rows)
    ]
    sheet_img = Image.new("RGB", (COLS * (CELL_W + PAD) + PAD, sum(row_h) + PAD), (24, 26, 30))
    draw = ImageDraw.Draw(sheet_img)

    y = PAD
    for r in range(rows):
        for c, (slug, caption, img) in enumerate(cells[r * COLS : (r + 1) * COLS]):
            x = PAD + c * (CELL_W + PAD)
            sheet_img.paste(img, (x, y))
            ty = y + img.height + 3
            draw.text((x, ty), slug, font=slug_font, fill=(120, 220, 255))
            for i, line in enumerate(wrap(draw, caption, cap_font, CELL_W)):
                draw.text((x, ty + 18 + i * 14), line, font=cap_font, fill=(215, 215, 215))
        y += row_h[r]

    OUT.mkdir(exist_ok=True)
    path = OUT / f"{group}.jpg"
    sheet_img.save(path, quality=88)
    return path


def main() -> None:
    sys.path.insert(0, str(ROOT / "scripts"))
    import re

    text = (ROOT / "scripts" / "build_products.py").read_text(encoding="utf-8")
    captions = dict(re.findall(r'^\s{4}"([^"]+)":\s"([^"]+)",$', text, re.M))

    ts = (ROOT / "src" / "lib" / "gallery.ts").read_text(encoding="utf-8")
    order: dict[str, list[tuple[str, str]]] = {}
    for slug, group in re.findall(r"slug:\s'([^']+)',[\s\S]{0,400}?group:\s'([^']+)'", ts):
        order.setdefault(group, []).append((slug, captions.get(slug, "(none)")))

    for group, entries in order.items():
        print(f"{group}: {len(entries)} frames -> {sheet(group, entries)}")


if __name__ == "__main__":
    main()
