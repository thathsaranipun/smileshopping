import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tracking from '@/components/Tracking';
import Reveal from '@/components/Reveal';
import { getSettings, SITE_URL } from '@/lib/data';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Smile Shopping — Kanjivaram silk half sarees & Kanchi cotton lehengas', template: '%s | Smile Shopping' },
  description: 'Kanjivaram silk zari half sarees and South-style Kanchi cotton lehengas, ready stock in Sri Lanka. Island-wide delivery to all 25 districts. Order in one WhatsApp message, pay cash on delivery.',
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: { siteName: 'Smile Shopping', type: 'website', locale: 'en_LK' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0a0a0a' };

// Always show the latest products, prices and stock straight after an admin edit.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const ld = {
    '@context': 'https://schema.org', '@type': 'ClothingStore', name: 'Smile Shopping', url: SITE_URL, image: `${SITE_URL}/icon.png`,
    telephone: `+${settings.whatsapp}`, email: 'hello@smileshopping.lk', priceRange: 'Rs. 4,900 – Rs. 7,200',
    address: { '@type': 'PostalAddress', addressCountry: 'LK' }, areaServed: 'Sri Lanka', paymentAccepted: 'Cash on delivery',
    openingHours: 'Mo-Sa 09:00-19:00',
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <CartProvider>
          <Header whatsapp={settings.whatsapp} />
          <main>{children}</main>
          <Footer whatsapp={settings.whatsapp} />
        </CartProvider>
        <Reveal />
        <Tracking />
      </body>
    </html>
  );
}
