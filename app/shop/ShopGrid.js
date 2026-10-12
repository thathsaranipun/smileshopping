'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { WAIcon, SearchIcon } from '@/components/icons';
import { waLink } from '@/lib/format';

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
        <select className="sel" aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="f">Featured</option><option value="new">Newest</option>
          <option value="lo">Price: low to high</option><option value="hi">Price: high to low</option>
        </select>
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
