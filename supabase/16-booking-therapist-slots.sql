-- Trip2Talk V4
-- Therapist availability slots and booking-slot assignment.

begin;

create extension if not exists btree_gist;

do $$
begin
  create type public.therapist_slot_status as enum (
    'available',
    'held',
    'booked',
    'blocked',
    'cancelled'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.therapist_slot_assignment_status as enum (
    'assigned',
    'completed',
    'released',
    'no_show',
    'cancelled'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.therapist_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  display_name text not null,
  legal_name text,
  specialties text[] not null default '{}'::text[],
  phone text,
  email text,
  payid text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, display_name),
  unique (tenant_id, email)
);

create index if not exists therapist_profiles_tenant_active_idx
  on public.therapist_profiles (tenant_id, is_active);

create table if not exists public.therapist_availability_slots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  therapist_id uuid not null references public.therapist_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.therapist_slot_status not null default 'available',
  service_location text,
  hold_expires_at timestamptz,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint therapist_availability_slots_time_check check (ends_at > starts_at),
  constraint therapist_availability_slots_hold_check check (
    hold_expires_at is null or hold_expires_at > starts_at
  )
);

create index if not exists therapist_slots_tenant_window_idx
  on public.therapist_availability_slots (tenant_id, starts_at, ends_at, status);

create index if not exists therapist_slots_therapist_window_idx
  on public.therapist_availability_slots (therapist_id, starts_at, ends_at);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'therapist_availability_no_overlap'
      and conrelid = 'public.therapist_availability_slots'::regclass
  ) then
    alter table public.therapist_availability_slots
      add constraint therapist_availability_no_overlap
      exclude using gist (
        tenant_id with =,
        therapist_id with =,
        tstzrange(starts_at, ends_at, '[)') with &&
      )
      where (status in ('available', 'held', 'booked', 'blocked'));
  end if;
end
$$;

create table if not exists public.booking_therapist_slots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_studios(id) on delete cascade,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  therapist_id uuid not null references public.therapist_profiles(id) on delete restrict,
  slot_id uuid not null references public.therapist_availability_slots(id) on delete restrict,
  assignment_status public.therapist_slot_assignment_status not null default 'assigned',
  assigned_by_role public.app_role,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_therapist_slots_completion_check check (
    completed_at is null or assignment_status = 'completed'
  )
);

create unique index if not exists booking_therapist_slots_active_slot_idx
  on public.booking_therapist_slots (slot_id)
  where assignment_status in ('assigned', 'completed');

create index if not exists booking_therapist_slots_booking_idx
  on public.booking_therapist_slots (booking_id, assignment_status);

create index if not exists booking_therapist_slots_tenant_idx
  on public.booking_therapist_slots (tenant_id, therapist_id, assignment_status);

create or replace function public.validate_therapist_slot_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_row public.bookings%rowtype;
  therapist_row public.therapist_profiles%rowtype;
  slot_row public.therapist_availability_slots%rowtype;
begin
  select *
  into booking_row
  from public.bookings
  where id = new.booking_id;

  if not found then
    raise exception 'Booking does not exist';
  end if;

  select *
  into slot_row
  from public.therapist_availability_slots
  where id = new.slot_id;

  if not found then
    raise exception 'Therapist slot does not exist';
  end if;

  select *
  into therapist_row
  from public.therapist_profiles
  where id = slot_row.therapist_id;

  if not found or not therapist_row.is_active then
    raise exception 'Therapist is inactive or missing';
  end if;

  if booking_row.tenant_id <> slot_row.tenant_id
    or booking_row.tenant_id <> therapist_row.tenant_id then
    raise exception 'Booking, therapist, and slot must belong to the same tenant';
  end if;

  if slot_row.status not in ('available', 'held', 'booked') then
    raise exception 'Therapist slot is not assignable';
  end if;

  if slot_row.status = 'booked'
    and not exists (
      select 1
      from public.booking_therapist_slots bts
      where bts.slot_id = new.slot_id
        and bts.id = coalesce(new.id, bts.id)
    ) then
    raise exception 'Therapist slot is already booked';
  end if;

  if slot_row.hold_expires_at is not null
    and slot_row.hold_expires_at <= now()
    and slot_row.status = 'held' then
    raise exception 'Therapist slot hold has expired';
  end if;

  new.tenant_id := booking_row.tenant_id;
  new.therapist_id := slot_row.therapist_id;
  new.assigned_by_role := coalesce(new.assigned_by_role, public.current_app_role());
  new.completed_at := case
    when new.assignment_status = 'completed' then coalesce(new.completed_at, now())
    else null
  end;

  return new;
end;
$$;

