/* Shows the product's photo, or a branded placeholder until a photo is uploaded. */
export default function ProductImage({ product, index = 0, priority = false }) {
  const src = product?.images?.[index];
  if (src) {
    return <img src={src} alt={product.name} loading={priority ? 'eager' : 'lazy'} decoding="async" />;
  }
  return (
    <span className="ph" aria-label={product?.name || ''}>
      <img src="/bird.webp" alt="" />
    </span>
  );
}
