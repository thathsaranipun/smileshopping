// THE SHOP CATALOGUE — edit this file to add, remove or change products.
//
// Add a product:  add a line to ITEMS below: [slug, colour name, category slug, photo count, featured]
// Its photos:     make a folder public/products/<collection>/<slug>/ with cover.jpg (the main image)
//                 plus 1.jpeg, 2.jpeg, ... ("photo count" = how many numbered photos)
// Prices:         PRICES below sets the price per collection. To give one product its own price, add it as a
//                 6th value on its line, e.g. ['red-navy', 'Red & Navy', 'kanjivaram-silk', 1, false, 5500]
// Sold out:       add the product's slug to SOLD_OUT (it stays on the site, marked "Sold out").
// Delivery:       ZONES at the bottom (one flat charge for every district).

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
const SIZES_S_3XL = ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', '3XL (46)'];
const KIDS_AGES = ['3 yrs', '4 yrs', '5 yrs', '6 yrs', '7 yrs', '8 yrs', '9 yrs', '10 yrs', '11 yrs', '12 yrs', '13 yrs', '14 yrs', '15 yrs'];

export const COLLECTION = [
  {
    slug: 'daisy-delight-linen-saree', cat: 'sarees', price: 4500, photos: 22, featured: true,
    name: 'Daisy Delight Linen Finish Saree',
    description: `Bloom with style. A splash of sunshine for your wardrobe, with bold daisies all over.

Saree
Fabric : Premium high quality linen-finish fabric
Feel : Light, breathable and comfortable for all-day wear, with a natural texture
Saree Cut : 6.3 meters (including blouse)
Quality : 100% premium quality finish
Availability : Single colours available`,
  },
  {
    slug: 'wct-rangoli-silk-mirror-work-saree', cat: 'sarees', price: 4400, photos: 12, featured: true,
    name: 'WCT Rangoli Silk Saree with Mirror Work',
    description: `Most viral trending saree. Prime quality product, just in.

Saree
Design Name : WCT
Fabric : Soft Rangoli silk
Work : Designer zari and thread C-pallu work with fancy real mirror work

Blouse
Fabric : Soft Rangoli silk with fancy real mirror work
Stitching : Unstitched`,
  },
  {
    slug: 'chinon-ready-to-wear-saree-full-koti', cat: 'sarees', price: 7400, photos: 16, featured: true,
    name: 'Ready to Wear Chinon Saree with Full Koti & Belt',
    description: `New super trending ready to wear saree with a fully stitched embroidery cording work koti (jacket) and belt.

Saree
Fabric : Heavy chinon
Work : Fancy moti lace
Stitching : Ready to wear

Jacket (koti)
Fabric : Banglori
Work : Embroidery cording work
Size : Fully stitched, up to 42

Blouse
Fabric : Heavy chinon

Belt
Work : Embroidery, fully stitched
Weight : 1 kg`,
  },
  {
    slug: 'narayanapet-cotton-saree', cat: 'sarees', price: 6100, photos: 24, featured: true,
    name: 'Narayanapet Design 120 Count Cotton Saree',
    description: `Traditional collection Narayanapet design cotton sarees. A very trendy Insta collection.

Saree
Fabric : 120 count cotton
Feel : Very soft and comfortable to wear
Blouse : Running blouse
Length : 6.2 meters with blouse`,
  },
  {
    slug: 'viscose-gajji-silk-saree', cat: 'sarees', price: 9000, photos: 11, featured: true,
    name: 'Viscose Gajji Silk Saree · Horse & Elephant Border',
    description: `Upcoming festive wear collection. 100% fine and first quality, ready to dispatch.

Saree
Fabric : Exclusive viscose Gajji silk
Body : Zari woven buttas all over
Border : Zari woven Bentex horse and elephant self border
Pallu : Rich woven self pallu
Blouse : Butti blouse
Availability : Single and multiples available`,
  },
  {
    slug: 'rangoli-crush-silk-saree', cat: 'sarees', price: 4560, photos: 17, featured: false,
    name: 'Rangoli Crush Silk Saree with Embroidery Blouse',
    description: `New arrival. Rangoli crush silk saree with a beautiful embroidery bits work blouse.

Saree
Fabric : Rangoli crush silk

Blouse
Work : Embroidery bits work
Availability : Ready stock`,
  },
  {
    slug: 'rose-mosaic-georgette-saree', cat: 'sarees', price: 4550, photos: 15, featured: true,
    name: 'Rose Mosaic Print Georgette Saree',
    description: `New arrival, catalogue Rose. Premium quality.

Saree
Fabric : Soft and smooth georgette
Print : Mosaic digital print
Border : Swarovski stone work scalloped border
Cut : 6.30 meters
Weight : 450 g

Blouse
Design : Printed blouse
Availability : Single colour`,
  },
  {
    slug: 'lichi-silk-banarasi-saree', cat: 'sarees', price: 4300, photos: 7, featured: false,
    name: 'Organic Banarasi Lichi Silk Saree',
    description: `Your dream wedding look should fit your comfort. Breathable organic Banarasi sarees for intimate and big Indian weddings, light on your skin.

Saree
Fabric : Lichi silk
Saree Length : 5.5 meters
Blouse Length : 0.8 meter
Weight : 550 g`,
  },
  {
    slug: 'ajrakh-crepe-gajji-silk-saree', cat: 'sarees', price: 4700, photos: 7, featured: false,
    name: 'Ajrakh Print Premium Crepe Silk Saree',
    description: `New super Ajrakh saree in pure crepe Gajji silk.

Saree
Fabric : Premium crepe silk
Print : Ajrakh
Length : 6.30 meters with blouse
Width : 48 inches
Latkans : 6 premium latkans
Weight : 480 g
Availability : Single and bulk ready`,
  },
  {
    slug: 'mysore-silk-weaving-border-saree', cat: 'sarees', price: 4520, photos: 8, featured: false,
    name: 'Super Premium Mysore Silk Saree',
    description: `Super hit new collection. Multiples ready to dispatch.

Saree
Fabric : Super premium Mysore silk
Border : Weaving border
Feel : Very soft and lightweight, perfect for an official look

Blouse
Design : Perfectly matching blouse, as shown in the photos`,
  },
  {
    slug: 'kanjiveram-silk-zari-lehenga', cat: 'lehengas', price: 5390, photos: 41, featured: true,
    name: 'Kanjiveram Silk Zari Lehenga with Banarasi Dupatta',
    description: `Kanjiveram silk zari lehenga with blouse, along with a Banarasi silk dupatta. 100% pure quality.

Lehenga
Fabric : Kanjiveram silk zari
Length : 3 meters, unstitched

Blouse
Fabric : Banarasi silk zari work
Length : 1 meter approx, unstitched

Dupatta
Fabric : Banarasi silk zari work
Length : 2.25 meters
Availability : Ready stock`,
  },
  {
    slug: 'vichitra-silk-draping-gown', cat: 'gowns-kurtis', price: 5450, photos: 12, featured: true, options: SIZES_S_3XL,
    name: 'Vichitra Silk Draping Style Party Gown',
    description: `Exclusive arrival. A party wear draping style gown with complete beads work on the yoke, plus a dupatta and belt so you can style it many ways. Perfect for festivals and functions.

Gown
Fabric : Premium blooming vichitra silk
Work : Sequence and beads work
Lining : Complete crepe lining attached
Length : 55 inches

Dupatta
Fabric : Premium blooming vichitra silk
Length : 2.5 meters

Belt
Work : Same embroidery and beads work
Set : Gown, dupatta and belt
Sizes : S to 3XL`,
  },
  {
    slug: 'slub-cotton-embroidery-suit-set', cat: 'suit-sets', price: 4160, photos: 16, featured: false, options: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    name: 'Slub Cotton Embroidery Kurti, Pant & Dupatta Set',
    description: `Guaranteed quality product.

Top
Fabric : Slub cotton
Work : Embroidery
Length : 43+ inches

Bottom
Fabric : Slub cotton
Length : 38+ inches

Dupatta
Fabric : Chanderi, digital printed
Sizes : S (36), M (38), L (40), XL (42), XXL (44)
Weight : 400 g`,
  },
  {
    slug: 'blackberry-viscose-suit-set', cat: 'suit-sets', price: 5350, photos: 11, featured: true, options: ['S', 'M', 'L', 'XL', 'XXL'],
    name: 'BlackBerry Viscose Embroidered Suit Set',
    description: `Catalogue BlackBerry.

Top
Fabric : Viscose
Work : Embroidered
Sleeves : Three quarter sleeves
Kurti Length : 44 inches

Bottom
Fabric : Viscose
Pant Length : 39 inches

Dupatta
Fabric : Chanderi
Work : Digital printed
Length : 2.25 meters
Sizes : S, M, L, XL, XXL`,
  },
  {
    slug: 'vichitra-silk-kurta-pant-set', cat: 'suit-sets', price: 5550, photos: 7, featured: false, options: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)', '3XL (46)'],
    name: 'Vichitra Silk Designer Kurta Pant Set',
    description: `New premium designer kurta pant set. 100% quality satisfaction guaranteed. Colour may vary slightly from the picture due to lighting.

Kurta
Fabric : Vichitra silk
Work : Embroidery
Sleeves : 3/4 sleeves
Length : 44+ inches

Pant
Length : 38+ inches

Dupatta
Fabric : Vichitra silk with embroidery work
Sizes : M (38), L (40), XL (42), XXL (44), 3XL (46)
Weight : 550 g`,
  },
  {
    slug: 'summer-cotton-3-piece-combo', cat: 'suit-sets', price: 9400, photos: 11, featured: true, options: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', '3XL (46)'],
    name: 'Summer Special Slub Cotton Suit · 3 Set Combo',
    description: `New launching combo of 3 suit sets at one price. Pick any 3 designs from the photos. If you don't like a collage, choose different pictures and send your order.

Top
Fabric : Slub cotton
Work : Embroidery
Length : 42+ inches

Bottom
Fabric : Slub cotton
Length : 38+ inches

Dupatta
Fabric : Chanderi, digital printed
Combo : 3 suit sets, fixed combo
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL
Weight : 1200 g`,
  },
  {
    slug: 'titali-tunic-palazzo-set', cat: 'suit-sets', price: 3900, photos: 34, featured: true, options: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', '3XL (46)', '4XL (48)', '5XL (50)'],
    name: 'Titali Tunic & Palazzo Set · SF Vol 60',
    description: `Price by size: S to XXL Rs 3,900, 3XL to 5XL Rs 4,150. 100% quality product.

Tunic
Fabric : Poly rayon
Work : Gaj button
Length : 32+ front, 36+ back
Sizes : S-36, M-38, L-40, XL-42, XXL-44, 3XL-46, 4XL-48, 5XL-50

Palazzo
Fabric : Imported stretchable Lycra
Length : 38+ inches
Size : Free size up to 5XL, elastic with belt
Weight : 400 g`,
  },
  {
    slug: 'banarasi-silk-kurti-set', cat: 'suit-sets', price: 5250, photos: 12, featured: false, options: SIZES_S_3XL,
    name: 'Banarasi Silk Zari Kurti, Pant & Dupatta Set',
    description: `Exclusive arrival. A traditional Banarasi silk kurti set with beautiful zari work and a rich pallu dupatta. Perfect for temple and festival wear.

Kurti
Fabric : Premium quality Banarasi silk
Work : Zari work
Length : 43 inches
Lining : Complete crepe lining

Dupatta
Design : Rich pallu
Length : 2.25 meters
Set : Kurti, dupatta and pant
Sizes : S to 3XL`,
  },
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
    slug: 'semi-gadwal-pattu-premium-saree', cat: 'sarees', price: 12300, photos: 5, featured: true,
    name: 'Semi Gadwal Pattu Premium Saree',
    description: `Latest and exclusive. A very exclusive premium semi Gadwal pattu saree.

Saree
Fabric : Semi Gadwal pattu
Quality : Very exclusive premium
Availability : In stock, ready to ship`,
  },
  {
    slug: 'semi-gadwal-pattu-kanchi-border-saree', cat: 'sarees', price: 8500, photos: 35, featured: true,
    name: 'Soft Semi Gadwal Pattu Saree · Kanchi Border',
    description: `Soft semi Gadwal pattu sarees with self weaving butties and contrast Kanchi weaving borders.

Saree
Fabric : Soft semi Gadwal pattu
Body : Self weaving butties
Border : Contrast Kanchi weaving border
Blouse : Contrast blouse, as shown
Availability : In stock, ready to ship`,
  },
  {
    slug: 'ready-to-wear-saree-koti-200', cat: 'sarees', price: 7750, photos: 12, featured: true,
    name: 'Ready to Wear Saree with Embroidered Koti · D.No 200',
    description: `New super trending ready to wear saree with a full embroidery sequence work koti (jacket).

Saree
Fabric : Heavy satin crepe
Stitching : Ready to wear

Jacket (Koti)
Fabric : Heavy satin crepe
Work : Embroidery sequence work
Size : Fully stitched, up to 42

Blouse
Fabric : Heavy satin crepe with embroidery work

Belt
Work : Embroidery belt, fully stitched
Weight : 1 kg`,
  },
  {
    slug: 'soft-silk-zari-stripe-saree', cat: 'sarees', price: 5920, photos: 24, featured: true,
    name: 'Luxury Soft Silk Zari Stripe Saree',
    description: `Luxury soft silk wedding and party wear saree. Light weight, soft texture, feel the quality.

Saree
Fabric : Dana 11/2 warp with 75D karishma silk
Design : Rich line zari and chain design checks with zari stripes, pattu type weaving
Pallu : Rich running zari pallu with plain vertical stripes
Blouse : Running blouse
Thread : First quality thread, guaranteed quality
Availability : Multiples and uniform sets available, ready to ship`,
  },
  {
    slug: 'exclusive-designer-silk-saree', cat: 'sarees', price: 5790, photos: 35, featured: true,
    name: 'Exclusive Designer Bridal Silk Saree',
    description: `New arrival. Exclusive designer silk saree, more attractive than pure soft silk sarees. Direct manufacturer price.

Saree
Fabric : Bridal silk material (a type of pure silk)
Weaving : 360 speed RPM, 100% genuine quality
Design : Full body real 3D embossed rich design
Zari : Rose gold zari type, woven with matching 110 karizma
Pallu : Rich pallu
Blouse : Contrast blouse`,
  },
  {
    slug: 'chanderi-temple-border-saree', cat: 'sarees', price: 5200, photos: 13, featured: false,
    name: 'Chanderi Printed Temple Border Saree',
    description: `Woven whispers of royalty, wrapped in Chanderi charm.

Saree
Fabric : Polyester viscose Chanderi
Work : Printed with temple border
Length : 5.5 meters

Blouse (unstitched)
Fabric : Polyester viscose Chanderi
Work : Printed with temple border
Length : 0.80 meter
Weight : 0.59 kg`,
  },
  {
    slug: 'space-fendy-silk-beads-saree', cat: 'sarees', price: 4980, photos: 8, featured: false,
    name: 'Pure Space Fendy Silk Beads Work Saree',
    description: `Fresh arrival. Pure space fendy silk saree with bead work and viscose thread embroidered flowers all over.

Saree
Fabric : Pure space fendy silk
Work : Bead work with viscose thread flower embroidery all over
Blouse : Running blouse`,
  },
  {
    slug: 'kaveri-malmal-cotton-silk-saree', cat: 'sarees', price: 4760, photos: 7, featured: false,
    name: 'Kaveri Mal Mal Cotton Silk Saree',
    description: `New launch, catalogue Kaveri. Upgrade your wardrobe with this khadi cotton saree.

Saree
Fabric : Mal mal cotton silk
Length : 5.5 meters

Blouse (unstitched)
Fabric : Beautiful jacquard wine rose zari
Availability : Single and bulk available, ready to ship`,
  },
  {
    slug: 'mirror-work-raw-silk-blouse', cat: 'sarees', price: 3690, photos: 10, featured: false,
    name: 'Mirror Work Pure Raw Silk Blouse',
    description: `Trending ready made blouse, Navratri special. Pair it with any saree or lehenga.

Blouse
Fabric : Pure raw silk
Work : Multicolour mirror work
Pattern : Apple cut blouse
Size : Free size up to 42, 10 inch sleeve margin inside
Height : 15 inches
Padded : Yes
Lining : Cotton
Opening : Back with hook
Colours : 7 colours
Weight : 300 g`,
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
    slug: 'mono-satin-sequins-lehenga-1686', cat: 'lehengas', price: 13250, photos: 3, featured: true,
    name: 'Mono Satin Sequins Cut Work Lehenga · D.No 1686',
    description: `A 4 meter flared coding sequins cut work lehenga with can-can and canvas layers. A perfect fusion of glamour and comfort.

Lehenga
Fabric : Heavy mono satin silk
Work : Coding sequins cut work with can-can and canvas patta
Flair : 4 meters
Stitching : Semi stitched
Length : 42 inches
Size : Up to 44
Colour : Blue

Blouse (unstitched)
Fabric : Heavy mono satin silk
Work : Coding sequins work
Length : 2 meters

Dupatta
Fabric : Butterfly net
Work : Coding sequins cut work
Length : 2.3 meters
Weight : Under 2 kg`,
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
    slug: 'deepavali-combo-suit-set', cat: 'suit-sets', price: 11700, photos: 5, featured: true, options: SIZES_S_3XL,
    name: 'Deepavali Combo Offer · 3 Kurta Sets',
    description: `Deepavali combo offer: three kurta, bottom and dupatta sets in one pack. Designs Panel, Chameli and Pooja.

Kurta
Fabric : Cotton slub with all over embroidery work
Length : 44+ inches
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46)

Bottom
Fabric : Cotton slub
Length : 38+ inches

Dupatta
Fabric : Maico, chinon, Chanderi
Length : 2.20 meters

Package
Package Contains : 3 sets (Panel, Chameli, Pooja)
Weight : 1.4 kg`,
  },
  {
    slug: 'crepe-anarkali-suit-519', cat: 'suit-sets', price: 9300, photos: 13, featured: true, options: SIZES_S_3XL,
    name: 'Designer Crepe Anarkali Suit · D.No 519',
    description: `New designer Anarkali suit in a new fancy style. Fully stitched with zip.

Anarkali
Fabric : Heavy natural crepe with 5 mm sequence and cording embroidery, full sleeves
Inner : Micro cotton
Length : 50–52 inches
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46) with margin, fully stitched

Pant
Fabric : Heavy natural crepe
Length : 38–40 inches

Dupatta
Fabric : Heavy tabby organza with 5 mm sequence and embroidery work
Length : 2.20 meters
Weight : 1.2 kg`,
  },
  {
    slug: 'chinon-silk-anarkali-suit-534', cat: 'suit-sets', price: 8500, photos: 5, featured: true, options: SIZES_S_3XL,
    name: 'Karwa Chauth Chinon Silk Anarkali Suit · D.No 534',
    description: `Karwa Chauth special. New designer Anarkali suit in a new fancy style, with zip.

Anarkali
Fabric : Heavy chinon silk with 3 mm sequence and zari embroidery, full long sleeves
Inner : Micro cotton
Length : 50–52 inches
Flair : 6 meters
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46) with margin

Pant
Fabric : Chinon silk
Inner : Micro cotton
Length : 39–40 inches

Dupatta
Fabric : Heavy chinon silk with 5 mm sequence embroidery
Border : Fancy lace border cut work with 3 mm sequence embroidery
Length : 2.30 meters
Weight : 950 g`,
  },
  {
    slug: 'fox-georgette-palazzo-set', cat: 'suit-sets', price: 8230, photos: 16, featured: true, options: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    name: 'Fox Georgette Party Wear Top & Palazzo Set',
    description: `New designer party wear top and palazzo with a fancy dupatta and embroidery sequence work. Minor colour difference is possible due to photography.

Top
Fabric : Premium heavy soft fox georgette with heavy sequence, multi thread embroidery, zari work and boring chippli
Inner : Micro cotton
Length : 44–45 inches
Sizes : S (36), M (38), L (40), XL (42), with margin to XXL (44)

Bottom
Fabric : Premium heavy soft fox georgette with the same embroidery work
Length : 40 inches

Dupatta
Fabric : Premium heavy soft fox georgette with the same embroidery work
Border : Two side big border
Length : 2.2 meters
Weight : 800 g`,
  },
  {
    slug: 'hamia-crepe-silk-palazzo-set-589', cat: 'suit-sets', price: 7200, photos: 7, featured: false, options: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    name: 'Hamia Crepe Silk Top & Palazzo Set · DN 589',
    description: `New designer party wear top and palazzo with a fancy dupatta and embroidery sequence work.

Top
Fabric : Heavy natural crepe soft silk with heavy sequence embroidery, zari work and moti work
Inner : Micro cotton
Length : 44–45 inches
Sizes : S (36), M (38), L (40), XL (42), with margin to XXL (44)

Bottom
Fabric : Heavy natural crepe soft silk with sequence embroidery zari
Waist : Elastic
Length : 40 inches

Dupatta
Fabric : Heavy natural crepe soft silk with heavy sequence embroidery zari work
Border : Four side big box patta
Length : 2.2 meters
Weight : 750 g`,
  },
  {
    slug: 'kavita-crunchy-silk-kurti-set', cat: 'suit-sets', price: 5650, photos: 10, featured: false, options: ['S', 'M', 'L', 'XL', 'XXL'],
    name: 'Kavita Crunchy Silk Flared Kurti, Pant & Dupatta Set',
    description: `Women's heavy crunchy silk flared kurti, pant and dupatta set, design Kavita 3. Perfect for festive wear, party wear, traditional functions and a casual ethnic look.

Kurti
Fabric : Heavy crunchy silk with sequence coding embroidery work
Length : 46+ inches
Sizes : S, M, L, XL, XXL

Pant
Fabric : Heavy shantoon silk
Length : 40 inches

Dupatta
Fabric : Crunchy silk
Weight : 470 g`,
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
    slug: 'fendy-silk-gown-sequence-dupatta', cat: 'gowns-kurtis', price: 8600, photos: 5, featured: true, options: SIZES,
    name: 'Fendy Silk Designer Gown with Sequence Dupatta',
    description: `Exclusive trending designer gown with a heavy sequence embroidery work dupatta. Fully stitched and ready to wear.

Gown
Fabric : Fendy silk, fully flared
Sleeves : Full
Inner : Heavy micro cotton
Length : 49–50 inches
Sizes : M (38), L (40), XL (42), XXL (44)

Pant
Fabric : Micro cotton
Length : 39–40 inches

Dupatta
Fabric : Fendy silk
Work : Sequence embroidery work
Weight : 950 g`,
  },
  {
    slug: 'fendy-silk-peacock-gown-3185', cat: 'gowns-kurtis', price: 7850, photos: 42, featured: true, options: SIZES,
    name: 'Fendy Silk Embroidery Gown Set · D.No 3185',
    description: `Women's ethnic wear. Fully stitched and ready to wear, premium quality.

Gown
Fabric : Fendy silk
Design : Embroidery codding and sequence work
Sleeves : Full
Inner : Heavy micro cotton
Sizes : M (38), L (40), XL (42), XXL (44)

Pant
Fabric : Fendy silk
Inner : Micro cotton

Dupatta
Fabric : Fendy silk
Design : Embroidery codding and sequence work with lace border
Weight : 850 g`,
  },
  {
    slug: 'megha-rangoli-anarkali', cat: 'gowns-kurtis', price: 5480, photos: 11, featured: true, options: SIZES_S_3XL,
    name: 'Megha Rangoli Embroidery Anarkali with Belt',
    description: `All new Rangoli embroidery Anarkali suit, catalogue Megha. Comes with a matching belt.

Anarkali
Fabric : Rangoli
Lining : Complete lining
Length : 52+ inches
Sleeve Length : 22 inches
Flair : 4 meters
Colours : Maroon, lavender, blue, onion, purple
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46)

Dupatta
Fabric : Rangoli, four side border
Weight : 530 g`,
  },
  {
    slug: 'silk-cotton-kanchi-border-kurti-set', cat: 'gowns-kurtis', price: 5220, photos: 16, featured: false, options: SIZES_S_3XL,
    name: 'Silk Cotton Kanchi Border Gown & Dupatta',
    description: `Elevate your style with this pure silk cotton set with a beautiful zari Kanchi border and a contrast zari weaving dupatta. Perfect festival wear.

Gown
Fabric : Premium quality silk cotton
Border : Zari Kanchi border work
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46)

Dupatta
Design : Contrast zari weaving
Weight : 430 g`,
  },
  {
    slug: 'vel-design-chettinad-kurti', cat: 'gowns-kurtis', price: 4820, photos: 15, featured: false, options: SIZES_S_3XL,
    name: 'Murugan Vel Design Chettinad Cotton Kurti',
    description: `New festival kurti, Vel design. Wear the power of Murugan Vel. Shipping extra.

Kurti
Fabric : Chettinad cotton with Vel symbol
Lining : Complete lining, with back side pattern and dori or funka
Length : 46+ inches
Sizes : S (36), M (38), L (40), XL (42), XXL (44), 3XL (46)
Colours : 4 colours

Dupatta
Fabric : Chettinad cotton
Length : 2.25 meters
Weight : 430 g`,
  },
  {
    slug: 'check-kurti-kalamkari-dupatta', cat: 'gowns-kurtis', price: 4500, photos: 17, featured: false,
    options: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    name: 'Check Weaving Kurti with Kalamkari Dupatta',
    description: `Traditional check weaving kurti with a Kalamkari print dupatta.

Kurti
Fabric : Silk cotton
Length : 43–44 inches
Sleeve Length : 11 inches
Lining : Crepe
Neck : Scallop cut work with canvas stitch finish
Sizes : S, M, L, XL, 2XL, 3XL, 4XL, 5XL

Dupatta
Fabric : Chennuri silk
Design : Kalamkari prints, 4 floral designs with no human or figure prints
Weight : 350–400 g`,
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
  {
    slug: 'kids-fendy-silk-gown-set-254', cat: 'kids', price: 6850, photos: 17, featured: true, optionLabel: 'Age', options: KIDS_AGES,
    name: "Kids' Fendy Silk Embroidery Gown Set · Code 254",
    description: `Premium quality, ready to wear, showroom finished. A trending kids gown set, fully stitched. See the size chart in the photos.

Gown
Fabric : Heavy fendy silk
Work : Embroidery threads, zari and sequins work
Sleeves : Full sleeves
Inner : Micro cotton
Stitching : Fully stitched

Bottom
Fabric : Micro cotton, fully stitched

Dupatta
Fabric : Heavy fendy silk
Work : Embroidery threads, zari and sequins work
Ages : 3 to 15 years
Weight : 650 g`,
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
  { id: 1, name: 'All districts in Sri Lanka', days: '1–5 working days', rate: 350, sort: 1, districts: ['Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha','Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya'] },
];
