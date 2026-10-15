/**
 * How an ice block machine is specified. Four independent choices, exactly as
 * Koolink explains them — machine type, power source, how many times a day it
 * produces, and capacity.
 *
 * This is the page's real work. A customer arrives knowing they want "an ice block
 * machine" and leaves knowing there are three power options and three production
 * cycles, which is the difference between a WhatsApp message that says "how much"
 * and one that says what they actually need.
 *
 * Every claim here is Koolink's own. Nothing about output, voltage or lifespan is
 * rounded, converted or inferred.
 */

export type Choice = {
  id: string;
  name: string;
  detail: string;
  /** Set on the option Koolink themselves single out. */
  note?: string;
};

/** "Our Ice block machine is of two types, Nylon type and mould types." */
export const MACHINE_TYPES: ReadonlyArray<Choice> = [
  {
    id: 'nylon',
    name: 'Nylon type',
    detail: 'Uses nylon to form each block, so you buy nylon daily to keep it running.',
  },
  {
    id: 'mould',
    name: 'Mould type',
    detail: 'Comes with its moulds permanently. Nothing to buy daily.',
  },
];

export const POWER_OPTIONS: ReadonlyArray<Choice> = [
  {
    id: 'full-solar',
    name: 'Full solar',
    detail:
      'Self-powered DC 24/48V hybrid commercial machines, supplied complete with panels and lithium batteries.',
    note: 'Costs considerably more than non-solar, and runs on nothing.',
  },
  {
    id: 'solar-friendly',
    name: 'Solar friendly DC 48V',
    detail:
      'Energy-saving DC 48V machines for people who already have a solar system to run them from.',
  },
  {
    id: 'mains',
    name: 'Non-solar AC 220-240V',
    detail: 'Best run on mains or a generator. Not suitable for solar systems.',
  },
];

/** "We have Three formation categories for all sizes." */
export const PRODUCTION_CYCLES: ReadonlyArray<Choice> = [
  { id: 'once', name: 'Once daily', detail: 'One full production run in under 24 hours.' },
  { id: 'twice', name: 'Twice daily', detail: 'A full run every 12 hours.' },
  { id: 'thrice', name: 'Three times daily', detail: 'A full run every 8 hours.' },
];

export const CAPACITY = {
  from: 21,
  to: 500,
  note: 'Various capacities and sizes, ranging from 21 blocks to over 500 blocks.',
} as const;

/**
 * The durability claims, which are the actual argument for buying from Koolink
 * rather than from whoever is cheapest this week. Their figures, their reasoning.
 */
export const DURABILITY: ReadonlyArray<{ heading: string; body: string }> = [
  {
    heading: 'The solar system',
    body: 'Lithium batteries, because they are the most durable, rugged, efficient and safest of the battery types. Every solar component is brand new, and an operational manual comes with it.',
  },
  {
    heading: 'The ice block machine',
    body: 'Everything used in assembly is brand new, including the 48V DC outdoor units. Components need periodic maintenance like any machine, and there is no fault that cannot be repaired. The parts are available in the market.',
  },
  {
    heading: 'Not a domestic freezer sold as a commercial machine',
    body: 'These are commercial machines with proper power systems. They are completely different from the domestic solar freezers being sold today as solar ice block machines, on batteries that will not last two years.',
  },
  {
    heading: 'Over 25 years of experience',
    body: 'We know the challenges and exactly what the user needs. Our products, solar or not, are not costly set against the output and the years you get out of them.',
  },
];
