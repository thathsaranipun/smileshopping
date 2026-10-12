-- =====================================================================
-- Smile Shopping — database setup
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run once on a fresh project.
-- =====================================================================

-- ---------- tables ----------
create table if not exists public.admins (
  email text primary key
);

create table if not exists public.categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  sort int not null default 0,
  bg text not null default '#FFF4D1',
  w1 text not null default '#FFE38A',
  w2 text not null default '#FBC24A'
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category_id int references public.categories(id) on delete set null,
  price int not null check (price >= 0),
  was_price int check (was_price is null or was_price >= 0),
  stock int not null default 0 check (stock >= 0),
  variant_label text not null default 'Colour',
  variants text[] not null default '{}',
  images text[] not null default '{}',
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);

create table if not exists public.delivery_zones (
  id serial primary key,
  name text not null,
  days text not null,
  rate int not null check (rate >= 0),
  districts text[] not null default '{}',
  sort int not null default 0
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  free_over int not null default 15000,
  whatsapp text not null default '94770000000'
);

create sequence if not exists public.order_seq start 10001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique default ('SS' || nextval('public.order_seq')),
  token uuid not null unique default gen_random_uuid(),
  customer_name text not null,
  mobile text not null,
  email text,
  address text not null,
  district text not null,
  notes text,
  items jsonb not null,
  subtotal int not null,
  delivery int not null,
  total int not null,
  pay_method text not null check (pay_method in ('online','cod')),
  pay_status text not null default 'Unpaid' check (pay_status in ('Unpaid','Paid','COD','Failed')),
  status text not null default 'Pending' check (status in ('Pending','Confirmed','Processing','Dispatched','Delivered','Cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ---------- helper: is the signed-in user an admin? ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- ---------- row level security ----------
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (public.is_admin());

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select using (active or public.is_admin());
drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read zones" on public.delivery_zones;
create policy "public read zones" on public.delivery_zones for select using (true);
drop policy if exists "admin write zones" on public.delivery_zones;
create policy "admin write zones" on public.delivery_zones for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);
drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Customers never read the orders table directly; only admins do.
drop policy if exists "admin all orders" on public.orders;
create policy "admin all orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());

-- ---------- place an order (prices and delivery are computed here, never trusted from the browser) ----------
create or replace function public.place_order(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  it jsonb; pr record; qty int; sub int := 0; del int; z record; fo int;
  lines jsonb := '[]'::jsonb; o_token uuid; method text;
begin
  method := coalesce(p->>'pay_method','online');
  if method not in ('online','cod') then raise exception 'Invalid payment method'; end if;
  if length(trim(coalesce(p->>'customer_name',''))) < 2 then raise exception 'Enter your full name'; end if;
  if coalesce(p->>'mobile','') !~ '^0[0-9]{9}$' then raise exception 'Enter a 10-digit mobile number starting with 0'; end if;
  if length(trim(coalesce(p->>'address',''))) < 5 then raise exception 'Enter your delivery address'; end if;
  if jsonb_array_length(coalesce(p->'items','[]'::jsonb)) = 0 then raise exception 'Your cart is empty'; end if;

  for it in select * from jsonb_array_elements(p->'items') loop
    qty := greatest(1, least(50, coalesce((it->>'qty')::int, 1)));
    select * into pr from products where id = (it->>'product_id')::uuid and active;
    if not found then raise exception 'A product in your cart is no longer available'; end if;
    if pr.stock < qty then raise exception '% has only % left', pr.name, pr.stock; end if;
    sub := sub + pr.price * qty;
    lines := lines || jsonb_build_object('product_id', pr.id, 'slug', pr.slug, 'name', pr.name,
      'variant', nullif(it->>'variant',''), 'qty', qty, 'price', pr.price, 'image', pr.images[1]);
  end loop;

  select * into z from delivery_zones where (p->>'district') = any(districts) limit 1;
  if not found then raise exception 'Select your district'; end if;
  select free_over into fo from settings where id = 1;
  del := case when sub >= coalesce(fo, 0) and coalesce(fo,0) > 0 then 0 else z.rate end;

  insert into orders (customer_name, mobile, email, address, district, notes, items, subtotal, delivery, total, pay_method, pay_status, status)
  values (trim(p->>'customer_name'), p->>'mobile', nullif(trim(coalesce(p->>'email','')),''), trim(p->>'address'), p->>'district',
          nullif(trim(coalesce(p->>'notes','')),''), lines, sub, del, sub + del, method,
          case when method = 'cod' then 'COD' else 'Unpaid' end,
          case when method = 'cod' then 'Confirmed' else 'Pending' end)
  returning token into o_token;

  if method = 'cod' then
    update products pp set stock = greatest(0, pp.stock - (l->>'qty')::int)
    from jsonb_array_elements(lines) l where pp.id = (l->>'product_id')::uuid;
  end if;
  return o_token;
end $$;

-- ---------- read one order by its secret token (for the customer's tracking page) ----------
create or replace function public.get_order(t uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('order_no', order_no, 'token', token, 'customer_name', customer_name, 'mobile', mobile,
    'address', address, 'district', district, 'items', items, 'subtotal', subtotal, 'delivery', delivery,
    'total', total, 'pay_method', pay_method, 'pay_status', pay_status, 'status', status, 'created_at', created_at)
  from orders where token = t;
$$;

-- ---------- DEMO payment result (replace with the real gateway's server callback before launch) ----------
create or replace function public.demo_payment(t uuid, success boolean) returns void
language plpgsql security definer set search_path = public as $$
declare o record;
begin
  select * into o from orders where token = t and pay_method = 'online' and pay_status in ('Unpaid','Failed');
  if not found then return; end if;
  if success then
    update orders set pay_status = 'Paid', status = 'Confirmed' where id = o.id;
    update products pp set stock = greatest(0, pp.stock - (l->>'qty')::int)
    from jsonb_array_elements(o.items) l where pp.id = (l->>'product_id')::uuid;
  else
    update orders set pay_status = 'Failed' where id = o.id;
  end if;
end $$;

create or replace function public.switch_to_cod(t uuid) returns void
language plpgsql security definer set search_path = public as $$
declare o record;
begin
  select * into o from orders where token = t and pay_status in ('Unpaid','Failed');
  if not found then return; end if;
  update orders set pay_method = 'cod', pay_status = 'COD', status = 'Confirmed' where id = o.id;
  update products pp set stock = greatest(0, pp.stock - (l->>'qty')::int)
  from jsonb_array_elements(o.items) l where pp.id = (l->>'product_id')::uuid;
end $$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
grant execute on function public.get_order(uuid) to anon, authenticated;
grant execute on function public.demo_payment(uuid, boolean) to anon, authenticated;
grant execute on function public.switch_to_cod(uuid) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- product photo storage ----------
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "public read product photos" on storage.objects;
create policy "public read product photos" on storage.objects for select using (bucket_id = 'products');
drop policy if exists "admin upload product photos" on storage.objects;
create policy "admin upload product photos" on storage.objects for insert with check (bucket_id = 'products' and public.is_admin());
drop policy if exists "admin update product photos" on storage.objects;
create policy "admin update product photos" on storage.objects for update using (bucket_id = 'products' and public.is_admin());
drop policy if exists "admin delete product photos" on storage.objects;
create policy "admin delete product photos" on storage.objects for delete using (bucket_id = 'products' and public.is_admin());

-- ---------- starter data ----------
insert into public.settings (id) values (1) on conflict (id) do nothing;

insert into public.categories (name, slug, sort, bg, w1, w2) values
 ('Home & Kitchen','home',1,'#FFF4D1','#FFE38A','#FBC24A'),
 ('Beauty & Care','beauty',2,'#F7EAFD','#EBCBF8','#D7A6F0'),
 ('Electronics','tech',3,'#E3F7FF','#B5EBFF','#7DD8FB'),
 ('Fashion','fashion',4,'#FFECE1','#FFCDAE','#FFA877'),
 ('Kids & Toys','kids',5,'#E8EEFF','#C9D7FF','#9DB4F7')
on conflict (slug) do nothing;

insert into public.delivery_zones (name, days, rate, sort, districts)
select * from (values
 ('Colombo district','1–2 working days',350,1,array['Colombo']),
 ('Gampaha & Kalutara','1–3 working days',400,2,array['Gampaha','Kalutara']),
 ('Other main districts','2–4 working days',450,3,array['Kandy','Matale','Nuwara Eliya','Galle','Matara','Hambantota','Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla','Monaragala','Ratnapura','Kegalle']),
 ('Northern & Eastern districts','3–5 working days',550,4,array['Jaffna','Kilinochchi','Mannar','Vavuniya','Mullaitivu','Trincomalee','Batticaloa','Ampara'])
) v(name,days,rate,sort,districts)
where not exists (select 1 from public.delivery_zones);

insert into public.products (slug,name,description,category_id,price,was_price,stock,variant_label,variants,featured)
select v.slug,v.name,v.descr,c.id,v.price,v.was,v.stock,v.vl,v.vars,v.feat
from (values
 ('clay-brew-mug-set','Clay Brew Mug Set (2 pcs)','Hand-glazed ceramic mugs that keep your tea warm for longer. 350ml each, microwave and dishwasher safe.','home',2450,2900,24,'Colour',array['Red','Sand','Plum'],true),
 ('insulated-flask','Everyday Insulated Flask 750ml','Cold for 24 hours, hot for 12. Leak-proof lid that fits most car cup holders.','home',3200,null,40,'Colour',array['Sky','Sunny','Night'],true),
 ('electric-kettle','Quick-Boil Electric Kettle 1.7L','Stainless steel body, auto shut-off and boil-dry protection.','home',6950,7900,9,'Colour','{}'::text[],false),
 ('wireless-headphones','Aura Wireless Headphones','40-hour battery, soft memory-foam cushions and Bluetooth 5.3 with a built-in mic.','tech',8900,10500,15,'Colour',array['Plum','Midnight'],true),
 ('mini-speaker','Pocket Beat Mini Speaker','Splash-proof speaker with 12 hours of playtime and a clip for your bag.','tech',4500,null,3,'Colour',array['Orange','Graphite'],true),
 ('smart-watch','Pulse Fit Smart Watch','Heart-rate, sleep and step tracking with a 7-day battery and WhatsApp notifications.','tech',11900,null,12,'Colour',array['Blue','Black'],false),
 ('glow-serum','Glow Vitamin C Serum 30ml','Brightening serum with vitamin C and niacinamide. Lightweight and suitable for all skin types.','beauty',2890,null,30,'Colour','{}'::text[],true),
 ('lip-tint','Velvet Lip Tint','Long-wear tint with a soft matte finish that feels weightless.','beauty',1450,null,50,'Shade',array['Rose','Berry','Nude'],false),
 ('canvas-tote','Market Canvas Tote','Heavy cotton canvas tote with an inner zip pocket.','fashion',1990,null,60,'Colour',array['Plum','Natural','Navy'],true),
 ('street-sneakers','Street Runner Sneakers','Breathable mesh upper with a cushioned sole for all-day comfort.','fashion',7450,8500,7,'Size',array['UK 6','UK 7','UK 8','UK 9'],true),
 ('cuddle-bear','Cuddle Bear Plush 30cm','Super-soft, child-safe plush with stitched eyes. Machine washable.','kids',2350,null,20,'Colour','{}'::text[],true),
 ('kids-bottle','Little Sipper Kids Bottle','BPA-free 400ml bottle with a flip straw. Fits in any school bag.','kids',1650,null,28,'Colour',array['Sky','Mango'],false)
) v(slug,name,descr,cat,price,was,stock,vl,vars,feat)
join public.categories c on c.slug = v.cat
on conflict (slug) do nothing;

-- ---------- make yourself admin: change the email, then run this line ----------
-- insert into public.admins (email) values ('you@example.com') on conflict do nothing;

-- ---------- live order updates in the admin dashboard ----------
do $$ begin
  alter publication supabase_realtime add table public.orders;
exception when others then null; end $$;
