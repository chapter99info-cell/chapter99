-- Upgrade an already-applied Photo Manager schema: move money off pm_clients,
-- remove mockup demo rows, enable realtime. Safe to re-run.

create table if not exists public.pm_client_finance (
  client_id text primary key references public.pm_clients(id) on delete cascade,
  deposit numeric not null default 0,
  custom_price numeric,
  fixed_price numeric,
  payment jsonb not null default '{}'::jsonb
);

alter table public.pm_client_finance enable row level security;
drop policy if exists "pm finance owner only" on public.pm_client_finance;
create policy "pm finance owner only" on public.pm_client_finance
  for all using (public.pm_is_owner()) with check (public.pm_is_owner());

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pm_clients' and column_name = 'deposit'
  ) then
    insert into public.pm_client_finance (client_id, deposit, custom_price, fixed_price, payment)
    select id, coalesce(deposit, 0), custom_price, fixed_price, coalesce(payment, '{}'::jsonb)
    from public.pm_clients
    on conflict (client_id) do nothing;
  end if;
end $$;

-- Recreate JSON helper before dropping columns it used to read.
drop function if exists public.pm_client_to_json(public.pm_clients);

alter table public.pm_clients drop column if exists deposit;
alter table public.pm_clients drop column if exists custom_price;
alter table public.pm_clients drop column if exists fixed_price;
alter table public.pm_clients drop column if exists payment;

create or replace function public.pm_client_to_json(r public.pm_clients)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare f public.pm_client_finance;
begin
  select * into f from public.pm_client_finance where client_id = r.id;
  return jsonb_build_object(
    'id', r.id,
    'name', r.name,
    'type', r.type,
    'typeLabel', r.type_label,
    'packageId', r.package_id,
    'fixedPrice', f.fixed_price,
    'customPrice', f.custom_price,
    'date', r.date_display,
    'dateISO', r.date_iso,
    'ceremonyTime', r.ceremony_time,
    'location', r.location,
    'deposit', coalesce(f.deposit, 0),
    'status', r.status,
    'statusLabel', r.status_label,
    'phone', r.phone,
    'email', r.email,
    'addonIds', coalesce(r.addon_ids, '[]'::jsonb),
    'checklist', coalesce(r.checklist, '{}'::jsonb),
    'briefConfirmed', r.brief_confirmed,
    'contractConfirmed', r.contract_confirmed,
    'confirmToken', r.confirm_token,
    'gallery', coalesce(r.gallery, '{}'::jsonb),
    'payment', coalesce(f.payment, '{}'::jsonb),
    'quote', coalesce(r.quote, '{}'::jsonb)
  );
end;
$$;

create or replace function public.pm_fetch_confirm(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare r public.pm_clients;
begin
  if p_token is null or length(trim(p_token)) < 6 then
    return null;
  end if;
  select * into r from public.pm_clients where confirm_token = trim(p_token);
  if not found then
    return null;
  end if;
  return public.pm_client_to_json(r);
end;
$$;

-- Mockup sample bookings must not ship in production.
delete from public.pm_expenses where id in ('x1','x2');
delete from public.pm_clients where id in ('c1','c2','c3','c4','c5');

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'pm_clients'
  ) then
    execute 'alter publication supabase_realtime add table public.pm_clients';
  end if;
end $$;
