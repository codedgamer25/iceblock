import type { Metadata } from 'next';

import { ProductCatalogue } from '@/components/products/ProductCatalogue';
import { BUSINESS, SITE_URL } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Products',
  description: `Explore nylon and mould type ice block machines, walk-in cold rooms and solar systems from ${BUSINESS.legalName}. ${BUSINESS.deliveryNote}`,
  alternates: { canonical: `${SITE_URL}/products` },
};

export default function ProductsPage() {
  return <ProductCatalogue />;
}
