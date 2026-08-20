-- Recurring expenses: one row, expanded in the tax summary by frequency.
alter table public.pm_expenses add column if not exists frequency text not null default 'once';
alter table public.pm_expenses add column if not exists ended_iso date;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'pm_expenses_frequency_check'
  ) then
    alter table public.pm_expenses
      add constraint pm_expenses_frequency_check check (frequency in ('once', 'monthly', 'yearly'));
  end if;
end $$;
