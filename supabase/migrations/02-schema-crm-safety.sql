-- Chapter 99 Phase 1: CRM, encrypted medical records, OSHC waiver log, Privacy Act 1988 audit.
do $$
begin
  create type public.customer_status as enum ('lead', 'confirmed', 'vip', 'inactive', 'blocked');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.privacy_action as enum ('collect', 'view', 'update', 'export', 'delete', 'waiver_accept');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  external_ref text unique,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  country_code char(2),
  preferred_language text not null default 'en',
  status public.customer_status not null default 'lead',
  marketing_consent boolean not null default false,
  privacy_notice_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_email_format check (email is null or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create table if not exists public.customer_contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  kind text not null,
  value text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.encrypted_medical_records (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  encrypted_payload bytea not null,
  key_id text not null,
  recorded_by_staff_id uuid references public.staff(id) on delete set null,
  redaction_due_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oshc_waiver_log (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  accepted boolean not null,
  accepted_at timestamptz,
  declined_reason text,
  ip_address inet default inet_client_addr(),
  user_agent text,
  created_at timestamptz not null default now(),
  constraint oshc_waiver_acceptance_time check (
    (accepted and accepted_at is not null) or (not accepted)
  )
);

create table if not exists public.privacy_audit_log (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  app_user_id uuid references public.app_users(id) on delete set null,
  action public.privacy_action not null,
  purpose text not null,
  privacy_act_basis text not null default 'Privacy Act 1988 - APP 3/6',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customers_email_idx on public.customers(lower(email));
create index if not exists customer_contacts_customer_id_idx on public.customer_contacts(customer_id);
create index if not exists encrypted_medical_records_customer_id_idx on public.encrypted_medical_records(customer_id);
create index if not exists oshc_waiver_log_customer_id_idx on public.oshc_waiver_log(customer_id);
create index if not exists privacy_audit_log_customer_id_created_at_idx
  on public.privacy_audit_log(customer_id, created_at desc);

drop trigger if exists customers_touch_updated_at on public.customers;
create trigger customers_touch_updated_at
before update on public.customers
for each row execute function public.touch_updated_at();

drop trigger if exists encrypted_medical_records_touch_updated_at on public.encrypted_medical_records;
create trigger encrypted_medical_records_touch_updated_at
before update on public.encrypted_medical_records
for each row execute function public.touch_updated_at();

create or replace function public.encrypt_medical_payload(p_payload jsonb, p_key text)
returns bytea
language sql
stable
as $$
  select pgp_sym_encrypt(
    p_payload::text,
    p_key,
    'cipher-algo=aes256, compress-algo=1'
  )
$$;

create or replace function public.decrypt_medical_payload(p_payload bytea, p_key text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select pgp_sym_decrypt(p_payload, p_key)::jsonb
$$;

create or replace function public.log_privacy_access(
  p_customer_id uuid,
  p_app_user_id uuid,
  p_action public.privacy_action,
  p_purpose text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  audit_id uuid;
begin
  insert into public.privacy_audit_log(customer_id, app_user_id, action, purpose, metadata)
  values (p_customer_id, p_app_user_id, p_action, p_purpose, coalesce(p_metadata, '{}'::jsonb))
  returning id into audit_id;

  return audit_id;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_customer_id_fkey'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_customer_id_fkey
      foreign key (customer_id) references public.customers(id) on delete set null;
  end if;
end $$;

alter table public.customers enable row level security;
alter table public.customer_contacts enable row level security;
alter table public.encrypted_medical_records enable row level security;
alter table public.oshc_waiver_log enable row level security;
alter table public.privacy_audit_log enable row level security;

grant execute on function public.encrypt_medical_payload(jsonb, text) to authenticated;
grant execute on function public.decrypt_medical_payload(bytea, text) to authenticated;
grant execute on function public.log_privacy_access(uuid, uuid, public.privacy_action, text, jsonb) to authenticated;
