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

type BatchExpensesRequest = {
  expenses: ExpensePayload[];
};

type BatchExpensesResponse = {
  inserted: number;
  expenseRows: Array<ExpenseRow & { receiptUrl?: string }>;
};

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    const payload = await readJsonBody<BatchExpensesRequest>(req);

    if (!Array.isArray(payload.expenses) || payload.expenses.length === 0) {
      return jsonResponse({ ok: false, error: "expenses must contain at least one item" }, 400);
    }

    const expenses = payload.expenses.map((expense) => {
      requireQuickExpensePin(expense.pin);
      validateReceipt(expense.receipt);

      return {
        expense: normalizeExpensePayload(expense),
        receipt: expense.receipt ?? null,
      };
    });

    const result = await callAppsScript<BatchExpensesResponse>("batchExpenses", {
      expenses,
    });

    return jsonResponse({
      ok: true,
      inserted: result.inserted,
      expenseRows: result.expenseRows,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
