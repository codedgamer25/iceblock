"""Build contact sheets from the Camera Roll so the machines can be identified before
any one of them is committed to a product tile.

Sheets of nine in a 3x3 grid, 4:3 cells, in a deterministic sorted order, so a grid
position maps back to exactly one filename. Reading order is left to right, top to
bottom. Nothing here touches the originals.
"""

import subprocess
from pathlib import Path

SRC = Path(r"C:\Users\shadr\OneDrive\Pictures\Camera Roll")
OUT = Path(r"C:\Users\shadr\iceblock\.sheets")
COLS, ROWS = 3, 3
CELL_W, CELL_H = 460, 345


def layout(count: int) -> str:
    """xstack needs an explicit pixel origin per input."""
    cells = []
    for slot in range(count):
        col, row = slot % COLS, slot // COLS
        cells.append(f"{col * CELL_W}_{row * CELL_H}")
    return "|".join(cells)


OUT.mkdir(exist_ok=True)

files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in {".jpeg", ".jpg", ".png"})
per_sheet = COLS * ROWS
sheets = [files[i : i + per_sheet] for i in range(0, len(files), per_sheet)]

print(f"{len(files)} images -> {len(sheets)} sheets of up to {per_sheet}\n")

for index, batch in enumerate(sheets, start=1):
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for path in batch:
        cmd += ["-i", str(path)]

    parts = [
        f"[{slot}:v]scale={CELL_W}:{CELL_H}:force_original_aspect_ratio=decrease,"
        f"pad={CELL_W}:{CELL_H}:(ow-iw)/2:(oh-ih)/2:color=0x101820,setsar=1[v{slot}]"
        for slot in range(len(batch))
    ]
    joined = "".join(f"[v{s}]" for s in range(len(batch)))
    parts.append(f"{joined}xstack=inputs={len(batch)}:layout={layout(len(batch))}[out]")

    dest = OUT / f"sheet{index}.jpg"
    cmd += ["-filter_complex", ";".join(parts), "-map", "[out]", "-q:v", "4", str(dest)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"sheet {index} FAILED:\n{result.stderr[:700]}")
        continue

    print(f"sheet{index}.jpg  (row-major, 3 across)")
    for slot, path in enumerate(batch, start=1):
        print(f"  {slot}: {path.name}")
    print()
