export const money = n => 'Rs. ' + Math.round(Number(n) || 0).toLocaleString('en-US');

export const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const discount = p => (p.was_price && p.was_price > p.price ? Math.round(100 - (p.price / p.was_price) * 100) : 0);

export const plumeStyle = c =>
  c ? { '--b': c.bg, '--w1': c.w1, '--w2': c.w2 } : { '--b': '#F3EEFB', '--w1': '#E9DEF8', '--w2': '#DCCBF4' };

export const slugify = s =>
  String(s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 80);

export const STAGES = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered'];
export const STAGE_LABEL = {
  Pending: 'Order placed', Confirmed: 'Confirmed', Processing: 'Packing', Dispatched: 'On the way', Delivered: 'Delivered', Cancelled: 'Cancelled',
};

export const DISTRICTS = ['Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha','Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya'];

// "94771234567" -> "+94 77 123 4567"
export const prettyPhone = n => {
  const d = String(n || '').replace(/\D/g, '');
  return d.length === 11 && d.startsWith('94') ? `+94 ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : `+${d}`;
};

// The WhatsApp message a customer sends to place an order. Purchases are confirmed on WhatsApp; there is no online payment.
export function orderMessage({ items, subtotal, delivery, customer, orderNo, link }) {
  const lines = items.map(l => `• ${l.name}${l.variant ? ` (${l.variant})` : ''} × ${l.qty} = ${money(l.price * l.qty)}`);
  const del = delivery === null || delivery === undefined ? 'to confirm' : delivery === 0 ? 'FREE' : money(delivery);
  return [
    orderNo ? `Hi Smile Shopping! I'd like to place order ${orderNo}:` : `Hi Smile Shopping! I'd like to order:`,
    ...lines, '',
    `Subtotal: ${money(subtotal)}`, `Delivery: ${del}`, `Total: ${money(subtotal + (delivery || 0))}`,
    ...(customer ? ['', `Name: ${customer.name}`, `Mobile: ${customer.mobile}`, `Address: ${customer.address}, ${customer.district}`,
      customer.notes ? `Note: ${customer.notes}` : ''] : []),
    link ? `\nOrder link: ${link}` : '',
  ].filter(Boolean).join('\n');
}

// Light 480px copy of a product photo: /products/x/cover.jpg -> /products/x/cover-sm.jpg (only for /products images).
export const smallImg = src => (src && src.startsWith('/products/') ? src.replace(/(\.jpe?g)$/i, '-sm$1') : src);
