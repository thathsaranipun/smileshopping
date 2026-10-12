import ProductImage from './ProductImage';
import { money, plumeStyle } from '@/lib/format';

export function ReceiptHead({ title }) {
  const d = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="r-head">
      <img className="bird" src="/bird.webp" alt="" />
      <img className="word" src="/word.webp" alt="Smile Shopping" />
      <span className="mute">{title} · {d}</span>
    </div>
  );
}

export function ReceiptLine({ item, children }) {
  const p = { name: item.name, images: item.image ? [item.image] : [] };
  return (
    <div className="r-item">
      <div className="r-thumb plume" style={plumeStyle(item.cat)}><ProductImage product={p} /></div>
      <div>
        <div className="r-name">{item.name}</div>
        <div className="r-var">{item.variant ? `${item.variant} · ` : ''}{children ? `${money(item.price)} each` : `Qty ${item.qty}`}</div>
        {children}
      </div>
      <div>{money(item.price * item.qty)}</div>
    </div>
  );
}

export const zoneFor = (zones, district) => zones.find(z => z.districts?.includes(district));
export const deliveryFor = (zones, settings, subtotal, district) => {
  const z = zoneFor(zones, district);
  if (!z) return null;
  return settings.free_over > 0 && subtotal >= settings.free_over ? 0 : z.rate;
};
