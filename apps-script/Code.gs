const SHEET_NAME = 'Expenses';
const HEADERS = ['id', 'category', 'description', 'amount', 'paidBy', 'createdAt', 'syncedAt'];

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || '{}');
  const expenses = payload.expenses || [];
  const sheet = getExpenseSheet_();

  if (expenses.length === 0) {
    return json_({ ok: true, appended: 0 });
  }

  const rows = expenses.map((expense) => [
    expense.id,
    expense.category,
    expense.description,
    expense.amount,
    expense.paidBy,
    expense.createdAt,
    new Date().toISOString(),
  ]);

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
  return json_({ ok: true, appended: rows.length });
}

function getExpenseSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
