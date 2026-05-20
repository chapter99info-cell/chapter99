create extension if not exists pgcrypto;

do $$
begin
  create type public.staff_role as enum ('admin', 'operations', 'guide', 'concierge');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.booking_status as enum (
    'inquiry',
    'qualified',
    'proposal_sent',
    'confirmed',
    'in_tour',
    'completed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.integration_channel as enum ('google_sheets', 'google_drive', 'twilio', 'resend');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.staff_pin_profiles (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  role public.staff_role not null,
  pin_hash text not null,
  active boolean not null default true,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_pin_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.staff_pin_profiles(id) on delete cascade,
  session_token text not null unique,
  role public.staff_role not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  location text,
  consent_status text not null default 'pending',
  privacy_notice_accepted_at timestamptz,
  media_release_accepted_at timestamptz,
  emergency_contact jsonb not null default '{}'::jsonb,
  dietary_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  region text not null,
  duration_days integer not null check (duration_days > 0),
  price_aud integer not null check (price_aud >= 0),
  gst_inclusive boolean not null default true,
  capacity integer not null check (capacity > 0),
  inclusions jsonb not null default '[]'::jsonb,
  compliance_notes jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  client_id uuid not null references public.clients(id) on delete restrict,
  tour_id uuid not null references public.tours(id) on delete restrict,
  status public.booking_status not null default 'inquiry',
  travel_window text not null,
  total_value_aud integer not null default 0,
  deposit_due_aud integer not null default 0,
  acl_terms_accepted_at timestamptz,
  sms_consent_at timestamptz,
  email_consent_at timestamptz,
  assigned_role public.staff_role not null default 'concierge',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  location text not null,
  description text not null,
  supplier_requirements jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references public.tours(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  storage_bucket text not null,
  storage_path text not null,
  caption text,
  release_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.integration_events (
  id uuid primary key default gen_random_uuid(),
  channel public.integration_channel not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_label text,
  actor_role public.staff_role,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.staff_pin_profiles enable row level security;
alter table public.staff_pin_sessions enable row level security;
alter table public.clients enable row level security;
alter table public.tours enable row level security;
alter table public.bookings enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.integration_events enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "Public can read active tours" on public.tours;
create policy "Public can read active tours"
  on public.tours for select
  using (active = true);

drop policy if exists "Public can read itinerary for active tours" on public.itinerary_items;
create policy "Public can read itinerary for active tours"
  on public.itinerary_items for select
  using (
    exists (
      select 1
      from public.tours
      where tours.id = itinerary_items.tour_id
        and tours.active = true
    )
  );

drop policy if exists "Anon can enqueue integration events" on public.integration_events;
create policy "Anon can enqueue integration events"
  on public.integration_events for insert
  with check (status = 'queued' and attempts = 0);

create or replace function public.verify_staff_pin(provided_pin text)
returns table (
  session_token text,
  role public.staff_role,
  label text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_profile public.staff_pin_profiles%rowtype;
  generated_token text;
  generated_expiry timestamptz;
begin
  if provided_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be four digits' using errcode = '22023';
  end if;

  select *
  into matched_profile
  from public.staff_pin_profiles
  where active = true
    and (locked_until is null or locked_until <= now())
    and crypt(provided_pin, pin_hash) = pin_hash
  limit 1;

  if matched_profile.id is null then
    insert into public.audit_events(event_type, metadata)
    values ('staff_pin_failed', jsonb_build_object('reason', 'invalid_pin'));

    raise exception 'Invalid PIN' using errcode = '28000';
  end if;

  generated_token := encode(gen_random_bytes(32), 'hex');
  generated_expiry := now() + interval '8 hours';

  update public.staff_pin_profiles
  set failed_attempts = 0,
      locked_until = null,
      last_used_at = now(),
      updated_at = now()
  where id = matched_profile.id;

  insert into public.staff_pin_sessions(profile_id, session_token, role, expires_at)
  values (matched_profile.id, generated_token, matched_profile.role, generated_expiry);

  insert into public.audit_events(actor_label, actor_role, event_type, metadata)
  values (
    matched_profile.label,
    matched_profile.role,
    'staff_pin_verified',
    jsonb_build_object('session_expires_at', generated_expiry)
  );

  session_token := generated_token;
  role := matched_profile.role;
  label := matched_profile.label;
  expires_at := generated_expiry;
  return next;
end;
$$;

revoke all on function public.verify_staff_pin(text) from public;
grant execute on function public.verify_staff_pin(text) to anon, authenticated;

comment on table public.staff_pin_profiles is
  'Store bcrypt-hashed four-digit staff PINs. Seed with crypt(''1234'', gen_salt(''bf'')) from a secure admin channel.';
comment on table public.integration_events is
  'Queue for Google Sheets, Google Drive, Twilio and Resend workers. Secrets must remain in Edge Functions or other server processes.';
