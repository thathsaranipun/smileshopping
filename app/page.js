import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { WAIcon } from '@/components/icons';
import { getCategories, getProducts, getSettings, getZones } from '@/lib/data';
import { money, plumeStyle, waLink } from '@/lib/format';

export default async function Home() {
  const [cats, products, settings, zones] = await Promise.all([getCategories(), getProducts(), getSettings(), getZones()]);
  const featured = products.filter(p => p.featured);
  const hero = (featured.length >= 4 ? featured : products).slice(0, 4);
  const from = zones.length ? Math.min(...zones.map(z => z.rate)) : 350;
  const wa = settings.whatsapp;

  return (
    <>
      <section className="hero">
        <div className="wrap hero-g">
          <div>
            <p className="script">Srilanka&apos;s best online chain</p>
            <h1>Everything you love, flying to your door.</h1>
            <p className="lede">Home, beauty, tech, fashion and kids&apos; favourites. Order in a minute, pay securely, and we deliver to all 25 districts.</p>
            <div className="cta-row">
              <Link className="btn btn-brand" href="/shop">Shop now</Link>
              <a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping! I need some help choosing a product.')} target="_blank" rel="noopener"><WAIcon /> Ask on WhatsApp</a>
            </div>
          </div>
          <div className="wingfan">
            {hero.map((p, i) => (
              <Link key={p.id} className={`feather f${i + 1}`} href={`/product/${p.slug}`} aria-label={p.name}>
                <span className="fx"><ProductImage product={p} priority /></span>
              </Link>
            ))}
            <img className="hero-bird" src="/bird.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="wrap promise">
        <div><i style={{ background: '#FFF4D1' }}>🚚</i><span><b>Island-wide delivery</b><small>All 25 districts, from {money(from)}</small></span></div>
        <div><i style={{ background: '#F7EAFD' }}>🔒</i><span><b>Secure payment</b><small>Card online or cash on delivery</small></span></div>
        <div><i style={{ background: '#E3F7FF' }}>↩︎</i><span><b>7-day returns</b><small>On unused items</small></span></div>
      </div>

      <section className="wrap sec">
        <div className="sec-head"><h2>Shop by category</h2><Link href="/shop">See everything</Link></div>
        <div className="cats">
          {cats.map(c => {
            const ps = products.filter(p => p.category_id === c.id);
            return (
              <Link key={c.id} className="cat plume" href={`/shop?cat=${c.slug}`} style={plumeStyle(c)}>
                <span className="cn">{c.name}</span>
                <span className="cc2">{ps.length} products</span>
                {ps[0] && <span className="cat-img"><ProductImage product={ps[0]} /></span>}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head"><h2>This week&apos;s favourites</h2><Link href="/shop">View all</Link></div>
        {products.length
          ? <div className="grid">{(featured.length ? featured : products).slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}</div>
          : <p className="empty"><b>Products are on their way</b>Add your first product from the admin dashboard.</p>}
      </section>

      {settings.free_over > 0 && (
        <section className="wrap sec">
          <div className="band"><h2>Free island-wide delivery on orders over {money(settings.free_over)}</h2><Link className="btn btn-gold" href="/shop">Start shopping</Link></div>
        </section>
      )}

      <section className="wrap sec">
        <div className="sec-head"><h2>How ordering works</h2></div>
        <div className="steps-g">
          <div className="st"><h3>Pick</h3><p>Browse by category or search, then choose your colour or size.</p></div>
          <div className="st"><h3>Pay</h3><p>One short checkout page. Pay by card or cash on delivery.</p></div>
          <div className="st"><h3>We pack</h3><p>You get an order number and updates as we prepare it.</p></div>
          <div className="st"><h3>Delivered</h3><p>At your door in 1–5 working days, anywhere in Sri Lanka.</p></div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="waband">
          <div>
            <h2>Not sure which one? Ask us on WhatsApp.</h2>
            <p>Sizes, colours, delivery times. Our team replies within minutes during business hours.</p>
            <a className="btn btn-wa" href={waLink(wa, 'Hi Smile Shopping!')} target="_blank" rel="noopener"><WAIcon /> Start a chat</a>
          </div>
          <div className="chat" aria-hidden="true">
            <div className="bub in">Hi! Is this available in another colour?</div>
            <div className="bub out">Yes 🙂 We have 3 colours in stock. Delivery to Kandy takes 2–4 days.</div>
            <div className="bub in">Perfect, ordering now!</div>
          </div>
        </div>
      </section>
    </>
  );
}
