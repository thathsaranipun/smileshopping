import { notFound } from 'next/navigation';
import { WAIcon } from '@/components/icons';
import { getSettings, getZones } from '@/lib/data';
import { money, waLink } from '@/lib/format';

const TITLES = {
  about: 'About Smile Shopping', contact: 'Contact us', delivery: 'Delivery information', payment: 'Payment information',
  returns: 'Returns & refunds', privacy: 'Privacy policy', terms: 'Terms & conditions',
};


export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: TITLES[slug] || 'Not found', alternates: { canonical: `/info/${slug}` } };
}

export default async function Info({ params }) {
  const { slug } = await params;
  if (!TITLES[slug]) notFound();
  const [settings, zones] = await Promise.all([getSettings(), getZones()]);
  const wa = settings.whatsapp;
  const body = {
    about: <>
      <p className="script" style={{ marginBottom: 14 }}>Srilanka&apos;s best online chain</p>
      <p>Smile Shopping brings everyday things that make life brighter (home and kitchen, beauty, tech, fashion and kids&apos; favourites) to every district in Sri Lanka.</p>
      <p>We keep it simple: fair prices, clear photos, fast delivery and a real person on WhatsApp when you need help.</p>
    </>,
    contact: <>
      <p>The quickest way to reach us is WhatsApp.</p>
      <a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping!')} target="_blank" rel="noopener"><WAIcon /> Chat on WhatsApp</a>
      <p style={{ marginTop: 22 }}>WhatsApp: +{wa}<br />Email: hello@smileshopping.lk<br />Hours: Monday to Saturday, 9.00am – 7.00pm</p>
    </>,
    delivery: <>
      <p>We deliver island-wide. Charges depend on your district and are shown at checkout before you pay.{settings.free_over > 0 && <> Orders over {money(settings.free_over)} ship free.</>}</p>
      <div className="tbl-wrap"><table><thead><tr><th>Area</th><th>Delivery time</th><th>Charge</th></tr></thead>
        <tbody>{zones.map(z => <tr key={z.id}><td>{z.name}<br /><small className="mute">{z.districts.join(', ')}</small></td><td>{z.days}</td><td>{money(z.rate)}</td></tr>)}</tbody></table></div>
    </>,
    payment: <>
      <p>Pay online with Visa, Mastercard or American Express through a secure Sri Lankan payment gateway, or choose cash on delivery.</p>
      <p>Your card details are entered on the gateway&apos;s secure page and are never stored on our website.</p>
    </>,
    returns: <>
      <p>Changed your mind? Return unused items in original packaging within 7 days of delivery.</p>
      <p>Message us on WhatsApp with your order number to start a return. Refunds go back to the original payment method within 7–10 working days.</p>
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
  return <section className="wrap info"><h1>{TITLES[slug]}</h1>{body}</section>;
}
