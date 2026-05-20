// Cron-driven alert aggregator - checks DA/Rego/Insurance expiry
import { supabase }              from './supabase';
import { sendAssetExpiryAlert }  from './notifyService';
import type { Asset }            from '../types/compliance';

export function calcDaysUntilExpiry(expiryDate: string): number {
  const today  = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getAlertLevel(days: number): Asset['alert_level'] {
  if (days < 0)  return 'expired';
  if (days <= 7) return 'critical';
  if (days <= 30) return 'warning';
  return 'ok';
}

export async function checkAssetExpiry(ownerPhone: string): Promise<void> {
  const { data: assets, error } = await supabase
    .from('assets')
    .select('*')
    .eq('is_active', true);

  if (error || !assets) return;

  for (const asset of assets) {
    const days  = calcDaysUntilExpiry(asset.expiry_date);
    const level = getAlertLevel(days);

    if (level === 'warning' && !asset.alert_30d_sent) {
      await sendAssetExpiryAlert({ ownerPhone, assetName: asset.name, expiryDate: asset.expiry_date, daysLeft: days });
      await supabase.from('assets').update({ alert_30d_sent: true }).eq('id', asset.id);
    }
    if (level === 'critical' && !asset.alert_7d_sent) {
      await sendAssetExpiryAlert({ ownerPhone, assetName: asset.name, expiryDate: asset.expiry_date, daysLeft: days });
      await supabase.from('assets').update({ alert_7d_sent: true }).eq('id', asset.id);
    }
  }
}
