-- Trip2Talk V4 Phase 1
-- OSHC/travel-insurance lockdown, digital waivers, encrypted medical records, and safety briefings.

begin;

do $$
begin
  create type public.compliance_document_status as enum ('missing', 'submitted', 'verified', 'rejected');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.customer_compliance_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  oshc_membership_number text,
  travel_insurance_file_path text,
  document_status public.compliance_document_status not null default 'missing',
  verified_by_role public.app_role,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id),
  constraint customer_compliance_has_cover check (
    oshc_membership_number is not null
    or travel_insurance_file_path is not null
    or document_status = 'missing'
  )
);

create table if not exists public.compliance_waivers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  tour_id uuid not null references public.tour_instances(id) on delete cascade,
  declaration_version text not null default 'oshc-repatriation-v1',
  declaration_text text not null,
  signer_legal_name text not null,
  signer_locale text not null default 'th-TH/en-AU',
  signed_at timestamptz not null default now(),
  signature_ip inet,
  signature_user_agent text,
  created_at timestamptz not null default now(),
  unique (customer_id, tour_id, declaration_version)
);

create table if not exists public.medical_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  encrypted_payload bytea not null,
  payload_sha256 text not null,
  encryption_context jsonb not null default '{"algorithm":"pgp_sym_encrypt","scope":"owner-only"}'::jsonb,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id)
);

create table if not exists public.safety_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  tour_id uuid not null references public.tour_instances(id) on delete cascade,
  release_at timestamptz not null,
  summary_status text not null default 'queued',
  owner_acknowledged_at timestamptz,
  push_dispatched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_id)
);

create or replace function public.oshc_repatriation_declaration()
returns text
language sql
immutable
as $$
  select 'ข้าพเจ้ารับทราบว่า OSHC ของข้าพเจ้าครอบคลุมเฉพาะบริการทางการแพทย์และรถพยาบาลมาตรฐานภายในประเทศออสเตรเลีย และไม่ครอบคลุมค่าใช้จ่ายในการส่งร่างกลับประเทศโดยเด็ดขาด / I acknowledge that my OSHC policy only covers standard medical/ambulance services within Australia and explicitly EXCLUDES international repatriation of remains. I agree to assume full financial responsibility for any emergency repatriation expenses and waive all liability claims against Trip2Talk and its operators.';
$$;

create or replace function public.encrypt_medical_payload(p_payload jsonb)
returns bytea
language plpgsql
security definer
set search_path = public
as $$
declare
  encryption_key text;
begin
  encryption_key := nullif(current_setting('app.medical_encryption_key', true), '');

  if encryption_key is null then
    raise exception 'Medical encryption key is not configured';
  end if;

  return pgp_sym_encrypt(p_payload::text, encryption_key, 'compress-algo=1, cipher-algo=aes256');
end;
$$;

