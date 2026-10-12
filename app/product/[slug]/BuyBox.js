'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import ProductImage from '@/components/ProductImage';
import { WAIcon } from '@/components/icons';
import { money, discount, plumeStyle, waLink } from '@/lib/format';
import { track } from '@/lib/track';

export default function BuyBox({ p, whatsapp, deliveryFrom }) {
  const { add } = useCart();
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [variant, setVariant] = useState(p.variants?.[0] || null);
  const [qty, setQty] = useState(1);
  const out = p.stock <= 0;
  const low = !out && p.stock <= 5;
  const off = discount(p);
  const shots = p.images?.length ? p.images : [null];

  useEffect(() => {
    document.body.classList.add('pdp');
    track('ViewContent', { content_ids: [p.slug], content_type: 'product', value: p.price, currency: 'LKR' });
    return () => document.body.classList.remove('pdp');
  }, [p.slug, p.price]);

  const addIt = silent => {
    const ok = add(p, variant, qty, silent);
    if (ok) track('AddToCart', { content_ids: [p.slug], value: p.price * qty, currency: 'LKR' });
    return ok;
  };

  return (
    <>
      <section className="pd">
        <div>
          <div className="gal-main plume" style={plumeStyle(p.category)}>
            <ProductImage product={p} index={img} priority />
            {off > 0 && <span className="badge" style={{ fontSize: 15, top: 18, left: 18 }}>Save {money(p.was_price - p.price)}</span>}
          </div>
          {shots.length > 1 && (
            <div className="thumbs">
              {shots.map((s, i) => (
                <button key={i} type="button" className={`thumb ${i === img ? 'on' : ''}`} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`}>
                  <img src={s} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          {p.category && <span className="tag-cat">{p.category.name}</span>}
          <h1 className="pd-name">{p.name}</h1>
          <div className="pd-price">
            <span className="price">{money(p.price)}</span>
            {off > 0 && <><span className="was">{money(p.was_price)}</span><span className="save">-{off}%</span></>}
          </div>
          <div className={`stock ${out ? 'out' : low ? 'low' : ''}`}>
            {out ? 'Sold out. Ask us on WhatsApp for restock dates' : low ? `Only ${p.stock} left` : 'In stock, ready to ship'}
          </div>

          {p.variants?.length > 0 && (
            <>
              <span className="lbl">{p.variant_label || 'Option'}</span>
              <div className="chips" style={{ margin: 0 }}>
                {p.variants.map(v => (
                  <button key={v} type="button" className={`chip ${v === variant ? 'on' : ''}`} onClick={() => setVariant(v)}>{v}</button>
                ))}
              </div>
            </>
          )}

          <span className="lbl">Quantity</span>
          <div className="stepper">
            <button type="button" aria-label="Decrease" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button type="button" aria-label="Increase" onClick={() => setQty(q => Math.min(Math.max(1, p.stock), q + 1))}>+</button>
          </div>

          <div className="buyrow">
            <button className="btn btn-brand" type="button" disabled={out} onClick={() => addIt(false)}>Add to cart</button>
            <button className="btn btn-ink" type="button" disabled={out} onClick={() => { if (addIt(true)) router.push('/checkout'); }}>Buy now</button>
          </div>

          <a className="wa-cta" href={waLink(whatsapp, `Hi Smile Shopping! I have a question about: ${p.name} (${money(p.price)})`)} target="_blank" rel="noopener">
            <span className="wico"><WAIcon /></span>
            <span><b>Questions about this product?</b><small>Chat with us on WhatsApp. We reply in minutes</small></span>
          </a>

          <div className="dbox">
            <div><span>🚚</span><span>Colombo in 1–2 working days, rest of the island in 2–5 days. From {money(deliveryFrom)}.</span></div>
            <div><span>💳</span><span>Pay securely by card online, or cash on delivery.</span></div>
            <div><span>↩︎</span><span>7-day returns on unused items. <Link href="/info/returns">Details</Link></span></div>
          </div>
          {p.description && <p className="desc">{p.description}</p>}
        </div>
      </section>

      <div className="buybar">
        <span className="bb-p">{money(p.price)}</span>
        <button className="btn btn-brand" type="button" disabled={out} onClick={() => addIt(false)}>{out ? 'Sold out' : 'Add to cart'}</button>
      </div>
    </>
  );
}
