import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { isContactConfigured } from '@/lib/business';
import { CAPACITY, MACHINE_TYPES, POWER_OPTIONS, PRODUCTION_CYCLES } from '@/lib/machines';
import { enquiryMessage, whatsappLink } from '@/lib/whatsapp';

/* Their own words for each group. The leads that used to sit under these headings were
   mine and said nothing the rows below did not already say. */
const GROUPS = [
  { id: 'type', label: 'Two types', choices: MACHINE_TYPES },
  { id: 'power', label: 'Non solar and full solar', choices: POWER_OPTIONS },
  { id: 'cycle', label: 'Three formation categories', choices: PRODUCTION_CYCLES },
];

/**
 * How an ice block machine is actually specified: type, power, cycle, capacity.
 *
 * This is the most useful section on the site — a customer arrives knowing they want
 * "an ice block machine" and leaves knowing there are three power options and three
 * production cycles, which is the difference between a WhatsApp message that says "how
 * much" and one that says what they actually need.
 *
 * Laid out as rules rather than boxes, and that is a correction rather than a
 * preference. This is tabular information — options against explanations — and it was
 * being shown as nine bordered cards, which is about the most templated thing a page
 * can do with a table. The rows share their idiom with the figures in the numbers band,
 * so two sections now use one device instead of each inventing its own box.
 */
export function MachineOptions() {
  return (
    <section id="ice-block-machines" className="theme-sheet py-v-space">
      <Reveal className="shell">
        <SplitText
          as="h2"
          className="h2 mt-5 max-w-[28ch]"
          text="Our ice block machine is of two types, nylon type and mould types."
        />
        <p className="lead mt-5 max-w-[56ch]">
          Prices differ and the full solar is far more expensive than non solar.
        </p>
      </Reveal>

      {GROUPS.map((group, index) => (
        <Reveal key={group.id} className="shell spec-group mt-14" delay={index}>
          <div id={`machine-${group.id}`} className="spec-head scroll-mt-header">
            <h3 className="h3">{group.label}</h3>
          </div>

          {group.choices.map((choice) => (
            <div key={choice.id} className="spec-row">
              <p className="h3">{choice.name}</p>
              <div>
                <p className="lead" style={{ color: 'var(--text)' }}>
                  {choice.detail}
                </p>
                {choice.note && (
                  <p className="body-small mt-2" style={{ color: 'var(--accent)' }}>
                    {choice.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      ))}

      <Reveal className="shell spec-group mt-14">
        <div id="machine-capacity" className="spec-head scroll-mt-header">
          <h3 className="h3">All sizes</h3>
        </div>

        <div className="spec-row">
          <p className="figure-value">
            {CAPACITY.from}
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            {CAPACITY.to}
          </p>
          <div>
            <p className="lead" style={{ color: 'var(--text)' }}>
              {CAPACITY.note}
            </p>
            {isContactConfigured() && (
              <a
                href={whatsappLink(
                  enquiryMessage({
                    product: 'ice block machines',
                    capacity: 'PLEASE FILL IN: how many blocks a day',
                  }),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary mt-6"
              >
                Call or WhatsApp for prices
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
