import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { SOCIAL_LINKS } from '@/lib/business';

/**
 * "Click on our page to watch more videos" — Koolink's own line, and the reason this
 * band exists. Their proof is on their social accounts, not in a testimonial block
 * somebody typed.
 *
 * The marquee underneath is the reference site's logo strip: their `.logos-items`
 * moves x to -107.5% over 10 seconds. Ours carries the platform names, at the same
 * cadence, duplicated so the seam is invisible rather than nearly.
 *
 * Handles without a link render as plain text. Three of the four are page names with
 * spaces in them, and a guessed URL sends a customer to somebody else's page.
 */
export function SocialBand() {
  return (
    <section id="videos" className="theme-deep py-v-space-sm" data-invert>
      <Reveal className="shell">
        <SplitText
          as="h2"
          className="h2-quiet mt-4 max-w-[34ch]"
          text="Click on our page to watch more videos."
        />
        <p className="lead mt-4 max-w-[52ch]">
          For more videos, pictures and products, visit the Koolink social media handles.
        </p>
      </Reveal>

      <Reveal className="shell mt-10 flex flex-wrap gap-x-8 gap-y-3" delay={1}>
        {SOCIAL_LINKS.map((social) =>
          social.href ? (
            <a
              key={social.platform}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lead"
              style={{ color: 'var(--text)' }}
            >
              {social.platform}, {social.handle}
            </a>
          ) : (
            <span key={social.platform} className="lead">
              {social.platform}, {social.handle}
            </span>
          ),
        )}
      </Reveal>

      {/* data-pause-offscreen is read by InViewRuntime, which keeps data-onscreen in sync
          both ways. For most of a 9,700px page this strip is nowhere near the viewport,
          and an infinite animation on a composited layer keeps the compositor awake for
          the whole session whether or not anybody can see it. */}
      <div
        className="marquee mt-12"
        aria-hidden="true"
        data-pause-offscreen
        data-onscreen="false"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-track">
            {SOCIAL_LINKS.map((social) => (
              <span key={social.platform} className="h3 whitespace-nowrap text-subtle">
                {social.platform}
              </span>
            ))}
            <span className="h3 whitespace-nowrap text-subtle">Quality</span>
            <span className="h3 whitespace-nowrap text-subtle">Efficiency</span>
            <span className="h3 whitespace-nowrap text-subtle">Durability</span>
          </div>
        ))}
      </div>
    </section>
  );
}
