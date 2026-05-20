-- Trip2Talk V4 Phase 1
-- Secure lightweight PIN sessions and role helpers for Supabase/PostgREST.

begin;

create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum (
    'public',
    'tour_staff',
    'co_host',
    'owner',
    'platform_admin',
    'automation_worker'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.tenant_studios (
  id uuid primary key default gen_random_uuid(),
  studio_name text not null unique,
  abn text not null,
  owner_legal_name text not null,
  owner_payid text not null,
  support_email text not null,
  support_phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_studios_abn_format check (abn ~ '^[0-9 ]{11,14}$')
);

create table if not exists public.pin_access_codes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  access_key text not null,
  role public.app_role not null,
  display_name text not null,
  hashed_pin text not null,
  is_active boolean not null default true,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, access_key),
  constraint pin_access_codes_internal_roles check (role <> 'public')
);

create table if not exists public.app_sessions (
  token_hash text primary key,
  pin_id uuid not null references public.pin_access_codes(id) on delete cascade,
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  role public.app_role not null,
  display_name text not null,
  device_label text,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  constraint app_sessions_expiry check (expires_at > issued_at)
);

create index if not exists app_sessions_tenant_role_idx
  on public.app_sessions (tenant_id, role, expires_at);

create table if not exists public.security_audit_events (
  id bigserial primary key,
  tenant_id uuid references public.tenant_studios(id) on delete set null,
  role public.app_role,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tenant_studios_updated_at on public.tenant_studios;
create trigger set_tenant_studios_updated_at
before update on public.tenant_studios
for each row execute function public.set_updated_at();

drop trigger if exists set_pin_access_codes_updated_at on public.pin_access_codes;
create trigger set_pin_access_codes_updated_at
before update on public.pin_access_codes
for each row execute function public.set_updated_at();

create or replace function public.trip2talk_session_token_hash()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  headers jsonb;
  raw_token text;
begin
  raw_token := nullif(current_setting('app.trip2talk_session', true), '');

  if raw_token is null then
    begin
      headers := nullif(current_setting('request.headers', true), '')::jsonb;
      raw_token := nullif(headers ->> 'x-trip2talk-session', '');
    exception
      when others then
        raw_token := null;
    end;
  end if;

  if raw_token is null then
    return null;
  end if;

  return encode(digest(raw_token, 'sha256'), 'hex');
end;
$$;

create or replace function public.current_app_session()
returns public.app_sessions
language sql
stable
security definer
set search_path = public
as $$
  select s
  from public.app_sessions s
  where s.token_hash = public.trip2talk_session_token_hash()
    and s.revoked_at is null
    and s.expires_at > now()
  limit 1;
$$;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select (public.current_app_session()).role;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select (public.current_app_session()).tenant_id;
$$;

create or replace function public.has_app_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = any(allowed_roles), false);
$$;

create or replace function public.start_pin_session(
  p_pin text,
  p_device_label text default null
)
returns table (
  session_token text,
  tenant_id uuid,
  role public.app_role,
  display_name text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_pin public.pin_access_codes%rowtype;
  raw_token text;
  session_expiry timestamptz;
begin
  if p_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must contain exactly 4 digits';
  end if;

  select pac.*
  into matched_pin
  from public.pin_access_codes pac
  join public.tenant_studios ts on ts.id = pac.tenant_id
  where pac.is_active
    and ts.is_active
    and pac.valid_from <= now()
    and (pac.valid_until is null or pac.valid_until > now())
    and pac.hashed_pin = crypt(p_pin, pac.hashed_pin)
  order by pac.created_at asc
  limit 1;

  if not found then
    insert into public.security_audit_events (event_type, metadata)
    values ('pin_login_failed', jsonb_build_object('device_label', p_device_label));
    raise exception 'Invalid PIN';
  end if;

  raw_token := encode(gen_random_bytes(32), 'hex');
  session_expiry := now() + interval '12 hours';

  insert into public.app_sessions (
    token_hash,
    pin_id,
    tenant_id,
    role,
    display_name,
    device_label,
    expires_at
  )
  values (
    encode(digest(raw_token, 'sha256'), 'hex'),
    matched_pin.id,
    matched_pin.tenant_id,
    matched_pin.role,
    matched_pin.display_name,
    p_device_label,
    session_expiry
  );

  insert into public.security_audit_events (tenant_id, role, event_type, metadata)
  values (
    matched_pin.tenant_id,
    matched_pin.role,
    'pin_login_success',
    jsonb_build_object('display_name', matched_pin.display_name, 'device_label', p_device_label)
  );

  return query
  select raw_token, matched_pin.tenant_id, matched_pin.role, matched_pin.display_name, session_expiry;
end;
$$;

alter table public.tenant_studios enable row level security;
alter table public.pin_access_codes enable row level security;
alter table public.app_sessions enable row level security;
alter table public.security_audit_events enable row level security;

drop policy if exists tenant_studios_select_scoped on public.tenant_studios;
create policy tenant_studios_select_scoped
on public.tenant_studios
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or id = public.current_tenant_id()
);

drop policy if exists tenant_studios_platform_admin_all on public.tenant_studios;
create policy tenant_studios_platform_admin_all
on public.tenant_studios
for all
using (public.has_app_role(array['platform_admin'::public.app_role]))
with check (public.has_app_role(array['platform_admin'::public.app_role]));

drop policy if exists pin_access_owner_platform_read on public.pin_access_codes;
create policy pin_access_owner_platform_read
on public.pin_access_codes
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['owner'::public.app_role])
  )
);

drop policy if exists pin_access_platform_manage on public.pin_access_codes;
create policy pin_access_platform_manage
on public.pin_access_codes
for all
using (public.has_app_role(array['platform_admin'::public.app_role]))
with check (public.has_app_role(array['platform_admin'::public.app_role]));

drop policy if exists app_sessions_own_read on public.app_sessions;
create policy app_sessions_own_read
on public.app_sessions
for select
using (token_hash = public.trip2talk_session_token_hash());

drop policy if exists security_audit_owner_platform_read on public.security_audit_events;
create policy security_audit_owner_platform_read
on public.security_audit_events
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['owner'::public.app_role])
  )
);

insert into public.tenant_studios (
  studio_name,
  abn,
  owner_legal_name,
  owner_payid,
  support_email,
  support_phone
)
values (
  'Trip2Talk Studio',
  '12 345 678 901',
  'Saen Trip2Talk',
  'owner@trip2talk.example',
  'hello@trip2talk.example',
  '+61000000000'
)
on conflict do nothing;

insert into public.pin_access_codes (tenant_id, access_key, role, display_name, hashed_pin)
select ts.id, seed.access_key, seed.role::public.app_role, seed.display_name, crypt(seed.pin, gen_salt('bf'))
from public.tenant_studios ts
cross join (
  values
    ('staff-ploy', 'tour_staff', 'Tour Staff - Ploy', '1111'),
    ('cohost-cashier', 'co_host', 'Co-Host / Cashier', '4444'),
    ('owner-saen', 'owner', 'Studio Owner - Saen', '9999'),
    ('platform-admin', 'platform_admin', 'Platform Admin', '3501')
) as seed(access_key, role, display_name, pin)
where ts.studio_name = 'Trip2Talk Studio'
on conflict (tenant_id, access_key) do update
set
  role = excluded.role,
  display_name = excluded.display_name,
  updated_at = now();

commit;
