"""Find candidate hero backgrounds and prove each one can carry the headline.

Two sources, because they trade off against each other:

  the three ice clips in Downloads  1920x1080 native, sharp at full bleed, but generated
  Koolink's own photographs        real, on brand, but 765-1080px wide, so a full-bleed
                                    bed means a 2x upscale and a softer frame

Every candidate is measured, not eyeballed. The hero's copy sits in the left half of the
frame between a quarter and four fifths of the way down; frost text over it has to clear
4.5:1 once the 0.34 scrim is composited, and the number that matters is the brightest 5%
of that region rather than its average, because a headline crossing one specular highlight
is the failure mode. Anything that misses is dropped before it is ever offered.

Run: python scripts/find_hero_beds.py
"""

import subprocess
from pathlib import Path

DOWNLOADS = Path.home() / "Downloads"
PHOTOS = Path(r"C:\Users\shadr\OneDrive\Pictures\Camera Roll")
OUT = Path(__file__).resolve().parent.parent / ".beds"

FROST = (0xF2, 0xF7, 0xFA)
ABYSS = (0x04, 0x10, 0x17)
SCRIM = 0.34

CLIPS = [
    ("freeze", "Generated Video August 29, 2026 - 4_51PM.mp4"),
    ("sink", "Generated Video August 29, 2026 - 4_59PM.mp4"),
    ("pour", "Generated Video August 29, 2026 - 4_42PM.mp4"),
]
FRAMES = [0, 24, 60, 96, 132]

# The photographs with enough pixels to survive a full-bleed upscale, and whose subject is
# material rather than a specific machine: a bed should be atmosphere, not a product claim.
PHOTO_TAGS = [
    "01.45.26",      # down into the mould cans
    "01.45.28 (2)",  # nylon-wrapped blocks forming
    "01.45.41 (2)",  # shelves of bagged ice
    "01.45.35 (1)",  # a day's blocks on the rack
    "01.45.44 (3)",  # finished blocks, arranged
    "01.45.21 (1)",  # the workshop mid-build
    "01.45.44",      # the yard at Ilupeju
]


def lin(v: float) -> float:
    v /= 255.0
    return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4


def rel(r: float, g: float, b: float) -> float:
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def ratio(a: float, b: float) -> float:
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def copy_region_contrast(path: Path, scrim: float = SCRIM) -> tuple[float, float]:
    """Frost-on-bed at the p95 and the worst pixel of the headline region."""
    lums = _region_luminances(path, scrim)
    fg = rel(*FROST)
    return ratio(fg, lums[int(len(lums) * 0.95)]), ratio(fg, lums[-1])


def _region_luminances(path: Path, scrim: float) -> list[float]:
    buf = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf",
         "crop=iw*0.5:ih*0.55:0:ih*0.25,scale=160:88", "-pix_fmt", "rgb24",
         "-frames:v", "1", "-f", "rawvideo", "-"],
        capture_output=True, check=True,
    ).stdout
    n = len(buf) // 3
    lums = []
    for i in range(n):
        px = (buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2])
        composited = tuple(px[c] * (1 - scrim) + ABYSS[c] * scrim for c in range(3))
        lums.append(rel(*composited))
    lums.sort()
    return lums


def required_scrim(path: Path) -> float | None:
    """The lowest `scrim` prop that puts frost at 4.5:1 over the brightest 5% of the copy.

    Pass/fail at the stock scrim was the wrong question and it threw away nineteen of
    twenty-two candidates. The scrim is a dial the CTA band already turns to 1.52; a brighter
    bed is not disqualified, it is more expensive. This reports the price.
    """
    fg = rel(*FROST)
    for step in range(34, 96):
        alpha = step / 100
        lums = _region_luminances(path, alpha)
        if ratio(fg, lums[int(len(lums) * 0.95)]) >= 4.5:
            return alpha / SCRIM
    return None


def extract(dest: Path, source: Path, frame: int | None) -> bool:
    """One 1920x1080 candidate. Photographs are cropped to 16:9 and scaled up; clips are
    already the right shape, so they are only trimmed."""
    if frame is not None:
        chain = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(source),
               "-vf", f"select=eq(n\\,{frame}),{chain}", "-frames:v", "1", "-fps_mode", "passthrough"]
    else:
        chain = ("scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,"
                 "crop=1920:1080")
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(source), "-vf", chain, "-frames:v", "1"]
    result = subprocess.run(cmd + ["-q:v", "3", str(dest)], capture_output=True, text=True)
    return result.returncode == 0 and dest.exists()


OUT.mkdir(exist_ok=True)
for stale in OUT.glob("*"):
    stale.unlink()

candidates = []

for name, filename in CLIPS:
    source = DOWNLOADS / filename
    if not source.exists():
        print(f"  clip missing, skipped: {filename}")
        continue
    for frame in FRAMES:
        dest = OUT / f"clip-{name}-{frame:03d}.jpg"
        if not extract(dest, source, frame):
            continue
        p95, worst = copy_region_contrast(dest)
        candidates.append((p95, worst, required_scrim(dest), dest.name, f"{name} clip, frame {frame}"))

for tag in PHOTO_TAGS:
    source = PHOTOS / f"WhatsApp Image 2026-08-31 at {tag}.jpeg"
    if not source.exists():
        print(f"  photo missing, skipped: {tag}")
        continue
    dest = OUT / f"photo-{tag.replace('.', '-').replace(' ', '').replace('(', '-').replace(')', '')}.jpg"
    if not extract(dest, source, None):
        continue
    p95, worst = copy_region_contrast(dest)
    candidates.append((p95, worst, required_scrim(dest), dest.name, f"photograph {tag}"))

candidates.sort(reverse=True)
print(f"
{len(candidates)} candidates. p95 is frost-on-bed at the stock scrim; `needs` is the")
print("scrim prop that would put it at 4.5:1. The current bed is clip-freeze-000 at scrim 1.")
print(f"{'p95':>7} {'worst':>7} {'needs':>7}  {'file':<28} source")
passing = []
for p95, worst, needs, filename, label in candidates:
    if needs is None:
        note = "  too bright at any scrim"
        print(f"{p95:7.2f} {worst:7.2f} {'--':>7}{note}  {filename:<26} {label}")
        continue
    print(f"{p95:7.2f} {worst:7.2f} {needs:7.2f}  {filename:<26} {label}")
    passing.append(filename)

print(f"
{len(passing)} of {len(candidates)} are usable at some scrim")

if passing:
    keep = passing[:9]
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for f in keep:
        cmd += ["-i", str(OUT / f)]
    parts = [f"[{i}:v]scale=620:349,setsar=1[v{i}]" for i in range(len(keep))]
    layout = "|".join(f"{(i % 3) * 620}_{(i // 3) * 349}" for i in range(len(keep)))
    parts.append("".join(f"[v{i}]" for i in range(len(keep)))
                 + f"xstack=inputs={len(keep)}:layout={layout}[o]")
    sheet = OUT / "sheet.jpg"
    subprocess.run(cmd + ["-filter_complex", ";".join(parts), "-map", "[o]",
                          "-q:v", "4", str(sheet)], check=False)
    print(f"\nsheet: {sheet}  (row-major, 3 across)")
    for i, f in enumerate(keep, start=1):
        print(f"  {i}: {f}")
