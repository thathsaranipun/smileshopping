import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WAIcon } from '@/components/icons';
import PageHero from '@/components/PageHero';
import CallbackForm from '@/components/CallbackForm';
import { getSettings, getZones } from '@/lib/data';
import { money, waLink, prettyPhone } from '@/lib/format';

const PAGES = {
  about: { title: 'About Smile Shopping', eyebrow: 'Who we are', image: '/images/banners/about.jpg', pos: 'center 12%', intro: 'Kanjivaram silk half sarees and South-style Kanchi cotton lehengas, in ready stock for every district in Sri Lanka.' },
  contact: { title: 'Contact us', eyebrow: 'Get in touch', image: '/images/banners/contact.jpg', pos: 'center 35%', intro: 'Questions about a colour, size or delivery? A real person replies on WhatsApp within minutes.' },
  'how-to-order': { title: 'How to order', eyebrow: 'Ordering', image: '/images/banners/howto.jpg', pos: 'center 40%', intro: 'Every order is placed and confirmed on WhatsApp. No card, no account. Pay when it arrives.' },
  delivery: { title: 'Delivery information', eyebrow: 'Island-wide', image: '/images/banners/delivery.jpg', pos: 'center 40%', intro: 'We deliver to all 25 districts. Charges depend on your district and are shown before you send your order.' },
  returns: { title: 'Returns & refunds', eyebrow: 'Easy returns', image: '/images/banners/returns.jpg', pos: 'center 30%', intro: 'Return unused items in original packaging within 7 days of delivery.' },
  privacy: { title: 'Privacy policy', eyebrow: 'Your information', image: '/images/banners/privacy.jpg', pos: 'center 25%', intro: 'What we collect when you order, why we need it, and how we keep it safe. We never sell your information.' },
  terms: { title: 'Terms & conditions', eyebrow: 'Shopping with us', image: '/images/banners/terms.jpg', pos: 'center 8%', intro: 'The simple rules for ordering, delivery, payment and returns at Smile Shopping.' },
};

const UPDATED = '18 November 2026';

export function generateStaticParams() {
  return Object.keys(PAGES).map(slug => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = PAGES[slug];
  return { title: p?.title || 'Not found', description: p?.intro, alternates: { canonical: `/info/${slug}` } };
}

const Phone = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
);
const Mail = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
const Clock = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