create or replace function public.upsert_medical_profile(
  p_customer_id uuid,
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_customer public.customers%rowtype;
  profile_id uuid;
begin
  if not public.has_app_role(array['owner'::public.app_role]) then
    raise exception 'Only the owner can write encrypted medical profiles';
  end if;

  select *
  into target_customer
  from public.customers
  where id = p_customer_id
    and tenant_id = public.current_tenant_id();

  if not found then
    raise exception 'Customer is outside the current tenant scope';
  end if;

  insert into public.medical_profiles (
    tenant_id,
    customer_id,
    encrypted_payload,
    payload_sha256,
    last_reviewed_at
  )
  values (
    target_customer.tenant_id,
    target_customer.id,
    public.encrypt_medical_payload(p_payload),
    encode(digest(p_payload::text, 'sha256'), 'hex'),
    now()
  )
  on conflict (customer_id) do update
  set
    encrypted_payload = excluded.encrypted_payload,
    payload_sha256 = excluded.payload_sha256,
    last_reviewed_at = now(),
    updated_at = now()
  returning id into profile_id;

  return profile_id;
end;
$$;

create or replace function public.read_medical_profile(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  encryption_key text;
  decrypted_text text;
begin
  if not public.has_app_role(array['owner'::public.app_role]) then
    raise exception 'Only the owner can read encrypted medical profiles';
  end if;

  encryption_key := nullif(current_setting('app.medical_encryption_key', true), '');

  if encryption_key is null then
    raise exception 'Medical encryption key is not configured';
  end if;

  select pgp_sym_decrypt(mp.encrypted_payload, encryption_key)
  into decrypted_text
  from public.medical_profiles mp
  where mp.customer_id = p_customer_id
    and mp.tenant_id = public.current_tenant_id();

  if decrypted_text is null then
    return null;
  end if;

  return decrypted_text::jsonb;
end;
$$;

create or replace function public.enforce_one_day_compliance()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_tour public.tour_instances%rowtype;
begin
  if new.status <> 'confirmed' then
    return new;
  end if;

  select *
  into target_tour
  from public.tour_instances
  where id = new.tour_id;

  if target_tour.tour_type <> 'one_day' then
    return new;
  end if;

  if not exists (
    select 1
    from public.customer_compliance_profiles ccp
    where ccp.customer_id = new.customer_id
      and ccp.tenant_id = new.tenant_id
      and ccp.document_status in ('submitted', 'verified')
      and (
        ccp.oshc_membership_number is not null
        or ccp.travel_insurance_file_path is not null
      )
  ) then
    raise exception 'OSHC membership number or travel insurance upload is required before ticket generation';
  end if;

  if not exists (
    select 1
    from public.compliance_waivers cw
    where cw.customer_id = new.customer_id
      and cw.tour_id = new.tour_id
      and cw.tenant_id = new.tenant_id
      and cw.declaration_version = 'oshc-repatriation-v1'
      and cw.declaration_text = public.oshc_repatriation_declaration()
  ) then
    raise exception 'Digital OSHC repatriation waiver must be signed before ticket generation';
  end if;

  new.confirmed_at := coalesce(new.confirmed_at, now());
  return new;
end;
$$;

drop trigger if exists enforce_one_day_compliance_before_booking_confirm on public.bookings;
create trigger enforce_one_day_compliance_before_booking_confirm
before insert or update of status on public.bookings
for each row execute function public.enforce_one_day_compliance();

create or replace function public.queue_safety_briefing_for_tour()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.safety_briefings (tenant_id, tour_id, release_at)
  values (new.tenant_id, new.id, new.departure_at - interval '24 hours')
  on conflict (tour_id) do update
  set
    release_at = excluded.release_at,
    summary_status = case
      when public.safety_briefings.owner_acknowledged_at is null then 'queued'
      else public.safety_briefings.summary_status
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists queue_safety_briefing_on_tour_change on public.tour_instances;
create trigger queue_safety_briefing_on_tour_change
after insert or update of departure_at on public.tour_instances
for each row execute function public.queue_safety_briefing_for_tour();

drop trigger if exists set_customer_compliance_profiles_updated_at on public.customer_compliance_profiles;
create trigger set_customer_compliance_profiles_updated_at
before update on public.customer_compliance_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_medical_profiles_updated_at on public.medical_profiles;
create trigger set_medical_profiles_updated_at
before update on public.medical_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_safety_briefings_updated_at on public.safety_briefings;
create trigger set_safety_briefings_updated_at
before update on public.safety_briefings
for each row execute function public.set_updated_at();

alter table public.customer_compliance_profiles enable row level security;
alter table public.compliance_waivers enable row level security;
alter table public.medical_profiles enable row level security;
alter table public.safety_briefings enable row level security;

drop policy if exists customer_compliance_internal_read on public.customer_compliance_profiles;
create policy customer_compliance_internal_read
on public.customer_compliance_profiles
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['tour_staff'::public.app_role, 'co_host'::public.app_role, 'owner'::public.app_role])
  )
);

drop policy if exists customer_compliance_cohost_owner_manage on public.customer_compliance_profiles;
create policy customer_compliance_cohost_owner_manage
on public.customer_compliance_profiles
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
);

drop policy if exists compliance_waivers_internal_read on public.compliance_waivers;
create policy compliance_waivers_internal_read
on public.compliance_waivers
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
  )
);

drop policy if exists compliance_waivers_cohost_owner_manage on public.compliance_waivers;
create policy compliance_waivers_cohost_owner_manage
on public.compliance_waivers
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['co_host'::public.app_role, 'owner'::public.app_role])
);

drop policy if exists medical_profiles_owner_only_read on public.medical_profiles;
create policy medical_profiles_owner_only_read
on public.medical_profiles
for select
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
);

drop policy if exists medical_profiles_owner_only_manage on public.medical_profiles;
create policy medical_profiles_owner_only_manage
on public.medical_profiles
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
);

drop policy if exists safety_briefings_owner_platform_read on public.safety_briefings;
create policy safety_briefings_owner_platform_read
on public.safety_briefings
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array['owner'::public.app_role])
    and release_at <= now()
  )
);

drop policy if exists safety_briefings_owner_acknowledge on public.safety_briefings;
create policy safety_briefings_owner_acknowledge
on public.safety_briefings
for update
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role])
);

commit;
