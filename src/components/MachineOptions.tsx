'use client';

import { useState } from 'react';
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
] as const;

const CAPACITY_PRESETS = [21, 50, 100, 200, 350, 500] as const;

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
  const [blocksPerDay, setBlocksPerDay] = useState<number>(100);

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

      <Reveal className="shell mt-14">
        <div id="machine-capacity" className="scroll-mt-header border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
          <h3 className="h3">All sizes &amp; instant quote builder</h3>
        </div>

        <div className="card mt-6 grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="figure-value">
              {CAPACITY.from}
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              {CAPACITY.to}
            </p>
            <p className="body-small mt-2" style={{ color: 'var(--text-muted)' }}>
              Blocks per production cycle — slide or pick your daily target:
            </p>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label htmlFor="capacity-slider" className="body-small font-semibold" style={{ color: 'var(--text)' }}>
                  Target output
                </label>
                <span className="h3" style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                  {blocksPerDay} blocks / day
                </span>
              </div>
              <input
                id="capacity-slider"
                type="range"
                min={CAPACITY.from}
                max={CAPACITY.to}
                value={blocksPerDay}
                onChange={(e) => setBlocksPerDay(Number(e.target.value))}
                className="mt-2 w-full cursor-pointer accent-[#0b5c7a]"
                aria-label="Daily ice block capacity"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {CAPACITY_PRESETS.map((preset) => {
                  const active = blocksPerDay === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBlocksPerDay(preset)}
                      aria-pressed={active}
                      className="body-small rounded-full border px-3 py-1 font-medium"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--rule)',
                        backgroundColor: active ? 'var(--accent)' : 'rgb(255 255 255 / 0.55)',
                        color: active ? '#fff' : 'var(--text)',
                      }}
                    >
                      {preset} blocks
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="lead" style={{ color: 'var(--text)' }}>
              {CAPACITY.note}
            </p>

            <div
              className="mt-5 rounded-2xl border p-4"
              style={{
                borderColor: 'var(--rule)',
                backgroundColor: 'rgb(255 255 255 / 0.45)',
              }}
            >
              <p className="body-small font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Your WhatsApp Specification Summary
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <div>
                  <dt style={{ color: 'var(--text-muted)' }}>Type</dt>
                  <dd className="font-semibold" style={{ color: 'var(--text)' }}>
                    {selected.type ?? 'Any'}
                  </dd>
                </div>
                <div>
                  <dt style={{ color: 'var(--text-muted)' }}>Power</dt>
                  <dd className="font-semibold" style={{ color: 'var(--text)' }}>
                    {selected.power ?? 'Any'}
                  </dd>
                </div>
                <div>
                  <dt style={{ color: 'var(--text-muted)' }}>Cycle</dt>
                  <dd className="font-semibold" style={{ color: 'var(--text)' }}>
                    {selected.cycle ?? 'Any'}
                  </dd>
                </div>
                <div>
                  <dt style={{ color: 'var(--text-muted)' }}>Capacity</dt>
                  <dd className="font-semibold" style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                    {blocksPerDay} blocks/day
                  </dd>
                </div>
              </dl>
            </div>

            {isContactConfigured() && (
              <a
                href={whatsappLink(
                  enquiryMessage({
                    product: 'ice block machines',
                    machineType: selected.type,
                    power: selected.power,
                    cycle: selected.cycle,
                    capacity: `${blocksPerDay} blocks a day`,
                  }),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary mt-6"
              >
                Book {blocksPerDay}-block machine on WhatsApp
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
