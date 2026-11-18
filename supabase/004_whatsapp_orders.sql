-- Run once in Supabase → SQL Editor on an existing database.
-- Removes the sandbox card-payment functions. Orders are now sent to the shop on WhatsApp and paid on delivery.
-- (The sandbox function let anyone holding an order link mark that order as "Paid", so it should not stay live.)

drop function if exists public.demo_payment(uuid, boolean);
drop function if exists public.switch_to_cod(uuid);
