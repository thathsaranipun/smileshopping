import { supabase, configured } from './supabase';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smileshopping.vercel.app';

const PRODUCT_COLS = 'id,slug,name,description,price,was_price,stock,variant_label,variants,images,featured,active,category_id,created_at,category:categories(id,name,slug,bg,w1,w2)';

async function safe(q, fallback) {
  if (!configured) return fallback;
  const { data, error } = await q;
  if (error) { console.error(error.message); return fallback; }
  return data ?? fallback;
}

export const getSettings = () =>
  safe(supabase.from('settings').select('*').eq('id', 1).maybeSingle(), null).then(s => s || { free_over: 15000, whatsapp: '94770000000' });

export const getCategories = () => safe(supabase.from('categories').select('*').order('sort'), []);

export const getProducts = ({ category } = {}) => {
  let q = supabase.from('products').select(PRODUCT_COLS).eq('active', true).order('featured', { ascending: false }).order('created_at', { ascending: false });
  return safe(q, []).then(ps => (category ? ps.filter(p => p.category?.slug === category) : ps));
};

export const getProduct = slug => safe(supabase.from('products').select(PRODUCT_COLS).eq('slug', slug).eq('active', true).maybeSingle(), null);

export const getZones = () => safe(supabase.from('delivery_zones').select('*').order('sort'), []);
