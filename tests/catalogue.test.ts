import { describe, expect, it } from 'vitest';
import { CATALOGUE, catalogueFilterFromHash } from '@/lib/catalogue';
import { GALLERY, GALLERY_GROUPS } from '@/lib/gallery';
import { PRODUCTS } from '@/lib/products';
import { enquiryMessage } from '@/lib/whatsapp';

describe('product catalogue navigation', () => {
  it('preserves every current product and photograph exactly once', () => {
    expect(CATALOGUE.map((group) => group.product.id).sort()).toEqual(
      PRODUCTS.map((product) => product.id).sort(),
    );
    const shots = CATALOGUE.flatMap((group) => group.shots);
    expect(shots).toEqual(GALLERY);
    expect(new Set(shots.map((shot) => shot.slug)).size).toBe(GALLERY.length);
  });

  it('resolves existing category deep links and falls back for unknown hashes', () => {
    for (const group of GALLERY_GROUPS)
      expect(catalogueFilterFromHash(`#${group.id}`)).toBe(group.id);
    for (const hash of ['', '#catalogue', '#missing', '#%broken'])
      expect(catalogueFilterFromHash(hash)).toBe('all');
  });

  it('keeps the selected machine and photograph in booking messages', () => {
    for (const group of CATALOGUE) {
      for (const shot of group.shots) {
        const message = enquiryMessage({
          product: group.title,
          image: `/gallery/${shot.slug}.webp`,
        });
        expect(message).toContain(group.title.toLowerCase());
        expect(message).toContain(`/gallery/${shot.slug}.webp`);
      }
    }
  });
});
