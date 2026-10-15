/**
 * Everything about the business that a person — not a developer — might need to
 * change. If you only ever edit one file in this project, this is the one.
 *
 * Every value here came from Koolink's own words. Nothing about capacity, lifespan,
 * power rating or price is inferred: where a figure was not given it is absent
 * rather than estimated, because this is a page a customer will hold you to.
 */

/** Both published numbers. The first is the one every button uses. */
export const PHONE_E164 = '+2348022689722';
export const PHONE_DISPLAY = '0802 268 9722';

export const PHONE_ALT_E164 = '+2348060324015';
export const PHONE_ALT_DISPLAY = '0806 032 4015';

/** wa.me wants the number with no plus and no spaces. Derived, never retyped. */
export const WHATSAPP_NUMBER = PHONE_E164.replace(/[^\d]/g, '');

/**
 * Set NEXT_PUBLIC_SITE_URL to the live domain before deploying — canonical URLs,
 * the sitemap, robots.txt and the WhatsApp link preview are all built from it.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3500').replace(
  /\/$/,
  '',
);

export const BUSINESS = {
  name: 'Koolink',
  legalName: 'Koolink Nigeria Limited',
  motto: 'Quality, Efficiency and Durability.',
  /* Assembled from their own product list rather than written as marketing copy. */
  summary:
    'Koolink Nigeria Limited. Non solar and full solar walk-in coldrooms, ice block machines, ice drinks chiller machines, solar deep freezers, domestic cold storages and liquid chillers. Professionals with over 25 years of experience.',
  yearsExperience: 25,
  rcNumber: 'RC 950910',
  areaServed: 'Nigeria',
  deliveryNote: 'We deliver anywhere in Nigeria.',
  bookingChannels: ['WhatsApp', 'Phone call'],
} as const;

/**
 * Koolink does not quote online — their words: "we don't disclose or discuss prices
 * online". The site is built so there is nowhere for a price to be typed, and the
 * content test asserts that no page renders a naira figure. Every product ends at
 * a conversation instead.
 */
export const PRICES_ARE_OFFLINE = true;

/** Their standing advice to customers, and it belongs on the page. */
export const PAYMENT_ADVICE =
  'Visit our office, or send someone, before making any payment.';

export type Office = { label: string; address: string };

/** Verbatim from Koolink. Do not tidy the spelling of an address. */
export const OFFICES: ReadonlyArray<Office> = [
  {
    label: 'Head office & factory',
    address: 'No 5, Umukoro Street, Ilupeju, Yewande/Giwa, Ogun State',
  },
  {
    label: 'Lagos',
    address: '35, Adebisi Shopping Complex, beside Domino Pizza, Abule Egba, Lagos',
  },
  {
    label: 'Abuja',
    address:
      'Shop 2, Block 45, Dutse-Pe Model Market by Army Scheme, Kubwa Extension III, FCT Abuja',
  },
  {
    label: 'Port Harcourt',
    address:
      'Shop 4, Azubuike Plaza, Rumousi by flyover bridge, East West Road, Port Harcourt, Rivers State',
  },
];

/**
 * Handles as Koolink wrote them. A `href` is only filled in where the handle maps
 * unambiguously to a URL — the rest are page names with spaces, and guessing a URL
 * for those risks sending customers to somebody else's page. Add the real links and
 * they light up automatically.
 */
export type Social = { platform: string; handle: string; href?: string };

export const SOCIAL_LINKS: ReadonlyArray<Social> = [
  { platform: 'Instagram', handle: 'Koolinkcoldrooms', href: 'https://instagram.com/koolinkcoldrooms' },
  { platform: 'Facebook', handle: 'Koolink Nigeria Limited' },
  { platform: 'YouTube', handle: 'Koolink Nigeria Limited' },
  { platform: 'TikTok', handle: 'Koolink iceblock Machines' },
];

/** A Nigerian mobile in international form: +234, then 7/8/9, then nine digits. */
export const NIGERIAN_MOBILE = /^\+234[789]\d{9}$/;

export const isContactConfigured = () =>
  NIGERIAN_MOBILE.test(PHONE_E164) && NIGERIAN_MOBILE.test(PHONE_ALT_E164);
