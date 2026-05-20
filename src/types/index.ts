export type UserRole = 'portfolio' | 'owner' | 'staff' | 'cashier' | 'superadmin';

export interface PinRoute {
  pin: string;
  role: UserRole;
  label: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  createdAt: string;
  syncedAt?: string;
}

export interface Asset {
  id: string;
  name: string;
  owner: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
}

export interface PaymentRequest {
  id: string;
  amount: number;
  payId: string;
  reference: string;
  status: 'draft' | 'sent' | 'paid' | 'void';
}

export interface AlertMessage {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  createdAt: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface SyncResult {
  ok: boolean;
  message: string;
  syncedCount: number;
}
