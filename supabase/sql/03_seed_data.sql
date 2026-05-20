insert into public.expenses (category, description, amount, paid_by)
values
  ('Maintenance', 'Pool pump service', 1250.00, 'Nok'),
  ('Utilities', 'Electricity top-up', 2840.00, 'Cashier')
on conflict do nothing;

insert into public.assets (name, owner, expiry_date)
values
  ('Villa insurance', 'Owner A', current_date + interval '20 days'),
  ('Rental license', 'Owner B', current_date + interval '120 days'),
  ('Vehicle registration', 'Operations', current_date - interval '5 days')
on conflict do nothing;
