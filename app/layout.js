import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tracking from '@/components/Tracking';
import Reveal from '@/components/Reveal';
import LogoLoader from '@/components/LogoLoader';

const SPLASH_JS = `(function(){var el=document.getElementById('splash');if(!el)return;var d=0;function h(){if(d)return;d=1;setTimeout(function(){el.classList.add('done')},Math.max(0,700-performance.now()))}var c=document.querySelector('main [data-cover] img');if(c&&!c.complete){c.addEventListener('load',h);c.addEventListener('error',h)}else h();setTimeout(h,Math.max(0,1600-performance.now()))})();`;
import { getSettings, SITE_URL } from '@/lib/data';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Smile Shopping — Kanjivaram silk half sarees & Kanchi cotton lehengas', template: '%s | Smile Shopping' },
  description: 'Kanjivaram silk zari half sarees and South-style Kanchi cotton lehengas, ready stock in Sri Lanka. Island-wide delivery to all 25 districts. Order in one WhatsApp message, pay cash on delivery.',
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: { siteName: 'Smile Shopping', type: 'website', locale: 'en_LK' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0a0a0a' };


export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const ld = {
    '@context': 'https://schema.org', '@type': 'ClothingStore', name: 'Smile Shopping', url: SITE_URL, image: `${SITE_URL}/icon.png`,
    telephone: `+${settings.whatsapp}`, email: settings.email, priceRange: 'Rs. 4,900 – Rs. 7,200',
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
        <div id="splash" aria-hidden="true" suppressHydrationWarning><LogoLoader /></div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <CartProvider>
          <Header whatsapp={settings.whatsapp} />
          <main>{children}</main>
          <Footer whatsapp={settings.whatsapp} />
        </CartProvider>
        {/* Hides the start-up logo screen without waiting for the app's JS: at least 0.7s, then once the cover photo
            has loaded, never longer than 1.6s. (CSS also hides it after 4s if scripts are blocked.) */}
        <script dangerouslySetInnerHTML={{ __html: SPLASH_JS }} />
        <Reveal />
        <Tracking />
      </body>
    </html>
  );
}
