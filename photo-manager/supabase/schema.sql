-- Chapter99 Photography Photo Manager — isolated project only.
-- Idempotent. Do not run on the agency / massage databases.

create table if not exists public.pm_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null check (role in ('owner','staff','blocked')),
  created_at timestamptz default now()
);

create table if not exists public.pm_staff_invites (
  email text primary key,
  code text not null,
  created_at timestamptz default now(),
  used_at timestamptz
);

create table if not exists public.pm_packages (
  id text primary key,
  kind text not null check (kind in ('wedding','engagement')),
  name text not null,
  price numeric not null,
  hours int not null,
  blurb jsonb not null default '[]'::jsonb
);

create table if not exists public.pm_addons (
  id text primary key,
  name text not null,
  price numeric not null,
  suggests_expense jsonb
);

create table if not exists public.pm_clients (
  id text primary key,
  name text not null,
  type text not null,
  type_label text not null,
  package_id text references public.pm_packages(id),
  date_display text not null,
  date_iso date not null,
  ceremony_time text,
  location text,
  status text not null,
  status_label text not null,
  phone text,
  email text,
  addon_ids jsonb not null default '[]'::jsonb,
  checklist jsonb not null default '{"preshoot":false,"balance":false,"gallery":false,"review":false}'::jsonb,
  brief_confirmed boolean not null default false,
  contract_confirmed boolean not null default false,
  confirm_token text unique,
  gallery jsonb not null default '{}'::jsonb,
  quote jsonb not null default '{}'::jsonb
);

-- Money never lives on pm_clients (staff can read that table). Owner-only.
create table if not exists public.pm_client_finance (
  client_id text primary key references public.pm_clients(id) on delete cascade,
  deposit numeric not null default 0,
  custom_price numeric,
  fixed_price numeric,
  payment jsonb not null default '{}'::jsonb
);

create table if not exists public.pm_expenses (
  id text primary key,
  date_iso date not null,
  category text not null,
  description text not null,
  amount numeric not null,
  linked_client_id text references public.pm_clients(id)
);

create table if not exists public.pm_vendor_sheets (
  client_id text primary key references public.pm_clients(id) on delete cascade,
  vendors jsonb not null default '[]'::jsonb
);

alter table public.pm_profiles enable row level security;
alter table public.pm_staff_invites enable row level security;
alter table public.pm_packages enable row level security;
alter table public.pm_addons enable row level security;
alter table public.pm_clients enable row level security;
alter table public.pm_client_finance enable row level security;
alter table public.pm_expenses enable row level security;
alter table public.pm_vendor_sheets enable row level security;

create or replace function public.pm_is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pm_profiles p
    where p.id = auth.uid() and p.role = 'owner'
  );
$$;

create or replace function public.pm_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pm_profiles p
    where p.id = auth.uid() and p.role in ('owner','staff')
  );
$$;

create or replace function public.pm_needs_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from public.pm_profiles where role = 'owner');
$$;

create or replace function public.pm_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  has_owner boolean;
  assigned text;
begin
  select exists (select 1 from public.pm_profiles where role = 'owner') into has_owner;
  assigned := 'blocked';
  if not has_owner then
    assigned := 'owner';
  elsif exists (
    select 1 from public.pm_staff_invites i
    where lower(i.email) = lower(new.email)
      and i.used_at is null
  ) then
    assigned := 'staff';
    update public.pm_staff_invites
      set used_at = now()
      where lower(email) = lower(new.email) and used_at is null;
  end if;

  insert into public.pm_profiles (id, email, name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'user'), '@', 1)),
    assigned
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists pm_on_auth_user_created on auth.users;
create trigger pm_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.pm_handle_new_user();

drop policy if exists "pm packages read" on public.pm_packages;
drop policy if exists "pm addons read" on public.pm_addons;
drop policy if exists "pm packages write owner" on public.pm_packages;
drop policy if exists "pm addons write owner" on public.pm_addons;
drop policy if exists "pm clients staff" on public.pm_clients;
drop policy if exists "pm clients write staff" on public.pm_clients;
drop policy if exists "pm clients update staff" on public.pm_clients;
drop policy if exists "pm clients delete owner" on public.pm_clients;
drop policy if exists "pm clients confirm token" on public.pm_clients;
drop policy if exists "pm expenses owner only" on public.pm_expenses;
drop policy if exists "pm vendors staff" on public.pm_vendor_sheets;
drop policy if exists "pm profiles self" on public.pm_profiles;
drop policy if exists "pm invites owner" on public.pm_staff_invites;

create policy "pm packages read" on public.pm_packages for select using (public.pm_is_staff());
create policy "pm addons read" on public.pm_addons for select using (public.pm_is_staff());
create policy "pm packages write owner" on public.pm_packages for all using (public.pm_is_owner()) with check (public.pm_is_owner());
create policy "pm addons write owner" on public.pm_addons for all using (public.pm_is_owner()) with check (public.pm_is_owner());

create policy "pm clients staff" on public.pm_clients for select using (public.pm_is_staff());
create policy "pm clients write staff" on public.pm_clients for insert with check (public.pm_is_staff());
create policy "pm clients update staff" on public.pm_clients for update using (public.pm_is_staff()) with check (public.pm_is_staff());
create policy "pm clients delete owner" on public.pm_clients for delete using (public.pm_is_owner());

create policy "pm expenses owner only" on public.pm_expenses
  for all using (public.pm_is_owner()) with check (public.pm_is_owner());

drop policy if exists "pm finance owner only" on public.pm_client_finance;
create policy "pm finance owner only" on public.pm_client_finance
  for all using (public.pm_is_owner()) with check (public.pm_is_owner());

