import { getCategories, getProducts, SITE_URL } from '@/lib/data';
export const revalidate = 3600;

export default async function sitemap() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()]);
  const pages = ['', '/shop', ...['about', 'contact', 'delivery', 'payment', 'returns', 'privacy', 'terms'].map(s => `/info/${s}`)];
  return [
    ...pages.map(p => ({ url: SITE_URL + p, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.5 })),
    ...cats.map(c => ({ url: `${SITE_URL}/shop?cat=${c.slug}`, changeFrequency: 'daily', priority: 0.7 })),
    ...products.map(p => ({ url: `${SITE_URL}/product/${p.slug}`, lastModified: p.created_at, changeFrequency: 'daily', priority: 0.8 })),
  ];
}
