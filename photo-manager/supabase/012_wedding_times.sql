-- Add Wedding Day end time + Pre-Wedding start/end times (all nullable, backward compatible).
alter table public.pm_clients add column if not exists wedding_end_time text;
alter table public.pm_clients add column if not exists pre_wedding_start_time text;
alter table public.pm_clients add column if not exists pre_wedding_end_time text;

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
    'preWeddingDateISO', r.pre_wedding_date_iso,
    'ceremonyTime', r.ceremony_time,
    'weddingEndTime', r.wedding_end_time,
    'preWeddingStartTime', r.pre_wedding_start_time,
    'preWeddingEndTime', r.pre_wedding_end_time,
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
