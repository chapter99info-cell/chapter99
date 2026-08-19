-- Per-job-type document logos. All types start on photos/wedding.png.
-- Do not use Chapter99_st.png (restaurant/spa photography + web-build line).

create table if not exists public.pm_brand_logos (
  type text primary key check (type in ('wedding', 'engagement', 'portrait', 'family', 'default')),
  logo_url text not null
);

alter table public.pm_brand_logos enable row level security;

drop policy if exists "pm brand logos read" on public.pm_brand_logos;
drop policy if exists "pm brand logos public read" on public.pm_brand_logos;
drop policy if exists "pm brand logos write owner" on public.pm_brand_logos;

-- Staff (and owner) can read mappings in the manager.
create policy "pm brand logos read" on public.pm_brand_logos
  for select using (public.pm_is_staff());

-- Confirm links are anonymous; they still need the remapped URL.
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

notify pgrst, 'reload schema';
