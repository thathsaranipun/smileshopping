'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';
import ProductImage from './ProductImage';
import { money, discount, plumeStyle } from '@/lib/format';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const out = p.stock <= 0;
  const off = discount(p);
  return (
    <Link className="tag" href={`/product/${p.slug}`}>
      <div className="tag-img plume" style={plumeStyle(p.category)}>
        <ProductImage product={p} />
        {out ? <span className="badge out">Sold out</span> : off ? <span className="badge">-{off}%</span> : null}
      </div>
      <div className="tag-body">
        <span className="tag-cat">{p.category?.name}</span>
        <h3>{p.name}</h3>
        <span className="price">{money(p.price)}</span>
        {p.was_price > p.price && <span className="was">{money(p.was_price)}</span>}
      </div>
      <button
        className="quick" type="button" disabled={out} aria-label={`Add ${p.name} to cart`}
        onClick={e => { e.preventDefault(); e.stopPropagation(); add(p, p.variants?.[0] || null, 1); }}
      >+</button>
    </Link>
  );
}
