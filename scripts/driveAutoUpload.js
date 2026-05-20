var EXPENSES_SHEET_NAME = "Expenses";
var SETTLEMENTS_SHEET_NAME = "Settlements";

var EXPENSE_HEADERS = ["Date", "Trip Code", "Category", "Amount", "GST", "Net", "Receipt URL"];
var SETTLEMENT_HEADERS = [
  "Tour Code",
  "Bookings",
  "Collected",
  "Commission",
  "Net to Owner",
];

function doGet() {
  return json_({
    ok: true,
    service: "drive-auto-upload",
  });
}

function doPost(event) {
  try {
    var payload = parsePayload_(event);
    verifySecret_(payload.secret);

    switch (payload.action) {
      case "appendExpense":
        return json_(appendExpense_(payload.expense, payload.receipt));
      case "batchExpenses":
        return json_(batchExpenses_(payload.expenses));
      case "exportSettlement":
        return json_(exportSettlement_(payload.quarter, payload.rows));
      default:
        throw new Error("Unsupported action: " + payload.action);
    }
  } catch (error) {
    return json_(
      {
        ok: false,
        error: error.message || String(error),
      },
      500,
    );
  }
}

function appendExpense_(expense, receipt) {
  assertExpense_(expense);

  var receiptUrl = receipt ? uploadReceipt_(expense, receipt) : "";
  var expenseRow = withReceiptUrl_(expense, receiptUrl);
  appendExpenseRows_([expenseRow]);

  return {
    ok: true,
    expenseRow: expenseRow,
  };
}

function batchExpenses_(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("expenses must contain at least one item");
  }

  var expenseRows = items.map(function (item) {
    assertExpense_(item.expense);

    var receiptUrl = item.receipt ? uploadReceipt_(item.expense, item.receipt) : "";
    return withReceiptUrl_(item.expense, receiptUrl);
  });

  appendExpenseRows_(expenseRows);

  return {
    ok: true,
    inserted: expenseRows.length,
    expenseRows: expenseRows,
  };
}

function exportSettlement_(quarter, rows) {
  if (!quarter) {
    throw new Error("quarter is required");
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("rows must contain at least one settlement row");
  }

  var sheet = getSheet_(SETTLEMENTS_SHEET_NAME, SETTLEMENT_HEADERS);
  var values = rows.map(function (row) {
    return [
      required_(row.tourCode, "tourCode"),
      requiredNumber_(row.bookings, "bookings"),
      requiredNumber_(row.collected, "collected"),
      requiredNumber_(row.commission, "commission"),
      requiredNumber_(row.netToOwner, "netToOwner"),
    ];
  });

  replaceDataRows_(sheet, SETTLEMENT_HEADERS.length, values);

  return {
    ok: true,
    quarter: quarter,
    exported: values.length,
  };
}

function appendExpenseRows_(expenseRows) {
  var sheet = getSheet_(EXPENSES_SHEET_NAME, EXPENSE_HEADERS);
  var values = expenseRows.map(function (expense) {
    return [
      expense.date,
      expense.tripCode,
      expense.category,
      expense.amount,
      expense.gst,
      expense.net,
      expense.receiptUrl || "",
    ];
  });

  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, EXPENSE_HEADERS.length).setValues(values);
}

function uploadReceipt_(expense, receipt) {
  if (!receipt.base64 || !receipt.mimeType) {
    throw new Error("receipt.base64 and receipt.mimeType are required");
  }

  var folder = getOrCreateTripFolder_(expense.tripCode);
  var fileName = receipt.fileName || buildReceiptFileName_(expense, receipt.mimeType);
  var bytes = Utilities.base64Decode(receipt.base64);
  var blob = Utilities.newBlob(bytes, receipt.mimeType, fileName);
  var file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

function getOrCreateTripFolder_(tripCode) {
  var rootFolderId = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID");
  var root = rootFolderId ? DriveApp.getFolderById(rootFolderId) : DriveApp.getRootFolder();
  var folderName = String(tripCode).trim().toUpperCase();
  var matches = root.getFoldersByName(folderName);

  return matches.hasNext() ? matches.next() : root.createFolder(folderName);
}

function getSheet_(sheetName, headers) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!spreadsheetId) {
    throw new Error("SHEET_ID script property is not configured");
  }

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  ensureHeaders_(sheet, headers);

  return sheet;
}

function ensureHeaders_(sheet, headers) {
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  var currentHeaders = headerRange.getValues()[0];
  var headerMismatch = headers.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (headerMismatch) {
    headerRange.setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function replaceDataRows_(sheet, columnCount, values) {
  var lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, columnCount).clearContent();
  }

  if (values.length > 0) {
    sheet.getRange(2, 1, values.length, columnCount).setValues(values);
  }
}

function withReceiptUrl_(expense, receiptUrl) {
  return {
    date: expense.date,
    tripCode: expense.tripCode,
    category: expense.category,
    amount: expense.amount,
    gst: expense.gst,
    net: expense.net,
    description: expense.description || "",
    receiptFileName: expense.receiptFileName || "",
    receiptUrl: receiptUrl,
  };
}

function buildReceiptFileName_(expense, mimeType) {
  var extension = mimeTypeToExtension_(mimeType);
  var amount = Number(expense.amount).toFixed(2).replace(".", "-");

  return [expense.tripCode, expense.date, amount, "Receipt"].join("_") + "." + extension;
}

function mimeTypeToExtension_(mimeType) {
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

function assertExpense_(expense) {
  required_(expense.date, "date");
  required_(expense.tripCode, "tripCode");
  required_(expense.category, "category");
  requiredNumber_(expense.amount, "amount");
  requiredNumber_(expense.gst, "gst");
  requiredNumber_(expense.net, "net");
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Missing JSON request body");
  }

  return JSON.parse(event.postData.contents);
}

function verifySecret_(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty("BRIDGE_SECRET");
  if (!expected) {
    throw new Error("BRIDGE_SECRET script property is not configured");
  }

  if (secret !== expected) {
    throw new Error("Invalid bridge secret");
  }
}

function required_(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(fieldName + " is required");
  }

  return String(value).trim();
}

function requiredNumber_(value, fieldName) {
  if (typeof value !== "number" || !isFinite(value)) {
    throw new Error(fieldName + " must be a number");
  }

  return value;
}

function json_(body, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(body));
  output.setMimeType(ContentService.MimeType.JSON);

  // Apps Script web apps cannot set HTTP status codes on ContentService output.
  // statusCode is accepted so callers can keep error paths explicit.
  return output;
}
