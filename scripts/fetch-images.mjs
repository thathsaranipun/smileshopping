// Downloads the demo product photos listed in scripts/product-images.json into public/products/<slug>.jpg.
// Run by .github/workflows/fetch-product-images.yml (or locally: node scripts/fetch-images.mjs).
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';

const list = JSON.parse(await readFile(new URL('./product-images.json', import.meta.url), 'utf8'));
await mkdir('public/products', { recursive: true });

let ok = 0, failed = [];
for (const [slug, id] of Object.entries(list)) {
  if (slug.startsWith('_')) continue;
  const out = `public/products/${slug}.jpg`;
  try { await access(out); console.log(`skip ${out} (exists)`); ok++; continue; } catch {}
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1000&fit=crop`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 smileshopping-demo' } });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.startsWith('image/')) { failed.push(`${slug} (${res.status} ${type})`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(out, buf);
  console.log(`saved ${out} ${Math.round(buf.length / 1024)} KB`);
  ok++;
}
console.log(`done: ${ok} ok, ${failed.length} failed`);
if (failed.length) console.log('failed: ' + failed.join(', '));
