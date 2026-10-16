import {
  BUSINESS,
  OFFICES,
  PAYMENT_ADVICE,
  PHONE_ALT_DISPLAY,
  PHONE_DISPLAY,
  SOCIAL_LINKS,
  isContactConfigured,
} from '@/lib/business';
import { KoolinkLogo } from '@/components/KoolinkLogo';
import { telLink } from '@/lib/whatsapp';

export function SiteFooter() {
  return (
    <footer
      className="theme-abyss relative overflow-hidden border-t py-v-space-sm"
      data-invert
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="shell relative z-10">
        <div
          className="glass rounded-[26px] sm:rounded-[32px] p-6 sm:p-9 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            backgroundColor: 'rgba(7, 24, 34, 0.48)',
            backgroundImage:
              'linear-gradient(150deg, rgba(255, 255, 255, 0.1) 0%, rgba(20, 101, 121, 0.12) 48%, rgba(4, 16, 23, 0.6) 100%)',
            border: '1px solid rgba(159, 188, 204, 0.22)',
            boxShadow:
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.26), 0 20px 48px -12px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div>
            <p className="h3">
              <KoolinkLogo />
            </p>
            <p className="body-small mt-1 text-subtle">{BUSINESS.legalName}</p>
            <p className="body-small mt-3 max-w-[36ch] text-subtle">{BUSINESS.summary}</p>
            <p className="body-small mt-3 text-subtle">{PAYMENT_ADVICE}</p>
          </div>

          <div>
            <p className="eyebrow text-subtle">Call or message</p>
            {isContactConfigured() && (
              <div className="mt-3 flex flex-col gap-1">
                <a href={telLink()} className="numeral">
                  {PHONE_DISPLAY}
                </a>
                <a href={telLink(true)} className="numeral">
                  {PHONE_ALT_DISPLAY}
                </a>
              </div>
            )}
            <p className="body-small mt-4 text-subtle">{BUSINESS.deliveryNote}</p>
          </div>

          <div>
            <p className="eyebrow text-subtle">Offices</p>
            <ul className="mt-3 flex flex-col gap-3">
              {OFFICES.map((office) => (
                <li key={office.label} className="body-small text-subtle">
                  <span style={{ color: 'var(--text)' }}>{office.label}</span>
                  <br />
                  {office.address}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-subtle">Find us</p>
            <ul className="mt-3 flex flex-col gap-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.platform} className="body-small text-subtle">
                  {social.href ? (
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      {social.platform}, {social.handle}
                    </a>
                  ) : (
                    <span>
                      {social.platform}, {social.handle}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
