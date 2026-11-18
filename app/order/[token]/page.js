'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReceiptHead, ReceiptLine } from '@/components/Receipt';
import { WAIcon } from '@/components/icons';
import { useOrder } from '@/lib/useOrder';
import { money, waLink, orderMessage, STAGES, STAGE_LABEL } from '@/lib/format';

export default function OrderPage() {
  const { token } = useParams();
  const [o, reload] = useOrder(token);
  const [wa, setWa] = useState('');
  useEffect(() => { supabase.from('settings').select('whatsapp').eq('id', 1).maybeSingle().then(({ data }) => setWa(data?.whatsapp || '')); }, []);

  if (o === undefined) return <section className="wrap sec" />;
  if (!o) return <section className="wrap"><div className="empty"><b>Order not found</b>Check the link, or message us on WhatsApp.<br /><br /><Link className="btn btn-brand" href="/shop">Go to shop</Link></div></section>;

  const idx = Math.max(0, STAGES.indexOf(o.status));
  const cancelled = o.status === 'Cancelled';
  const first = o.customer_name.split(' ')[0];

  return (
    <section className="wrap">
      <div className="okhead">
        <div className="okmark"><img src="/bird.webp" alt="" /></div>
        <h1>Thank you, {first}!</h1>
        <p>
          Order <span className="oid">{o.order_no}</span> is with us.{' '}
          {o.pay_status === 'Paid' ? 'It is paid.' : `Pay ${money(o.total)} in cash when it arrives.`}
          {' '}Save this page to check your order status.
        </p>
      </div>

      {wa && o.status !== 'Cancelled' && o.status !== 'Delivered' && (
        <div className="card sendbox">
          <p><b>Didn&apos;t see WhatsApp open?</b><br />Send us your order so we can confirm stock and delivery.</p>
          <a className="btn btn-wa" target="_blank" rel="noopener" href={waLink(wa, orderMessage({
            items: o.items, subtotal: o.subtotal, delivery: o.delivery, orderNo: o.order_no,
            customer: { name: o.customer_name, mobile: o.mobile, address: o.address, district: o.district }, link: typeof location !== 'undefined' ? location.href : '',
          }))}><WAIcon /> Send order on WhatsApp</a>
        </div>
      )}

      <div className="trk-card">
        <h3>{cancelled ? 'This order was cancelled' : o.status === 'Delivered' ? `Delivered to ${o.district}` : `Your order is on its way to ${o.district}`}</h3>
        {!cancelled && (
          <div className="tracker">
            <div className="trk-rail"><div className="trk-fill" style={{ width: `${(idx / 4) * 100}%` }} /></div>
            <div className="flyer" style={{ left: `calc(10% + ${(80 * idx) / 4}%)` }}><img src="/bird.webp" alt="" /></div>
            <div className="trk-stops">
              {STAGES.map((s, i) => <div key={s} className={`stop ${i <= idx ? 'done' : ''}`}><span className="dot" /><span>{STAGE_LABEL[s]}</span></div>)}
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 14 }}><button className="btn btn-line" type="button" onClick={reload} style={{ padding: '8px 16px', fontSize: 14 }}>Refresh status</button></div>
      </div>

      <div className="receipt">
        <ReceiptHead title={`Order ${o.order_no}`} />
        {o.items.map((it, i) => <ReceiptLine key={i} item={it} />)}
        <div className="r-line" style={{ marginTop: 10 }}><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
        <div className="r-line"><span>Delivery to {o.district}</span><span>{o.delivery ? money(o.delivery) : 'FREE'}</span></div>
        <div className="r-line r-total"><span>Total</span><span>{money(o.total)}</span></div>
        <div className="r-note">Payment: {o.pay_status === 'Paid' ? 'Paid' : 'Cash on delivery'}<br />Deliver to: {o.address}, {o.district}</div>
      </div>

      <div className="ord-actions">
        {wa && <a className="btn btn-wa" href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi Smile Shopping! Checking on my order ' + o.order_no)}`} target="_blank" rel="noopener"><WAIcon /> Ask about this order</a>}
        <Link className="btn btn-brand" href="/shop">Continue shopping</Link>
      </div>
    </section>
  );
}
