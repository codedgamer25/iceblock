import { CtaBand } from '@/components/CtaBand';
import { Hero } from '@/components/Hero';
import { KoolinkShowcase } from '@/components/KoolinkShowcase';
import { MachineOptions } from '@/components/MachineOptions';
import { Numbers } from '@/components/Numbers';
import { Offices } from '@/components/Offices';
import { Products } from '@/components/Products';
import { SocialBand } from '@/components/SocialBand';
import { WhyKoolink } from '@/components/WhyKoolink';

/**
 * Section order is the sale in order: who we are, what we build, how a machine is
 * specified, the figures, why ours rather than the cheap one, proof you can watch,
 * where to find us, the ask.
 *
 * There is no "how buying works" section any more. It described a four-step process in
 * language Koolink never used, and the facts inside it (visit before paying, delivery
 * anywhere in Nigeria, an operational manual) are all stated in their own words
 * elsewhere on the page.
 *
 * The scrubbed video section that used to sit after the products has been removed —
 * the imagery now lives in the product tiles and the section beds, which carry it
 * without asking the reader for four screens of scroll or a megabyte of frames.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <KoolinkShowcase />
      <MachineOptions />
      <Numbers />
      <WhyKoolink />
      <SocialBand />
      <Offices />
      <CtaBand />
    </>
  );
}
