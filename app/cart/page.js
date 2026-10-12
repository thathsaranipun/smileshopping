import CartView from './CartView';
import { getSettings, getZones } from '@/lib/data';

export const metadata = { title: 'Your cart', robots: { index: false } };

export default async function CartPage() {
  const [zones, settings] = await Promise.all([getZones(), getSettings()]);
  return <CartView zones={zones} settings={settings} />;
}
