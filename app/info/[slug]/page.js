import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { WAIcon } from '@/components/icons';
import PageHero from '@/components/PageHero';
import CallbackForm from '@/components/CallbackForm';
import { getSettings, getZones } from '@/lib/data';
import { money, waLink, prettyPhone } from '@/lib/format';

const PAGES = {
  about: { title: 'About Smile Shopping', eyebrow: 'Who we are', image: '/images/banner-about.jpg', pos: 'center 12%', intro: 'Kanjivaram silk half sarees and South-style Kanchi cotton lehengas, in ready stock for every district in Sri Lanka.' },
  contact: { title: 'Contact us', eyebrow: 'Get in touch', image: '/images/banner-contact.jpg', pos: 'center 35%', intro: 'Questions about a colour, size or delivery? A real person replies on WhatsApp within minutes.' },
  'how-to-order': { title: 'How to order', eyebrow: 'Ordering', image: '/images/banner-howto.jpg', pos: 'center 40%', intro: 'Every order is placed and confirmed on WhatsApp. No card, no account. Pay when it arrives.' },
  delivery: { title: 'Delivery information', eyebrow: 'Island-wide', image: '/images/banner-delivery.jpg', pos: 'center 40%', intro: 'We deliver to all 25 districts. Charges depend on your district and are shown before you send your order.' },
  returns: { title: 'Returns & refunds', eyebrow: 'Easy returns', image: '/images/banner-returns.jpg', pos: 'center 30%', intro: 'Return unused items in original packaging within 7 days of delivery.' },
  privacy: { title: 'Privacy policy', eyebrow: 'Legal' },
  terms: { title: 'Terms & conditions', eyebrow: 'Legal' },
};

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
  if (slug === 'payment') permanentRedirect('/info/how-to-order');
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
            <a className="card ccard" href="mailto:hello@smileshopping.lk" data-rv style={{ '--d': '.12s' }}>
              <i><Mail /></i><small>Email</small><b>hello@smileshopping.lk</b><span>We reply within one working day</span>
            </a>
            <div className="card ccard" data-rv style={{ '--d': '.18s' }}>
              <i><Clock /></i><small>Opening hours</small><b>9.00am – 7.00pm</b><span>Monday to Saturday</span>
            </div>
          </div>

          <div className="contact-g">
            <div className="contact-img" data-rv><img src="/images/look-3.jpg" alt="Model wearing a pink lehenga with a zari dupatta" loading="lazy" /></div>
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
    privacy: <>
      <p>We collect only what we need to deliver your order: name, mobile number, address and, optionally, email. We never sell your information.</p>
      <p>Final policy text to be supplied by Smile Shopping.</p>
    </>,
    terms: <>
      <p>Prices are in Sri Lankan Rupees and include applicable taxes. Product availability is confirmed when your order is placed.</p>
      <p>Final terms to be supplied by Smile Shopping.</p>
    </>,
  }[slug];

  if (!page.image) return <section className="wrap info"><p className="eyebrow">{page.eyebrow}</p><h1 style={{ marginTop: 14 }}>{page.title}</h1>{body}</section>;
  return (
    <>
      <PageHero {...page} />
      <section className="wrap info info-body">{body}</section>
    </>
  );
}
