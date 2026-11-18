// THE SHOP CATALOGUE — edit this file to add, remove or change products.
//
// Add a product:  add a line to ITEMS below: [slug, colour name, category slug, photo count, featured]
// Its photos:     make a folder public/products/<collection>/<slug>/ with cover.jpg (the main image)
//                 plus 1.jpeg, 2.jpeg, ... ("photo count" = how many numbered photos)
// Prices:         PRICES below sets the price per collection. To give one product its own price, add it as a
//                 6th value on its line, e.g. ['red-navy', 'Red & Navy', 'kanjivaram-silk', 1, false, 5500]
// Sold out:       add the product's slug to SOLD_OUT (it stays on the site, marked "Sold out").
// Delivery:       ZONES at the bottom (charge per district group).

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
  { id: 3, name: 'Sarees', slug: 'sarees', sort: 1, bg: '#16110f', w1: '#241a14', w2: '#32241a' },
  { id: 1, name: 'Kanjivaram Silk Half Sarees', slug: 'kanjivaram-silk', sort: 2, bg: '#1a1410', w1: '#2a1d12', w2: '#3a2614' },
  { id: 2, name: 'Kanchi Cotton Lehengas', slug: 'kanchi-cotton', sort: 3, bg: '#14110f', w1: '#211a14', w2: '#2e2218' },
  { id: 4, name: 'Lehengas', slug: 'lehengas', sort: 4, bg: '#17110f', w1: '#251914', w2: '#33221a' },
  { id: 5, name: 'Suit & Palazzo Sets', slug: 'suit-sets', sort: 5, bg: '#131112', w1: '#20191b', w2: '#2c2226' },
  { id: 6, name: 'Gowns & Kurtis', slug: 'gowns-kurtis', sort: 6, bg: '#151012', w1: '#23181c', w2: '#302026' },
  { id: 7, name: 'Kids Wear', slug: 'kids', sort: 7, bg: '#121113', w1: '#1e1a20', w2: '#2a242c' },
];

// Photos live in public/products/<collection>/<slug>/: cover.jpg first (shop card + first gallery image), then 1.jpeg, 2.jpeg …
const img = (cat, slug, n) => [`/products/${cat}/${slug}/cover.jpg`, ...Array.from({ length: n }, (_, i) => `/products/${cat}/${slug}/${i + 1}.jpeg`)];

// [slug, colour name, category slug, photo count, featured, (optional) own price]
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

// Price per collection, in rupees.
export const PRICES = { 'kanjivaram-silk': 4900, 'kanchi-cotton': 7200 };

// Slugs of products that are sold out, e.g. ['red-navy', 'royal-blue'].
export const SOLD_OUT = [];

const HALF_SAREE_SETS = ITEMS.map(([slug, colour, cat, n, featured, ownPrice], i) => {
  const category = CATEGORIES.find(c => c.slug === cat);
  const silk = cat === 'kanjivaram-silk';
  return {
    id: `local-${slug}`,
    slug: silk ? `kanjivaram-silk-half-saree-${slug}` : `kanchi-cotton-lehenga-${slug}`,
    name: silk ? `Kanjivaram Silk Half Saree · ${colour}` : `Kanchi Cotton Lehenga · ${colour}`,
    description: silk ? SILK : COTTON,
    price: ownPrice || PRICES[cat],
    was_price: null,
    stock: SOLD_OUT.includes(slug) ? 0 : 10,
    variant_label: 'Colour',
    variants: [],
    images: img(cat, slug, n),
    featured,
    active: true,
    category_id: category.id,
    category,
    created_at: new Date(Date.UTC(2026, 10, 1, 0, ITEMS.length - i)).toISOString(),
  };
});

/* ---------------------------------------------------------------------------------------------------------
   SAREES, LEHENGAS, SUIT SETS, GOWNS & KIDS WEAR
   One entry per product. Photos: public/products/<category>/<slug>/cover.jpg + 1.jpeg … <photos>.jpeg
   Description: "Key : Value" lines show as a spec table, short lines without a colon become headings.
   options: the choices a customer picks (sizes or colours); optionLabel names them.
   --------------------------------------------------------------------------------------------------------- */
