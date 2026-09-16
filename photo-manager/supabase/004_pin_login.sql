-- PIN login secrets: service role only (no anon/authenticated policies).
create table if not exists public.pm_pin_secrets (
  user_id uuid primary key references public.pm_profiles(id) on delete cascade,
  pin_hash text not null unique,
  updated_at timestamptz not null default now()
);

create table if not exists public.pm_pin_attempts (
  client_key text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.pm_pin_secrets enable row level security;
alter table public.pm_pin_attempts enable row level security;

revoke all on public.pm_pin_secrets from anon, authenticated, public;
revoke all on public.pm_pin_attempts from anon, authenticated, public;

alter table public.pm_profiles add column if not exists pin_set_at timestamptz;
