-- Chapter 99 Phase 1: tours, bookings, installments, staff, PayID, settlement view.
do $$
begin
  create type public.staff_status as enum ('active', 'inactive', 'contractor');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.departure_status as enum ('scheduled', 'confirmed', 'sold_out', 'blocked', 'cancelled', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.booking_status as enum ('pending', 'deposit_paid', 'paid', 'cancelled', 'checked_in');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.installment_status as enum ('scheduled', 'due', 'paid', 'overdue', 'waived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid references public.app_users(id) on delete set null,
  legal_name text not null,
  display_name text not null,
  role public.app_role not null,
  status public.staff_status not null default 'active',
  payid text,
  commission_rate numeric(5, 4) not null default 0.1000,
  visa_badge text,
  visa_expires_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_commission_rate_range check (commission_rate >= 0 and commission_rate <= 1)
);

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  gallery_urls text[] not null default '{}',
  capacity integer not null,
  low_stock_threshold integer not null default 4,
  base_price numeric(12, 2) not null,
  currency char(3) not null default 'AUD',
  duration_minutes integer not null,
  meeting_point text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tours_capacity_positive check (capacity > 0),
  constraint tours_low_stock_non_negative check (low_stock_threshold >= 0),
  constraint tours_base_price_non_negative check (base_price >= 0)
);

create table if not exists public.tour_departures (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  guide_staff_id uuid references public.staff(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.departure_status not null default 'scheduled',
  capacity_override integer,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_departures_window check (ends_at > starts_at),
  constraint tour_departures_capacity_override_positive check (capacity_override is null or capacity_override > 0)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique,
  tour_id uuid not null references public.tours(id) on delete restrict,
  departure_id uuid references public.tour_departures(id) on delete set null,
  customer_id uuid,
  status public.booking_status not null default 'pending',
  seats integer not null default 1,
  gross_amount numeric(12, 2) not null,
  discount_amount numeric(12, 2) not null default 0,
  paid_amount numeric(12, 2) not null default 0,
  currency char(3) not null default 'AUD',
  booked_by_staff_id uuid references public.staff(id) on delete set null,
  source text not null default 'direct',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_seats_positive check (seats > 0),
  constraint bookings_amounts_non_negative check (
    gross_amount >= 0 and discount_amount >= 0 and paid_amount >= 0
  )
);

create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sequence_number integer not null,
  due_on date not null,
  amount numeric(12, 2) not null,
  paid_at timestamptz,
  method text,
  payid_reference text,
  status public.installment_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint installments_amount_non_negative check (amount >= 0),
  constraint installments_sequence_positive check (sequence_number > 0),
  unique (booking_id, sequence_number)
);

create table if not exists public.staff_commissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  staff_id uuid not null references public.staff(id) on delete restrict,
  rate numeric(5, 4) not null,
  amount numeric(12, 2) not null,
  status text not null default 'accrued',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_commissions_rate_range check (rate >= 0 and rate <= 1),
  constraint staff_commissions_amount_non_negative check (amount >= 0)
);

create index if not exists staff_app_user_id_idx on public.staff(app_user_id);
create index if not exists tour_departures_tour_id_starts_at_idx on public.tour_departures(tour_id, starts_at);
create index if not exists bookings_departure_id_idx on public.bookings(departure_id);
create index if not exists bookings_customer_id_idx on public.bookings(customer_id);
create index if not exists installments_booking_id_idx on public.installments(booking_id);
create index if not exists staff_commissions_staff_id_idx on public.staff_commissions(staff_id);

drop trigger if exists staff_touch_updated_at on public.staff;
create trigger staff_touch_updated_at
before update on public.staff
for each row execute function public.touch_updated_at();

drop trigger if exists tours_touch_updated_at on public.tours;
create trigger tours_touch_updated_at
before update on public.tours
for each row execute function public.touch_updated_at();

drop trigger if exists tour_departures_touch_updated_at on public.tour_departures;
create trigger tour_departures_touch_updated_at
before update on public.tour_departures
for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

drop trigger if exists installments_touch_updated_at on public.installments;
create trigger installments_touch_updated_at
before update on public.installments
for each row execute function public.touch_updated_at();

drop trigger if exists staff_commissions_touch_updated_at on public.staff_commissions;
create trigger staff_commissions_touch_updated_at
before update on public.staff_commissions
for each row execute function public.touch_updated_at();

create or replace function public.resolve_staff_payid(p_staff_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(s.payid, u.payid)
  from public.staff s
  left join public.app_users u on u.id = s.app_user_id
  where s.id = p_staff_id
    and s.status = 'active'
$$;

create or replace view public.booking_settlement_view as
select
  b.id as booking_id,
  b.booking_number,
  t.title as tour_title,
  d.starts_at,
  b.status as booking_status,
  b.gross_amount,
  b.discount_amount,
  (b.gross_amount - b.discount_amount) as net_amount,
  coalesce(sum(i.amount) filter (where i.status = 'paid'), 0)::numeric(12, 2) as installment_paid,
  coalesce(sum(sc.amount), 0)::numeric(12, 2) as commission_accrued,
  (b.gross_amount - b.discount_amount - coalesce(sum(sc.amount), 0))::numeric(12, 2) as owner_settlement_due,
  array_remove(array_agg(distinct public.resolve_staff_payid(sc.staff_id)), null) as payid_targets
from public.bookings b
join public.tours t on t.id = b.tour_id
left join public.tour_departures d on d.id = b.departure_id
left join public.installments i on i.booking_id = b.id
left join public.staff_commissions sc on sc.booking_id = b.id
group by b.id, t.title, d.starts_at;

alter table public.staff enable row level security;
alter table public.tours enable row level security;
alter table public.tour_departures enable row level security;
alter table public.bookings enable row level security;
alter table public.installments enable row level security;
alter table public.staff_commissions enable row level security;

grant execute on function public.resolve_staff_payid(uuid) to authenticated;
grant select on public.booking_settlement_view to authenticated;