const SIZES = ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'];

export const COLLECTION = [
  {
    slug: 'kanchipuram-pure-pattu-saree', cat: 'sarees', price: 64000, photos: 12, featured: true,
    name: 'Kanchipuram Pure Pattu Silk Saree',
    description: `Kanchipuram traditional and trendy designs, from the Sri Madheswaran Silks weavers.

Saree
Fabric : 100% pure pattu (Kanchipuram silk)
Certification : Silk Mark certified available
Designs : Traditional and trendy Kanchipuram patterns
Price : Wholesale price
Availability : New arrival collection`,
  },
  {
    slug: 'kanchipuram-semi-silk-saree', cat: 'sarees', price: 13200, photos: 12, featured: true,
    name: 'Kanchipuram Semi Silk Saree',
    description: `Kanchipuram-style semi silk saree with a rich woven border, a classic for weddings and functions.

Saree
Fabric : Kanchipuram semi silk
Availability : Ready stock`,
  },
  {
    slug: 'bridal-brocade-saree', cat: 'sarees', price: 8000, photos: 12, featured: true,
    name: 'Bridal Brocade Saree',
    description: `Exclusive bridal saree collection. 100% genuine quality, direct from the manufacturer.

Saree
Fabric : Brocade
Pallu : Kanchipuram pattern rich jari pallu
Border : Extreme jari border
Blouse : Contrast blouse
Saree Length : 6.30 meters
Weight : 0.9 kg approx`,
  },
  {
    slug: 'space-satin-sequence-saree', cat: 'sarees', price: 6800, photos: 12, featured: false,
    name: 'Space Satin Bits Sequence Work Saree',
    description: `New arrival. Space satin saree with bits sequence work and a contrast bits sequence work blouse.

Saree
Fabric : Space satin
Work : Bits sequence work
Blouse : Contrast bits sequence work blouse
Availability : Ready stock`,
  },
  {
    slug: 'banarasi-half-and-half-saree', cat: 'sarees', price: 6560, photos: 12, featured: true,
    name: 'Banarasi Half & Half Semi Katan Silk Saree',
    description: `Banarasi half and half semi katan soft silk saree with a unique border. Super soft, smooth fabric.

Saree
Fabric : Semi katan soft silk
Body : Boota-booti weave
Border : Soft zari weaving border
Pallu : Designer rich pallu
Blouse : Brocade blouse
Colour : Black and light pink, off and off pattern`,
  },
  {
    slug: 'keri-fendy-satin-saree', cat: 'sarees', price: 5700, photos: 10, featured: false,
    name: 'Keri Fendy Satin Embroidery Saree',
    description: `Design Keri. Very soft and elegant, a rich look in fendy satin with beautiful embroidery.

Saree
Fabric : Fendy satin
Work : Embroidery with 3 mm sequence work
Border : Heavy border with buttis all over the saree

Blouse
Stitching : Fully stitched
Work : Heavy jhal work embroidery sequence design
Back : Net pattern with fancy tassels
Size : Up to 42"
Availability : Ready stock`,
  },
  {
    slug: 'kerala-kanchi-border-mulcotton-saree', cat: 'sarees', price: 5100, photos: 12, featured: true,
    name: 'Kerala Kanchi Border Mulmul Cotton Saree',
    description: `Authentic Kerala special weave. Wrapped in tradition, draped in elegance.

Saree
Fabric : Premium mulmul cotton (slub mal cotton)
Design : Full body plain with Kanchi border
Thread : Assured colour, 100% pure mulmul thread
Blouse : Blouse piece included
Tip : Match with a separate blouse for a gorgeous look`,
  },
  {
    slug: 'bollywood-chiffon-saree', cat: 'sarees', price: 4700, photos: 6, featured: false,
    name: 'Bollywood Trending Chiffon Saree',
    description: `Bollywood trending design. This saree will make you feel like a celebrity whenever you wear it.

Saree
Fabric : Frenday chinon

Blouse
Fabric : Frenday chiffon
Work : Designer brits cut dana work with sequence
Quality : Premium
Availability : Ready stock`,
  },
  {
    slug: 'lisha-linen-kalamkari-saree', cat: 'sarees', price: 4300, photos: 12, featured: false,
    name: 'Lisha Linen Kalamkari Print Saree',
    description: `Most trending concept, catalogue Lisha Linen-7.

Saree
Fabric : Soft cotton based linen
Print : Fancy Kalamkari print
Border : Zari border
Availability : Single piece per colour, ready stock`,
  },
  {
    slug: 'net-embroidery-lehenga-1025', cat: 'lehengas', price: 4300, photos: 12, featured: true,
    name: 'Net Embroidery Lehenga · Design 1025',
    description: `Beautiful new fancy embroidery work lehenga.

Lehenga
Fabric : Heavy net
Work : Multi thread embroidery all over, cut work border design
Stitching : Semi stitched
Length : 42–44 inches

Blouse
Fabric : Heavy Banglory silk with multi work
Length : 0.80 meter (unstitched)

Dupatta
Fabric : Heavy net with embroidery and cut work
Length : 2.20 meters approx
Weight : 500 g`,
  },
  {
    slug: 'farshi-suit-set-1505', cat: 'suit-sets', price: 9240, photos: 8, featured: true, options: SIZES,
    name: 'Premium Farshi Suit Set · D.No 1505',
    description: `Newly launched premium farshi suit set, a perfect blend of tradition and style.

Kurti
Fabric : Premium French crepe
Inner : Micro
Work : Fully heavy 5 mm sequence, zari and thread embroidery
Length : 38–39 inches
Sizes : M (38), L (40), XL (42), XXL (44), fully stitched

Farshi Palazzo
Fabric : Moss satin silk
Length : 40 inches
Inner : Micro
Work : Fully heavy thread embroidery
Size : Free size up to XXL, fully stitched

Dupatta
Fabric : Faux georgette
Work : Fully heavy 5 mm sequence, zari and thread embroidery
Length : 2 meters

Package
Package Contains : Stitched kurti, stitched palazzo, dupatta, 4 fancy buttons
Weight : 1 kg`,
  },
  {
    slug: 'roman-silk-party-set-238', cat: 'suit-sets', price: 8060, photos: 8, featured: false, options: SIZES,
    name: 'Pure Roman Silk Party Wear Set · Code 238',
    description: `New designer party wear look. Unique design for your unique style.

Top
Fabric : Pure Roman silk with 3 mm sequence embroidery, with sleeves
Inner : Micro cotton
Length : 47–48 inches
Sizes : M (38), L (40), XL (42), XXL (44), fully stitched

Bottom
Fabric : Pure Roman silk with elastic
Length : 39–40 inches, fully stitched

Dupatta
Fabric : Heavy faux georgette with 3 mm sequence embroidery
Length : 2.20 meters
Weight : 900 g`,
  },
  {
    slug: 'designer-palazzo-set-1600', cat: 'suit-sets', price: 6960, photos: 12, featured: true, options: SIZES,
    name: 'Designer Palazzo Set · Style 1600',
    description: `Elegant ethnic wear, crafted in classy tones with premium fabric and detailing. Perfect for festive celebrations, weddings and elegant occasions.

Suit
Fabric : JMC silk
Lining : Soft micro inner
Work : Intricate thread work
Sizes : M (38), L (40), XL (42), XXL (44), with 3XL margin

Palazzo
Fabric : JMC silk
Lining : Micro
Work : Intricate thread work
Size : Fully stitched, fits up to 44 (elastic waistband)

Dupatta
Fabric : JMC silk
Work : Intricate thread work
Length : 2.10 meters
Weight : 1 kg approx`,
  },
  {
    slug: 'natural-satin-silk-suit-set', cat: 'suit-sets', price: 5490, photos: 6, featured: false, options: SIZES,
    name: 'Natural Satin Silk Top, Farshi & Dupatta Set',
    description: `New designer collection in natural satin silk. Top, bottom and dupatta set, fully stitched and ready to wear.

Top
Fabric : Natural satin silk with embroidery sequence work, full sleeve
Inner : Heavy micro cotton
Length : 35–36 inches
Sizes : M (38), L (40), XL (42), XXL (44), fully stitched

Farshi Pant
Fabric : Natural satin silk with elastic
Length : 40–41 inches, fully stitched

Dupatta
Fabric : Natural satin silk with lace border
Weight : 800 g`,
  },
  {
    slug: 'aliya-cut-handwork-top', cat: 'gowns-kurtis', price: 5850, photos: 8, featured: false, options: ['M', 'L', 'XL', 'XXL'],
    name: 'Aliya Cut Heavy Handwork Flared Top',
    description: `Heavy handwork top in georgette, Aliya cut with front pleats and a full flare.

Top
Fabric : Georgette with lining
Work : Heavy handwork
Style : Aliya cut, front pleated, flared
Sizes : M, L, XL, XXL`,
  },
  {
    slug: 'roja-three-layer-maxi', cat: 'gowns-kurtis', price: 4960, photos: 12, featured: true, optionLabel: 'Colour', options: ['Maroon', 'Purple', 'Black', 'Wine'],
    name: "Roja 80's Three Layer Maxi Gown",
    description: `Exclusive arrival. A recreation of the 80's trend: hand work three layer maxi, design Roja 2.

Gown
Fabric : CP blooming vichitra silk
Inner : Heavy micro
Length : 47–48 inches
Sleeves : 10 inches
Flair : 4 meters
Colours : Maroon, purple, black, wine
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46)
Weight : 450 g`,
  },
  {
    slug: 'kids-silk-suit-set', cat: 'kids', price: 4850, photos: 2, featured: false, optionLabel: 'Age',
    options: ['3 yrs', '4 yrs', '5 yrs', '6 yrs', '7 yrs', '8 yrs', '9 yrs', '10 yrs', '11 yrs', '12 yrs', '13 yrs', '14 yrs', '15 yrs'],
    name: "Kids' GMY Silk Top, Palazzo & Dupatta Set",
    description: `Fully stitched and ready to wear. Premium quality. See the size chart in the photos.

Top
Fabric : GMY silk
Design : Embroidery sequence work
Sleeves : Full sleeves
Inner : Heavy micro cotton

Palazzo
Fabric : GMY silk

Dupatta
Fabric : GMY silk
Design : Embroidery work
Ages : 3 to 15 years`,
  },
];

