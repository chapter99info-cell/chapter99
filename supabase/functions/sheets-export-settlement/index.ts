import {
  callAppsScript,
  errorResponse,
  handleOptions,
  jsonResponse,
  readJsonBody,
  validateSettlementRows,
  type SettlementExportRow,
} from "../_shared/sheetsBridge.ts";

type ExportSettlementRequest = {
  quarter: string;
  rows: SettlementExportRow[];
};

type ExportSettlementResponse = {
  quarter: string;
  exported: number;
};

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    const payload = await readJsonBody<ExportSettlementRequest>(req);

    if (!payload.quarter?.trim()) {
      return jsonResponse({ ok: false, error: "quarter is required" }, 400);
    }

    const rows = validateSettlementRows(payload.rows);
    const quarter = payload.quarter.trim().toUpperCase();
    const result = await callAppsScript<ExportSettlementResponse>("exportSettlement", {
      quarter,
      rows,
    });

    return jsonResponse({
      ok: true,
      quarter: result.quarter,
      exported: result.exported,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