export default async function Info({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  const [settings, zones] = await Promise.all([getSettings(), getZones()]);
  const wa = settings.whatsapp;
  const orderBtn = <a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping! I would like to order.')} target="_blank" rel="noopener"><WAIcon /> Order on WhatsApp</a>;

  if (slug === 'contact') {
    return (
      <>
        <PageHero {...page}>
          <div className="cta-row"><a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping!')} target="_blank" rel="noopener"><WAIcon /> Chat on WhatsApp</a></div>
        </PageHero>
        <section className="wrap sx">
          <div className="contact-cards">
            <a className="card ccard" href={waLink(wa, 'Hi Smile Shopping!')} target="_blank" rel="noopener" data-rv>
              <i className="wa"><WAIcon /></i><small>WhatsApp</small><b>{prettyPhone(wa)}</b><span>Fastest reply, usually in minutes</span>
            </a>
            <a className="card ccard" href={`tel:+${wa}`} data-rv style={{ '--d': '.06s' }}>
              <i><Phone /></i><small>Call us</small><b>{prettyPhone(wa)}</b><span>Mon – Sat, during opening hours</span>
            </a>
            <a className="card ccard" href={`mailto:${settings.email}`} data-rv style={{ '--d': '.12s' }}>
              <i><Mail /></i><small>Email</small><b>{settings.email}</b><span>We reply within one working day</span>
            </a>
            <div className="card ccard" data-rv style={{ '--d': '.18s' }}>
              <i><Clock /></i><small>Opening hours</small><b>{settings.hours}</b><span>Messages outside these hours are answered next morning</span>
            </div>
          </div>

          <div className="contact-g">
            <div className="contact-img" data-rv><img src="/images/lookbook/look-3.jpg" alt="Model wearing a pink lehenga with a zari dupatta" loading="lazy" /></div>
            <div data-rv>
              <p className="eyebrow">We&apos;re here to help</p>
              <h2 style={{ margin: '16px 0 18px' }}>Not sure which colour to pick?</h2>
              <p className="mute" style={{ lineHeight: 1.75, marginBottom: 26 }}>Send us a message and we&apos;ll share a daylight video of any colour, help with sizing, and confirm delivery to your district. Or leave your number and we&apos;ll call you.</p>
              <CallbackForm whatsapp={wa} />
            </div>
          </div>
        </section>
      </>
    );
  }

  const body = {
    about: <>
      <p>Smile Shopping brings Kanjivaram silk zari half sarees and South-style Kanchi cotton lehengas, in ready stock, to every district in Sri Lanka.</p>
      <p>A South-style lehenga carries the essence of South Indian culture: rich zari borders, deep jewel tones and a flair that moves beautifully at every function, pooja and festival. We photograph the actual pieces, so what you see is what arrives.</p>
      <p>We keep it simple: fair prices, clear photos, fast delivery and a real person on WhatsApp when you need help.</p>
      <div className="cta-row"><Link className="btn btn-light" href="/shop">Shop the collection <span className="arr" aria-hidden="true">→</span></Link>{orderBtn}</div>
    </>,
    delivery: <>
      <p>We deliver island-wide.{settings.free_over > 0 && <> Orders over {money(settings.free_over)} ship free.</>}</p>
      <div className="tbl-wrap"><table><thead><tr><th>Area</th><th>Delivery time</th><th>Charge</th></tr></thead>
        <tbody>{zones.map(z => <tr key={z.id}><td>{z.name}<br /><small className="mute">{z.districts.join(', ')}</small></td><td>{z.days}</td><td>{money(z.rate)}</td></tr>)}</tbody></table></div>
    </>,
    'how-to-order': <>
      <div className="steps4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card step"><h3>Pick your colour</h3><p>Open any product and tap <b>Order on WhatsApp</b>, or add several pieces to your cart and tap <b>Send order on WhatsApp</b>.</p></div>
        <div className="card step"><h3>Send the message</h3><p>WhatsApp opens with your items, total and delivery details already written. Just press send.</p></div>
        <div className="card step"><h3>We confirm</h3><p>We reply to confirm stock, delivery charge and dispatch date, usually within minutes during opening hours.</p></div>
        <div className="card step"><h3>Pay on delivery</h3><p>Pay the rider in cash when your parcel arrives. If you would rather pay another way, tell us in the chat.</p></div>
      </div>
      <div className="cta-row">{orderBtn}</div>
    </>,
    returns: <>
      <p>Changed your mind? Return unused items in original packaging within 7 days of delivery.</p>
      <p>Message us on WhatsApp with your order number to start a return. We arrange your refund with you on WhatsApp within 7–10 working days.</p>
      <div className="cta-row"><a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping! I would like to return an order.')} target="_blank" rel="noopener"><WAIcon /> Start a return</a></div>
    </>,
    privacy: <div className="legal">
      <p className="updated">Last updated: {UPDATED}</p>
      <h2>1. What we collect</h2>
      <p>When you place an order or ask for a call back, we collect only what we need to deliver it:</p>
      <ul>
        <li>Your name and mobile number</li>
        <li>Your delivery address and district</li>
        <li>Your email address, only if you choose to give it</li>
        <li>The items you order, the order total and any delivery note</li>
        <li>The messages you send us on WhatsApp</li>
      </ul>
      <p>We do not collect card or bank details. There is no online payment on this website.</p>
      <h2>2. How we use it</h2>
      <ul>
        <li>To confirm your order, pack it and deliver it</li>
        <li>To contact you about your order, delivery or a return</li>
        <li>To call you back when you request it</li>
        <li>To keep basic sales and order records for our business</li>
      </ul>
      <p>We will not send you marketing messages unless you ask us to.</p>
      <h2>3. Who we share it with</h2>
      <p>We share your name, phone number and address only with the courier delivering your parcel. We never sell, rent or trade your information to anyone.</p>
      <p>Orders are sent through WhatsApp, which is run by Meta. Messages you send us are also covered by WhatsApp&apos;s own privacy policy.</p>
      <h2>4. Cookies and analytics</h2>
      <p>Your cart and checkout details are saved in your own browser so they are still there when you come back. We may use basic analytics to understand which pages are visited, so we can improve the site.</p>
      <h2>5. How long we keep it</h2>
      <p>We keep order records for as long as we need them for delivery, returns and our business accounts, then delete them.</p>
      <h2>6. Your rights</h2>
      <p>You can ask us at any time to see the information we hold about you, correct it, or delete it. Message us on WhatsApp or email <a href={`mailto:${settings.email}`}>{settings.email}</a> and we will reply within 7 working days. We handle personal data in line with Sri Lanka&apos;s Personal Data Protection Act, No. 9 of 2022.</p>
      <h2>7. Contact</h2>
      <p>Smile Shopping · WhatsApp {prettyPhone(wa)} · <a href={`mailto:${settings.email}`}>{settings.email}</a></p>
    </div>,
    terms: <div className="legal">
      <p className="updated">Last updated: {UPDATED}</p>
      <h2>1. About these terms</h2>
      <p>These terms apply when you browse smileshopping.lk or order from Smile Shopping. By placing an order you agree to them.</p>
      <h2>2. Products and colours</h2>
      <p>We photograph the actual pieces, but colours can look slightly different depending on your screen and the lighting. If you are unsure, ask us on WhatsApp for a daylight video before you order.</p>
      <h2>3. Prices</h2>
      <p>All prices are in Sri Lankan Rupees (Rs.). The delivery charge for your district is shown before you send your order. We may change prices at any time, but the price confirmed in your WhatsApp order is the price you pay.</p>
      <h2>4. Placing an order</h2>
      <p>You order by sending your order on WhatsApp from the website. Your order is accepted once we reply on WhatsApp to confirm it. If an item has sold out, we will tell you before dispatch and you will not be charged for it.</p>
      <h2>5. Payment</h2>
      <p>You pay cash on delivery when your parcel arrives. If we agree another payment method with you on WhatsApp, we will confirm the details in the chat. We never ask for card details on this website.</p>
      <h2>6. Delivery</h2>
      <p>We deliver to all 25 districts in Sri Lanka, usually within 1–5 working days of confirmation. Delivery times are estimates and can be delayed by couriers, weather or public holidays. Please give a correct address and a phone number we can reach.{settings.free_over > 0 && <> Orders over {money(settings.free_over)} ship free.</>}</p>
      <h2>7. Cancelling an order</h2>
      <p>You can cancel free of charge by messaging us before your order is dispatched. If an order is refused at the door without a good reason, we may ask you to pay the delivery charge on your next order.</p>
      <h2>8. Returns</h2>
      <p>Unused items in their original packaging can be returned within 7 days of delivery. See our <Link href="/info/returns">returns &amp; refunds</Link> page for details.</p>
      <h2>9. Your information</h2>
      <p>We use your details only to process and deliver your order. See our <Link href="/info/privacy">privacy policy</Link>.</p>
      <h2>10. Changes and law</h2>
      <p>We may update these terms from time to time; the version on this page applies to new orders. These terms are governed by the laws of Sri Lanka.</p>
      <h2>11. Contact</h2>
      <p>Questions about these terms? WhatsApp {prettyPhone(wa)} or email <a href={`mailto:${settings.email}`}>{settings.email}</a>.</p>
    </div>,
  }[slug];

  if (!page.image) return <section className="wrap info"><p className="eyebrow">{page.eyebrow}</p><h1 style={{ marginTop: 14 }}>{page.title}</h1>{body}</section>;
  return (
    <>
      <PageHero {...page} />
      <section className="wrap info info-body">{body}</section>
    </>
  );
}
