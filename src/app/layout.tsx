import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

import { InViewRuntime } from '@/components/InViewRuntime';
import { MobileActionBar } from '@/components/MobileActionBar';
import { LiquidGlassFilter } from '@/components/LiquidGlassFilter';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SmoothScroll } from '@/components/SmoothScroll';
import { BUSINESS, OFFICES, PHONE_ALT_E164, PHONE_E164, SITE_URL } from '@/lib/business';

import './globals.css';

/* Archivo for headings because a manufacturer should read as engineered rather
   than boutique; Geist for everything else: it is as legible as Inter at 16px on a cheap
   phone screen and does not carry Inter's every-AI-site-uses-it association. */
const display = Archivo({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
});


const TITLE = `${BUSINESS.legalName} - ice block machines, coldrooms and chillers in ${BUSINESS.areaServed}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s - ${BUSINESS.legalName}`,
  },
  description: BUSINESS.summary,
  /* The searches this business is actually lost to right now. Solar is the
     differentiator, so it carries most of them. */
  keywords: [
    'ice block machine Nigeria',
    'solar ice block machine',
    'ice block machine price Nigeria',
    'walk in coldroom Nigeria',
    'coldroom installation Lagos',
    'solar deep freezer Nigeria',
    'ice drinks chiller machine',
    'liquid chiller for bakery',
    'commercial refrigeration Nigeria',
    'ice block machine Abuja',
    'ice block machine Port Harcourt',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: BUSINESS.summary,
    siteName: BUSINESS.legalName,
  },
  robots: { index: true, follow: true },
};

/**
 * `data-js` is set before first paint, and every entrance rule in globals.css is
 * gated behind it. Without this a visitor whose bundle fails to load would get a
 * page of permanently invisible content; with it they get the finished page.
 */
const JS_FLAG = "document.documentElement.dataset.js='1'";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* Four offices, so four locations rather than one address on the organisation —
     this is what puts the right branch into a local search result. */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS.legalName,
    description: BUSINESS.summary,
    url: SITE_URL,
    telephone: [PHONE_E164, PHONE_ALT_E164],
    slogan: BUSINESS.motto,
    areaServed: { '@type': 'Country', name: BUSINESS.areaServed },
    location: OFFICES.map((office) => ({
      '@type': 'Place',
      name: `${BUSINESS.legalName} - ${office.label}`,
      address: { '@type': 'PostalAddress', streetAddress: office.address },
    })),
  };

  return (
    /* suppressHydrationWarning because the inline script below sets data-js on
       this element before React hydrates, and React would otherwise report the
       attribute it did not render as a mismatch. Setting it after hydration would
       defeat the point: the entrance rules are gated on it, so it has to be there
       before first paint. */
    <html
      lang="en"
      className={`${display.variable} ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        {/* The refraction filter, rendered once for the whole document. It has no
            visual output of its own — every glass surface references it by id, and it
            also publishes the rim and lift values so the CSS and the filter are driven
            by the same six settings rather than tuned separately. */}
        <LiquidGlassFilter />
        <SmoothScroll />
        <InViewRuntime />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileActionBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
