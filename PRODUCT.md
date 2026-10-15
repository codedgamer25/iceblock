# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Nigerian business owners buying a refrigeration machine that a business depends on. Ice
block traders, frozen food sellers, bars and lounges, bakeries, farm produce handlers,
pharmacies. They are procurement-minded and price-sensitive, and they arrive suspicious
of being scammed: the category is full of sellers who take a deposit and vanish, or
deliver a machine that dies within the year. The buyer is usually specifying the purchase
and paying for it personally, not routing it through a procurement department.

Their job: work out which machine and what size fits what they are cooling, satisfy
themselves the seller is real, and reach a human who can price it.

## Product Purpose

Koolink Nigeria Limited builds and supplies commercial refrigeration. The site leads with
four lines, updated on the client's instruction of 2026-09-07: **nylon type ice block machines,
mould type ice block machines, walk-in cold rooms, solar panel types.**

It previously listed six — the three refrigeration lines above plus ice drinks chiller machines,
solar deep freezers, domestic cold storages and liquid chillers. In 2026-09-07 the client added
dedicated solar panel types with real photographs of solar panel setups and roof installations.
They still build custom sizes; the copy says so in one line rather than pretending the list is exhaustive.

The site turns an unqualified visitor into a phone or WhatsApp conversation with enough
of the specification already settled that the call is short. Success is a contact from
someone who already knows the machine type, power option and capacity band they need. It
is not a lead form, a catalogue, or a store.

## Positioning

Koolink manufactures rather than imports, and specifies every machine solar-first: each
line comes as full solar (DC 24/48V, self-powered, lithium batteries and
panels included brand new), solar-friendly DC 48V, or non-solar AC 220-240V. In a market
where grid power decides whether a cold business can run at all, the solar variant is the
product rather than an upsell.

Twenty-five years of trading and four offices a customer can walk into are the second
half of the position, and in this category the harder half to copy.

## Operating Context

The purchase ends in a phone call whatever the website does. Koolink does not quote
online; their words are "we don't disclose or discuss prices online". A specification is
priced verbally, against the exact machine type, power option, production cycle and
capacity.

Koolink's own standing advice to customers is to visit an office, or send someone, before
making any payment. The site repeats that advice rather than working around it.

Machines are delivered anywhere in Nigeria with an operational manual, and on solar
builds every solar component is new.

Ice block machines specifically: nylon type or mould type; produce once, twice or three
times daily; capacity from 21 blocks a day to over 500.

## Capabilities and Constraints

- **No prices, anywhere, in any form.** Client instruction, enforced mechanically:
  `tests/content.test.ts` fails if a naira figure appears anywhere under `src/`.
- **No accounts and no login.** Explicitly ruled out by the client.
- **No forms and no cart.** The two contact channels are WhatsApp and a phone call. Both
  published numbers are real: 0802 268 9722 (primary, used by every button) and
  0806 032 4015.
- Client instruction: the phone number appears on every product picture, and every
  picture carries a "Book now" action that opens WhatsApp.
- Responsive behavior is a stated client requirement ("flexible"), not an assumption.
- Terminology to keep: "ice block machine" (not ice maker), "coldroom" as one word,
  "nylon type" and "mould type", "full solar" / "solar-friendly" / "non-solar".
- Undecided: Facebook, YouTube and TikTok page URLs. The handles are page names
  containing spaces, so no URL can be derived; they render unlinked until Koolink
  supplies the real ones.
- Undecided: canonical domain. `NEXT_PUBLIC_SITE_URL` is unset, so canonical URLs, the
  sitemap and link previews currently build from localhost.

## Brand Commitments

- Name: **Koolink**, legal entity Koolink Nigeria Limited. Confirmed 2026-08-30.
- The "ICE BLOCK" asset sheet supplied earlier is a look-and-feel reference only. Its
  starburst mark and wordmark are not the brand and do not appear on the site.
- Motto: "Quality, Efficiency and Durability."
- Voice: plain, specific, unhedged. Numbers where numbers are known, silence where they
  are not. No superlative standing in for a specification.
- Every figure on the site comes from Koolink's own words. Where a figure was not given it
  is absent rather than estimated, because a customer will hold them to it.
  `src/lib/business.ts` is the one file a non-developer edits.

## Evidence on Hand

- Four verbatim office addresses, including the Ogun head office and factory
  (`src/lib/business.ts`).
- 25 years in business. Client-stated.
- Machine specification data: types, power options, production cycles, capacity range
  (`src/lib/machines.ts`).
- Real product photography, supplied by Koolink across four folders sorted by product type
  (`~/OneDrive/Pictures/{nylon machieces, moddle type, cold room, solar panel}`).
  **29 are published** at `/products` in four groups, and four more carry the homepage tiles.
  Two duplicates were dropped from the earlier batch.

  Nothing is cropped: every frame carries Koolink's badge and phone numbers in the **top-left**
  corner and the client explicitly instructed for the logo and numbers to stay visible. On the
  homepage product tiles, `.product-photo > img` uses `object-position: top left` to ensure the
  watermark badge remains completely in frame on every device.

  Note for whoever writes copy against these: the folders are the client's own grouping, not a
  subject index. Group headings carry the client's product name; captions describe only what is in
  the frame. Do not write a caption that turns a folder name into a claim about a picture.
  Real solar panel equipment and roof installations are pictured in the solar panel group.
- CAC registration exists and may be published. **The number itself has not been supplied
  and must not be invented.**
- Logo file not supplied. `src/components/KoolinkLogo.tsx` is a drawn stand-in.
- Absent, and not to be fabricated: testimonials, named customers, client logos,
  installation counts, warranty terms, standards certifications, benchmarks, prices.

## Product Principles

1. **The call is the product.** Judge a surface by whether it shortens the conversation
   that follows it, not by whether it holds attention.
2. **A specification beats an adjective.** The buyer is choosing between machines; give
   them the axes they actually choose on: type, power, cycle, capacity.
3. **Earn trust with things that can be checked.** Addresses, years, a registration
   number, an invitation to come and see it. Not assertions about quality.
4. **Solar is the position, not a feature.** Power is the constraint on the whole business
   the machine serves.
5. **Never fill a gap with an invention.** An absent figure stays absent.

## Accessibility & Inclusion

Mobile-first Nigerian traffic on constrained data and mid-range Android devices. The
contact path must work with nothing more than a link, and no affordance may depend on
hover.

