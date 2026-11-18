// Everything the shop shows comes from the files in /data — there is no database.
import { CATEGORIES, PRODUCTS, ZONES } from '@/data/products.mjs';
import { SITE } from '@/data/site';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smileshopping.vercel.app';

const sorted = [...PRODUCTS].sort((a, b) => b.featured - a.featured);

export const getSettings = async () => SITE;
export const getCategories = async () => [...CATEGORIES].sort((a, b) => a.sort - b.sort);
export const getProducts = async ({ category } = {}) => (category ? sorted.filter(p => p.category?.slug === category) : sorted);
export const getProduct = async slug => PRODUCTS.find(p => p.slug === slug) || null;
export const getZones = async () => [...ZONES].sort((a, b) => a.sort - b.sort);
