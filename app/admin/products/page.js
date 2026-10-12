'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductImage from '@/components/ProductImage';
import { plumeStyle } from '@/lib/format';
import { useAdmin } from '@/components/AdminCtx';

export default function Products() {
  const { toast } = useAdmin();
  const [ps, setPs] = useState(null);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*, category:categories(id,name,bg,w1,w2)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort'),
    ]).then(([a, b]) => { setPs(a.data || []); setCats(b.data || []); });
  }, []);

  const save = async (p, patch, label) => {
    const { error } = await supabase.from('products').update(patch).eq('id', p.id);
    if (error) return toast(error.message);
    setPs(list => list.map(x => (x.id === p.id ? { ...x, ...patch } : x)));
    toast(label);
  };

  const list = useMemo(() => (ps || []).filter(p => (!cat || String(p.category_id) === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase()))), [ps, q, cat]);
  if (!ps) return <div className="adm-load">Loading products…</div>;

  return (
    <>
      <div className="adm-head">
        <h2>{ps.length} products</h2>
        <Link className="btn btn-brand" href="/admin/products/new">Add product</Link>
      </div>
      <div className="tools">
        <label className="search"><input type="search" placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" /></label>
        <select className="sel" value={cat} onChange={e => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <p className="mute" style={{ margin: '0 0 12px' }}>Price and stock save when you leave the box. Changes show on the shop straight away.</p>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Price (Rs.)</th><th>Stock</th><th>Featured</th><th>Visible</th><th></th></tr></thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className={p.active ? '' : 'dim'}>
                <td><div className="pcell"><div className="r-thumb plume" style={plumeStyle(p.category)}><ProductImage product={p} /></div><span>{p.name}{!p.images?.length && <><br /><small className="warn">No photo yet</small></>}</span></div></td>
                <td>{p.category?.name || '—'}</td>
                <td><input type="number" min="0" step="10" defaultValue={p.price} aria-label="Price" onBlur={e => +e.target.value !== p.price && save(p, { price: Math.max(0, +e.target.value) }, 'Price saved')} /></td>
                <td><input type="number" min="0" defaultValue={p.stock} aria-label="Stock" style={{ width: 80 }} onBlur={e => +e.target.value !== p.stock && save(p, { stock: Math.max(0, +e.target.value) }, 'Stock saved')} /></td>
                <td><input type="checkbox" className="cb" checked={p.featured} aria-label="Featured" onChange={e => save(p, { featured: e.target.checked }, e.target.checked ? 'Shown on home page' : 'Removed from home page')} /></td>
                <td><input type="checkbox" className="cb" checked={p.active} aria-label="Visible" onChange={e => save(p, { active: e.target.checked }, e.target.checked ? 'Product visible on shop' : 'Product hidden from shop')} /></td>
                <td style={{ whiteSpace: 'nowrap' }}><Link className="lnk" href={`/admin/products/${p.id}`}>Edit</Link> · <Link className="lnk" href={`/product/${p.slug}`} target="_blank">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
