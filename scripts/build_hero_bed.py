"""Cut the hero's two backgrounds out of the supplied composite.

One source image, two very different jobs, because a phone and a desktop put the copy in
different places:

  wide      the copy sits in the left half, so the frame keeps the whole composition and the
            scrim runs left-heavy. The machine is on the right, in the clear.
  portrait  the copy spans the full width, so nothing can be "kept clear" horizontally. The
            crop moves right to bring the machine into frame and the scrim turns ninety
            degrees to top-heavy instead (see the portrait rule in globals.css). Copy in the
            dark upper two thirds, machine in the bright lower third.

The portrait window was chosen by measuring, not by eye. Sampling the copy band row by row
and applying each row's own scrim alpha:

    x=120  gradient only, no machine      9.48:1   (what shipped first, and why it was wrong)
    x=400  ice pile and the machine base  6.50:1
    x=560  machine lower half             6.32:1
    x=700  the whole machine in frame     5.63:1   <- chosen

All four clear AA. x=700 is the one that actually shows the product, and it costs 3.85 of
headroom that was never being spent on anything.

Run: python scripts/build_hero_bed.py
"""

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "hero-source.webp"
OUT = ROOT / "public" / "bg"

VARIANTS = [
    # 3:2 source to 16:9, taken from just below centre: keeps the machine, the ice and the
    # mountain line, loses sky the composition does not need. 1.25x upscale, which the scrim
    # and the dark left half absorb.
    ("hero-wide", "crop=1536:864:0:80,scale=1920:1080:flags=lanczos"),
    # 768 of 1536 starting at x=700, so the machine and the ice pile are both inside with
    # margin. Full source height, scaled up to 1080x1440.
    ("hero-portrait", "crop=768:1024:700:0,scale=1080:1440:flags=lanczos"),
]

FORMATS = (("avif", ["-f", "avif", "-crf", "30"]), ("webp", ["-quality", "82"]))


def dims(path: Path) -> str:
    return subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()


if not SRC.exists():
    raise SystemExit(f"source missing: {SRC}")

OUT.mkdir(parents=True, exist_ok=True)
for name, chain in VARIANTS:
    for fmt, args in FORMATS:
        dest = OUT / f"{name}.{fmt}"
        result = subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-vf", chain]
            + args + ["-frames:v", "1", str(dest)],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            raise SystemExit(f"{dest.name} failed: {result.stderr.strip()[:250]}")
        print(f"  {dest.name:<22} {dims(dest)}  {dest.stat().st_size // 1024} KB")
