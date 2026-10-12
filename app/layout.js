import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tracking from '@/components/Tracking';
import { getSettings, SITE_URL } from '@/lib/data';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Smile Shopping — Sri Lanka's best online chain", template: '%s | Smile Shopping' },
  description: 'Shop home, beauty, electronics, fashion and kids products online. Island-wide delivery to all 25 districts, secure payment and WhatsApp support.',
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: { siteName: 'Smile Shopping', type: 'website', locale: 'en_LK' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1F1147' };

// Always show the latest products, prices and stock straight after an admin edit.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lobster+Two:ital,wght@1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <Header whatsapp={settings.whatsapp} />
          <main>{children}</main>
          <Footer whatsapp={settings.whatsapp} />
        </CartProvider>
        <Tracking />
      </body>
    </html>
  );
}
