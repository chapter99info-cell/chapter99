// Net settlement calculation between Owner and Staff
export interface SettlementSummary {
  totalCollected:      number;
  totalCommissions:    number;
  netToOwner:          number;
  billingPayid:        string;
  commissionBreakdown: { staffName: string; amount: number; paid: boolean }[];
}

export function calcGST(amountInclGST: number) {
  const gst = parseFloat((amountInclGST / 11).toFixed(2));
  return { gst, net: parseFloat((amountInclGST - gst).toFixed(2)) };
}

export function calcCommission(headCount: number, ratePerHead: number): number {
  return parseFloat((headCount * ratePerHead).toFixed(2));
}

export function calcNetSettlement(totalCollected: number, totalCommissions: number): number {
  return parseFloat((totalCollected - totalCommissions).toFixed(2));
}

export function resolvePayid(staffPayid?: string, ownerPayid?: string): string {
  return staffPayid ?? ownerPayid ?? '';
}
