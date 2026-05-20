const PAY_ID_PREFIX = 'CH99';

export function createPayId(amount: number, createdAt = new Date()): string {
  const datePart = createdAt.toISOString().slice(0, 10).replaceAll('-', '');
  const amountPart = Math.round(amount * 100).toString().padStart(8, '0');
  const randomPart = crypto.getRandomValues(new Uint16Array(1))[0].toString(36).padStart(4, '0');

  return `${PAY_ID_PREFIX}-${datePart}-${amountPart}-${randomPart}`.toUpperCase();
}

export function paymentReference(payId: string, description: string): string {
  const safeDescription = description.trim().replace(/\s+/g, ' ').slice(0, 32);
  return `${payId} ${safeDescription}`.trim();
}
