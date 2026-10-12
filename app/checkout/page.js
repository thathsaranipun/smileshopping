import CheckoutView from './CheckoutView';
import { getSettings, getZones } from '@/lib/data';

export const metadata = { title: 'Checkout', robots: { index: false } };

export default async function CheckoutPage() {
  const [zones, settings] = await Promise.all([getZones(), getSettings()]);
  return <CheckoutView zones={zones} settings={settings} />;
}
