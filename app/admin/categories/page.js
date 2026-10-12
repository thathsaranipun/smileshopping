'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { plumeStyle, slugify } from '@/lib/format';
import { useAdmin } from '@/components/AdminCtx';

const PALETTES = [
  { label: 'Gold', bg: '#FFF4D1', w1: '#FFE38A', w2: '#FBC24A' },
  { label: 'Lilac', bg: '#F7EAFD', w1: '#EBCBF8', w2: '#D7A6F0' },
  { label: 'Sky', bg: '#E3F7FF', w1: '#B5EBFF', w2: '#7DD8FB' },
  { label: 'Orange', bg: '#FFECE1', w1: '#FFCDAE', w2: '#FFA877' },
  { label: 'Blue', bg: '#E8EEFF', w1: '#C9D7FF', w2: '#9DB4F7' },
];

export default function Categories() {
  const { toast } = useAdmin();
  const [cats, setCats] = useState(null);
  const [counts, setCounts] = useState({});
  const [name, setName] = useState('');

  const load = async () => {
    const [{ data }, { data: ps }] = await Promise.all([
      supabase.from('categories').select('*').order('sort'),
      supabase.from('products').select('category_id'),
    ]);
    setCats(data || []);
    const c = {}; (ps || []).forEach(p => { c[p.category_id] = (c[p.category_id] || 0) + 1; }); setCounts(c);
  };
  useEffect(() => { load(); }, []);

  const add = async e => {
    e.preventDefault();
    if (!name.trim()) return;
    const pal = PALETTES[(cats?.length || 0) % PALETTES.length];
    const { error } = await supabase.from('categories').insert({ name: name.trim(), slug: slugify(name), sort: (cats?.length || 0) + 1, bg: pal.bg, w1: pal.w1, w2: pal.w2 });
    if (error) return toast(error.code === '23505' ? 'That category already exists' : error.message);
    setName(''); toast('Category added'); load();
  };
  const save = async (c, patch, msg = 'Saved') => {
    const { error } = await supabase.from('categories').update(patch).eq('id', c.id);
    if (error) return toast(error.message);
    toast(msg); load();
  };
  const del = async c => {
    if (counts[c.id] && !confirm(`${counts[c.id]} products are in "${c.name}". They'll stay on the shop without a category. Delete it?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', c.id);
    if (error) return toast(error.message);
    toast('Category deleted'); load();
  };

  if (!cats) return <div className="adm-load">Loading…</div>;
  return (
    <>
      <div className="adm-head"><h2>Categories</h2></div>
      <form className="tools" onSubmit={add}>
        <label className="search"><input placeholder="New category name, e.g. Sports" value={name} onChange={e => setName(e.target.value)} aria-label="New category name" /></label>
        <button className="btn btn-brand">Add category</button>
      </form>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Order</th><th>Name</th><th>Products</th><th>Colour</th><th></th></tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id}>
                <td><input type="number" defaultValue={c.sort} style={{ width: 70 }} aria-label="Sort order" onBlur={e => +e.target.value !== c.sort && save(c, { sort: +e.target.value }, 'Order saved')} /></td>
                <td><input defaultValue={c.name} aria-label="Name" style={{ width: 200 }} onBlur={e => e.target.value.trim() && e.target.value !== c.name && save(c, { name: e.target.value.trim() }, 'Name saved')} /><br /><small className="mute">/shop?cat={c.slug}</small></td>
                <td>{counts[c.id] || 0}</td>
                <td>
                  <div className="swatches">
                    {PALETTES.map(p => (
                      <button key={p.label} type="button" title={p.label} aria-label={p.label} className={`sw plume ${c.bg === p.bg ? 'on' : ''}`} style={plumeStyle(p)} onClick={() => save(c, { bg: p.bg, w1: p.w1, w2: p.w2 }, 'Colour saved')} />
                    ))}
                  </div>
                </td>
                <td><button type="button" className="lnk danger" onClick={() => del(c)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