create or replace function public.refresh_therapist_slot_status(p_slot_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.booking_therapist_slots bts
    where bts.slot_id = p_slot_id
      and bts.assignment_status in ('assigned', 'completed')
  ) then
    update public.therapist_availability_slots
    set status = 'booked',
        hold_expires_at = null,
        updated_at = now()
    where id = p_slot_id;
  else
    update public.therapist_availability_slots
    set status = case
          when status = 'booked' then 'available'::public.therapist_slot_status
          else status
        end,
        updated_at = now()
    where id = p_slot_id;
  end if;
end;
$$;

create or replace function public.sync_therapist_slot_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'DELETE' then
    perform public.refresh_therapist_slot_status(old.slot_id);
    return old;
  end if;

  if TG_OP = 'UPDATE' and old.slot_id is distinct from new.slot_id then
    perform public.refresh_therapist_slot_status(old.slot_id);
  end if;

  perform public.refresh_therapist_slot_status(new.slot_id);

  return new;
end;
$$;

create or replace function public.expire_therapist_slot_holds()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_count integer;
begin
  update public.therapist_availability_slots
  set status = 'available',
      hold_expires_at = null,
      updated_at = now()
  where status = 'held'
    and hold_expires_at <= now();

  get diagnostics expired_count = row_count;
  return expired_count;
end;
$$;

drop trigger if exists validate_therapist_slot_assignment_before_write
  on public.booking_therapist_slots;
create trigger validate_therapist_slot_assignment_before_write
before insert or update of booking_id, slot_id, assignment_status, completed_at
on public.booking_therapist_slots
for each row execute function public.validate_therapist_slot_assignment();

drop trigger if exists sync_therapist_slot_status_after_write
  on public.booking_therapist_slots;
create trigger sync_therapist_slot_status_after_write
after insert or update of slot_id, assignment_status or delete
on public.booking_therapist_slots
for each row execute function public.sync_therapist_slot_status();

drop trigger if exists set_therapist_profiles_updated_at
  on public.therapist_profiles;
create trigger set_therapist_profiles_updated_at
before update on public.therapist_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_therapist_availability_slots_updated_at
  on public.therapist_availability_slots;
create trigger set_therapist_availability_slots_updated_at
before update on public.therapist_availability_slots
for each row execute function public.set_updated_at();

drop trigger if exists set_booking_therapist_slots_updated_at
  on public.booking_therapist_slots;
create trigger set_booking_therapist_slots_updated_at
before update on public.booking_therapist_slots
for each row execute function public.set_updated_at();

alter table public.therapist_profiles enable row level security;
alter table public.therapist_availability_slots enable row level security;
alter table public.booking_therapist_slots enable row level security;

drop policy if exists therapist_profiles_internal_read on public.therapist_profiles;
create policy therapist_profiles_internal_read
on public.therapist_profiles
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array[
      'tour_staff'::public.app_role,
      'co_host'::public.app_role,
      'owner'::public.app_role
    ])
  )
);

drop policy if exists therapist_profiles_owner_cohost_manage on public.therapist_profiles;
create policy therapist_profiles_owner_cohost_manage
on public.therapist_profiles
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
);

drop policy if exists therapist_slots_internal_read on public.therapist_availability_slots;
create policy therapist_slots_internal_read
on public.therapist_availability_slots
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array[
      'tour_staff'::public.app_role,
      'co_host'::public.app_role,
      'owner'::public.app_role
    ])
  )
);

drop policy if exists therapist_slots_owner_cohost_manage on public.therapist_availability_slots;
create policy therapist_slots_owner_cohost_manage
on public.therapist_availability_slots
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
);

drop policy if exists booking_therapist_slots_internal_read on public.booking_therapist_slots;
create policy booking_therapist_slots_internal_read
on public.booking_therapist_slots
for select
using (
  public.has_app_role(array['platform_admin'::public.app_role])
  or (
    tenant_id = public.current_tenant_id()
    and public.has_app_role(array[
      'tour_staff'::public.app_role,
      'co_host'::public.app_role,
      'owner'::public.app_role
    ])
  )
);

drop policy if exists booking_therapist_slots_owner_cohost_manage on public.booking_therapist_slots;
create policy booking_therapist_slots_owner_cohost_manage
on public.booking_therapist_slots
for all
using (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
)
with check (
  tenant_id = public.current_tenant_id()
  and public.has_app_role(array['owner'::public.app_role, 'co_host'::public.app_role])
);

-- Enable this in hosted Supabase after pg_cron is available:
-- select cron.schedule(
--   'trip2talk-expire-therapist-slot-holds',
--   '* * * * *',
--   $$select public.expire_therapist_slot_holds();$$
-- );

commit;
