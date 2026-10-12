import ShopGrid from './ShopGrid';
import { getCategories, getProducts, getSettings } from '@/lib/data';

export async function generateMetadata({ searchParams }) {
  const { cat } = await searchParams;
  const cats = await getCategories();
  const c = cats.find(x => x.slug === cat);
  return { title: c ? c.name : 'Shop all products', description: c ? `Shop ${c.name} online with island-wide delivery in Sri Lanka.` : undefined, alternates: { canonical: c ? `/shop?cat=${c.slug}` : '/shop' } };
}

export default async function Shop({ searchParams }) {
  const { cat, q, focus } = await searchParams;
  const [cats, products, settings] = await Promise.all([getCategories(), getProducts(), getSettings()]);
  return <ShopGrid cats={cats} products={products} cat={cat || null} q={q || ''} focus={!!focus} whatsapp={settings.whatsapp} />;
}
