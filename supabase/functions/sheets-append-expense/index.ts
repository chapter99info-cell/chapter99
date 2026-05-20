import {
  callAppsScript,
  errorResponse,
  handleOptions,
  jsonResponse,
  normalizeExpensePayload,
  readJsonBody,
  requireQuickExpensePin,
  validateReceipt,
  type ExpensePayload,
  type ExpenseRow,
} from "../_shared/sheetsBridge.ts";

type AppendExpenseResponse = {
  expenseRow: ExpenseRow & { receiptUrl?: string };
};

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    const payload = await readJsonBody<ExpensePayload>(req);
    requireQuickExpensePin(payload.pin);
    validateReceipt(payload.receipt);

    const expenseRow = normalizeExpensePayload(payload);
    const result = await callAppsScript<AppendExpenseResponse>("appendExpense", {
      expense: expenseRow,
      receipt: payload.receipt ?? null,
    });

    return jsonResponse({
      ok: true,
      expenseRow: result.expenseRow,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
