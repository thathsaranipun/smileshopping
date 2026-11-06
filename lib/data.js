import { supabase, configured } from './supabase';
import { CATEGORIES, PRODUCTS, ZONES } from './catalog.mjs';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smileshopping.vercel.app';

const PRODUCT_COLS = 'id,slug,name,description,price,was_price,stock,variant_label,variants,images,featured,active,category_id,created_at,category:categories(id,name,slug,bg,w1,w2)';

// Without Supabase keys (e.g. local dev) the shop runs on the bundled catalogue in lib/catalog.mjs.
async function safe(q, fallback) {
  if (!configured) return fallback;
  const { data, error } = await q;
  if (error) { console.error(error.message); return fallback; }
  return data ?? fallback;
}

export const getSettings = () =>
  safe(supabase.from('settings').select('*').eq('id', 1).maybeSingle(), null).then(s => s || { free_over: 15000, whatsapp: '94770000000' });

export const getCategories = () => safe(supabase.from('categories').select('*').order('sort'), CATEGORIES);

export const getProducts = ({ category } = {}) => {
  let q = supabase.from('products').select(PRODUCT_COLS).eq('active', true).order('featured', { ascending: false }).order('created_at', { ascending: false });
  const local = [...PRODUCTS].sort((a, b) => b.featured - a.featured);
  return safe(q, local).then(ps => (category ? ps.filter(p => p.category?.slug === category) : ps));
};

export const getProduct = slug => safe(supabase.from('products').select(PRODUCT_COLS).eq('slug', slug).eq('active', true).maybeSingle(), PRODUCTS.find(p => p.slug === slug) || null);

export const getZones = () => safe(supabase.from('delivery_zones').select('*').order('sort'), ZONES);
