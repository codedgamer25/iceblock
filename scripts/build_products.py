"""Build the product tiles and the catalogue from Koolink's three type folders.

Replaces scripts/build_gallery.py and scripts/build_product_tiles.py, which worked from a
single Camera Roll export. The new set arrives already sorted by product type:

    nylon machieces   -> nylon        21 files, 20 after one exact duplicate
    moddle type       -> mould         4 files (plus a stray PDF, skipped)
    cold room         -> coldroom      8 files, 7 after one exact duplicate

The client's folder names are the product types, on their instruction, so nothing here
re-sorts by subject.

NOTHING IS CROPPED. Every frame carries Koolink's watermark in the top-left — a cyan disc
reading KOOLINK NIGERIA LIMITED around a magenta KL oval, with the two phone numbers under it —
and the client asked for it kept. That is the opposite of the first batch, where the badge was
cropped out because the page stamps the number itself in its own type. It means every picture
now shows the number twice: once in the client's badge and once in the page's stamp. Deliberate,
and theirs to change.

Run: python scripts/build_products.py
"""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"C:\Users\shadr\OneDrive\Pictures")
GALLERY_OUT = ROOT / "public" / "gallery"
DATA = ROOT / "src" / "lib" / "gallery.ts"
TILE_OUT = ROOT / "public" / "products"
PROOF = ROOT / ".impeccable"

# 720 for a 2x phone, 400 for the ~330px these actually render at on a 1x desktop. Both widths
# exist because a `sizes` attribute is ignored entirely when the srcset holds one URL with no
# width descriptor, which is what the first version shipped.
LONG_EDGE = 720
SMALL_EDGE = 400
TILE_EDGE = 900

FOLDERS = {
    "nylon": "nylon machieces",
    "mould": "moddle type",
    "coldroom": "cold room",
    "solar": "solar panel",
}

# The one photograph from each type that leads the homepage tile. Taken out of the catalogue,
# because the site's rule is that a picture appears once: a frame that leads a tile does not also
# sit in the gallery. Chosen for being the clearest statement of what the type is — nylon sleeves
# in an open trough, the mould grid with its lid up, a finished room with the door open.
TILES = {
    "nylon": "WhatsApp Image 2026-09-05 at 20.41.05.jpeg",
    "mould": "WhatsApp Image 2026-09-05 at 20.45.37.jpeg",
    "coldroom": "WhatsApp Image 2026-09-05 at 20.43.49.jpeg",
    "solar": "WhatsApp Image 2026-09-06 at 16.57.16.jpeg",
}

# Exact duplicates, found by difference hash across all three folders before anything was
# encoded: 1/64 and 2/64 apart from the frames kept. The client's instruction from the first
# batch stands — a photograph appears once.
DROP = {
    "WhatsApp Image 2026-09-05 at 20.41.04.jpeg",      # == 20.40.56
    "WhatsApp Image 2026-09-05 at 20.43.50 (1).jpeg",  # == 20.43.48 (1)
}


# What each frame shows, and the one piece of editorial judgement in this file. The group heading
# names the product line the client filed it under; a caption describes only what is actually in
# the picture. That is how the folders can be used exactly as named — their instruction — without
# any single caption claiming a drinks chiller is a nylon machine.
#
# Every one of these was checked against a contact sheet of the built frames — see
# scripts/caption_sheet.py, which stamps the caption onto the photograph it belongs to. Five were
# wrong on the first pass and only visible that way: one called a trough of soft drinks "a
# chiller", naming a product line the client had dropped; three called a man in a Koolink shirt a
# customer; and one counted four evaporators on a wall that has five. A caption is the one thing
# in the gallery no test can check, so it gets looked at rather than asserted.
CAPTIONS = {
    "20-40-55": "The same trough loaded with bottled drinks instead of sleeves.",
    "20-40-56": "An upright cabinet with its tray runners empty and the door open.",
    "20-40-57-1": "Finished cabinets in the yard with their condensers, waiting to go out.",
    "20-40-57": "The showroom, where mould type machines and steel moulds can be inspected.",
    "20-40-58": "A long red trough machine with the lid up and the sleeves inside.",
    "20-40-59-1": "Wrapped and checked in at the logistics counter for delivery.",
    "20-40-59": "A trough of finished blocks, ready to be lifted out.",
    "20-41-00": "A day's blocks bagged on the drying shelves, still dripping.",
    "20-41-01-1": "A compact mould type machine with a blue lid, standing on the yard pavers.",
    "20-41-01": "A red and white upright standing beside its condenser.",
    "20-41-02-1": "Bagging by hand from an open cabinet of finished blocks.",
    "20-41-02": "The door, insulated and carrying the Koolink plate.",
    "20-41-03-1": "A yellow lid raised over a trough of sleeves.",
    "20-41-03": "Blocks stacked across the cabinet shelves.",
    "20-41-05-1": "Nylon sleeves in the trough with the ice formed inside them.",
    "20-41-06-1": "A white upright open to its trays, condenser underneath.",
    "20-41-06": "Two of the team bagging from a trough of sleeves.",
    "20-41-07": "Reaching into an open cabinet for a bagged block.",
    "20-41-08": "A red trough machine part-way through assembly.",
    "20-45-38-1": "A finished block lifted clear of a blue mould machine.",
    "20-45-38": "A yellow mould machine on site with its lids open.",
    "20-45-39": "Wrapped on its pallet and ready for delivery.",
    "20-43-45": "A finished room wrapped for transport, door and hinges visible.",
    "20-43-47": "Inside a fitted room, the evaporator mounted over the door.",
    "20-43-48-1": "A room fitted out with shelving along both walls.",
    "20-43-48": "An empty room, floor laid and the evaporators run along the ceiling.",
    "20-43-49-1": "A large room with a row of evaporators along the far wall.",
    "20-43-50": "A room in use, stocked with pallets and crates.",
    "solar-roof-install": "A technician mounting solar panels on site.",
}

