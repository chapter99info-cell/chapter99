-- Chapter 99 Phase 1: asset compliance alerts, trip-block trigger, safety briefs, expenses.
do $$
begin
  create type public.asset_kind as enum ('vehicle', 'vessel', 'venue', 'equipment');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.alert_severity as enum ('info', 'warning', 'critical');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.expense_status as enum ('draft', 'submitted', 'approved', 'rejected', 'reimbursed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.app_alerts (
  id uuid primary key default gen_random_uuid(),
  severity public.alert_severity not null default 'info',
  title text not null,
  body text not null,
  related_table text,
  related_id uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind public.asset_kind not null,
  registration_number text,
  da_reference text,
  da_expires_on date,
  registration_expires_on date,
  insurance_expires_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_documents (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  issued_on date,
  expires_on date,
  uploaded_by_staff_id uuid references public.staff(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_assets (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid not null references public.tour_departures(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete restrict,
  assigned_by_staff_id uuid references public.staff(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (departure_id, asset_id)
);

create table if not exists public.safety_briefs (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid not null references public.tour_departures(id) on delete cascade,
  due_at timestamptz not null,
  completed_at timestamptz,
  completed_by_staff_id uuid references public.staff(id) on delete set null,
  brief_template text not null default 'standard-pretrip',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (departure_id, brief_template)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  offline_id text unique,
  staff_id uuid references public.staff(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  departure_id uuid references public.tour_departures(id) on delete set null,
  category text not null,
  amount numeric(12, 2) not null,
  currency char(3) not null default 'AUD',
  incurred_at timestamptz not null default now(),
  merchant text,
  notes text,
  status public.expense_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expenses_amount_non_negative check (amount >= 0)
);

create table if not exists public.expense_attachments (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  captured_at timestamptz not null default now()
);

create index if not exists app_alerts_unresolved_idx
  on public.app_alerts(severity, created_at desc)
  where resolved_at is null;
create index if not exists assets_expiry_idx
  on public.assets(da_expires_on, registration_expires_on, insurance_expires_on);
create index if not exists asset_documents_asset_id_idx on public.asset_documents(asset_id);
create index if not exists trip_assets_departure_id_idx on public.trip_assets(departure_id);
create index if not exists safety_briefs_due_at_idx on public.safety_briefs(due_at) where completed_at is null;
create index if not exists expenses_staff_id_incurred_at_idx on public.expenses(staff_id, incurred_at desc);

drop trigger if exists assets_touch_updated_at on public.assets;
create trigger assets_touch_updated_at
before update on public.assets
for each row execute function public.touch_updated_at();

drop trigger if exists safety_briefs_touch_updated_at on public.safety_briefs;
create trigger safety_briefs_touch_updated_at
before update on public.safety_briefs
for each row execute function public.touch_updated_at();

drop trigger if exists expenses_touch_updated_at on public.expenses;
create trigger expenses_touch_updated_at
before update on public.expenses
for each row execute function public.touch_updated_at();

create or replace function public.asset_is_trip_ready(p_asset_id uuid, p_for_date date default current_date)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(bool_and(check_date is null or check_date >= p_for_date), false)
  from (
    select da_expires_on as check_date from public.assets where id = p_asset_id and is_active
    union all
    select registration_expires_on from public.assets where id = p_asset_id and is_active
    union all
    select insurance_expires_on from public.assets where id = p_asset_id and is_active
  ) checks
$$;

create or replace function public.block_departure_for_asset_compliance()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  departure_start date;
  asset_name text;
begin
  select starts_at::date into departure_start
  from public.tour_departures
  where id = new.departure_id;

  select name into asset_name
  from public.assets
  where id = new.asset_id;

  if not public.asset_is_trip_ready(new.asset_id, coalesce(departure_start, current_date)) then
    update public.tour_departures
    set status = 'blocked'
    where id = new.departure_id
      and status not in ('cancelled', 'completed');

    insert into public.app_alerts(severity, title, body, related_table, related_id)
    values (
      'critical',
      'Trip blocked by asset compliance',
      coalesce(asset_name, 'Assigned asset') || ' is missing current DA, Rego, or Insurance cover.',
      'tour_departures',
      new.departure_id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trip_asset_block_compliance on public.trip_assets;
create trigger trip_asset_block_compliance
after insert or update of asset_id, departure_id on public.trip_assets
for each row execute function public.block_departure_for_asset_compliance();

create or replace function public.schedule_safety_brief()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.safety_briefs(departure_id, due_at)
  values (new.id, new.starts_at - interval '24 hours')
  on conflict (departure_id, brief_template)
  do update set due_at = excluded.due_at;

  return new;
end;
$$;

drop trigger if exists tour_departure_schedule_safety_brief on public.tour_departures;
create trigger tour_departure_schedule_safety_brief
after insert or update of starts_at on public.tour_departures
for each row execute function public.schedule_safety_brief();

alter table public.app_alerts enable row level security;
alter table public.assets enable row level security;
alter table public.asset_documents enable row level security;
alter table public.trip_assets enable row level security;
alter table public.safety_briefs enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_attachments enable row level security;

grant execute on function public.asset_is_trip_ready(uuid, date) to authenticated;
