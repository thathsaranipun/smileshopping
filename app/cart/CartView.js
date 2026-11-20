'use client';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { ReceiptHead, ReceiptLine, deliveryFor } from '@/components/Receipt';
import { money } from '@/lib/format';

export const DKEY = 'ss-district';

export default function CartView({ zones, settings }) {
  const { items, ready, setQty, remove, subtotal } = useCart();

  if (!ready) return <section className="wrap"><div className="receipt"><ReceiptHead title="Your cart" /></div></section>;
  if (!items.length) {
    return (
      <section className="wrap">
        <div className="receipt" style={{ textAlign: 'center' }}>
          <ReceiptHead title="Your cart" />
          <p style={{ fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 800, margin: '26px 0 6px' }}>Your cart is empty</p>
          <p className="mute" style={{ fontFamily: 'var(--fd)' }}>Add something you love and it will show up here.</p>
          <Link className="btn btn-brand" href="/shop">Browse products</Link>
        </div>
      </section>
    );
  }
  const del = deliveryFor(zones, settings, subtotal, '');

  return (
    <section className="wrap">
      <div className="flow"><span className="on">1 Cart</span><span>2 Details</span><span>3 WhatsApp</span><span>4 Done</span></div>
      <div className="receipt">
        <ReceiptHead title="Your cart" />
        {items.map((l, i) => (
          <ReceiptLine key={`${l.product_id}-${l.variant}`} item={l}>
            <div className="mini">
              <button type="button" aria-label="Decrease" onClick={() => setQty(i, l.qty - 1)}>−</button>
              <span style={{ minWidth: 22, textAlign: 'center' }}>{l.qty}</span>
              <button type="button" aria-label="Increase" onClick={() => setQty(i, l.qty + 1)}>+</button>
              <button type="button" className="rm" onClick={() => remove(i)}>Remove</button>
            </div>
          </ReceiptLine>
        ))}
        <div className="r-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="r-line"><span>Delivery</span><span>{del === null ? '—' : del === 0 ? 'FREE' : money(del)}</span></div>
        {settings.free_over > 0 && subtotal < settings.free_over && <div className="r-note">Add {money(settings.free_over - subtotal)} more for free delivery</div>}
        <div className="r-line r-total"><span>Total</span><span>{money(subtotal + (del || 0))}</span></div>
        <Link className="btn btn-brand btn-block" href="/checkout" style={{ marginTop: 18 }}>Continue to order</Link>
        <Link className="btn btn-line btn-block" href="/shop" style={{ marginTop: 10 }}>Keep shopping</Link>
      </div>
    </section>
  );
}
