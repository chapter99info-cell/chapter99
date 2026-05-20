import { differenceInCalendarDays, parseISO } from 'date-fns';
import { AlertMessage, Asset } from '../types';

export function classifyAsset(asset: Omit<Asset, 'status'>, warningWindowDays = 30): Asset {
  const daysUntilExpiry = differenceInCalendarDays(parseISO(asset.expiryDate), new Date());

  if (daysUntilExpiry < 0) {
    return { ...asset, status: 'expired' };
  }

  if (daysUntilExpiry <= warningWindowDays) {
    return { ...asset, status: 'expiring' };
  }

  return { ...asset, status: 'active' };
}

export function assetExpiryAlerts(assets: Asset[]): AlertMessage[] {
  return assets
    .filter((asset) => asset.status !== 'active')
    .map((asset) => ({
      id: `asset-${asset.id}`,
      severity: asset.status === 'expired' ? 'critical' : 'warning',
      title: asset.status === 'expired' ? 'Asset expired' : 'Asset expiring soon',
      message: `${asset.name} for ${asset.owner} expires on ${asset.expiryDate}.`,
      createdAt: new Date().toISOString(),
    }));
}
