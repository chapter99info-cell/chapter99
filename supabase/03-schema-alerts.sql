-- Trip2Talk V4 Phase 1
-- Operational asset compliance, expiry alerts, and trip-creation liability shield.

begin;

do $$
begin
  create type public.asset_kind as enum (
    'driver_authority',
    'vehicle_commercial_rego',
    'public_liability_insurance',
    'vehicle_insurance',
    'first_aid_certificate'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.asset_status as enum ('active', 'expiring_30', 'expired', 'archived');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.alert_severity as enum ('info', 'warning', 'high', 'critical');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.compliance_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  asset_kind public.asset_kind not null,
  asset_label text not null,
  reference_number text,
  file_path text,
  issued_at date,
  expires_at date not null,
  status public.asset_status not null default 'active',
  owner_sms_alert_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, asset_kind, reference_number)
);

create index if not exists compliance_assets_expiry_idx
  on public.compliance_assets (tenant_id, asset_kind, expires_at, status);

create table if not exists public.alert_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  asset_id uuid references public.compliance_assets(id) on delete cascade,
  tour_id uuid references public.tour_instances(id) on delete cascade,
  alert_key text not null,
  severity public.alert_severity not null,
  title text not null,
  message text not null,
  delivery_channel text not null default 'owner_sms',
  scheduled_for timestamptz not null default now(),
  delivered_at timestamptz,
  acknowledged_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, alert_key)
);

create index if not exists alert_events_delivery_idx
  on public.alert_events (tenant_id, delivery_channel, scheduled_for, delivered_at);

create or replace function public.derive_asset_status(p_expires_at date)
returns public.asset_status
language sql
stable
as $$
  select case
    when p_expires_at < current_date then 'expired'::public.asset_status
    when p_expires_at <= current_date + 30 then 'expiring_30'::public.asset_status
    else 'active'::public.asset_status
  end;
$$;

create or replace function public.set_asset_status()
returns trigger
language plpgsql
as $$
begin
  if new.status <> 'archived' then
    new.status := public.derive_asset_status(new.expires_at);
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_compliance_asset_status_before_write on public.compliance_assets;
create trigger set_compliance_asset_status_before_write
before insert or update of expires_at, status on public.compliance_assets
for each row execute function public.set_asset_status();

create or replace function public.queue_asset_expiry_alerts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  queued_count integer := 0;
  asset_row public.compliance_assets%rowtype;
  alert_key text;
  severity public.alert_severity;
begin
  update public.compliance_assets
  set status = public.derive_asset_status(expires_at),
      updated_at = now()
  where status <> 'archived';

  for asset_row in
    select *
    from public.compliance_assets
    where status in ('expiring_30', 'expired')
  loop
    alert_key := asset_row.id::text || ':' || asset_row.status::text;
    severity := case
      when asset_row.status = 'expired' then 'critical'::public.alert_severity
      else 'high'::public.alert_severity
    end;

    insert into public.alert_events (
      tenant_id,
      asset_id,
      alert_key,
      severity,
      title,
      message,
      metadata
    )
    values (
      asset_row.tenant_id,
      asset_row.id,
      alert_key,
      severity,
      case
        when asset_row.status = 'expired' then 'Compliance document expired'
        else 'Compliance document expires within 30 days'
      end,
      asset_row.asset_label || ' (' || asset_row.asset_kind::text || ') expires on ' || asset_row.expires_at::text,
      jsonb_build_object(
        'asset_kind', asset_row.asset_kind,
        'expires_at', asset_row.expires_at,
        'requires_owner_sms', true
      )
    )
    on conflict (tenant_id, alert_key) do nothing;

    if found then
      queued_count := queued_count + 1;
    end if;
  end loop;

  return queued_count;
end;
$$;

create or replace function public.block_tour_creation_for_expired_assets()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.compliance_assets ca
    where ca.tenant_id = new.tenant_id
      and ca.asset_kind in (
        'driver_authority',
        'vehicle_commercial_rego',
        'public_liability_insurance'
      )
      and ca.status = 'expired'
  ) then
    raise exception 'Trip creation blocked: a required driver authority, commercial rego, or public liability document has expired';
  end if;

  return new;
end;
$$;

drop trigger if exists block_tour_creation_when_assets_expired on public.tour_instances;
create trigger block_tour_creation_when_assets_expired
before insert or update of status, departure_at on public.tour_instances
for each row execute function public.block_tour_creation_for_expired_assets();

drop trigger if exists set_compliance_assets_updated_at on public.compliance_assets;
create trigger set_compliance_assets_updated_at
before update on public.compliance_assets
for each row execute function public.set_updated_at();

alter table public.compliance_assets enable row level security;
alter table public.alert_events enable row level security;

drop policy if exists compliance_assets_owner_platform_read on public.compliance_assets;
create policy compliance_assets_owner_platform_read
on public.compliance_assets
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['owner'::public.app_role])
  )
);

drop policy if exists compliance_assets_owner_manage on public.compliance_assets;
create policy compliance_assets_owner_manage
on public.compliance_assets
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
);

drop policy if exists alert_events_owner_platform_read on public.alert_events;
create policy alert_events_owner_platform_read
on public.alert_events
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['owner'::public.app_role])
  )
);

drop policy if exists alert_events_owner_acknowledge on public.alert_events;
create policy alert_events_owner_acknowledge
on public.alert_events
for update
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
);

-- Enable this in hosted Supabase after pg_cron is available:
-- select cron.schedule(
--   'trip2talk-daily-compliance-alerts',
--   '0 22 * * *',
--   $$select public.queue_asset_expiry_alerts();$$
-- );

commit;
