-- Smile Shopping: manage admin users from the dashboard.
-- Already applied to the live project; kept here so the setup can be recreated.

-- Admins can see and remove entries in the admins list.
drop policy if exists "admins manage list" on public.admins;
create policy "admins manage list" on public.admins for all using (public.is_admin()) with check (public.is_admin());

-- List admins with whether they have a login yet.
create or replace function public.list_admins() returns table(email text, has_login boolean, last_sign_in timestamptz)
language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then raise exception 'Only admins can see this'; end if;
  return query
    select a.email, u.id is not null, u.last_sign_in_at
    from public.admins a left join auth.users u on lower(u.email) = lower(a.email)
    order by a.email;
end $$;

-- Create (or reset) an admin login with a password the current admin chooses.
create or replace function public.create_admin(new_email text, new_password text) returns void
language plpgsql security definer set search_path = public, auth, extensions as $$
declare uid uuid; e text := lower(trim(new_email));
begin
  if not public.is_admin() then raise exception 'Only admins can add admins'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Enter a valid email address'; end if;
  if length(coalesce(new_password, '')) < 8 then raise exception 'Password must be at least 8 characters'; end if;

  select id into uid from auth.users where lower(email) = e;
  if uid is null then
    uid := gen_random_uuid();
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      phone_change, phone_change_token, email_change_token_current, reauthentication_token)
    values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', e,
      extensions.crypt(new_password, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '', '', '', '', '');
    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), uid, uid::text, jsonb_build_object('sub', uid::text, 'email', e, 'email_verified', true), 'email', now(), now(), now());
  else
    update auth.users set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now() where id = uid;
  end if;
  insert into public.admins (email) values (e) on conflict do nothing;
end $$;

-- Remove an admin (their login is deleted too). You can't remove yourself or the last admin.
create or replace function public.remove_admin(old_email text) returns void
language plpgsql security definer set search_path = public, auth as $$
declare e text := lower(trim(old_email));
begin
  if not public.is_admin() then raise exception 'Only admins can remove admins'; end if;
  if e = lower(coalesce(auth.jwt() ->> 'email', '')) then raise exception 'You can''t remove yourself'; end if;
  if (select count(*) from public.admins) <= 1 then raise exception 'Keep at least one admin'; end if;
  delete from public.admins where lower(email) = e;
  delete from auth.users where lower(email) = e;
end $$;

-- Change your own password from the dashboard.
create or replace function public.change_my_password(new_password text) returns void
language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if not public.is_admin() then raise exception 'Only admins can do this'; end if;
  if length(coalesce(new_password, '')) < 8 then raise exception 'Password must be at least 8 characters'; end if;
  update auth.users set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')), updated_at = now()
  where lower(email) = lower(auth.jwt() ->> 'email');
end $$;

revoke all on function public.list_admins() from public, anon;
revoke all on function public.create_admin(text, text) from public, anon;
revoke all on function public.remove_admin(text) from public, anon;
revoke all on function public.change_my_password(text) from public, anon;
grant execute on function public.list_admins() to authenticated;
grant execute on function public.create_admin(text, text) to authenticated;
grant execute on function public.remove_admin(text) to authenticated;
grant execute on function public.change_my_password(text) to authenticated;

-- Point demo products at the photos stored in the repo (public/products/<slug>.jpg).
update public.products set images = array['/products/' || slug || '.jpg']
where slug in ('clay-brew-mug-set','insulated-flask','electric-kettle','wireless-headphones','mini-speaker','smart-watch',
               'glow-serum','lip-tint','canvas-tote','street-sneakers','cuddle-bear','kids-bottle')
  and (images = '{}' or images[1] like '/products/%');
