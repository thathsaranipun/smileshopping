'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { ReceiptHead, ReceiptLine, deliveryFor, zoneFor } from '@/components/Receipt';
import { WAIcon } from '@/components/icons';
import { supabase, configured } from '@/lib/supabase';
import { money, waLink, orderMessage, DISTRICTS } from '@/lib/format';
import { track } from '@/lib/track';
import { DKEY } from '../cart/CartView';

const FKEY = 'ss-checkout';

/* No online payment: the order is saved (so it shows in the admin dashboard) and then sent to the shop on WhatsApp.
   The customer pays cash on delivery, or however they agree with the shop in the chat. */
export default function CheckoutView({ zones, settings }) {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ customer_name: '', mobile: '', email: '', address: '', district: '', notes: '' });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FKEY) || '{}');
      delete saved.pay_method;
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
    return <section className="wrap"><div className="empty"><b>Your cart is empty</b>Add a product to start your order.<br /><br /><Link className="btn btn-brand" href="/shop">Browse products</Link></div></section>;
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

    const customer = { name: f.customer_name.trim(), mobile: f.mobile.replace(/\s/g, ''), address: f.address.trim(), district: f.district, notes: f.notes.trim() };
    const value = subtotal + (del || 0);

    if (!configured) {
      // No database yet: the WhatsApp message is the order.
      window.open(waLink(settings.whatsapp, orderMessage({ items, subtotal, delivery: del, customer })), '_blank', 'noopener');
      track('Purchase', { value, currency: 'LKR' });
      clear();
      router.push('/');
      return;
    }

    // Open the WhatsApp tab now, inside the tap, so the browser doesn't block it as a pop-up once the order is saved.
    const win = window.open('', '_blank');
    if (win) win.opener = null;
    setBusy(true); setFail('');
    const payload = { ...f, mobile: customer.mobile, pay_method: 'cod', items: items.map(l => ({ product_id: l.product_id, qty: l.qty, variant: l.variant })) };
    const { data: token, error } = await supabase.rpc('place_order', { p: payload });
    if (error) { win?.close(); setBusy(false); setFail(error.message || 'Could not place the order. Please try again.'); return; }
    const { data: o } = await supabase.rpc('get_order', { t: token });
    const msg = orderMessage({
      items: o?.items || items, subtotal: o?.subtotal ?? subtotal, delivery: o ? o.delivery : del, customer,
      orderNo: o?.order_no, link: `${location.origin}/order/${token}`,
    });
    if (win) win.location.href = waLink(settings.whatsapp, msg);
    track('Purchase', { value, currency: 'LKR' });
    clear();
    router.push(`/order/${token}`);
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
      <div className="flow"><span className="done">1 Cart</span><span className="on">2 Details</span><span>3 WhatsApp</span><span>4 Done</span></div>
      <div className="co">
        <div>
          <h1 className="pg-title" style={{ marginBottom: 18 }}>Your details</h1>
          {field('customer_name', 'Full name', { placeholder: 'e.g. Nimali Perera', autoComplete: 'name' })}
          <div className="f-row">
            {field('mobile', 'Mobile number', { type: 'tel', inputMode: 'tel', placeholder: '07X XXX XXXX', autoComplete: 'tel' })}
            {field('email', <>Email <small>(optional)</small></>, { type: 'email', placeholder: 'you@email.com', autoComplete: 'email' })}
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
          <div className="card sendbox" style={{ margin: '8px 0 0', maxWidth: 'none' }}>
            <p><b>How payment works</b><br />No card needed. We confirm your order on WhatsApp, and you pay the rider in cash when it arrives.</p>
          </div>
        </div>

        <div className="sumbox">
          <div className="receipt">
            <ReceiptHead title="Order summary" />
            {items.map(l => <ReceiptLine key={`${l.product_id}-${l.variant}`} item={l} />)}
            <div className="r-line" style={{ marginTop: 10 }}><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="r-line"><span>Delivery{f.district ? ` to ${f.district}` : ''}</span><span>{del === null ? '—' : del === 0 ? 'FREE' : money(del)}</span></div>
            {zone && <div className="r-note">{zone.days}</div>}
            <div className="r-line r-total"><span>Total</span><span>{money(subtotal + (del || 0))}</span></div>
            <div className="r-note">Pay cash on delivery</div>
            {fail && <div className="err" style={{ display: 'block' }}>{fail}</div>}
            <button className="btn btn-wa btn-block wa-big" type="button" style={{ marginTop: 18 }} disabled={busy} onClick={submit}>
              <WAIcon /> {busy ? 'Sending order…' : 'Send order on WhatsApp'}
            </button>
            <div className="r-note" style={{ textAlign: 'center', marginTop: 10 }}>WhatsApp opens with your order ready to send.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
