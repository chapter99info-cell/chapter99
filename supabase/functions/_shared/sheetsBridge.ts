export type ReceiptUploadPayload = {
  base64: string;
  mimeType: string;
  fileName?: string;
};

export type ExpensePayload = {
  pin?: string;
  date: string;
  tripCode: string;
  category: string;
  amount: number;
  gst?: number;
  net?: number;
  description?: string;
  receipt?: ReceiptUploadPayload;
};

export type ExpenseRow = {
  date: string;
  tripCode: string;
  category: string;
  amount: number;
  gst: number;
  net: number;
  description?: string;
  receiptFileName?: string;
};

export type SettlementExportRow = {
  tourCode: string;
  bookings: number;
  collected: number;
  commission: number;
  netToOwner: number;
};

export type AppsScriptResponse<T> = {
  ok: boolean;
  error?: string;
} & T;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function handleOptions(req: Request): Response | null {
  return req.method === "OPTIONS" ? new Response("ok", { headers: corsHeaders }) : null;
}

export async function readJsonBody<T>(req: Request): Promise<T> {
  if (req.method !== "POST") {
    throw httpError("Method not allowed", 405);
  }

  try {
    return await req.json();
  } catch (_error) {
    throw httpError("Request body must be valid JSON", 400);
  }
}

export function jsonResponse<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function errorResponse(error: unknown): Response {
  const status = isHttpError(error) ? error.status : 500;
  const message = error instanceof Error ? error.message : "Unexpected error";

  return jsonResponse({ ok: false, error: message }, status);
}

export function requireQuickExpensePin(pin: string | undefined): void {
  const expectedPin = Deno.env.get("QUICK_EXPENSE_PIN") ?? "9999";

  if (pin !== expectedPin) {
    throw httpError("Invalid Quick Expense PIN", 401);
  }
}

export function normalizeExpensePayload(payload: ExpensePayload): ExpenseRow {
  if (!payload.tripCode?.trim()) {
    throw httpError("tripCode is required", 400);
  }

  if (!payload.date?.trim()) {
    throw httpError("date is required", 400);
  }

  if (!payload.category?.trim()) {
    throw httpError("category is required", 400);
  }

  const amount = roundCurrency(payload.amount);
  const gst = roundCurrency(payload.gst ?? amount / 11);
  const net = roundCurrency(payload.net ?? amount - gst);

  return {
    date: normalizeDate(payload.date),
    tripCode: payload.tripCode.trim().toUpperCase(),
    category: payload.category.trim(),
    amount,
    gst,
    net,
    description: payload.description?.trim() || undefined,
    receiptFileName: payload.receipt?.fileName,
  };
}

export async function callAppsScript<T>(
  action: "appendExpense" | "batchExpenses" | "exportSettlement",
  payload: Record<string, unknown>,
): Promise<AppsScriptResponse<T>> {
  const webAppUrl = requiredEnv("GOOGLE_APPS_SCRIPT_WEB_APP_URL");
  const bridgeSecret = requiredEnv("GOOGLE_APPS_SCRIPT_SHARED_SECRET");

  const response = await fetch(webAppUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      secret: bridgeSecret,
      ...payload,
    }),
  });

  const text = await response.text();
  let data: AppsScriptResponse<T>;

  try {
    data = JSON.parse(text);
  } catch (_error) {
    throw httpError(`Apps Script returned non-JSON response: ${text}`, 502);
  }

  if (!response.ok || !data.ok) {
    throw httpError(data.error ?? `Apps Script request failed with ${response.status}`, 502);
  }

  return data;
}

export function validateReceipt(receipt: ReceiptUploadPayload | undefined): void {
  if (!receipt) {
    return;
  }

  if (!receipt.base64?.trim()) {
    throw httpError("receipt.base64 is required when receipt is provided", 400);
  }

  if (!receipt.mimeType?.trim()) {
    throw httpError("receipt.mimeType is required when receipt is provided", 400);
  }
}

export function validateSettlementRows(rows: SettlementExportRow[]): SettlementExportRow[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw httpError("rows must contain at least one settlement row", 400);
  }

  return rows.map((row) => ({
    tourCode: requiredString(row.tourCode, "tourCode").toUpperCase(),
    bookings: requiredInteger(row.bookings, "bookings"),
    collected: roundCurrency(row.collected),
    commission: roundCurrency(row.commission),
    netToOwner: roundCurrency(row.netToOwner),
  }));
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw httpError(`${name} is not configured`, 500);
  }

  return value;
}

function normalizeDate(date: string): string {
  const normalized = date.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    throw httpError(`Invalid date: ${date}`, 400);
  }

  return parsed.toISOString().slice(0, 10);
}

function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) {
    throw httpError(`Invalid currency amount: ${value}`, 400);
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function requiredString(value: string, fieldName: string): string {
  if (!value?.trim()) {
    throw httpError(`${fieldName} is required`, 400);
  }

  return value.trim();
}

function requiredInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw httpError(`${fieldName} must be a non-negative integer`, 400);
  }

  return value;
}

function httpError(message: string, status: number): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

function isHttpError(error: unknown): error is Error & { status: number } {
  return error instanceof Error && typeof (error as Error & { status?: unknown }).status === "number";
}
