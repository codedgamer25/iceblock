'use client';

import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { MACHINE_TYPES, POWER_OPTIONS, PRODUCTION_CYCLES } from '@/lib/machines';

/* Their own words for each group. The leads that used to sit under these headings were
   mine and said nothing the rows below did not already say. */
const GROUPS = [
  { id: 'type', label: 'Two types', choices: MACHINE_TYPES },
  { id: 'power', label: 'Non solar and full solar', choices: POWER_OPTIONS },
  { id: 'cycle', label: 'Three formation categories', choices: PRODUCTION_CYCLES },
] as const;

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
  const [selected, setSelected] = useState<{
    type?: string;
    power?: string;
    cycle?: string;
  }>({
    type: MACHINE_TYPES[0].name,
    power: POWER_OPTIONS[0].name,
    cycle: PRODUCTION_CYCLES[1].name,
  });

  const toggleChoice = (groupId: 'type' | 'power' | 'cycle', name: string) => {
    setSelected((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === name ? undefined : name,
    }));
  };

  return (
    <section id="ice-block-machines" className="theme-sheet py-v-space">
      <Reveal className="shell">
        <SplitText
          as="h2"
          className="h2 mt-5 max-w-[28ch]"
          text="Our ice block machine is of two types, nylon type and mould types."
        />
        <p className="lead mt-5 max-w-[56ch]">
          Prices differ and the full solar is far more expensive than non solar. Tap any option below to build your specification.
        </p>
      </Reveal>

      {GROUPS.map((group, index) => (
        <Reveal key={group.id} className="shell mt-14" delay={index}>
          <div id={`machine-${group.id}`} className="scroll-mt-header flex flex-wrap items-baseline justify-between gap-2 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
            <h3 className="h3">{group.label}</h3>
            <span className="body-small" style={{ color: 'var(--text-muted)' }}>
              {selected[group.id] ? `Selected: ${selected[group.id]}` : 'Tap a card to select'}
            </span>
          </div>

          <div
            className={`mt-6 grid gap-gutter ${
              group.choices.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
            }`}
          >
            {group.choices.map((choice) => {
              const isSelected = selected[group.id] === choice.name;
              return (
                <article
                  key={choice.id}
                  onClick={() => toggleChoice(group.id, choice.name)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleChoice(group.id, choice.name);
                    }
                  }}
                  className="card flex cursor-pointer flex-col justify-between gap-3 text-left"
                  style={{
                    borderColor: isSelected ? 'var(--accent)' : undefined,
                    boxShadow: isSelected ? '0 0 0 2px var(--accent)' : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="h3">{choice.name}</h4>
                      <span
                        className="body-small shrink-0 rounded-full px-2.5 py-0.5 font-medium"
                        style={{
                          backgroundColor: isSelected ? 'var(--accent)' : 'rgb(255 255 255 / 0.5)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                    <p className="lead mt-3" style={{ color: 'var(--text)' }}>
                      {choice.detail}
                    </p>
                  </div>
                  {choice.note && (
                    <p className="body-small pt-2" style={{ color: 'var(--accent)' }}>
                      {choice.note}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </Reveal>
      ))}
    </section>
  );
}
