'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { WAIcon, SearchIcon } from '@/components/icons';
import { waLink } from '@/lib/format';

const SORTS = [['f', 'Featured'], ['new', 'Newest'], ['lo', 'Price: low to high'], ['hi', 'Price: high to low']];

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const box = useRef();
  useEffect(() => {
    if (!open) return;
    const close = e => { if (!box.current?.contains(e.target)) setOpen(false); };
    const esc = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);
  const label = SORTS.find(([v]) => v === value)?.[1];
  return (
    <div className="dd" ref={box}>
      <button type="button" className="sel dd-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="mute">Sort:</span> {label}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <ul className="dd-menu" role="listbox" aria-label="Sort products">
          {SORTS.map(([v, l]) => (
            <li key={v} role="option" aria-selected={v === value}>
              <button type="button" className={v === value ? 'on' : ''} onClick={() => { onChange(v); setOpen(false); }}>
                {l}{v === value && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ShopGrid({ cats, products, cat, q: q0, focus, whatsapp }) {
  const [q, setQ] = useState(q0);
  const [sort, setSort] = useState('f');
  const input = useRef();
  const c = cats.find(x => x.slug === cat);

  useEffect(() => { if (focus) input.current?.focus(); }, [focus]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let ps = products.filter(p => (!c || p.category_id === c.id) &&
      (!t || `${p.name} ${p.category?.name || ''} ${p.description}`.toLowerCase().includes(t)));
    if (sort === 'lo') ps = [...ps].sort((a, b) => a.price - b.price);
    if (sort === 'hi') ps = [...ps].sort((a, b) => b.price - a.price);
    if (sort === 'new') ps = [...ps].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return ps;
  }, [products, c, q, sort]);

  return (
    <section className="wrap sec">
      <div className="shop-head">
        <h1 className="pg-title">{c ? c.name : 'All products'}</h1>
        <span className="mute">{list.length} {list.length === 1 ? 'product' : 'products'}</span>
      </div>
      <div className="tools">
        <label className="search"><SearchIcon />
          <input ref={input} type="search" placeholder="Search products…" aria-label="Search products" value={q} onChange={e => setQ(e.target.value)} />
        </label>
        <SortMenu value={sort} onChange={setSort} />
      </div>
      <div className="chips">
        <Link className={`chip ${!c ? 'on' : ''}`} href="/shop">All</Link>
        {cats.map(x => <Link key={x.id} className={`chip ${x.slug === cat ? 'on' : ''}`} href={`/shop?cat=${x.slug}`}>{x.name}</Link>)}
      </div>
      {list.length ? (
        <div className="grid">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="empty">
          <b>{q ? `No products match "${q}"` : 'No products here yet'}</b>
          Try a shorter word, or ask us on WhatsApp and we&apos;ll check for you.<br /><br />
          <a className="btn btn-wa" href={waLink(whatsapp, `Hi! Do you have: ${q || c?.name || ''}`)} target="_blank" rel="noopener"><WAIcon /> Ask on WhatsApp</a>
        </div>
      )}
    </section>
  );
}
