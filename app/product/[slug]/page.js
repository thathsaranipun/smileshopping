import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import BuyBox from './BuyBox';
import { getProduct, getProducts, getSettings, getZones, SITE_URL } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: 'Product not found' };
  const desc = (p.description || p.name).slice(0, 155);
  return {
    title: p.name, description: desc, alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: desc, images: p.images?.length ? [p.images[0]] : ['/icon.png'], url: `/product/${p.slug}` },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [p, all, settings, zones] = await Promise.all([getProduct(slug), getProducts(), getSettings(), getZones()]);
  if (!p) notFound();
  const related = all.filter(x => x.id !== p.id && x.category_id === p.category_id)
    .concat(all.filter(x => x.category_id !== p.category_id)).slice(0, 4);
  const from = zones.length ? Math.min(...zones.map(z => z.rate)) : 350;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description,
    image: p.images, sku: p.slug, url: `${SITE_URL}/product/${p.slug}`,
    offers: { '@type': 'Offer', priceCurrency: 'LKR', price: p.price, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  };

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="crumb">
        <Link href="/">Home</Link> / {p.category && <><Link href={`/shop?cat=${p.category.slug}`}>{p.category.name}</Link> / </>}{p.name}
      </p>
      <BuyBox p={p} whatsapp={settings.whatsapp} deliveryFrom={from} />
      {related.length > 0 && (
        <section className="sec">
          <div className="sec-head"><h2>You might also like</h2></div>
          <div className="grid">{related.map(x => <ProductCard key={x.id} p={x} />)}</div>
        </section>
      )}
    </div>
  );
}
