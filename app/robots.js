import { SITE_URL } from '@/lib/data';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/cart', '/checkout', '/pay', '/order'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
