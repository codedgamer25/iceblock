import { GALLERY, GALLERY_GROUPS, type GalleryGroupId } from './gallery';
import { PRODUCTS } from './products';

export const CATALOGUE_DETAILS: Record<
  GalleryGroupId,
  { label: string; productId: string }
> = {
  nylon: { label: 'Nylon machines', productId: 'nylon-type-machines' },
  mould: { label: 'Mould machines', productId: 'mould-type-machines' },
  coldroom: { label: 'Cold rooms', productId: 'walk-in-cold-rooms' },
  solar: { label: 'Solar systems', productId: 'solar-panel-types' },
};

export const CATALOGUE = GALLERY_GROUPS.map((group) => ({
  ...group,
  ...CATALOGUE_DETAILS[group.id],
  product: PRODUCTS.find(
    (product) => product.id === CATALOGUE_DETAILS[group.id].productId,
  )!,
  shots: GALLERY.filter((shot) => shot.group === group.id),
}));

export type CatalogueFilter = GalleryGroupId | 'all';

export function catalogueFilterFromHash(hash: string): CatalogueFilter {
  const id = hash.replace(/^#/, '');
  return GALLERY_GROUPS.some((group) => group.id === id)
    ? (id as GalleryGroupId)
    : 'all';
}