create policy "pm vendors staff" on public.pm_vendor_sheets
  for all using (public.pm_is_staff()) with check (public.pm_is_staff());

create policy "pm profiles self" on public.pm_profiles
  for select using (id = auth.uid() or public.pm_is_owner());

create policy "pm invites owner" on public.pm_staff_invites
  for all using (public.pm_is_owner()) with check (public.pm_is_owner());

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

create or replace function public.pm_submit_confirm(p_token text, p_kind text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind = 'brief' then
    update public.pm_clients
      set brief_confirmed = true,
          status = case when status = 'draft' then 'pending' else status end,
          status_label = case when status = 'draft' then 'รอมัดจำ' else status_label end
      where confirm_token = trim(p_token);
  else
    update public.pm_clients
      set contract_confirmed = true
      where confirm_token = trim(p_token);
  end if;
  return found;
end;
$$;

grant execute on function public.pm_needs_owner() to anon, authenticated;
grant execute on function public.pm_fetch_confirm(text) to anon, authenticated;
grant execute on function public.pm_submit_confirm(text, text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'pm_clients'
  ) then
    execute 'alter publication supabase_realtime add table public.pm_clients';
  end if;
end $$;

insert into public.pm_packages (id, kind, name, price, hours, blurb) values
  ('w1','wedding','Small Wedding (2 hrs)',1400,2,'["2 ชม. คุ้มครอง","1 ช่างภาพ","ภาพความละเอียดสูงทั้งหมด","อัลบั้มออนไลน์ส่วนตัว"]'::jsonb),
  ('w2','wedding','Small Wedding (4 hrs)',1600,4,'["4 ชม. คุ้มครอง","1 ช่างภาพ","ภาพความละเอียดสูงทั้งหมด","อัลบั้มออนไลน์ส่วนตัว"]'::jsonb),
  ('w3','wedding','Diamond Package',2500,8,'["6-8 ชม. คุ้มครอง","1 ช่างภาพ, กล้องหลายตัว","Photobook ขนาดกลาง","อัลบั้มออนไลน์แชร์ได้"]'::jsonb),
  ('w4','wedding','Deluxe Package',4400,10,'["8-10 ชม. เต็มวัน","2 ช่างภาพ, กล้องหลายตัว","Photobook ขนาดใหญ่","อัลบั้มออนไลน์แชร์ครอบครัว/เพื่อน"]'::jsonb),
  ('e1','engagement','Package 1',950,2,'["ช่วงเวลาพระอาทิตย์ตก 2 ชม.","1 ช่างภาพ","ถ่ายในเมือง ไม่จำกัดจำนวนภาพ","รีทัชภาพ + Online Gallery + USB"]'::jsonb),
  ('e2','engagement','Package 2',1700,4,'["Sunset & After Dark 4 ชม.","1 ช่างภาพ + ผู้ช่วย","พื้นที่ถ่ายซิดนีย์ ไม่จำกัดจำนวนภาพ","รีทัชภาพ + Online Gallery ฟรี"]'::jsonb),
  ('e3','engagement','Package 3',2400,8,'["เต็มวัน 8 ชม.","1 ช่างภาพ + ผู้ช่วย + รถรับส่ง","พื้นที่ถ่ายซิดนีย์ ไม่จำกัดจำนวนภาพ","รีทัชภาพ + Wedding guest photobook"]'::jsonb)
on conflict (id) do nothing;

insert into public.pm_addons (id, name, price, suggests_expense) values
  ('extra-photographer','Additional photographer',600,null),
  ('saen-video','Saen shoots video himself (extra)',500,null),
  ('freelance-video','Hire freelance videographer (extra)',800,'{"category":"Freelancer / contractor","description":"Freelance videographer hire (typical average cost)","typicalAmount":400}'::jsonb),
  ('drone','Aerial drone',475,null),
  ('extra-album','Extra photo album',1000,null),
  ('raw-footage','Raw/unedited footage',500,null)
on conflict (id) do nothing;

-- Per-job-type logos (same wedding.png for all types until remapped in Settings/Brand).
create table if not exists public.pm_brand_logos (
  type text primary key check (type in ('wedding', 'engagement', 'portrait', 'family', 'default')),
  logo_url text not null
);

alter table public.pm_brand_logos enable row level security;

drop policy if exists "pm brand logos read" on public.pm_brand_logos;
drop policy if exists "pm brand logos public read" on public.pm_brand_logos;
drop policy if exists "pm brand logos write owner" on public.pm_brand_logos;

create policy "pm brand logos read" on public.pm_brand_logos
  for select using (public.pm_is_staff());

create policy "pm brand logos public read" on public.pm_brand_logos
  for select using (true);

create policy "pm brand logos write owner" on public.pm_brand_logos
  for all using (public.pm_is_owner()) with check (public.pm_is_owner());

grant select on public.pm_brand_logos to anon, authenticated;
grant insert, update, delete on public.pm_brand_logos to authenticated;

insert into public.pm_brand_logos (type, logo_url) values
  ('default', 'https://auidjqalknebeqoxhwex.supabase.co/storage/v1/object/public/Photos%20media/photos/wedding.png'),
  ('wedding', 'https://auidjqalknebeqoxhwex.supabase.co/storage/v1/object/public/Photos%20media/photos/wedding.png'),
  ('engagement', 'https://auidjqalknebeqoxhwex.supabase.co/storage/v1/object/public/Photos%20media/photos/wedding.png'),
  ('portrait', 'https://auidjqalknebeqoxhwex.supabase.co/storage/v1/object/public/Photos%20media/photos/wedding.png'),
  ('family', 'https://auidjqalknebeqoxhwex.supabase.co/storage/v1/object/public/Photos%20media/photos/wedding.png')
on conflict (type) do nothing;
