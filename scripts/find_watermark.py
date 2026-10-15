"""Locate Koolink's watermark badge in each source photograph.

Guessing crop rectangles and checking them by eye took two passes and still left the badge
clipped into three tiles, so this measures it instead. The badge is a saturated blue disc
with a magenta centre on photographs that are otherwise machines, walls and sky, so it is
separable by saturation and hue rather than by position: anything strongly blue-cyan or
magenta beyond what a photograph of a white cabinet contains.

Prints, per file, the badge bounding box and the largest 4:3 crop that excludes it.
"""

import subprocess
from pathlib import Path

SRC = Path(r"C:\Users\shadr\OneDrive\Pictures\Camera Roll")
WANTED = [
    "WhatsApp Image 2026-08-31 at 01.45.31.jpeg",
    "WhatsApp Image 2026-08-31 at 01.45.23 (3).jpeg",
    "WhatsApp Image 2026-08-31 at 01.45.21.jpeg",
    "WhatsApp Image 2026-08-31 at 01.45.23 (2).jpeg",
    "WhatsApp Image 2026-08-31 at 01.45.41.jpeg",
    "WhatsApp Image 2026-08-31 at 01.45.28.jpeg",
]


def dims(path: Path) -> tuple[int, int]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)


def pixels(path: Path, w: int, h: int) -> bytes:
    return subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "rawvideo",
         "-pix_fmt", "rgb24", "-frames:v", "1", "-"],
        capture_output=True, check=True,
    ).stdout


def badge_box(buf: bytes, w: int, h: int):
    """Bounding box of the watermark, or None. Scans the bottom-right quadrant only:
    a machine elsewhere in frame can be genuinely blue, the badge is always down here."""
    x0, y0 = w // 2, h // 2
    left, top, right, bottom = w, h, -1, -1
    hits = 0
    for y in range(y0, h):
        row = y * w * 3
        for x in range(x0, w):
            i = row + x * 3
            r, g, b = buf[i], buf[i + 1], buf[i + 2]
            mx, mn = max(r, g, b), min(r, g, b)
            if mx < 60:
                continue
            sat = (mx - mn) / mx
            if sat < 0.55:
                continue
            # the badge is blue-dominant cyan or magenta; a photograph of a machine in
            # this quadrant is rarely either at this saturation
            blue_disc = b == mx and b - r > 60
            magenta = r > 120 and b > 120 and g < min(r, b) - 50
            if not (blue_disc or magenta):
                continue
            hits += 1
            left, top = min(left, x), min(top, y)
            right, bottom = max(right, x), max(bottom, y)
    if hits < 400:
        return None
    return left, top, right, bottom


def best_crop(w: int, h: int, box):
    """Largest 4:3 rectangle that clears the badge, preferring to keep full width."""
    limit_y = box[1] if box else h
    best = None
    for crop_h in range(limit_y, 80, -2):
        crop_w = round(crop_h * 4 / 3)
        if crop_w > w:
            continue
        best = (0, 0, crop_w, crop_h)
        break
    if best is None:
        crop_w = w
        crop_h = round(crop_w * 3 / 4)
        best = (0, 0, crop_w, min(crop_h, limit_y))
    return best


for name in WANTED:
    path = SRC / name
    w, h = dims(path)
    buf = pixels(path, w, h)
    box = badge_box(buf, w, h)
    crop = best_crop(w, h, box)
    tag = name.replace("WhatsApp Image 2026-08-31 at ", "").replace(".jpeg", "")
    print(f"{tag:<16} {w}x{h}")
    print(f"  badge      {box if box else 'not detected'}")
    print(f"  clean 4:3  x={crop[0]} y={crop[1]} w={crop[2]} h={crop[3]}"
          f"   -> {min(680, crop[2])}px wide tile")
