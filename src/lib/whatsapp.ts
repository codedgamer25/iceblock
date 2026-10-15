import { BUSINESS, PHONE_ALT_E164, PHONE_E164, SITE_URL, WHATSAPP_NUMBER } from './business';

/**
 * Every call-to-action on the site ends up here.
 *
 * There is no server, no database and no form to submit — and no login, which was
 * an explicit requirement. An enquiry is a WhatsApp message the customer can read
 * and edit before they send it. That is the whole transport layer, and it is why
 * the site can be hosted anywhere for nothing.
 *
 * `wa.me` takes the number with no `+` and the text URL-encoded. Encoding happens
 * once, here, because a raw `&` or `#` in a place name would otherwise silently
 * truncate the message.
 */

export type Enquiry = {
  /** Which product they tapped. */
  product?: string;
  /**
   * The picture they were looking at, as a site-root path like `/gallery/01-45-26.avif`.
   *
   * It goes into the message as an absolute URL, which is the closest thing to attaching
   * it that the platform allows. `wa.me` carries text and nothing else: there is no
   * parameter for a file, and no amount of encoding adds one. What a URL on its own line
   * does get you is WhatsApp fetching it and rendering a preview, so the message arrives
   * with the photograph visible above the words and one tap opens it full size.
   *
   * The alternative was `navigator.share` with a real File, which genuinely attaches the
   * image — and loses the thing that makes this work at all. Web Share hands off to the OS
   * sheet, so the customer picks an app and then picks a contact, and Koolink is not in
   * their contacts. Trading a pre-addressed, pre-filled chat for a real attachment would
   * cost more enquiries than the attachment is worth.
   */
  image?: string;
  /** Nylon or mould, if they got that far. */
  machineType?: string;
  /** Full solar, solar friendly, or mains. */
  power?: string;
  /** Once, twice or three times daily. */
  cycle?: string;
  /** How many blocks a day they need. */
  capacity?: string;
  /** Where it is going. */
  location?: string;
};

export const GENERAL_ENQUIRY = `Hello ${BUSINESS.legalName}, I would like to ask about your machines.`;

export function whatsappLink(message: string = GENERAL_ENQUIRY): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function telLink(alternate = false): string {
  return `tel:${alternate ? PHONE_ALT_E164 : PHONE_E164}`;
}

/**
 * Builds the message a "Book now" button hands to WhatsApp. Empty fields are left
 * out entirely rather than sent as "Power: " — a half-specified enquiry should still
 * read like a person wrote it.
 *
 * Note what is never in here: a price. Koolink quotes on the phone, so the message
 * asks about the machine and lets them answer.
 */
export function enquiryMessage(draft: Enquiry): string {
  const lines: string[] = [`Hello ${BUSINESS.legalName},`];

  if (draft.product) {
    lines.push(`I am interested in your ${draft.product.toLowerCase()}.`);
  } else {
    lines.push('I am interested in your machines.');
  }

  const add = (label: string, value?: string) => {
    const trimmed = value?.trim();
    if (trimmed) lines.push(`${label}: ${trimmed}`);
  };

  add('Machine type', draft.machineType);
  add('Power', draft.power);
  add('Production', draft.cycle);
  add('Capacity needed', draft.capacity);
  add('Location', draft.location);

  /* The picture, on its own line and absolute, so WhatsApp previews it. It sits above the
     closing sentence rather than at the very end because a preview card is easier to read
     when the sentence after it tells you what to do with it. Relative paths are useless
     here: the message leaves the site, so `SITE_URL` has to be a real origin, which is why
     NEXT_PUBLIC_SITE_URL matters beyond canonical tags. */
  if (draft.image) {
    /* Forced to WebP even when the caller hands over the AVIF path. Every image on this site
       is written in both formats, and the one that matters here is whichever WhatsApp's link
       scraper can actually decode — AVIF support in preview fetchers is patchy, and a preview
       that fails silently degrades this from "the picture is in the message" to a bare URL,
       which is the whole feature gone. WebP is decoded everywhere that matters. */
    const preview = draft.image.replace(/\.avif$/, '.webp');
    lines.push('', 'This is the one I am looking at:', `${SITE_URL}${preview}`);
  }

  lines.push('', 'Please send me the details and the price.');
  return lines.join('\n');
}
