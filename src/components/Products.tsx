import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/Reveal';
import styles from '@/components/products/Products.module.css';
import { BUSINESS, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { CATALOGUE_DETAILS } from '@/lib/catalogue';
import { PRODUCTS, PRODUCTS_NOTE } from '@/lib/products';
import { enquiryMessage, telLink, whatsappLink } from '@/lib/whatsapp';

export function Products() {
  return (
    <section id="products" className={`${styles.home} theme-frost`}>
      <div className={styles.container}>
        <Reveal className={styles.homeHeading}>
          <div>
            <p className={styles.eyebrow}>Made by Koolink</p>
            <h2>Built for your business.</h2>
            <p>Ice block machines, cold rooms and solar systems.</p>
          </div>
          <Link href="/products" className={styles.textLink}>
            Explore all products <ArrowRight size={18} />
          </Link>
        </Reveal>
        <div className={styles.homeGrid}>
          {PRODUCTS.map((product) => {
            const groupId = Object.entries(CATALOGUE_DETAILS).find(
              ([, detail]) => detail.productId === product.id,
            )?.[0];
            return (
              <article
                key={product.id}
                id={`product-${product.id}`}
                className={`${styles.homeCard} scroll-mt-header`}
              >
                <Link
                  href={`/products#${groupId}`}
                  className={styles.homePhoto}
                  aria-label={`View ${product.name.toLowerCase()}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  {isContactConfigured() && (
                    <span className="product-stamp numeral">
                      {PHONE_DISPLAY}
                    </span>
                  )}
                </Link>
                <div className={styles.homeCardBody}>
                  <h3>
                    <Link href={`/products#${groupId}`}>{product.name}</Link>
                  </h3>
                  <p>{product.what}</p>
                  <div className={styles.homeCardActions}>
                    {isContactConfigured() && (
                      <a
                        href={whatsappLink(
                          enquiryMessage({
                            product: product.name,
                            image: product.image,
                          }),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book now <ArrowUpRight size={16} />
                      </a>
                    )}
                    <Link href={`/products#${groupId}`}>
                      View range <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.homeNote}>
          <p>{PRODUCTS_NOTE}</p>
          {isContactConfigured() && (
            <a href={telLink()} aria-label={`Call ${BUSINESS.name}`}>
              <Phone size={16} />
              {PHONE_DISPLAY}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
