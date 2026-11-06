import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { WAIcon } from '@/components/icons';
import { getCategories, getProducts, getSettings, getZones } from '@/lib/data';
import { money, waLink } from '@/lib/format';

const COLOURS = ['Silver & Royal Purple', 'Peacock Teal', 'Black & Crimson', 'Tangerine', 'Powder Blue', 'Rani Pink', 'Maroon & Green', 'Sage & Sky', 'Lavender & Wine', 'Mustard & Black', 'Royal Blue', 'Plum Wine'];

const FAQ = [
  ['What is included with a half saree?', 'The Kanjivaram silk set comes with 3.5 m of lehenga fabric, about 0.8 m of blouse fabric and a 2.2 m Banarasi voni (dupatta). The Kanchi cotton lehenga comes stitched, with an unstitched blouse, a georgette dupatta and a drawstring.'],
  ['What waist size does the lehenga fit?', 'The stitched Kanchi cotton lehenga supports a waist up to 42 inches, with a 41 inch length and a 3 metre flair. It closes with a drawstring and zip.'],
  ['Is it ready stock?', 'Yes. Every colour on the site is in ready stock in Sri Lanka and ships within 1–2 working days of your order.'],
  ['How do I pay?', 'Pay securely online by card, or choose cash on delivery and pay the rider when your order arrives.'],
  ['Will the colour match the photos?', 'We photograph the actual pieces, and the quality is the same as in the video. If you want to see a colour in daylight, message us on WhatsApp and we will send a quick clip.'],
];

const pick = (ps, slug) => ps.find(p => p.slug.endsWith(slug)) || ps[0];

