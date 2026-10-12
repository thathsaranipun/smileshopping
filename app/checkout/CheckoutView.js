'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { ReceiptHead, ReceiptLine, deliveryFor, zoneFor } from '@/components/Receipt';
import { supabase } from '@/lib/supabase';
import { money, DISTRICTS } from '@/lib/format';
import { track } from '@/lib/track';
import { DKEY } from '../cart/CartView';

const FKEY = 'ss-checkout';

export default function CheckoutView({ zones, settings }) {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ customer_name: '', mobile: '', email: '', address: '', district: '', notes: '', pay_method: 'online' });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FKEY) || '{}');
      setF(x => ({ ...x, ...saved, district: saved.district || localStorage.getItem(DKEY) || '' }));
    } catch {}
  }, []);
  useEffect(() => { if (ready && items.length) track('InitiateCheckout', { value: subtotal, currency: 'LKR', num_items: items.length }); }, [ready]); // eslint-disable-line

  const set = (k, v) => {
    const n = { ...f, [k]: v }; setF(n); setErrs(e => ({ ...e, [k]: null }));
    try { const { notes, ...keep } = n; localStorage.setItem(FKEY, JSON.stringify(keep)); if (k === 'district') localStorage.setItem(DKEY, v); } catch {}
  };

  if (!ready) return null;
  if (!items.length) {
    return <section className="wrap"><div className="empty"><b>Your cart is empty</b>Add a product to start checkout.<br /><br /><Link className="btn btn-brand" href="/shop">Browse products</Link></div></section>;
  }

  const del = deliveryFor(zones, settings, subtotal, f.district);
  const zone = zoneFor(zones, f.district);

  const submit = async () => {
    const e = {};
    if (f.customer_name.trim().length < 2) e.customer_name = 'Enter your full name';
    if (!/^0\d{9}$/.test(f.mobile.replace(/\s/g, ''))) e.mobile = 'Enter a 10-digit mobile number starting with 0';
    if (f.email && !/.+@.+\..+/.test(f.email)) e.email = 'Check your email address';
    if (f.address.trim().length < 5) e.address = 'Enter your delivery address';
    if (!f.district) e.district = 'Select your district';
    setErrs(e);
    if (Object.keys(e).length) { document.querySelector('.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setBusy(true); setFail('');
    const payload = { ...f, mobile: f.mobile.replace(/\s/g, ''), items: items.map(l => ({ product_id: l.product_id, qty: l.qty, variant: l.variant })) };
    const { data: token, error } = await supabase.rpc('place_order', { p: payload });
    setBusy(false);
    if (error) { setFail(error.message || 'Could not place the order. Please try again.'); return; }
    track('Purchase', { value: subtotal + (del || 0), currency: 'LKR' });
    clear();
    router.push(f.pay_method === 'cod' ? `/order/${token}` : `/pay/${token}`);
  };

  const field = (k, label, props = {}) => (
    <div className="f">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} className={errs[k] ? 'bad' : ''} value={f[k]} onChange={e => set(k, e.target.value)} {...props} />
      <div className="err">{errs[k]}</div>
    </div>
  );

  return (
    <section className="wrap">
      <div className="flow"><span className="done">1 Cart</span><span className="on">2 Details</span><span>3 Payment</span><span>4 Done</span></div>
      <div className="co">
        <div>
          <h1 className="pg-title" style={{ marginBottom: 18 }}>Checkout</h1>
          {field('customer_name', 'Full name', { placeholder: 'e.g. Nimali Perera', autoComplete: 'name' })}
          <div className="f-row">
            {field('mobile', 'Mobile number', { type: 'tel', inputMode: 'tel', placeholder: '07X XXX XXXX', autoComplete: 'tel' })}
            {field('email', <>Email <small>(optional, for receipt)</small></>, { type: 'email', placeholder: 'you@email.com', autoComplete: 'email' })}
          </div>
          {field('address', 'Delivery address', { placeholder: 'House no, street, town', autoComplete: 'street-address' })}
          <div className="f">
            <label htmlFor="f-district">District</label>
            <select id="f-district" className={errs.district ? 'bad' : ''} value={f.district} onChange={e => set('district', e.target.value)}>
              <option value="">Select district</option>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <div className="err">{errs.district}</div>
          </div>
          {field('notes', <>Delivery note <small>(optional)</small></>, { placeholder: 'Landmark, best time to call…' })}
          <span className="lbl">Payment</span>
          <label className="popt">
            <input type="radio" name="pay" checked={f.pay_method === 'online'} onChange={() => set('pay_method', 'online')} />
            <span><b>Pay online</b><small>Visa, Mastercard, Amex via secure gateway</small></span>
            <span className="cards"><i>VISA</i><i>MC</i><i>AMEX</i></span>
          </label>
          <label className="popt">
            <input type="radio" name="pay" checked={f.pay_method === 'cod'} onChange={() => set('pay_method', 'cod')} />
            <span><b>Cash on delivery</b><small>Pay the rider when your order arrives</small></span>
          </label>
        </div>

        <div className="sumbox">
          <div className="receipt">
            <ReceiptHead title="Order summary" />
            {items.map(l => <ReceiptLine key={`${l.product_id}-${l.variant}`} item={l} />)}
            <div className="r-line" style={{ marginTop: 10 }}><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="r-line"><span>Delivery{f.district ? ` to ${f.district}` : ''}</span><span>{del === null ? '—' : del === 0 ? 'FREE' : money(del)}</span></div>
            {zone && <div className="r-note">{zone.days}</div>}
            <div className="r-line r-total"><span>Total</span><span>{money(subtotal + (del || 0))}</span></div>
            {fail && <div className="err" style={{ display: 'block', fontFamily: 'var(--fd)' }}>{fail}</div>}
            <button className="btn btn-brand btn-block" type="button" style={{ marginTop: 18 }} disabled={busy} onClick={submit}>
              {busy ? 'Placing order…' : f.pay_method === 'cod' ? 'Place order' : 'Place order & pay'}
            </button>
            <div className="r-note" style={{ textAlign: 'center', marginTop: 10 }}>🔒 Card details are handled by the payment gateway, never stored on this site.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