const COLLECTION_PRODUCTS = COLLECTION.map((p, i) => {
  const category = CATEGORIES.find(c => c.slug === p.cat);
  return {
    id: `local-${p.slug}`,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    was_price: null,
    stock: SOLD_OUT.includes(p.slug) ? 0 : 10,
    variant_label: p.optionLabel || 'Size',
    variants: p.options || [],
    images: img(p.cat, p.slug, p.photos),
    featured: p.featured,
    active: true,
    category_id: category.id,
    category,
    created_at: new Date(Date.UTC(2026, 10, 18, 0, COLLECTION.length - i)).toISOString(),
  };
});

export const PRODUCTS = [...COLLECTION_PRODUCTS, ...HALF_SAREE_SETS];

export const ZONES = [
  { id: 1, name: 'Colombo district', days: '1–2 working days', rate: 350, sort: 1, districts: ['Colombo'] },
  { id: 2, name: 'Gampaha & Kalutara', days: '1–3 working days', rate: 400, sort: 2, districts: ['Gampaha', 'Kalutara'] },
  { id: 3, name: 'Other main districts', days: '2–4 working days', rate: 450, sort: 3, districts: ['Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'] },
  { id: 4, name: 'Northern & Eastern districts', days: '3–5 working days', rate: 550, sort: 4, districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Trincomalee', 'Batticaloa', 'Ampara'] },
];
