-- Make the photography media bucket readable for <img> tags on quotes/invoices/contracts.
-- Bucket id must match Storage → "Photos media". Safe to re-run.

insert into storage.buckets (id, name, public)
values ('Photos media', 'Photos media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "pm brand logos public objects" on storage.objects;
create policy "pm brand logos public objects"
  on storage.objects for select
  using (bucket_id = 'Photos media');

drop policy if exists "pm brand logos owner write" on storage.objects;
create policy "pm brand logos owner write"
  on storage.objects for all
  using (bucket_id = 'Photos media' and public.pm_is_owner())
  with check (bucket_id = 'Photos media' and public.pm_is_owner());
