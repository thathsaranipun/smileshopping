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
