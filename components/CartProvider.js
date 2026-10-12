'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const Ctx = createContext(null);
const KEY = 'ss-cart-v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [bump, setBump] = useState(0);
  const timer = useRef();

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY)) || []); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const notify = useCallback(msg => {
    setToast(msg); clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback((p, variant, qty = 1, silent) => {
    if (!p || p.stock <= 0) return false;
    setItems(cur => {
      const i = cur.findIndex(l => l.product_id === p.id && l.variant === (variant || null));
      const max = p.stock;
      if (i >= 0) return cur.map((l, j) => (j === i ? { ...l, qty: Math.min(l.qty + qty, max), stock: max, price: p.price } : l));
      return [...cur, {
        product_id: p.id, slug: p.slug, name: p.name, price: p.price, stock: max,
        image: p.images?.[0] || null, variant: variant || null, qty: Math.min(qty, max), cat: p.category || null,
      }];
    });
    setBump(b => b + 1);
    if (!silent) notify('added');
    return true;
  }, [notify]);

  const setQty = (i, q) => setItems(cur => (q < 1 ? cur.filter((_, j) => j !== i) : cur.map((l, j) => (j === i ? { ...l, qty: Math.min(q, l.stock || q) } : l))));
  const remove = i => setItems(cur => cur.filter((_, j) => j !== i));
  const clear = () => setItems([]);
  const count = items.reduce((a, l) => a + l.qty, 0);
  const subtotal = items.reduce((a, l) => a + l.qty * l.price, 0);

  return (
    <Ctx.Provider value={{ items, ready, add, setQty, remove, clear, count, subtotal, bump, notify }}>
      {children}
      <div id="toast" role="status" className={toast ? 'on' : ''}>
        {toast === 'added' ? <>Added to cart <Link href="/cart">View cart</Link></> : toast}
      </div>
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
