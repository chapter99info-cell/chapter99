-- Owner-only quote calculator rates (key/amount rows, same pattern as pm_brand_logos).
create table if not exists public.pm_quote_rates (
  id text primary key,
  amount numeric not null,
  label text not null
);

alter table public.pm_quote_rates enable row level security;

drop policy if exists "pm quote rates owner" on public.pm_quote_rates;
create policy "pm quote rates owner" on public.pm_quote_rates
  for all using (public.pm_is_owner()) with check (public.pm_is_owner());

grant select, insert, update, delete on public.pm_quote_rates to authenticated;

insert into public.pm_quote_rates (id, amount, label) values
  ('photo_hourly', 80, 'ถ่ายภาพ — ต่อชั่วโมง'),
  ('web_per_page', 150, 'เว็บ — ต่อหน้า'),
  ('web_booking', 180, 'เว็บ — ฟอร์มจองคิว'),
  ('web_gallery', 120, 'เว็บ — แกลเลอรี'),
  ('web_bilingual', 150, 'เว็บ — สองภาษา (ไทย+อังกฤษ)'),
  ('backend_queue_calendar', 15, 'หลังบ้าน — คิว/ปฏิทิน'),
  ('backend_invoicing', 15, 'หลังบ้าน — ใบแจ้งหนี้'),
  ('backend_reminders', 15, 'หลังบ้าน — เตือนลูกค้า'),
  ('backend_tax_expense', 15, 'หลังบ้าน — ภาษี/รายจ่าย'),
  ('backend_multi_staff', 15, 'หลังบ้าน — หลายพนักงาน'),
  ('intro_factor', 0.7, 'ตัวคูณราคาเริ่มต้น')
on conflict (id) do nothing;
