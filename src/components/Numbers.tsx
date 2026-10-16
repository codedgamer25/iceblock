import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { BUSINESS, OFFICES } from '@/lib/business';
import { CAPACITY } from '@/lib/machines';

/**
 * The numbers band, and the one section on the page laid out as an editorial spread
 * rather than a grid of boxes.
 *
 * That is deliberate. An audit of the finished page found nine of eleven sections with
 * the identical shape — eyebrow, 52px heading, optional lead, grid of bordered cards —
 * and uniform repetition is what makes a site read as templated however good each part
 * is. This section breaks the pattern: an asymmetric split, one figure per row against
 * a hairline, and numerals at display scale doing the work a heading would normally do.
 *
 * Every figure is Koolink's own, and two are derived rather than typed: the office
 * count comes from the office list and the capacity from the machine data, so neither
 * can drift out of step with the rest of the site.
 */
const FIGURES: ReadonlyArray<{ value: string; unit: string; label: string }> = [
  {
    value: String(BUSINESS.yearsExperience),
    unit: 'years',
    label: 'We know the challenges and exactly what the user needs.',
  },
  {
    value: `${CAPACITY.to}+`,
    unit: 'blocks a day',
    label: `Various capacities and sizes, ranging from ${CAPACITY.from} blocks to over ${CAPACITY.to} blocks.`,
  },
  {
    value: '30',
    unit: 'years',
    label: 'The body has a lifespan of over 30 years. The solar system can be up to 15 years or more if well maintained.',
  },
  {
    value: String(OFFICES.length),
    unit: 'offices',
    label: 'Head office and factory in Ogun State, with offices in Lagos, Abuja and Port Harcourt.',
  },
];

export function Numbers() {
  return (
    <section id="numbers" className="theme-glacier py-v-space">
      <div className="shell grid gap-x-gutter gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SplitText
            as="h2"
            className="h-display mt-5 max-w-[12ch]"
            text="21 to over 500 blocks."
          />
        </Reveal>

        <div className="lg:col-span-8">
          {FIGURES.map((figure, index) => (
            <Reveal key={figure.unit + figure.value} className="figure-row" delay={index}>
              <p className="figure-value">
                {figure.value}
                <span className="eyebrow ml-3 align-super" style={{ color: 'var(--accent)' }}>
                  {figure.unit}
                </span>
              </p>
              <p className="lead max-w-[42ch]">{figure.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
