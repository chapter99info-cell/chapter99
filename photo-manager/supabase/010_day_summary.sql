-- Client-facing shoot-day summary (editable). Empty = generate from crew timeline in the app.
alter table public.pm_clients add column if not exists day_summary text not null default '';

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
    'quote', coalesce(r.quote, '{}'::jsonb),
    'prepTips', coalesce(r.prep_tips, ''),
    'daySummary', coalesce(r.day_summary, ''),
    'addonPrices', coalesce(f.addon_prices, '{}'::jsonb)
  );
end;
$$;
