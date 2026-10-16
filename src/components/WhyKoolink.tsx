import { Reveal } from '@/components/Reveal';
import { BUSINESS } from '@/lib/business';
import { SplitText } from '@/components/SplitText';
import { DURABILITY } from '@/lib/machines';

/**
 * The argument for buying from Koolink rather than from whoever is cheapest this
 * week — which is the argument they make themselves, so it is made in their figures
 * and their words: fifteen years on the solar, thirty on the body, lithium because
 * of what it is, and a straight comparison against the converted domestic freezers
 * being sold as commercial machines.
 *
 * Deliberately not a grid of icons. These are claims a customer will hold them to,
 * so each one gets room to be read.
 */
export function WhyKoolink() {
  return (
    <section id="why-us" className="theme-deep py-v-space" data-invert>
      <Reveal className="shell">
        {/* The motto is the heading and their affordability sentence is the paragraph under it.
            The sentence was the heading, which put ninety-six characters at 52px: seven lines
            on a phone, and 1440ms for a per-character reveal that scales with length. A
            sentence that long is a paragraph however it is set. */}
        <SplitText as="h2" className="h2 max-w-[24ch]" text={BUSINESS.motto} />
        <p className="lead mt-5 max-w-[58ch]">
          It is better to use high-quality, efficient, durable materials and products than to do
          otherwise in the name of affordability.
        </p>
      </Reveal>

      <Reveal className="shell mt-12 grid gap-x-gutter gap-y-10 md:grid-cols-2" delay={1}>
        {DURABILITY.map((item) => (
          <div
            key={item.heading}
            className="border-t pt-6 flex flex-col gap-3"
            style={{ borderColor: 'var(--rule)' }}
          >
            <h3 className="h3 max-w-[22ch]">{item.heading}</h3>
            <p className="lead max-w-[52ch]">{item.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
