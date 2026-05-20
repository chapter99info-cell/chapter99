-- Chapter 99 Phase 1: PIN authentication, access log, and RLS lockdown.
create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum ('owner', 'guide', 'operations', 'sales', 'safety');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  role public.app_role not null unique,
  pin_hash text not null,
  is_active boolean not null default true,
  payid text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_users_pin_hash_bcrypt check (pin_hash like '$2%')
);

create table if not exists public.access_logs (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid references public.app_users(id) on delete set null,
  role public.app_role,
  success boolean not null,
  pin_fingerprint text not null,
  device_id text,
  ip_address inet default inet_client_addr(),
  user_agent text,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists access_logs_app_user_id_idx on public.access_logs(app_user_id);
create index if not exists access_logs_created_at_idx on public.access_logs(created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_users_touch_updated_at on public.app_users;
create trigger app_users_touch_updated_at
before update on public.app_users
for each row execute function public.touch_updated_at();

create or replace function public.set_pin(p_user_id uuid, p_pin text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_pin !~ '^[0-9]{4,8}$' then
    raise exception 'PIN must be 4 to 8 digits';
  end if;

  update public.app_users
  set pin_hash = crypt(p_pin, gen_salt('bf', 12))
  where id = p_user_id;

  if not found then
    raise exception 'Unknown app user %', p_user_id;
  end if;
end;
$$;

create or replace function public.verify_pin(
  p_pin text,
  p_device_id text default null,
  p_user_agent text default null
)
returns table (
  ok boolean,
  app_user_id uuid,
  role public.app_role,
  display_name text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_user public.app_users%rowtype;
  fingerprint text := encode(digest(coalesce(p_pin, ''), 'sha256'), 'hex');
begin
  select *
  into matched_user
  from public.app_users
  where is_active
    and pin_hash = crypt(p_pin, pin_hash)
  limit 1;

  if matched_user.id is null then
    insert into public.access_logs(success, pin_fingerprint, device_id, user_agent, reason)
    values (false, fingerprint, p_device_id, p_user_agent, 'invalid_pin');

    return query select false, null::uuid, null::public.app_role, null::text;
    return;
  end if;

  insert into public.access_logs(app_user_id, role, success, pin_fingerprint, device_id, user_agent)
  values (matched_user.id, matched_user.role, true, fingerprint, p_device_id, p_user_agent);

  return query
  select true, matched_user.id, matched_user.role, matched_user.display_name;
end;
$$;

insert into public.app_users(display_name, role, pin_hash, payid)
values
  ('Owner', 'owner', crypt('9999', gen_salt('bf', 12)), null),
  ('Lead Guide', 'guide', crypt('1111', gen_salt('bf', 12)), null),
  ('Operations', 'operations', crypt('2222', gen_salt('bf', 12)), null),
  ('Sales', 'sales', crypt('3333', gen_salt('bf', 12)), null),
  ('Safety', 'safety', crypt('4444', gen_salt('bf', 12)), null)
on conflict (role) do nothing;

alter table public.app_users enable row level security;
alter table public.access_logs enable row level security;

drop policy if exists "no direct app user reads" on public.app_users;
create policy "no direct app user reads"
on public.app_users
for select
to anon, authenticated
using (false);

drop policy if exists "no direct access log reads" on public.access_logs;
create policy "no direct access log reads"
on public.access_logs
for select
to anon, authenticated
using (false);

revoke all on table public.app_users from anon, authenticated;
revoke all on table public.access_logs from anon, authenticated;
grant execute on function public.verify_pin(text, text, text) to anon, authenticated;
