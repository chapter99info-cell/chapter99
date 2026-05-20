export type ExpenseCategory =
  | "Fuel"
  | "Food"
  | "Accommodation"
  | "Parking"
  | "Supplies"
  | "Maintenance"
  | "Other";

export type ReceiptUploadInput = {
  /**
   * Base64-encoded file content without a data: URL prefix.
   */
  base64: string;
  mimeType: string;
  fileName?: string;
};

export type QuickExpenseDropInput = {
  tripCode: string;
  date: string | Date;
  category: ExpenseCategory | string;
  amount: number;
  gst?: number;
  net?: number;
  description?: string;
  receipt?: ReceiptUploadInput;
  pin?: string;
};

export type FormattedExpenseRow = {
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

export type SettlementExportInput = {
  quarter: string;
  rows: SettlementExportRow[];
};

type FunctionInvokeOptions = {
  body?: unknown;
};

type FunctionInvokeResult<T> = {
  data: T | null;
  error: Error | { message?: string } | null;
};

export type GoogleSheetsSupabaseClient = {
  functions: {
    invoke<T = unknown>(
      functionName: string,
      options?: FunctionInvokeOptions,
    ): Promise<FunctionInvokeResult<T>>;
  };
};

export type AppendExpenseResult = {
  ok: true;
  expenseRow: FormattedExpenseRow & { receiptUrl?: string };
};

export type BatchExpensesResult = {
  ok: true;
  inserted: number;
  expenseRows: Array<FormattedExpenseRow & { receiptUrl?: string }>;
};

export type ExportSettlementResult = {
  ok: true;
  quarter: string;
  exported: number;
};

const QUICK_EXPENSE_PIN = "9999";

export async function appendQuickExpenseDrop(
  supabase: GoogleSheetsSupabaseClient,
  input: QuickExpenseDropInput,
): Promise<AppendExpenseResult> {
  const expense = formatExpenseForSheets(input);
  return invokeSheetsFunction<AppendExpenseResult>(supabase, "sheets-append-expense", {
    ...input,
    ...expense,
    pin: input.pin ?? QUICK_EXPENSE_PIN,
    receipt: input.receipt
      ? {
          ...input.receipt,
          fileName:
            input.receipt.fileName ??
            buildReceiptFileName({
              tripCode: expense.tripCode,
              date: expense.date,
              amount: expense.amount,
              mimeType: input.receipt.mimeType,
            }),
        }
      : undefined,
  });
}

export async function syncOfflineExpenses(
  supabase: GoogleSheetsSupabaseClient,
  expenses: QuickExpenseDropInput[],
): Promise<BatchExpensesResult> {
  return invokeSheetsFunction<BatchExpensesResult>(supabase, "sheets-batch-expenses", {
    expenses: expenses.map((expense) => {
      const row = formatExpenseForSheets(expense);
      return {
        ...expense,
        ...row,
        pin: expense.pin ?? QUICK_EXPENSE_PIN,
        receipt: expense.receipt
          ? {
              ...expense.receipt,
              fileName:
                expense.receipt.fileName ??
                buildReceiptFileName({
                  tripCode: row.tripCode,
                  date: row.date,
                  amount: row.amount,
                  mimeType: expense.receipt.mimeType,
                }),
            }
          : undefined,
      };
    }),
  });
}

export async function exportQuarterlySettlement(
  supabase: GoogleSheetsSupabaseClient,
  input: SettlementExportInput,
): Promise<ExportSettlementResult> {
  return invokeSheetsFunction<ExportSettlementResult>(
    supabase,
    "sheets-export-settlement",
    input,
  );
}

export function formatExpenseForSheets(input: QuickExpenseDropInput): FormattedExpenseRow {
  const amount = roundCurrency(input.amount);
  const gst = roundCurrency(input.gst ?? amount / 11);
  const net = roundCurrency(input.net ?? amount - gst);

  return {
    date: formatSheetDate(input.date),
    tripCode: input.tripCode.trim().toUpperCase(),
    category: input.category.trim(),
    amount,
    gst,
    net,
    description: input.description?.trim() || undefined,
  };
}

export function buildReceiptFileName(input: {
  tripCode: string;
  date: string | Date;
  amount: number;
  mimeType?: string;
}): string {
  const tripCode = input.tripCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "-");
  const date = formatSheetDate(input.date);
  const amount = roundCurrency(input.amount).toFixed(2).replace(".", "-");
  const extension = mimeTypeToExtension(input.mimeType);

  return `${tripCode}_${date}_${amount}_Receipt.${extension}`;
}

function formatSheetDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }

  const normalized = date.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid expense date: ${date}`);
  }

  return parsed.toISOString().slice(0, 10);
}

function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid currency amount: ${value}`);
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function mimeTypeToExtension(mimeType?: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    default:
      return "jpg";
  }
}

async function invokeSheetsFunction<T>(
  supabase: GoogleSheetsSupabaseClient,
  functionName: string,
  body: unknown,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(functionName, { body });

  if (error) {
    throw new Error(error.message ?? `Failed to invoke ${functionName}`);
  }

  if (!data) {
    throw new Error(`${functionName} returned no data`);
  }

  return data;
}
