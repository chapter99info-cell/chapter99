create extension if not exists pgcrypto;

create type pin_role as enum ('public', 'staff', 'cashier', 'owner', 'superadmin');

create table if not exists pin_registry (
  id uuid primary key default gen_random_uuid(),
  pin_hash text not null,
  role pin_role not null,
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  deactivated_at timestamptz
);

create table if not exists access_log (
  id uuid primary key default gen_random_uuid(),
  role pin_role,
  attempted_pin text,
  success boolean not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create or replace function hash_pin(pin text)
returns text
language sql
stable
as $$
  select encode(digest(pin, 'sha256'), 'hex')
$$;

create or replace function verify_pin(pin text, user_agent text default null)
returns table(role pin_role, success boolean)
language plpgsql
security definer
as $$
declare
  matched pin_registry;
begin
  select *
  into matched
  from pin_registry
  where pin_hash = hash_pin(pin)
    and is_active = true
  limit 1;

  insert into access_log(role, attempted_pin, success, user_agent)
  values (matched.role, right(pin, 1), matched.id is not null, user_agent);

  if matched.id is null then
    return query select null::pin_role, false;
  end if;

  return query select matched.role, true;
end;
$$;

insert into pin_registry(pin_hash, role, label)
values
  (hash_pin('1111'), 'staff', 'Staff - Ploy'),
  (hash_pin('4444'), 'cashier', 'Co-host / Cashier'),
  (hash_pin('9999'), 'owner', 'Owner Hub - Saen'),
  (hash_pin('3501'), 'superadmin', 'Super Admin')
on conflict do nothing;
