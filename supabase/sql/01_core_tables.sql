create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('portfolio', 'owner', 'staff', 'cashier', 'superadmin')),
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  description text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  paid_by text not null,
  created_at timestamptz not null default now(),
  synced_at timestamptz
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text not null,
  expiry_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid references public.expenses (id) on delete set null,
  amount numeric(12, 2) not null check (amount >= 0),
  pay_id text not null unique,
  reference text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'void')),
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets (id) on delete cascade,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  title text not null,
  message text not null,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  unique (asset_id, title)
);

create table if not exists public.sync_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null check (status in ('pending', 'success', 'failed')),
  detail text,
  created_at timestamptz not null default now()
);
