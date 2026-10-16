import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { SOCIAL_LINKS } from '@/lib/business';

export function SocialBand() {
  return (
    <section
      id="videos"
      className="theme-deep relative overflow-hidden py-v-space-sm border-b"
      style={{
        borderColor: 'var(--rule)',
        backgroundImage:
          'radial-gradient(105% 70% at 80% 22%, rgba(0, 150, 71, 0.22), transparent 60%), radial-gradient(95% 65% at 18% 75%, rgba(43, 168, 206, 0.26), transparent 62%), linear-gradient(180deg, rgb(6 22 32) 0%, rgb(9 31 44) 52%, rgb(4 16 23) 100%)',
      }}
      data-invert
    >
      <div className="shell relative z-10">
        <div
          className="glass relative overflow-hidden rounded-[26px] sm:rounded-[32px] p-6 sm:p-8"
          style={{
            backgroundColor: 'rgba(9, 32, 46, 0.54)',
            backgroundImage:
              'linear-gradient(145deg, rgba(255, 255, 255, 0.13) 0%, rgba(0, 150, 71, 0.1) 48%, rgba(7, 24, 34, 0.58) 100%)',
            border: '1px solid rgba(159, 188, 204, 0.26)',
            boxShadow:
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(95, 211, 238, 0.14), 0 22px 48px -12px rgba(0, 0, 0, 0.45)',
          }}
        >
          <Reveal>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(95, 211, 238, 0.3)',
                color: 'var(--accent)',
              }}
            >
              Live Production Proof
            </span>
            <SplitText
              as="h2"
              className="h2-quiet mt-3 max-w-[34ch]"
              text="Click on our page to watch more videos."
            />
            <p className="lead mt-3 max-w-[52ch]">
              For more videos, pictures and products, visit the Koolink social media handles.
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-3" delay={1}>
            {SOCIAL_LINKS.map((social) =>
              social.href ? (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-transform active:scale-95"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 4px 12px rgba(0, 0, 0, 0.22)',
                    color: 'var(--text)',
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>{social.platform}:</span> {social.handle}
                </a>
              ) : (
                <span
                  key={social.platform}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22)',
                    color: 'var(--text)',
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>{social.platform}:</span> {social.handle}
                </span>
              ),
            )}
          </Reveal>
        </div>
      </div>

      <div
        className="marquee mt-10"
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
