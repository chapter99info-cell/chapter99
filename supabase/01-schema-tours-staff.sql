-- Trip2Talk V4 Phase 1
-- Tours, staff acquisition channels, PayID routing, installments, and settlement ledger.

begin;

do $$
begin
  create type public.tour_type as enum ('one_day', 'multi_day', 'international_extension');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.tour_status as enum ('draft', 'published', 'locked', 'departed', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.booking_status as enum ('draft', 'pending_compliance', 'confirmed', 'cancelled', 'completed');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_channel as enum ('owner_payid', 'staff_payid', 'cash', 'card', 'partner_invoice');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_status as enum ('pending', 'confirmed', 'refunded', 'failed');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  display_name text not null,
  staff_role text not null default 'Tour Staff',
  payid text not null,
  phone text,
  email text,
  commission_per_head numeric(10,2) not null default 75.00,
  min_commission numeric(10,2) not null default 50.00,
  max_commission numeric(10,2) not null default 100.00,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, email),
  constraint staff_profiles_commission_range check (
    min_commission >= 0
    and max_commission >= min_commission
    and commission_per_head between min_commission and max_commission
  )
);

create index if not exists staff_profiles_tenant_idx
  on public.staff_profiles (tenant_id, is_active);

create table if not exists public.tour_instances (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  trip_code text not null,
  title text not null,
  region text not null,
  tour_type public.tour_type not null default 'one_day',
  departure_at timestamptz not null,
  return_at timestamptz,
  capacity integer not null check (capacity > 0),
  base_price numeric(10,2) not null check (base_price >= 0),
  deposit_amount numeric(10,2) not null default 100.00 check (deposit_amount >= 100.00),
  status public.tour_status not null default 'draft',
  public_notes text,
  internal_notes text,
  created_by_role public.app_role,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, trip_code)
);

create index if not exists tour_instances_public_schedule_idx
  on public.tour_instances (tenant_id, status, departure_at);

create table if not exists public.tour_staff_assignments (
  tour_id uuid not null references public.tour_instances(id) on delete cascade,
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  assignment_role text not null default 'host',
  created_at timestamptz not null default now(),
  primary key (tour_id, staff_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  legal_name text not null,
  preferred_name text,
  email text not null,
  phone text,
  country_of_residence text,
  visa_status text,
  is_student_visa_holder boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create index if not exists customers_tenant_name_idx
  on public.customers (tenant_id, legal_name);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  tour_id uuid not null references public.tour_instances(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  acquired_by_staff_id uuid references public.staff_profiles(id) on delete set null,
  acquisition_channel text not null default 'direct',
  status public.booking_status not null default 'pending_compliance',
  package_price numeric(10,2) not null check (package_price >= 0),
  deposit_required numeric(10,2) not null default 100.00 check (deposit_required >= 100.00),
  pricing_override_reason text,
  billing_channel public.payment_channel not null default 'owner_payid',
  contract_pdf_path text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_id, customer_id)
);

create index if not exists bookings_tenant_status_idx
  on public.bookings (tenant_id, status);

create table if not exists public.installment_schedules (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sequence_no integer not null check (sequence_no > 0),
  label text not null,
  amount numeric(10,2) not null check (amount >= 0),
  due_at timestamptz not null,
  paid_at timestamptz,
  payment_channel public.payment_channel not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id, sequence_no)
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  channel public.payment_channel not null,
  status public.payment_status not null default 'pending',
  received_at timestamptz,
  external_reference text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists payment_transactions_booking_idx
  on public.payment_transactions (booking_id, status);

create table if not exists public.settlement_ledgers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  acquired_by_staff_id uuid references public.staff_profiles(id) on delete set null,
  total_collected numeric(10,2) not null default 0,
  staff_commission_due numeric(10,2) not null default 0,
  net_settlement_amount numeric(10,2) not null default 0,
  computed_at timestamptz not null default now(),
  unique (booking_id)
);

