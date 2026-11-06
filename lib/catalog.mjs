// The lehenga / half-saree collection. Used as the shop's catalogue when Supabase isn't connected,
// and turned into supabase/003_lehenga_catalog.sql by scripts/catalog-sql.mjs so the live shop sells the same items.

const SILK = `NEW: 12 colours available
Half saree, now in trend. 100% pure quality, same as the video.

Kanjivaram Silk Zari lehenga with blouse, along with a Banarasi dupatta.

What you get
Lehenga : 3.5 meters
Blouse : 0.80 meter approx
Voni (dupatta) : 2.20 meters Banarasi
Weight : 550 g
Availability : Ready stock`;

const COTTON = `Crafted with love, adorned with heritage. The South-style Kanchi cotton silk lehenga is more than just attire; it's a piece of art that captures the essence of South Indian culture.

Lehenga (stitched)
Lehenga Fabric : Kanchi Cotton
Lehenga Work : Zari Weaving Work
Lehenga Waist : Supported up to 42
Lehenga Closure : Drawstring with zip
Stitching : Stitched with canvas
Length : 41
Flair : 3.00 meter
Inner : Micro cotton

Blouse (unstitched)
Blouse Fabric : Kanchi Cotton
Blouse Work : Zari Weaving Work
Blouse Length : 0.90 meter

Dupatta
Dupatta Fabric : Georgette
Dupatta Work : Plain with lace border
Dupatta Length : 2.5 meter, 44" width

Package
Package Contains : Lehenga, Blouse, Dupatta, Drawstring
Weight : 0.9 kg`;

export const CATEGORIES = [
  { id: 1, name: 'Kanjivaram Silk Half Sarees', slug: 'kanjivaram-silk', sort: 1, bg: '#1a1410', w1: '#2a1d12', w2: '#3a2614' },
  { id: 2, name: 'Kanchi Cotton Lehengas', slug: 'kanchi-cotton', sort: 2, bg: '#14110f', w1: '#211a14', w2: '#2e2218' },
];

const img = (slug, n) => Array.from({ length: n }, (_, i) => `/products/lehenga/${slug}-${i + 1}.jpeg`);

// [slug, colour name, category slug, photo count, featured]
const ITEMS = [
  ['silver-royal-purple', 'Silver & Royal Purple', 'kanjivaram-silk', 2, true],
  ['powder-blue-violet', 'Powder Blue & Violet', 'kanjivaram-silk', 2, true],
  ['black-crimson', 'Black & Crimson', 'kanjivaram-silk', 2, true],
  ['mauve-scarlet', 'Mauve & Scarlet', 'kanjivaram-silk', 2, false],
  ['tangerine-bottle-green', 'Tangerine & Bottle Green', 'kanjivaram-silk', 2, true],
  ['peacock-teal-rani-pink', 'Peacock Teal & Rani Pink', 'kanjivaram-silk', 2, false],
  ['rani-pink-teal', 'Rani Pink & Teal', 'kanjivaram-silk', 2, false],
  ['rose-pink-maroon', 'Rose Pink & Maroon', 'kanjivaram-silk', 1, false],
  ['olive-fuchsia', 'Olive & Fuchsia', 'kanjivaram-silk', 2, false],
  ['purple-peacock-teal', 'Purple & Peacock Teal', 'kanjivaram-silk', 2, true],
  ['teal-navy', 'Teal & Navy', 'kanjivaram-silk', 1, false],
  ['red-navy', 'Red & Navy', 'kanjivaram-silk', 1, false],
  ['maroon-bottle-green', 'Maroon & Bottle Green', 'kanchi-cotton', 3, true],
  ['beige-mustard', 'Beige & Mustard', 'kanchi-cotton', 2, false],
  ['sage-sky-blue', 'Sage Green & Sky Blue', 'kanchi-cotton', 2, true],
  ['lilac-emerald', 'Lilac & Emerald', 'kanchi-cotton', 2, false],
  ['lavender-wine', 'Lavender & Wine', 'kanchi-cotton', 2, true],
  ['silver-grey-maroon', 'Silver Grey & Maroon', 'kanchi-cotton', 1, false],
  ['magenta-midnight-navy', 'Magenta & Midnight Navy', 'kanchi-cotton', 1, false],
  ['sunflower-green', 'Sunflower Yellow & Green', 'kanchi-cotton', 1, false],
  ['navy-marigold', 'Navy & Marigold', 'kanchi-cotton', 1, false],
  ['royal-blue', 'Royal Blue', 'kanchi-cotton', 1, false],
  ['plum-wine', 'Plum Wine', 'kanchi-cotton', 1, false],
  ['emerald-navy', 'Emerald & Navy', 'kanchi-cotton', 1, false],
  ['mustard-black', 'Mustard & Black', 'kanchi-cotton', 1, false],
  ['olive-black', 'Olive & Black', 'kanchi-cotton', 1, false],
  ['black-gold', 'Classic Black & Gold', 'kanchi-cotton', 1, false],
  ['ash-grey-navy', 'Ash Grey & Navy', 'kanchi-cotton', 1, false],
  ['maroon-black', 'Maroon & Black', 'kanchi-cotton', 1, false],
];

export const PRODUCTS = ITEMS.map(([slug, colour, cat, n, featured], i) => {
  const category = CATEGORIES.find(c => c.slug === cat);
  const silk = cat === 'kanjivaram-silk';
  return {
    id: `local-${slug}`,
    slug: silk ? `kanjivaram-silk-half-saree-${slug}` : `kanchi-cotton-lehenga-${slug}`,
    name: silk ? `Kanjivaram Silk Half Saree · ${colour}` : `Kanchi Cotton Lehenga · ${colour}`,
    description: silk ? SILK : COTTON,
    price: silk ? 4900 : 7200,
    was_price: null,
    stock: 10,
    variant_label: 'Colour',
    variants: [],
    images: img(slug, n),
    featured,
    active: true,
    category_id: category.id,
    category,
    created_at: new Date(Date.UTC(2026, 10, 1, 0, ITEMS.length - i)).toISOString(),
  };
});

export const ZONES = [
  { id: 1, name: 'Colombo district', days: '1–2 working days', rate: 350, sort: 1, districts: ['Colombo'] },
  { id: 2, name: 'Gampaha & Kalutara', days: '1–3 working days', rate: 400, sort: 2, districts: ['Gampaha', 'Kalutara'] },
  { id: 3, name: 'Other main districts', days: '2–4 working days', rate: 450, sort: 3, districts: ['Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'] },
  { id: 4, name: 'Northern & Eastern districts', days: '3–5 working days', rate: 550, sort: 4, districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Trincomalee', 'Batticaloa', 'Ampara'] },
];
