create type tour_status as enum ('draft', 'open', 'full', 'completed', 'cancelled');
create type booking_status as enum ('pending', 'confirmed', 'paid', 'waitlist', 'cancelled');
create type payment_method as enum ('payid', 'cash', 'card', 'bank_transfer');
create type visa_type as enum ('tourist', 'student', 'working_holiday', 'permanent', 'citizen', 'new_zealand', 'other');

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  preferred_name text,
  pin_role pin_role not null default 'staff',
  payid_email text,
  payid_phone text,
  commission_rate numeric(10,2) not null default 0,
  visa_type visa_type,
  visa_expiry date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  tour_code text unique not null,
  title text not null,
  description text,
  departure_date timestamptz not null,
  return_date timestamptz,
  meeting_location text,
  max_capacity integer not null default 12,
  current_bookings integer not null default 0,
  base_price numeric(10,2) not null,
  status tour_status not null default 'draft',
  requires_oshc boolean not null default true,
  safety_brief_sent boolean not null default false,
  lead_staff_id uuid references staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique not null,
  tour_id uuid not null references tours(id) on delete cascade,
  customer_id uuid,
  acquired_by_staff uuid references staff(id),
  billing_payid text,
  total_price numeric(10,2) not null,
  deposit_paid numeric(10,2) not null default 0,
  balance_due numeric(10,2) generated always as (total_price - deposit_paid) stored,
  commission_amount numeric(10,2) default 0,
  commission_paid boolean not null default false,
  status booking_status not null default 'pending',
  payment_method payment_method,
  oshc_number text,
  insurance_doc_url text,
  waiver_signed boolean not null default false,
  waiver_signed_at timestamptz,
  contract_pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists installments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  due_date date not null,
  amount_due numeric(10,2) not null,
  amount_paid numeric(10,2) not null default 0,
  paid_at timestamptz,
  is_deposit boolean not null default false
);

create or replace view tour_settlement as
select
  t.id as tour_id,
  t.tour_code,
  t.title,
  t.departure_date,
  count(b.id)::integer as total_bookings,
  coalesce(sum(b.deposit_paid), 0)::numeric(10,2) as total_collected,
  coalesce(sum(b.commission_amount) filter (where b.commission_paid = false), 0)::numeric(10,2) as total_commissions_due,
  (coalesce(sum(b.deposit_paid), 0) - coalesce(sum(b.commission_amount) filter (where b.commission_paid = false), 0))::numeric(10,2) as net_settlement_owner,
  s.full_name as lead_staff_name,
  coalesce(s.payid_email, s.payid_phone) as staff_payid
from tours t
left join bookings b on b.tour_id = t.id and b.status <> 'cancelled'
left join staff s on s.id = t.lead_staff_id
group by t.id, s.full_name, s.payid_email, s.payid_phone;
