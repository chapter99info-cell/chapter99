create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  preferred_name text,
  email text,
  phone text,
  nationality text,
  date_of_birth date,
  visa_type text,
  visa_expiry date,
  oshc_provider text,
  oshc_number text,
  oshc_expiry date,
  insurance_type text check (insurance_type in ('oshc', 'travel', 'none')) default 'none',
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists customer_medical (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  allergies bytea,
  medications bytea,
  conditions bytea,
  emergency_contact bytea,
  blood_type text,
  consent_given_at timestamptz
);

create table if not exists waiver_templates (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  content_en text not null,
  content_th text not null,
  content_hash text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists customer_waivers (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  waiver_template_id uuid not null references waiver_templates(id),
  signed_at timestamptz not null default now(),
  signature_name text not null,
  ip_address inet,
  user_agent text
);

create or replace function encrypt_medical(value text, secret text)
returns bytea
language sql
stable
as $$
  select pgp_sym_encrypt(value, secret)
$$;

create or replace function decrypt_medical(value bytea, secret text)
returns text
language sql
stable
as $$
  select pgp_sym_decrypt(value, secret)
$$;