# The frame each group opens with. LeadAndGrid gives its first shot the full width of the shell,
# and PanoramaRows and AsymmetricTrio both put theirs top-left, so shots[0] is the largest
# photograph in its section and the one a reader sees first.
#
# Filename order chose them before this existed, which handed the nineteen-frame nylon section a
# trough full of Pepsi bottles as its hero — a real photograph of a real machine, but the one
# frame in the group that does not show ice. These three are the clearest picture of the product
# the heading names.
LEADS = {
    "nylon": "20-40-58",
    "mould": "20-41-01-1",
    "coldroom": "20-43-48-1",
    "solar": "solar-roof-install",
}

GROUPS = [
    ("nylon", "Nylon type machines",
     "Ice formed in nylon sleeves in an open trough, lifted out bagged and ready to sell."),
    ("mould", "Mould type machines",
     "Ice formed in a fixed grid of steel moulds, turned out as clean blocks."),
    ("coldroom", "Walk-in cold rooms",
     "Panelled, doored and fitted to the space you have, from one room to a store."),
    ("solar", "Solar panel types",
     "Monocrystalline solar panels and complete DC solar setups to power commercial cold operations."),
]


def slug_for(name: str) -> str:
    """A stable, URL-safe id from the WhatsApp filename's timestamp."""
    stem = (
        name.rsplit(".", 1)[0]
        .replace("WhatsApp Image 2026-09-05 at ", "")
        .replace("WhatsApp Image 2026-09-06 at ", "")
    )
    if stem.lower() == "jjj":
        return "solar-roof-install"
    return stem.replace(".", "-").replace(" ", "").replace("(", "-").replace(")", "")


def dims(path: Path) -> tuple[int, int]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)


def encode(source: Path, dest: Path, target: int, quality: int) -> tuple[int, int]:
    """Scale the long edge to `target` and write one file. No crop — see the module docstring."""
    w, h = dims(source)
    scale = min(1.0, target / max(w, h))
    out_w, out_h = max(2, round(w * scale) // 2 * 2), max(2, round(h * scale) // 2 * 2)
    args = (["-f", "avif", "-crf", str(quality)] if dest.suffix == ".avif"
            else ["-quality", str(quality)])
    result = subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(source),
         "-vf", f"scale={out_w}:{out_h}:flags=lanczos"] + args + ["-frames:v", "1", str(dest)],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise SystemExit(f"{dest.name} failed: {result.stderr.strip()[:200]}")
    return out_w, out_h


def sources(key: str) -> list[Path]:
    folder = SRC / FOLDERS[key]
    if not folder.is_dir():
        raise SystemExit(f"source folder missing: {folder}")
    return [
        p for p in sorted(folder.iterdir())
        if p.suffix.lower() in {".jpeg", ".jpg", ".png", ".webp"} and p.name not in DROP
    ]


