import { GALLERY_GROUPS } from './gallery';
import { PRODUCTS } from './products';

/**
 * The slide-out menu, as data.
 *
 * Every child link points at its own anchor. That sounds obvious and it is the whole
 * point of this file being rewritten: the first version listed six products that all
 * linked to `/#products`, so six menu entries did the same thing. A menu that lies
 * about where it goes is worse than a shorter menu.
 *
 * Product anchors are namespaced `product-` because a product id and a section id can
 * collide — `ice-block-machines` is the section explaining how to specify a machine, and a
 * explains how to specify one.
 *
 * Two kinds of link live here now. On-page anchors are written `/#id` and are what
 * NAV_TARGETS collects for the "you are here" mark. Cross-page links to /products are
 * plain routes, and the gallery's own section ids give the menu somewhere specific to
 * land rather than dropping a reader at the top of a page of twenty-eight photographs.
 */

export type NavChild = { label: string; href: string };
export type NavGroup = { id: string; label: string; href?: string; children?: NavChild[] };

export const NAV_GROUPS: ReadonlyArray<NavGroup> = [
  {
    id: 'products',
    label: 'Products',
    children: PRODUCTS.map((product) => ({
      label: product.name,
      href: `/#product-${product.id}`,
    })),
  },
  {
    id: 'gallery',
    label: 'What we have built',
    children: [
      { label: 'Every machine, all photographs', href: '/products' },
      ...GALLERY_GROUPS.map((group) => ({
        label: group.title,
        href: `/products#${group.id}`,
      })),
    ],
  },
  {
    id: 'machines',
    label: 'Ice blocks',
    children: [
      { label: 'Nylon or mould type', href: '/#machine-type' },
      { label: 'Solar, solar friendly, mains', href: '/#machine-power' },
      { label: 'Once, twice, three times daily', href: '/#machine-cycle' },
      { label: '21 to over 500 blocks a day', href: '/#machine-capacity' },
    ],
  },
  {
    id: 'company',
    label: 'Why Koolink',
    children: [
      { label: 'Quality, Efficiency, Durability', href: '/#why-us' },
      { label: 'By the numbers', href: '/#numbers' },
      { label: 'Watch the machines running', href: '/#videos' },
    ],
  },
  {
    id: 'buying',
    label: 'Where to find us',
    children: [
      { label: 'Our four offices', href: '/#offices' },
    ],
  },
];

/**
 * Every same-page anchor the menu can reach, for the "you are here" mark and for the test
 * that fails if a menu entry points at an id no section carries. Cross-page routes are
 * excluded on purpose: their targets live in another document, so the homepage cannot be
 * asked to contain them.
 */
export const NAV_TARGETS: ReadonlyArray<string> = NAV_GROUPS.flatMap((group) =>
  group.children ? group.children.map((child) => child.href) : [],
)
  .concat(NAV_GROUPS.filter((group) => group.href).map((group) => group.href!))
  .filter((href) => href.startsWith('/#'))
  .map((href) => href.replace('/#', ''));
