'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/format';
import { useAdmin } from '@/components/AdminCtx';

const EMPTY = { name: '', slug: '', category_id: '', price: '', was_price: '', stock: 10, description: '', variant_label: 'Colour', variants: '', images: [], featured: false, active: true };

/* Shrink photos in the browser before upload (max 1600px, WebP) so the free 1 GB storage lasts. */
async function compress(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.85));
  return blob || file;
}

export default function EditProduct() {
  const { id } = useParams();
  const isNew = id === 'new';
  const router = useRouter();
  const { toast } = useAdmin();
  const [f, setF] = useState(isNew ? EMPTY : null);
  const [cats, setCats] = useState([]);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [err, setErr] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    supabase.from('categories').select('*').order('sort').then(({ data }) => {
      setCats(data || []);
      if (isNew && data?.length) setF(x => ({ ...x, category_id: x.category_id || data[0].id }));
    });
    if (!isNew) supabase.from('products').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!data) return setErr('Product not found');
      setF({ ...data, was_price: data.was_price ?? '', variants: (data.variants || []).join(', ') });
    });
  }, [id, isNew]);

  if (err && !f) return <div className="empty"><b>{err}</b><Link className="btn btn-line" href="/admin/products">Back to products</Link></div>;
  if (!f) return <div className="adm-load">Loading…</div>;

  const set = (k, v) => setF(x => ({ ...x, [k]: v, ...(k === 'name' && !slugTouched ? { slug: slugify(v) } : {}) }));

  const upload = async files => {
    const list = [...files];
    setUploading(list.length);
    const urls = [];
    for (const file of list) {
      try {
        const body = await compress(file);
        const ext = body.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg');
        const path = `${slugify(f.name || 'product') || 'product'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error } = await supabase.storage.from('products').upload(path, body, { contentType: body.type || file.type, upsert: false });
        if (error) throw error;
        urls.push(supabase.storage.from('products').getPublicUrl(path).data.publicUrl);
      } catch (e) { toast(`Upload failed: ${e.message}`); }
      setUploading(n => n - 1);
    }
    setF(x => ({ ...x, images: [...x.images, ...urls] }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const move = (i, d) => setF(x => {
    const im = [...x.images]; const j = i + d;
    if (j < 0 || j >= im.length) return x;
    [im[i], im[j]] = [im[j], im[i]]; return { ...x, images: im };
  });
  const dropImg = i => setF(x => ({ ...x, images: x.images.filter((_, k) => k !== i) }));

  const save = async e => {
    e.preventDefault(); setErr('');
    if (!f.name.trim()) return setErr('Enter a product name');
    if (f.price === '' || +f.price < 0) return setErr('Enter a price');
    const row = {
      name: f.name.trim(), slug: slugify(f.slug || f.name), category_id: f.category_id ? +f.category_id : null,
      price: Math.round(+f.price), was_price: f.was_price === '' ? null : Math.round(+f.was_price), stock: Math.max(0, Math.round(+f.stock || 0)),
      description: f.description.trim(), variant_label: f.variant_label.trim() || 'Option',
      variants: f.variants.split(',').map(s => s.trim()).filter(Boolean), images: f.images, featured: f.featured, active: f.active,
    };
    setBusy(true);
    const { error } = isNew ? await supabase.from('products').insert(row) : await supabase.from('products').update(row).eq('id', id);
    setBusy(false);
    if (error) return setErr(error.code === '23505' ? 'Another product already uses this web address. Change the URL slug.' : error.message);
    toast(isNew ? 'Product added' : 'Product saved');
    router.push('/admin/products');
  };

  const remove = async () => {
    if (!confirm(`Delete "${f.name}"? This can't be undone. To keep it but hide it from the shop, untick "Visible on shop" instead.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return toast(error.message);
    toast('Product deleted'); router.push('/admin/products');
  };

  return (
    <form className="pform" onSubmit={save}>
      <div className="adm-head">
        <h2>{isNew ? 'Add product' : 'Edit product'}</h2>
        <Link className="lnk" href="/admin/products">Back to products</Link>
      </div>
      <div className="pform-g">
        <div className="adm-card">
          <div className="f"><label htmlFor="p-name">Product name</label><input id="p-name" value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Clay Brew Mug Set (2 pcs)" /></div>
          <div className="f"><label htmlFor="p-slug">Web address <small>smileshopping.lk/product/{f.slug || '…'}</small></label><input id="p-slug" value={f.slug} onChange={e => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} /></div>
          <div className="f"><label htmlFor="p-desc">Description</label><textarea id="p-desc" rows={5} value={f.description} onChange={e => set('description', e.target.value)} placeholder="What it is, size, material, what's in the box" /></div>
          <div className="f-row">
            <div className="f"><label htmlFor="p-price">Price (Rs.)</label><input id="p-price" type="number" min="0" value={f.price} onChange={e => set('price', e.target.value)} /></div>
            <div className="f"><label htmlFor="p-was">Was price <small>(optional, shows a discount)</small></label><input id="p-was" type="number" min="0" value={f.was_price} onChange={e => set('was_price', e.target.value)} /></div>
          </div>
          <div className="f-row">
            <div className="f"><label htmlFor="p-cat">Category</label><select id="p-cat" value={f.category_id || ''} onChange={e => set('category_id', e.target.value)}><option value="">No category</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="f"><label htmlFor="p-stock">Stock</label><input id="p-stock" type="number" min="0" value={f.stock} onChange={e => set('stock', e.target.value)} /></div>
          </div>
          <div className="f-row">
            <div className="f"><label htmlFor="p-vl">Option name</label><input id="p-vl" value={f.variant_label} onChange={e => set('variant_label', e.target.value)} placeholder="Colour, Size, Shade" /></div>
            <div className="f"><label htmlFor="p-v">Options <small>(comma separated, optional)</small></label><input id="p-v" value={f.variants} onChange={e => set('variants', e.target.value)} placeholder="Red, Blue, Green" /></div>
          </div>
          <label className="check"><input type="checkbox" className="cb" checked={f.active} onChange={e => set('active', e.target.checked)} /> Visible on shop</label>
          <label className="check"><input type="checkbox" className="cb" checked={f.featured} onChange={e => set('featured', e.target.checked)} /> Feature on home page</label>
        </div>

        <div className="adm-card">
          <span className="lbl" style={{ marginTop: 0 }}>Photos</span>
          <p className="mute" style={{ marginTop: 0, fontSize: 14 }}>The first photo is the main one. Square photos look best.</p>
          <div className="imgs">
            {f.images.map((u, i) => (
              <div key={u} className="im">
                <img src={u} alt="" />
                {i === 0 && <span className="main">Main</span>}
                <div className="im-act">
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move left" disabled={i === 0}>‹</button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move right" disabled={i === f.images.length - 1}>›</button>
                  <button type="button" onClick={() => dropImg(i)} aria-label="Remove photo">✕</button>
                </div>
              </div>
            ))}
            <label className="im add">
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => upload(e.target.files)} />
              <span>{uploading ? `Uploading ${uploading}…` : '+ Add photos'}</span>
            </label>
          </div>
        </div>
      </div>

      {err && <p className="err" style={{ display: 'block' }}>{err}</p>}
      <div className="form-actions">
        <button className="btn btn-brand" disabled={busy || uploading > 0}>{busy ? 'Saving…' : isNew ? 'Add product' : 'Save changes'}</button>
        {!isNew && <button className="btn btn-line danger" type="button" onClick={remove}>Delete product</button>}
      </div>
    </form>
  );
}
