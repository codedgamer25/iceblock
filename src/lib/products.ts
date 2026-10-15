/**
 * What Koolink sells. Three product lines, which is the client's own list and their own names
 * for them: the two kinds of ice block machine they build, and the cold rooms.
 *
 * It was six. Drinks chillers, solar deep freezers and liquid chillers came off on the client's
 * instruction when they supplied a new photograph set covering these three — see
 * scripts/build_products.py for the folders. Nothing was dropped for want of a picture: the type
 * below handles a missing `image` on purpose, and a product with none renders a visibly empty
 * frame rather than borrowing a stock photograph of somebody else's machine. They were dropped
 * because the client said the site sells these three.
 *
 * There is no price field, and that is deliberate rather than unfinished: Koolink does not quote
 * online, so the type gives nowhere for a figure to be typed and every card ends at a call
 * instead. `tests/content.test.ts` fails the build if a naira figure appears anywhere on the page.
 *
 * `image` points at a photograph of that actual machine, supplied by Koolink and encoded by
 * scripts/build_products.py, which is also where the record of which frame leads which tile
 * lives. These crops keep Koolink's watermark badge — their phone numbers are in the corner of
 * every frame at the client's request, so the page's own stamp is the second place the number
 * appears on each picture.
 */

export type Product = {
  id: string;
  name: string;
  /** One line: what it is. */
  what: string;
  /** Who buys it, in their words where possible. */
  who: string;
  image?: string;
};

export const PRODUCTS: ReadonlyArray<Product> = [
  {
    id: 'nylon-type-machines',
    image: '/products/nylon.avif',
    name: 'Nylon type machines',
    what: 'Ice formed in nylon sleeves in an open trough, bagged as it comes out.',
    who: 'Anyone selling ice by the bag: markets, fish sellers, event suppliers, depots.',
  },
  {
    id: 'mould-type-machines',
    image: '/products/mould.avif',
    name: 'Mould type machines',
    what: 'Ice formed in a fixed grid of steel moulds, turned out as clean blocks.',
    who: 'Operations that want a consistent block: hotels, cold chain, larger ice sellers.',
  },
  {
    id: 'walk-in-cold-rooms',
    image: '/products/coldroom.avif',
    name: 'Walk-in cold rooms',
    what: 'Panelled, doored and fitted to the space you have, from one room to a store.',
    who: 'Anyone storing what would otherwise spoil: farms, restaurants, pharmacies, traders.',
  },
  {
    id: 'solar-panel-types',
    image: '/products/solar.avif',
    name: 'Solar panel types',
    what: 'Monocrystalline solar panels and complete DC solar systems to power cold operations.',
    who: 'Cold room and ice block businesses needing uninterrupted 24/7 off-grid solar power without generator fuel costs.',
  },
];

/**
 * Said out loud on the page, because a four-line product list invites the question. Koolink
 * builds and installs more than this; these are the lines they asked to lead with.
 */
export const PRODUCTS_NOTE =
  'We build and install more than the products above, and we fabricate to a size you specify. Tell us what you need to freeze and we will tell you what it takes.';
