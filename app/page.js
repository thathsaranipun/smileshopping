import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import StatCounter from '@/components/StatCounter';
import CallbackForm from '@/components/CallbackForm';
import { WAIcon } from '@/components/icons';
import { getCategories, getProducts, getSettings, getZones } from '@/lib/data';
import { money, waLink } from '@/lib/format';

const COLOURS = ['Silver & Royal Purple', 'Peacock Teal', 'Black & Crimson', 'Tangerine', 'Powder Blue', 'Rani Pink', 'Maroon & Green', 'Sage & Sky', 'Lavender & Wine', 'Mustard & Black', 'Royal Blue', 'Plum Wine'];

const FAQ = [
  ['How do I place an order?', 'Add your colours to the cart and tap "Send order on WhatsApp", or tap "Order on WhatsApp" on any product. Your order arrives in our chat with the items, total and delivery details already filled in. We confirm it there within minutes.'],
  ['How do I pay?', 'There is no online payment. Pay the rider in cash when your order arrives. If you would rather pay another way, tell us on WhatsApp when we confirm your order.'],
  ['What is included with a half saree?', 'The Kanjivaram silk set comes with 3.5 m of lehenga fabric, about 0.8 m of blouse fabric and a 2.2 m Banarasi voni (dupatta). The Kanchi cotton lehenga comes stitched, with an unstitched blouse, a georgette dupatta and a drawstring.'],
  ['What waist size does the lehenga fit?', 'The stitched Kanchi cotton lehenga supports a waist up to 42 inches, with a 41 inch length and a 3 metre flair. It closes with a drawstring and zip.'],
  ['Is it ready stock?', 'Yes. Every colour on the site is in ready stock in Sri Lanka and ships within 1–2 working days of your order being confirmed.'],
  ['Will the colour match the photos?', 'We photograph the actual pieces, and the quality is the same as in the video. If you want to see a colour in daylight, message us on WhatsApp and we will send a quick clip.'],
];

const VALUES = [
  ['Pure quality', 'The same fabric, zari and colours you see in our photos and videos. No surprises when the parcel opens.'],
  ['Ready stock', 'Every colour is here in Sri Lanka, packed and dispatched within 1–2 working days of confirmation.'],
  ['Island-wide', 'Delivery to all 25 districts with clear rates by district, shown before you send your order.'],
  ['Real people', 'Questions about size, colour or delivery? A real person replies on WhatsApp within minutes.'],
];

const STEP_IMG = ['/images/banner-returns.jpg', '/images/look-3.jpg', '/images/band-cta.jpg', '/images/coll-silk.jpg'];

const STEPS = [
  ['Pick your colour', 'Browse both collections and open a colour to see every photo and the full fabric details.'],
  ['Send on WhatsApp', 'Tap "Order on WhatsApp". Your items, total and address go to us in one ready-made message.'],
  ['We confirm & pack', 'We reply to confirm stock and delivery, then pack your set with care the same or next day.'],
  ['Pay on delivery', 'Your parcel arrives in 1–5 working days. Pay the rider in cash when it reaches your door.'],
];

const LOOKS = [
  ['/images/look-2.jpg', 'Bride in an orange embroidered lehenga with a net dupatta'],
  ['/images/look-1.jpg', 'Model in a printed saree under a stone archway'],
  ['/images/look-5.jpg', 'Emerald green blouse with a tie-back and lace border'],
  ['/images/look-4.jpg', 'Model in a pastel lehenga by an old doorway'],
  ['/images/band-cta.jpg', 'Close-up of a red silk saree with a zari border'],
];

const Arr = () => <span className="arr" aria-hidden="true">→</span>;

