"""Cut the two page backgrounds out of the source clips.

Chosen by measurement rather than eye — see the candidate table: the frost block at
frame 0 of the freeze clip gives the headline region a mean luminance of 30/255,
which puts frost-coloured text over it at 15.45:1. That is AA body contrast with no
scrim at all, so the scrim the hero does carry is there for the block's highlights
rather than to rescue the copy.

Two shapes each, for the same reason the capsule has two: a full-viewport background
on a phone held upright is cropping a 16:9 frame down to about 0.46, which throws
away three quarters of it and upscales the rest.
"""

import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "bg")
D = os.path.join(os.path.expanduser("~"), "Downloads")

# id -> (source clip, source frame, why)
SHOTS = {
    "hero": (
        "Generated Video August 29, 2026 - 4_51PM.mp4",
        0,
        "a solid clear block before the frost grows: the product, and dark enough to "
        "carry a headline",
    ),
    "cta": (
        "Generated Video August 29, 2026 - 4_59PM.mp4",
        70,
        "cold streaming off a submerged block: the closing image",
    ),
}

VARIANTS = [
    # id suffix, filter chain, avif crf, webp quality
    ("wide", "scale=1920:-2", 48, 74),
    ("portrait", "crop=ih*3/4:ih:(iw-ih*3/4)/2:0,scale=1080:-2", 48, 74),
]


def run(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0

    for name, (clip, frame, why) in SHOTS.items():
        src = os.path.join(D, clip)
        if not os.path.exists(src):
            sys.exit("missing source clip: %s" % src)
        print("%s  (frame %d) — %s" % (name, frame, why))

        for suffix, chain, crf, quality in VARIANTS:
            staging = tempfile.mkdtemp(prefix="bg-")
            try:
                png = os.path.join(staging, "frame.png")
                proc = run(["ffmpeg", "-y", "-v", "error", "-i", src,
                            "-vf", "select='eq(n,%d)',%s" % (frame, chain),
                            "-fps_mode", "passthrough", "-frames:v", "1", png])
                if proc.returncode != 0:
                    sys.exit("extract failed for %s-%s:\n%s" % (name, suffix, proc.stderr))

                # AVIF through the dedicated muxer — image2 writes files no browser
                # will decode, however correct the header looks.
                avif = os.path.join(OUT, "%s-%s.avif" % (name, suffix))
                proc = run(["ffmpeg", "-y", "-v", "error", "-i", png,
                            "-c:v", "libaom-av1", "-crf", str(crf), "-cpu-used", "6",
                            "-still-picture", "1", "-f", "avif", avif])
                if proc.returncode != 0:
                    sys.exit("avif failed for %s-%s:\n%s" % (name, suffix, proc.stderr))

                webp = os.path.join(OUT, "%s-%s.webp" % (name, suffix))
                proc = run(["ffmpeg", "-y", "-v", "error", "-i", png,
                            "-c:v", "libwebp", "-quality", str(quality), webp])
                if proc.returncode != 0:
                    sys.exit("webp failed for %s-%s:\n%s" % (name, suffix, proc.stderr))

                dims = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                            "-show_entries", "stream=width,height", "-of", "csv=p=0",
                            avif]).stdout.strip()
                a, w = os.path.getsize(avif), os.path.getsize(webp)
                total += a + w
                print("  %-9s %-11s avif %6.1f KB   webp %6.1f KB"
                      % (suffix, dims, a / 1024, w / 1024))
            finally:
                shutil.rmtree(staging, ignore_errors=True)

    print("")
    print("total %.1f KB in public/bg/" % (total / 1024))


if __name__ == "__main__":
    main()
