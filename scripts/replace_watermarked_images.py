"""Batch replace site images with the new watermarked versions from C:\\Users\\HP\\Documents\\watermark\\watermark.

Generates:
- public/products/*.{webp,avif} (long edge 900)
- public/gallery/*.{webp,avif} (long edge 720)
- public/gallery/*-400.{webp,avif} (long edge 400)
Updates src/lib/gallery.ts with the exact dimensions.
"""

from pathlib import Path
from PIL import Image
import re

ROOT = Path(__file__).resolve().parent.parent
WM_DIR = Path(r"C:\Users\HP\Documents\watermark\watermark")
PRODUCTS_DIR = ROOT / "public" / "products"
GALLERY_DIR = ROOT / "public" / "gallery"
GALLERY_TS = ROOT / "src" / "lib" / "gallery.ts"

# 1. Product tile replacements
PRODUCT_REPLACEMENTS = {
    "coldroom": "WhatsApp Image 2026-10-15 at 9.34.18 AM (1).jpeg",
    "solar": "WhatsApp Image 2026-10-15 at 9.34.20 AM.jpeg",
    "mould": "WhatsApp Image 2026-10-15 at 9.34.17 AM (1).jpeg",
    "nylon": "WhatsApp Image 2026-10-15 at 9.34.19 AM (3).jpeg",
}

# 2. Gallery shot replacements (slug -> filename, optional crop box)
GALLERY_REPLACEMENTS = {
    "20-40-55": ("WhatsApp Image 2026-10-15 at 9.34.14 AM (2).jpeg", None),
    "20-40-56": ("WhatsApp Image 2026-10-15 at 9.34.11 AM (1).jpeg", None),
    "20-40-57": ("WhatsApp Image 2026-10-15 at 9.34.00 AM (1).jpeg", None),
    "20-40-57-1": ("WhatsApp Image 2026-10-15 at 9.34.12 AM.jpeg", None),
    "20-40-58": ("WhatsApp Image 2026-10-15 at 9.34.13 AM (3).jpeg", None),
    "20-40-59-1": ("WhatsApp Image 2026-10-15 at 9.34.19 AM.jpeg", (0, 122, 486, 726)),
    "20-41-00": ("WhatsApp Image 2026-10-15 at 9.34.19 AM (2).jpeg", None),
    "20-41-01-1": ("WhatsApp Image 2026-10-15 at 9.34.16 AM (1).jpeg", None),
    "20-41-02": ("WhatsApp Image 2026-10-15 at 9.34.16 AM.jpeg", None),
    "20-41-02-1": ("WhatsApp Image 2026-10-15 at 9.34.13 AM (2).jpeg", None),
    "20-41-03-1": ("WhatsApp Image 2026-10-15 at 9.34.01 AM.jpeg", None),
    "20-41-05-1": ("WhatsApp Image 2026-10-15 at 9.34.14 AM (1).jpeg", None),
    "20-41-06": ("WhatsApp Image 2026-10-15 at 9.34.14 AM.jpeg", None),
    "20-41-06-1": ("WhatsApp Image 2026-10-15 at 9.34.10 AM.jpeg", None),
    "20-41-07": ("WhatsApp Image 2026-10-15 at 9.34.13 AM (1).jpeg", None),
    "20-41-08": ("WhatsApp Image 2026-10-15 at 9.34.10 AM (1).jpeg", None),
    "20-43-45": ("WhatsApp Image 2026-10-15 at 9.34.11 AM.jpeg", None),
    "20-43-48-1": ("WhatsApp Image 2026-10-15 at 9.34.18 AM.jpeg", None),
    "20-43-49-1": ("WhatsApp Image 2026-10-15 at 9.34.17 AM (3).jpeg", None),
    "20-43-50": ("WhatsApp Image 2026-10-15 at 9.34.17 AM (4).jpeg", None),
    "solar-roof-install": ("WhatsApp Image 2026-10-15 at 9.34.19 AM (4).jpeg", None),
}


def scale_dimensions(w: int, h: int, target_long_edge: int) -> tuple[int, int]:
    scale = min(1.0, target_long_edge / max(w, h))
    out_w = max(2, round(w * scale) // 2 * 2)
    out_h = max(2, round(h * scale) // 2 * 2)
    return out_w, out_h


def process_products():
    print("Processing products...")
    for prod_name, wm_filename in PRODUCT_REPLACEMENTS.items():
        src_path = WM_DIR / wm_filename
        with Image.open(src_path) as im:
            im = im.convert("RGB")
            w, h = im.size
            out_w, out_h = scale_dimensions(w, h, 900)
            resized = im.resize((out_w, out_h), Image.Resampling.LANCZOS)
            webp_dest = PRODUCTS_DIR / f"{prod_name}.webp"
            avif_dest = PRODUCTS_DIR / f"{prod_name}.avif"
            resized.save(webp_dest, "WEBP", quality=82)
            resized.save(avif_dest, "AVIF", quality=75)
            print(f"  product {prod_name:<10} -> {out_w}x{out_h}")


def process_gallery() -> dict[str, tuple[int, int, int]]:
    print("Processing gallery...")
    new_dims = {}
    for slug, (wm_filename, crop_box) in GALLERY_REPLACEMENTS.items():
        src_path = WM_DIR / wm_filename
        with Image.open(src_path) as im:
            im = im.convert("RGB")
            if crop_box:
                im = im.crop(crop_box)
            w, h = im.size

            # Wide variant (720 max)
            w720, h720 = scale_dimensions(w, h, 720)
            im_720 = im.resize((w720, h720), Image.Resampling.LANCZOS)
            im_720.save(GALLERY_DIR / f"{slug}.webp", "WEBP", quality=82)
            im_720.save(GALLERY_DIR / f"{slug}.avif", "AVIF", quality=75)

            # Narrow variant (400 max)
            w400, h400 = scale_dimensions(w, h, 400)
            im_400 = im.resize((w400, h400), Image.Resampling.LANCZOS)
            im_400.save(GALLERY_DIR / f"{slug}-400.webp", "WEBP", quality=80)
            im_400.save(GALLERY_DIR / f"{slug}-400.avif", "AVIF", quality=72)

            new_dims[slug] = (w720, h720, w400)
            print(f"  gallery {slug:<20} -> {w720}x{h720} (smallWidth: {w400})")
    return new_dims


def update_gallery_ts(new_dims: dict[str, tuple[int, int, int]]):
    print("Updating src/lib/gallery.ts...")
    content = GALLERY_TS.read_text(encoding="utf-8")

    for slug, (w, h, sw) in new_dims.items():
        # Replace width, height, smallWidth for slug
        # Pattern: { slug: '20-40-58', group: 'nylon', width: 676, height: 720, smallWidth: 374, caption: ...
        pattern = rf"(\{{\s*slug:\s*'{re.escape(slug)}',\s*group:\s*'[^']+',\s*)width:\s*\d+,\s*height:\s*\d+,\s*smallWidth:\s*\d+,"
        replacement = rf"\g<1>width: {w}, height: {h}, smallWidth: {sw},"
        content = re.sub(pattern, replacement, content)

    GALLERY_TS.write_text(content, encoding="utf-8")
    print("src/lib/gallery.ts updated.")


if __name__ == "__main__":
    process_products()
    new_dims = process_gallery()
    update_gallery_ts(new_dims)
    print("All images successfully replaced and manifest updated.")