export default async function Home() {
  const [cats, products, settings, zones] = await Promise.all([getCategories(), getProducts(), getSettings(), getZones()]);
  const featured = products.filter(p => p.featured);
  const from = zones.length ? Math.min(...zones.map(z => z.rate)) : 350;
  const wa = settings.whatsapp;
  const img = (slug, i = 0) => pick(products, slug)?.images?.[i] || '/icon.png';
  const heroShots = [img('purple-peacock-teal'), img('magenta-midnight-navy'), img('red-navy')];
  const mosaic = ['mustard-black', 'teal-navy', 'sunflower-green', 'ash-grey-navy', 'magenta-midnight-navy', 'emerald-navy', 'navy-marigold', 'royal-blue']
    .map(s => pick(products, s)).filter(Boolean);
  const catInfo = {
    'kanjivaram-silk': { pill: 'Rs. 4,900 · 12 colours', blurb: 'Silk zari lehenga, blouse and a Banarasi voni. Light, festive and ready to drape.', shot: img('silver-royal-purple', 1) },
    'kanchi-cotton': { pill: 'Rs. 7,200 · Stitched', blurb: 'South-style Kanchi cotton with zari weaving. Stitched lehenga, blouse fabric and georgette dupatta.', shot: img('maroon-bottle-green', 1) },
  };

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">{heroShots.map((s, i) => <img key={i} src={s} alt="" />)}</div>
        <div className="hero-in">
          <p className="eyebrow">New · 12 colours in ready stock</p>
          <h1>Heritage woven in silk &amp; zari</h1>
          <p className="lede">Kanjivaram silk half sarees and South-style Kanchi cotton lehengas, crafted with love and delivered to all 25 districts of Sri Lanka.</p>
          <div className="cta-row">
            <Link className="btn btn-light" href="/shop">Shop the collection <span className="arrow">→</span></Link>
            <a className="btn" href={waLink(wa, 'Hi Smile Shopping! I need help choosing a lehenga.')} target="_blank" rel="noopener"><WAIcon /> Ask on WhatsApp</a>
          </div>
        </div>
        <span className="scrollcue" aria-hidden="true" />
      </section>

      <section className="wrap split">
        <div>
          <p className="eyebrow">Our collection</p>
          <h2>Crafted with love, adorned with heritage</h2>
          <p>A South-style lehenga is more than attire. It is a piece of art that carries the essence of South Indian culture: rich zari borders, deep jewel tones and a flair that moves beautifully at every function, pooja and festival.</p>
          <p>Every set is 100% pure quality, the same as you see in our photos and videos, and ready to ship today.</p>
          <Link className="btn btn-brand" href="/shop" style={{ marginTop: 18 }}>Explore all colours <span className="arrow">→</span></Link>
        </div>
        <div className="duo">
          <div className="split-img"><img src={img('olive-black')} alt="Kanchi cotton lehenga in olive and black" /></div>
          <div className="split-img">
            <img src={img('black-crimson')} alt="Kanjivaram silk half saree in black and crimson" />
            <div className="stamp"><b>{products.length}</b><small>colours in ready stock</small></div>
          </div>
        </div>
      </section>

      <section className="marquee" aria-label="Colours available">
        <div className="marquee-track">
          {[0, 1].map(k => <div key={k} aria-hidden={k === 1}>{COLOURS.map(c => <span key={c}>{c}</span>)}</div>)}
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 120 }}>
        <div className="center" style={{ marginBottom: 54 }}>
          <p className="eyebrow">What we offer</p>
          <h2 style={{ marginTop: 18 }}>Shop by collection</h2>
          <p className="lead" style={{ marginTop: 20 }}>Two signature styles, each in a palette of jewel tones with hand-finished zari borders.</p>
        </div>
        <div className="collections">
          {cats.map(c => {
            const n = products.filter(p => p.category_id === c.id).length;
            const info = catInfo[c.slug] || { pill: `${n} pieces`, blurb: '', shot: products.find(p => p.category_id === c.id)?.images?.[0] };
            return (
              <Link key={c.id} className="coll" href={`/shop?cat=${c.slug}`}>
                {info.shot && <img src={info.shot} alt="" />}
                <span className="pill">{info.pill}</span>
                <h3>{c.name}</h3>
                {info.blurb && <p>{info.blurb}</p>}
                <span className="go">Explore {n} colours <span className="arrow">→</span></span>
              </Link>
            );
          })}
          <Link className="coll" href="/shop">
            <img src={img('sage-sky-blue')} alt="" />
            <span className="pill">Ready stock</span>
            <h3>The full edit</h3>
            <p>Every half saree and lehenga in one place. Filter by collection, search a colour and order in a minute.</p>
            <span className="go">View everything <span className="arrow">→</span></span>
          </Link>
        </div>
      </section>

      <section className="wrap split rev">
        <div className="split-img"><img src={img('peacock-teal-rani-pink')} alt="Peacock teal and rani pink half saree" /></div>
        <div>
          <p className="eyebrow">Why it feels special</p>
          <h2>Made for every celebration</h2>
          <h3>Pure Kanjivaram zari</h3>
          <p>Woven zari borders with temple and peacock motifs that catch the light, paired with a Banarasi voni for that classic South Indian drape.</p>
          <h3>Comfort in Kanchi cotton</h3>
          <p>A stitched lehenga with canvas lining and a micro cotton inner, so it holds its shape through long ceremonies and still feels light.</p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div><p className="eyebrow">The edit</p><h2 style={{ marginTop: 18 }}>This week&apos;s favourites</h2></div>
          <Link href="/shop">View all {products.length}</Link>
        </div>
        {products.length
          ? <div className="grid">{(featured.length ? featured : products).slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}</div>
          : <p className="empty"><b>Products are on their way</b>Add your first product from the admin dashboard.</p>}
      </section>

      <section className="statement">
        <div className="wrap statement-g">
          <div>
            <p className="eyebrow">Smile Shopping</p>
            <h2><span>Drape the</span><span className="grad-text">tradition.</span><span>Own the day.</span></h2>
            <Link className="btn btn-light" href="/shop" style={{ marginTop: 34 }}>Find your colour <span className="arrow">→</span></Link>
          </div>
          <div className="fan" aria-hidden="true">
            {['plum-wine', 'sunflower-green', 'black-gold'].map(s => <img key={s} src={img(s)} alt="" />)}
          </div>
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 110 }}>
        <div className="sec-head">
          <div><p className="eyebrow">Lookbook</p><h2 style={{ marginTop: 18 }}>Seen in the wild</h2></div>
          <Link href="/shop">Shop the looks</Link>
        </div>
        <div className="mosaic">
          {mosaic.map(p => (
            <Link key={p.id} href={`/product/${p.slug}`} data-name={p.name}><img src={p.images[0]} alt={p.name} loading="lazy" /></Link>
          ))}
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 110 }}>
        <div className="center" style={{ marginBottom: 54 }}>
          <p className="eyebrow">Why choose us</p>
          <h2 style={{ marginTop: 18 }}>Why Smile Shopping?</h2>
        </div>
        <div className="features">
          <div className="feat"><i>✦</i><h3>Pure quality</h3><p>The same fabric, zari and colours you see in our photos and videos. No surprises.</p></div>
          <div className="feat"><i>⚡</i><h3>Ready stock</h3><p>Every colour is here in Sri Lanka, packed and dispatched within 1–2 working days.</p></div>
          <div className="feat"><i>🚚</i><h3>Island-wide</h3><p>Delivery to all 25 districts from {money(from)}{settings.free_over > 0 && <>, free over {money(settings.free_over)}</>}.</p></div>
          <div className="feat"><i>💬</i><h3>Real people</h3><p>Questions about size, colour or delivery? Our team replies on WhatsApp within minutes.</p></div>
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 110 }}>
        <div className="center" style={{ marginBottom: 54 }}>
          <p className="eyebrow">Pricing</p>
          <h2 style={{ marginTop: 18 }}>Choose your set</h2>
        </div>
        <div className="packs">
          <div className="pack">
            <p className="eyebrow">Kanjivaram silk</p>
            <h3>Silk zari half saree</h3>
            <div className="amt">Rs. 4,900<small>/ set</small></div>
            <ul>
              <li>Lehenga fabric: 3.5 meters</li>
              <li>Blouse fabric: 0.80 meter approx</li>
              <li>Banarasi voni (dupatta): 2.20 meters</li>
              <li>12 colours · 550 g · ready stock</li>
            </ul>
            <Link className="btn btn-light" href="/shop?cat=kanjivaram-silk">Shop silk half sarees <span className="arrow">→</span></Link>
          </div>
          <div className="pack hot">
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
            <Link className="btn btn-brand" href="/shop?cat=kanchi-cotton">Shop cotton lehengas <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 110 }}>
        <div className="center" style={{ marginBottom: 54 }}>
          <p className="eyebrow">How it works</p>
          <h2 style={{ marginTop: 18 }}>Ordering is easy</h2>
        </div>
        <div className="steps-g">
          <div className="st"><h3>Pick your colour</h3><p>Browse both collections, open a colour to see every photo and the full fabric details.</p></div>
          <div className="st"><h3>Checkout</h3><p>One short page. Pay securely by card, or choose cash on delivery.</p></div>
          <div className="st"><h3>We deliver</h3><p>Packed with care and at your door in 1–5 working days, anywhere in Sri Lanka.</p></div>
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 110 }}>
        <div className="center" style={{ marginBottom: 40 }}>
          <p className="eyebrow">FAQ</p>
          <h2 style={{ marginTop: 18 }}>Questions, answered</h2>
        </div>
        <div className="faq">
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 110 }}>
        <div className="closer">
          <div className="closer-cols" aria-hidden="true">
            {[0, 1].map(col => (
              <div key={col} className="closer-col">
                {[0, 1].map(k => (
                  <div key={k}>
                    {products.filter((_, i) => i % 2 === col).slice(0, 8).map(p => <img key={p.id} src={p.images[p.images.length > 1 ? 1 : 0]} alt="" loading="lazy" />)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="eyebrow">Ready when you are</p>
          <h2>Find the lehenga for your day</h2>
          <div className="cta-row">
            <Link className="btn btn-light" href="/shop">Shop now <span className="arrow">→</span></Link>
            <a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping!')} target="_blank" rel="noopener"><WAIcon /> Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
