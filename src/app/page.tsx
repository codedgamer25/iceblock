import { CtaBand } from '@/components/CtaBand';
import { BuildFilm } from '@/components/BuildFilm';
import { Hero } from '@/components/Hero';
import { KoolinkShowcase } from '@/components/KoolinkShowcase';
import { MachineOptions } from '@/components/MachineOptions';
import { Numbers } from '@/components/Numbers';
import { Offices } from '@/components/Offices';
import { SocialBand } from '@/components/SocialBand';
import { WhyKoolink } from '@/components/WhyKoolink';

/**
 * Section order is the sale in order: who we are, what we build, how a machine is
 * specified, the sub-zero thermal core architecture, the figures, why ours rather than
 * the cheap one, proof you can watch, where to find us, the ask.
 *
 * There is no "how buying works" section any more. It described a four-step process in
 * language Koolink never used, and the facts inside it (visit before paying, delivery
 * anywhere in Nigeria, an operational manual) are all stated in their own words
 * elsewhere on the page.
 *
 * The film sits after the product row: proof in motion before the reader is asked to
 * specify a machine. It is one half-viewport scrub, not a four-screen pin — the frame
 * grows from half size to full width as it enters, then loops quietly and can be paused.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <KoolinkShowcase />
      <BuildFilm />
      <MachineOptions />
      <Numbers />
      <WhyKoolink />
      <SocialBand />
      <Offices />
      <CtaBand />
    </>
  );
}