export default async function Home() {
  const [cats, products, settings, zones] = await Promise.all([getCategories(), getProducts(), getSettings(), getZones()]);
  const from = zones.length ? Math.min(...zones.map(z => z.rate)) : 350;
  const wa = settings.whatsapp;
  const catInfo = {
    'kanjivaram-silk': { tag: 'Silk', blurb: 'Silk zari lehenga, blouse and a Banarasi voni. Light, festive and ready to drape.', shot: '/images/coll-silk.jpg' },
    'kanchi-cotton': { tag: 'Cotton', blurb: 'South-style Kanchi cotton with zari weaving. Stitched lehenga, blouse fabric and georgette dupatta.', shot: '/images/coll-cotton.jpg' },
  };

  return (
    <>
      {/* 1. Hero */}
      <section className="hx" data-cover>
        {/* Cover photo: replace public/images/hero.jpg to change it. */}
        <div className="hx-bg" aria-hidden="true"><img src="/images/hero.jpg" alt="" /></div>
        <div className="wrap hx-in">
          <div className="hx-copy">
            <p className="eyebrow">Ready stock · Sri Lanka · Island-wide delivery</p>
            <h1>Timeless elegance in <em>every drape</em></h1>
            <p className="lede">Kanjivaram silk half sarees and South-style Kanchi cotton lehengas. Pick your colour, send your order on WhatsApp and pay when it arrives.</p>
            <div className="cta-row">
              <Link className="btn btn-light" href="/shop">Shop the collection <Arr /></Link>
              <a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping! I would like to order.')} target="_blank" rel="noopener"><WAIcon /> Order on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who we are */}
      <section className="wrap sx who">
        <div className="who-img" data-rv>
          <img src="/images/who.jpg" alt="Model in a crimson lehenga and net dupatta" loading="lazy" />
          <div className="stamp"><b>{products.length}</b><small>colours ready to ship</small></div>
        </div>
        <div data-rv>
          <p className="eyebrow">Who we are</p>
          <h2>Crafted with love, adorned with heritage</h2>
          <p>A South-style lehenga is more than attire. It carries the essence of South Indian culture: rich zari borders, deep jewel tones and a flair that moves beautifully at every function, pooja and festival.</p>
          <p>Smile Shopping keeps it simple: fair prices, real photos, fast delivery and a real person on WhatsApp.</p>
          <ul className="checks">
            <li>100% pure quality, as in our videos</li>
            <li>Ready stock in Sri Lanka</li>
            <li>Order in one WhatsApp message</li>
            <li>Cash on delivery, island-wide</li>
          </ul>
          <div className="cta-row" style={{ marginTop: 0 }}>
            <Link className="btn btn-light" href="/info/about">More about us <Arr /></Link>
            <Link className="btn btn-line" href="/info/how-to-order">How to order</Link>
          </div>
        </div>
      </section>

      {/* 3. Values */}
      <section className="wrap sx" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="Our promise" title="Why Smile Shopping?" />
        <div className="values">
          {VALUES.map(([t, d], i) => (
            <div key={t} className="card vcard" data-rv style={{ '--d': `${i * 0.08}s` }}>
              <span className="num">0{i + 1}</span><h3>{t}</h3><p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Stats band */}
      <section className="stats" aria-label="Smile Shopping in numbers" style={{ '--bgimg': 'url(/images/band-stats.jpg)' }}>
        <StatCounter value={products.length} suffix="+" label="Colours in stock" />
        <StatCounter value={cats.length} label="Collections" />
        <StatCounter value={25} label="Districts delivered" />
        <StatCounter value={7} label="Day easy returns" />
      </section>

      {/* 5. Collections */}
      <section className="wrap sx">
        <SectionHeading eyebrow="What we offer" title="Shop by collection" intro="Two signature styles, each in a palette of jewel tones with hand-finished zari borders." />
        <div className="collections">
          {cats.map((c, i) => {
            const n = products.filter(p => p.category_id === c.id).length;
            const info = catInfo[c.slug] || { tag: 'Collection', blurb: '', shot: products.find(p => p.category_id === c.id)?.images?.[0] };
            return (
              <Link key={c.id} className="coll" href={`/shop?cat=${c.slug}`} data-rv style={{ '--d': `${i * 0.08}s` }}>
                {info.shot && <img src={info.shot} alt="" />}
                <span className="pill">{info.tag}</span>
                <h3>{c.name}</h3>
                {info.blurb && <p>{info.blurb}</p>}
                <span className="go">Explore {n} colours <span className="arrow">→</span></span>
              </Link>
            );
          })}
          <Link className="coll" href="/shop" data-rv style={{ '--d': '.16s' }}>
            <img src="/images/coll-all.jpg" alt="" />
            <span className="pill">All</span>
            <h3>The full edit</h3>
            <p>Every half saree and lehenga in one place. Filter by collection, search a colour and order in a minute.</p>
            <span className="go">View everything <span className="arrow">→</span></span>
          </Link>
        </div>
      </section>

      {/* Lookbook */}
      <section className="wrap sx" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="Lookbook" title="Made for every celebration" intro="Weddings, poojas, festivals and family functions. A drape for every moment." />
        <div className="look">
          {LOOKS.map(([src, alt], i) => (
            <figure key={src} className={`look-i look-${i + 1}`} data-rv style={{ '--d': `${i * 0.06}s` }}>
              <img src={src} alt={alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      {/* 7. Sets */}
      <section className="wrap sx" style={{ paddingTop: 0 }}>
        <SectionHeading center eyebrow="Pricing" title="Choose your set" />
        <div className="packs">
          <div className="pack" data-rv>
            <p className="eyebrow">Kanjivaram silk</p>
            <h3>Silk zari half saree</h3>
            <div className="amt">Rs. 4,900<small>/ set</small></div>
            <ul>
              <li>Lehenga fabric: 3.5 meters</li>
              <li>Blouse fabric: 0.80 meter approx</li>
              <li>Banarasi voni (dupatta): 2.20 meters</li>
              <li>12 colours · 550 g · ready stock</li>
            </ul>
            <Link className="btn btn-line" href="/shop?cat=kanjivaram-silk">Shop silk half sarees <Arr /></Link>
          </div>
          <div className="pack hot" data-rv style={{ '--d': '.08s' }}>
            <span className="ribbon">Most loved</span>
            <p className="eyebrow">Kanchi cotton</p>
            <h3>Stitched lehenga set</h3>
            <div className="amt">Rs. 7,200<small>/ set</small></div>
            <ul>
              <li>Stitched lehenga with canvas, waist up to 42, 3 m flair</li>
              <li>Unstitched blouse with zari weaving: 0.90 meter</li>
              <li>Georgette dupatta with lace border: 2.5 meters</li>
              <li>Drawstring included · 0.9 kg · ready stock</li>
            </ul>
            <Link className="btn btn-light" href="/shop?cat=kanchi-cotton">Shop cotton lehengas <Arr /></Link>
          </div>
        </div>
      </section>

      {/* 8. How it works */}
      <section className="wrap sx" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="How it works" title="Ordering takes a minute" intro={`No card, no account. Delivery from ${money(from)}${settings.free_over > 0 ? `, free over ${money(settings.free_over)}` : ''}.`} />
        <div className="steps4">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="card step step-img" data-rv style={{ '--d': `${i * 0.08}s`, '--bgimg': `url(${STEP_IMG[i]})` }}><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </section>

      {/* 9. Colour marquee */}
      <section className="marquee" aria-label="Colours available">
        <div className="marquee-track">
          {[0, 1].map(k => <div key={k} aria-hidden={k === 1}>{COLOURS.map(c => <span key={c}>{c}</span>)}</div>)}
        </div>
      </section>

      {/* 10. FAQ + call back */}
      <section className="wrap sx">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="faq-g">
          <div className="faq" data-rv>
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
          <CallbackForm whatsapp={wa} />
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="wrap" style={{ paddingBottom: 'clamp(72px, 9vw, 120px)' }}>
        <div className="ctaband" data-rv style={{ '--bgimg': 'url(/images/banner-returns.jpg)' }}>
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2>Find the lehenga for your day</h2>
            <p>Send us the colour you love on WhatsApp. We confirm stock, delivery and total in minutes.</p>
          </div>
          <div className="cta-row">
            <a className="btn btn-light" href={waLink(wa, 'Hi Smile Shopping! I would like to order.')} target="_blank" rel="noopener"><WAIcon /> Order on WhatsApp</a>
            <Link className="btn btn-line" href="/shop">Browse colours <Arr /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