create or replace function public.client_billing_payid(p_booking_id uuid)
returns table (
  payid text,
  channel public.payment_channel,
  payable_to text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(sp.payid, ts.owner_payid) as payid,
    case
      when b.acquired_by_staff_id is not null then 'staff_payid'::public.payment_channel
      else 'owner_payid'::public.payment_channel
    end as channel,
    coalesce(sp.display_name, ts.owner_legal_name) as payable_to
  from public.bookings b
  join public.tenant_studios ts on ts.id = b.tenant_id
  left join public.staff_profiles sp on sp.id = b.acquired_by_staff_id and sp.is_active
  where b.id = p_booking_id;
$$;

create or replace function public.rebuild_booking_settlement(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_row public.bookings%rowtype;
  collected numeric(10,2);
  commission_due numeric(10,2);
begin
  select *
  into booking_row
  from public.bookings
  where id = p_booking_id;

  if not found then
    return;
  end if;

  select coalesce(sum(amount), 0)
  into collected
  from public.payment_transactions
  where booking_id = p_booking_id
    and status = 'confirmed';

  select coalesce(sp.commission_per_head, 0)
  into commission_due
  from public.staff_profiles sp
  where sp.id = booking_row.acquired_by_staff_id
    and sp.is_active;

  commission_due := case
    when booking_row.acquired_by_staff_id is null then 0
    else coalesce(commission_due, 0)
  end;

  insert into public.settlement_ledgers (
    tenant_id,
    booking_id,
    acquired_by_staff_id,
    total_collected,
    staff_commission_due,
    net_settlement_amount,
    computed_at
  )
  values (
    booking_row.tenant_id,
    booking_row.id,
    booking_row.acquired_by_staff_id,
    collected,
    commission_due,
    collected - commission_due,
    now()
  )
  on conflict (booking_id) do update
  set
    acquired_by_staff_id = excluded.acquired_by_staff_id,
    total_collected = excluded.total_collected,
    staff_commission_due = excluded.staff_commission_due,
    net_settlement_amount = excluded.net_settlement_amount,
    computed_at = now();
end;
$$;

create or replace function public.sync_booking_settlement_trigger()
returns trigger
language plpgsql
as $$
begin
  if TG_TABLE_NAME = 'bookings' then
    perform public.rebuild_booking_settlement(coalesce(new.id, old.id));
  else
    perform public.rebuild_booking_settlement(coalesce(new.booking_id, old.booking_id));
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_payment_transaction_settlement on public.payment_transactions;
create trigger sync_payment_transaction_settlement
after insert or update or delete on public.payment_transactions
for each row execute function public.sync_booking_settlement_trigger();

drop trigger if exists sync_booking_staff_settlement on public.bookings;
create trigger sync_booking_staff_settlement
after insert or update of acquired_by_staff_id, package_price, status on public.bookings
for each row execute function public.sync_booking_settlement_trigger();

drop trigger if exists set_staff_profiles_updated_at on public.staff_profiles;
create trigger set_staff_profiles_updated_at
before update on public.staff_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_tour_instances_updated_at on public.tour_instances;
create trigger set_tour_instances_updated_at
before update on public.tour_instances
for each row execute function public.set_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_installment_schedules_updated_at on public.installment_schedules;
create trigger set_installment_schedules_updated_at
before update on public.installment_schedules
for each row execute function public.set_updated_at();

alter table public.staff_profiles enable row level security;
alter table public.tour_instances enable row level security;
alter table public.tour_staff_assignments enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.installment_schedules enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.settlement_ledgers enable row level security;

drop policy if exists staff_profiles_internal_read on public.staff_profiles;
create policy staff_profiles_internal_read
on public.staff_profiles
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or tenant_id = public.current_tenant_id()
);

drop policy if exists staff_profiles_owner_cohost_manage on public.staff_profiles;
create policy staff_profiles_owner_cohost_manage
on public.staff_profiles
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
);

drop policy if exists tour_instances_public_and_internal_read on public.tour_instances;
create policy tour_instances_public_and_internal_read
on public.tour_instances
for select
using (
  status = 'published'
  or public.has_app_role(array['platform_admin'::public.app_role])
  or tenant_id = public.current_tenant_id()
);

drop policy if exists tour_instances_owner_cohost_manage on public.tour_instances;
create policy tour_instances_owner_cohost_manage
on public.tour_instances
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
);

drop policy if exists tour_staff_assignments_internal_read on public.tour_staff_assignments;
create policy tour_staff_assignments_internal_read
on public.tour_staff_assignments
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or exists (
    select 1
    from public.tour_instances ti
    where ti.id = tour_id
      and ti.tenant_id = public.current_tenant_id()
  )
);

drop policy if exists customers_internal_read on public.customers;
create policy customers_internal_read
on public.customers
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['tour_staff'::public.app_role, 'co_host'::public.app_role, 'owner'::public.app_role])
  )
);

drop policy if exists customers_cohost_owner_manage on public.customers;
create policy customers_cohost_owner_manage
on public.customers
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
);

drop policy if exists bookings_internal_read on public.bookings;
create policy bookings_internal_read
on public.bookings
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['tour_staff'::public.app_role, 'co_host'::public.app_role, 'owner'::public.app_role])
  )
);

drop policy if exists bookings_cohost_owner_manage on public.bookings;
create policy bookings_cohost_owner_manage
on public.bookings
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
);

drop policy if exists installment_schedules_internal_read on public.installment_schedules;
create policy installment_schedules_internal_read
on public.installment_schedules
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and b.tenant_id = public.current_tenant_id()
  )
);

drop policy if exists installment_schedules_cohost_owner_manage on public.installment_schedules;
create policy installment_schedules_cohost_owner_manage
on public.installment_schedules
for all
using (
  public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
  and exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and b.tenant_id = public.current_tenant_id()
  )
)
with check (
  public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
  and exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and b.tenant_id = public.current_tenant_id()
  )
);

drop policy if exists payments_internal_read on public.payment_transactions;
create policy payments_internal_read
on public.payment_transactions
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
  )
);

drop policy if exists payments_cohost_owner_manage on public.payment_transactions;
create policy payments_cohost_owner_manage
on public.payment_transactions
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
);

drop policy if exists settlement_ledgers_owner_platform_read on public.settlement_ledgers;
create policy settlement_ledgers_owner_platform_read
on public.settlement_ledgers
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['owner'::public.app_role])
  )
);

insert into public.staff_profiles (
  tenant_id,
  display_name,
  staff_role,
  payid,
  email,
  commission_per_head
)
select ts.id, 'Ploy', 'Tour Staff', 'ploy@trip2talk.example', 'ploy@trip2talk.example', 75.00
from public.tenant_studios ts
where ts.studio_name = 'Trip2Talk Studio'
on conflict (tenant_id, email) do update
set
  display_name = excluded.display_name,
  staff_role = excluded.staff_role,
  payid = excluded.payid,
  commission_per_head = excluded.commission_per_head,
  updated_at = now();

commit;
