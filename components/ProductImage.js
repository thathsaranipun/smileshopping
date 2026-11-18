import { smallImg } from '@/lib/format';

/* Shows the product's photo, or a branded placeholder until a photo is uploaded.
   Every product photo has a light 480px copy (name-sm.jpg); the browser picks the size the screen needs.
   sizes: how wide the image shows on screen — cards are about half the phone width, the gallery is full width. */
export default function ProductImage({ product, index = 0, priority = false, sizes = '(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 22vw', small = false }) {
  const src = product?.images?.[index];
  if (src) {
    const sm = smallImg(src);
    return (
      <img
        src={small ? sm : src}
        srcSet={small ? undefined : `${sm} 480w, ${src} 1000w`}
        sizes={small ? undefined : sizes}
        alt={product.name}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    );
  }
  return (
    <span className="ph" aria-label={product?.name || ''}>
      <img src="/images/brand/bird.webp" alt="" />
    </span>
  );
}
