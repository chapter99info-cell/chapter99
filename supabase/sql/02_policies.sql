alter table public.profiles enable row level security;
alter table public.expenses enable row level security;
alter table public.assets enable row level security;
alter table public.payment_requests enable row level security;
alter table public.alerts enable row level security;
alter table public.sync_events enable row level security;

create policy "profiles are visible to authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "expenses are manageable by authenticated users"
  on public.expenses for all
  to authenticated
  using (true)
  with check (true);

create policy "assets are manageable by authenticated users"
  on public.assets for all
  to authenticated
  using (true)
  with check (true);

create policy "payment requests are manageable by authenticated users"
  on public.payment_requests for all
  to authenticated
  using (true)
  with check (true);

create policy "alerts are manageable by authenticated users"
  on public.alerts for all
  to authenticated
  using (true)
  with check (true);

create policy "sync events are visible to authenticated users"
  on public.sync_events for select
  to authenticated
  using (true);

create policy "sync events can be inserted by authenticated users"
  on public.sync_events for insert
  to authenticated
  with check (true);
