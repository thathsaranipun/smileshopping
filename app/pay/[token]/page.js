'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrder } from '@/lib/useOrder';
import { money } from '@/lib/format';

/* DEMO payment screen. Before launch this is replaced by a redirect to the real gateway (e.g. PayHere)
   and the gateway's server-to-server notify call marks the order Paid. */
export default function Pay() {
  const { token } = useParams();
  const router = useRouter();
  const [o, reload] = useOrder(token);
  const [busy, setBusy] = useState(false);
  const done = o && (o.pay_status === 'Paid' || o.pay_status === 'COD');
  useEffect(() => { if (done) router.replace(`/order/${token}`); }, [done, router, token]);

  if (o === undefined) return <section className="wrap sec" />;
  if (!o) return <section className="wrap"><div className="empty"><b>Order not found</b><Link className="btn btn-brand" href="/shop">Go to shop</Link></div></section>;
  if (done) return null;

  const act = async (fn, args) => { setBusy(true); await supabase.rpc(fn, args); setBusy(false); };
  const steps = <div className="flow"><span className="done">1 Cart</span><span className="done">2 Details</span><span className="on">3 Payment</span><span>4 Done</span></div>;

  if (o.pay_status === 'Failed') {
    return (
      <section className="wrap">{steps}
        <div className="okhead">
          <div className="okmark" style={{ background: '#FFE0DD' }}><svg viewBox="0 0 40 40" width="40"><path d="M13 13l14 14M27 13L13 27" stroke="#E8322B" strokeWidth="4" strokeLinecap="round" /></svg></div>
          <h1>Payment not completed</h1>
          <p>The bank declined the payment for order <span className="oid">{o.order_no}</span>. Nothing was charged. Try again, or switch to cash on delivery.</p>
          <div className="ord-actions">
            <button className="btn btn-brand" type="button" disabled={busy} onClick={async () => { await act('demo_payment', { t: token, success: true }); router.push(`/order/${token}`); }}>Try payment again</button>
            <button className="btn btn-line" type="button" disabled={busy} onClick={async () => { await act('switch_to_cod', { t: token }); router.push(`/order/${token}`); }}>Switch to cash on delivery</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap">{steps}
      <div className="gw">
        <div className="gw-top"><span>🔒 Secure payment</span><span>Sandbox</span></div>
        <div className="gw-body">
          <div style={{ color: '#6b7280', fontSize: 14 }}>Paying Smile Shopping · Order {o.order_no}</div>
          <div className="gw-amt">{money(o.total)}</div>
          <div className="gw-f"><small>Card number</small>4111 1111 1111 1111</div>
          <div className="gw-row"><div className="gw-f"><small>Expiry</small>12 / 28</div><div className="gw-f"><small>CVV</small>•••</div></div>
          <div className="gw-f"><small>Name on card</small>{o.customer_name.toUpperCase()}</div>
          <button className="gw-pay" type="button" disabled={busy} onClick={async () => { await act('demo_payment', { t: token, success: true }); router.push(`/order/${token}`); }}>Pay {money(o.total)}</button>
          <button className="gw-fail" type="button" disabled={busy} onClick={async () => { await act('demo_payment', { t: token, success: false }); reload(); }}>Simulate a declined payment</button>
        </div>
        <div className="gw-note">Test mode. The live site sends customers to the Sri Lankan payment gateway&apos;s secure page. Card data never touches this website.</div>
      </div>
    </section>
  );
}