def build() -> None:
    GALLERY_OUT.mkdir(parents=True, exist_ok=True)
    TILE_OUT.mkdir(parents=True, exist_ok=True)
    for stale in list(GALLERY_OUT.iterdir()) + list(TILE_OUT.iterdir()):
        stale.unlink()

    shots: list[dict] = []
    for key in FOLDERS:
        for f in sources(key):
            if f.name == TILES[key]:
                tw, th = encode(f, TILE_OUT / f"{key}.avif", TILE_EDGE, 32)
                encode(f, TILE_OUT / f"{key}.webp", TILE_EDGE, 80)
                print(f"  tile  {key:<9} -> {tw}x{th}")
                continue
            slug = slug_for(f.name)
            small_w, _ = encode(f, GALLERY_OUT / f"{slug}-400.avif", SMALL_EDGE, 34)
            encode(f, GALLERY_OUT / f"{slug}-400.webp", SMALL_EDGE, 78)
            big_w, big_h = encode(f, GALLERY_OUT / f"{slug}.avif", LONG_EDGE, 30)
            encode(f, GALLERY_OUT / f"{slug}.webp", LONG_EDGE, 82)
            kb = (GALLERY_OUT / f"{slug}.avif").stat().st_size // 1024
            shots.append({"slug": slug, "group": key, "width": big_w, "height": big_h,
                          "smallWidth": small_w, "source": f.name})
            print(f"  {slug:<14} {big_w}x{big_h} / {small_w}w   {kb} KB")

    PROOF.mkdir(exist_ok=True)
    (PROOF / "product-shots.json").write_text(json.dumps(shots, indent=2), encoding="utf-8")
    counts = {k: sum(1 for s in shots if s["group"] == k) for k in FOLDERS}
    print(f"\n{len(shots)} catalogue frames {counts}, 3 tiles")
    write_manifest(shots)


DOC_HEADER = """/**
 * Koolink's own photographs, the whole set.
 *
 * Generated by scripts/build_products.py — edit the CAPTIONS, GROUPS, LEADS and TILES there, not
 * this file. The three groups are the client's own folders and their own names for what they sell:
 * nylon type, mould type, cold room. No frame moves between groups, on their instruction, so a
 * group heading names the product line while each caption describes only what its own frame
 * actually shows.
 *
 * Within a group the order is the order they sent them, except that one named frame is hoisted to
 * the front. Every layout family gives its first shot the most room, so shots[0] is the picture
 * that has to carry the section, and filename order is no way to pick it.
 *
 * Nothing is cropped. Every frame carries Koolink's watermark in the top-left with their two
 * phone numbers, and they asked for it kept — so the page's own stamp is the second place the
 * number appears on each picture.
 *
 * `width` and `height` are the delivered pixel dimensions and exist so the page can reserve
 * space and never shift as images arrive.
 */

export type GalleryGroupId =
"""

DOC_TYPES = """
export type GalleryShot = {
  slug: string;
  group: GalleryGroupId;
  width: number;
  height: number;
  /** The narrow variant's width, for the srcset descriptor. */
  smallWidth: number;
  caption: string;
};

export const GALLERY_GROUPS: ReadonlyArray<{
  id: GalleryGroupId;
  title: string;
  blurb: string;
}> = [
"""


def write_manifest(shots: list[dict]) -> None:
    """Emit src/lib/gallery.ts.

    Generated rather than hand-kept, so the pixel dimensions in it are always the ones ffmpeg
    actually wrote — a manifest that disagrees with the files on disk reserves the wrong space
    and the page shifts as each picture lands.
    """
    built = {s["slug"] for s in shots}
    missing = sorted(s for s in built if s not in CAPTIONS)
    if missing:
        raise SystemExit(f"no caption for {missing}")
    stale = sorted(k for k in CAPTIONS if k not in built)
    if stale:
        raise SystemExit(f"caption for a frame that is no longer built: {stale}")
    for group, lead in LEADS.items():
        if lead not in built:
            raise SystemExit(f"lead frame {lead!r} for {group!r} was not built")

    out = [DOC_HEADER]
    out.append("\n".join(f"  | {group!r}" for group, _, _ in GROUPS).replace("'", "'") + "\n  ;\n")
    out.append(DOC_TYPES)
    for group, title, blurb in GROUPS:
        out.append(f"  {{ id: {group!r}, title: {title!r}, blurb: {blurb!r} }},\n")
    out.append("];\n\nexport const GALLERY: ReadonlyArray<GalleryShot> = [\n")
    for group, _, _ in GROUPS:
        # Lead first, then the rest in filename order, which for a WhatsApp export is the order
        # the client sent them in.
        members = [s for s in shots if s["group"] == group]
        members.sort(key=lambda s: (s["slug"] != LEADS.get(group), s["slug"]))
        for shot in members:
            out.append(
                f"  {{ slug: {shot['slug']!r}, group: {group!r}, width: {shot['width']}, "
                f"height: {shot['height']}, smallWidth: {shot['smallWidth']}, "
                f"caption: {CAPTIONS[shot['slug']]!r} }},\n"
            )
    out.append("];\n")
    DATA.write_text("".join(out), encoding="utf-8")
    print(f"{len(shots)} shots -> {DATA.relative_to(ROOT)}")


if __name__ == "__main__":
    # Editing a caption or a lead does not change a single pixel, and re-encoding 31 frames to
    # rewrite one string is slow enough that it discourages fixing the copy. `--manifest-only`
    # replays the last build's proof file instead.
    if "--manifest-only" in sys.argv:
        write_manifest(json.loads((PROOF / "product-shots.json").read_text(encoding="utf-8")))
    else:
        build()
