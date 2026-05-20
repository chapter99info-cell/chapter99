create type asset_type as enum ('vehicle', 'license', 'insurance', 'other');
create type expense_category as enum ('fuel', 'lodge', 'meals', 'equipment', 'marketing', 'other');

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  asset_type asset_type not null,
  name text not null,
  identifier text,
  expiry_date date not null,
  issuing_body text,
  document_url text,
  blocks_trip_creation boolean not null default false,
  is_active boolean not null default true,
  alert_30d_sent boolean not null default false,
  alert_7d_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete set null,
  category expense_category not null,
  amount_aud numeric(10,2) not null,
  receipt_url text,
  receipt_filename text,
  notes text,
  recorded_by_role text,
  synced_to_drive boolean not null default false,
  synced_to_sheets boolean not null default false,
  offline_id text unique,
  recorded_at timestamptz not null default now()
);

create table if not exists safety_brief_queue (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  due_at timestamptz not null,
  sent_at timestamptz,
  customer_count integer not null default 0,
  flagged_count integer not null default 0
);

create or replace function block_trip_when_assets_expired()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from assets
    where is_active = true
      and blocks_trip_creation = true
      and expiry_date < current_date
  ) then
    raise exception 'Trip creation blocked: one or more required assets are expired';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_block_trip_when_assets_expired on tours;
create trigger trg_block_trip_when_assets_expired
before insert or update on tours
for each row execute function block_trip_when_assets_expired();

create or replace function schedule_safety_brief()
returns trigger
language plpgsql
as $$
begin
  insert into safety_brief_queue(tour_id, due_at)
  values (new.id, new.departure_date - interval '24 hours')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists trg_schedule_safety_brief on tours;
create trigger trg_schedule_safety_brief
after insert on tours
for each row execute function schedule_safety_brief();
