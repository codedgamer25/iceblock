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

/**
 * Handles without a link are rendered as plain text rather than as a guess at a
 * URL. Three of the four are page names with spaces in them, and sending a customer
 * to somebody else's Facebook page is worse than making them search.
 */
export function SiteFooter() {
  return (
    <footer className="theme-abyss border-t py-v-space-sm" data-invert style={{ borderColor: 'var(--rule)' }}>
      <div className="shell grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
    </footer>
  );
}
