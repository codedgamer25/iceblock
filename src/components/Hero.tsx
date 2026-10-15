import { Reveal } from '@/components/Reveal';
import { SectionBackground } from '@/components/SectionBackground';
import { SplitText } from '@/components/SplitText';
import { BUSINESS, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

/**
 * Two layers leaving at different rates over the same scroll range, which is the
 * reference site's hero move rebuilt on our own runtime: the photograph grows
 * (their `Bg Scale`, 1 → 1.2 from 40%) while the copy lifts away from it (their
 * heading at -15em). Depth without a single 3D transform.
 *
 * The bed is a supplied composite: a commercial ice machine on a frozen plain with the
 * left half falling away into deep blue, which is where the copy sits. Measured before it
 * was committed to — the headline region reads 6.88:1 for frost text at the stock scrim,
 * against 4.00:1 with no scrim at all, so the scrim is load-bearing here rather than
 * decorative. The portrait crop is the left 768px only: measured across the frame, anything
 * further right than x=120 pulls the mountains and ice into the copy region and drops it
 * under AA on a phone, where the headline spans the whole width instead of half of it.
 */
export function Hero() {
  return (
    <section
      className="theme-deep relative overflow-hidden pb-v-space pt-[calc(var(--header-height)+var(--v-space-sm))]"
      data-invert
    >
      <SectionBackground
        name="hero"
        alt="A commercial ice machine on a frozen plain, cube ice stacked beside it, under a deep blue sky."
        priority
      />

      <div className="parallax depth-near relative" data-parallax>
        <Reveal className="shell flex flex-col items-start">
          {/* No eyebrow. The motto was here and wrapped onto two lines at 375px, which is one
              line more than a label is allowed, and a heading that opens with "Welcome to" does
              not need anything introducing it. The motto now heads the section that argues for
              it, where it also cut a 1440ms split reveal down to 660ms. */}
          <SplitText
            as="h1"
            className="h1 mt-5 max-w-[20ch]"
            text={`Welcome to ${BUSINESS.legalName}.`}
          />

          {/* Full-strength ink, not the muted tone, and the phone is why. The portrait bed puts
              the mountain line and the top of the machine directly behind this paragraph, where
              the top-heavy scrim has already eased off to about 0.7 so the machine stays
              visible. Haze measured 3.24:1 there. Frost measures 5.98:1 over the same pixels,
              and this is the sentence that says what the company is, so whispering it was never
              the right call anyway. */}
          <p className="lead mt-6 max-w-[54ch]" style={{ color: 'var(--text)' }}>
            We are professionals with over {BUSINESS.yearsExperience} years of experience, and we
            know the challenges and exactly what the user needs.
          </p>

          <div
            className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            data-hero-cta
          >
            {isContactConfigured() ? (
              <>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                >
                  Book now on WhatsApp
                </a>
                <a href={telLink()} className="button secondary numeral">
                  {PHONE_DISPLAY}
                </a>
              </>
            ) : (
              <p className="body-small text-subtle">
                The numbers in business.ts are not valid Nigerian mobiles, so nothing here dials
                anybody yet.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
