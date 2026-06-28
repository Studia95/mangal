-- Repair client catalog write access.
-- Safe to run multiple times in Supabase SQL Editor.
-- It makes every client owner_user_id an owner in catalog_members for their catalog.

insert into public.catalog_members (catalog_id, user_id, role)
select client.catalog_id, client.owner_user_id, 'owner'::public.catalog_role
from public.clients client
where client.catalog_id is not null
  and client.owner_user_id is not null
on conflict (catalog_id, user_id) do update set
  role = excluded.role;

insert into public.profiles (id, email, full_name)
select client.owner_user_id, client.email, coalesce(client.owner_name, '')
from public.clients client
where client.owner_user_id is not null
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name;
