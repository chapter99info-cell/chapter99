const MASTER_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('MASTER_FOLDER_ID');
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const SECRET_TOKEN = PropertiesService.getScriptProperties().getProperty('SECRET_TOKEN');

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  if (payload.token !== SECRET_TOKEN) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  if (payload.action === 'append_expense') return appendExpense(payload);
  if (payload.action === 'batch_expenses') return batchExpenses(payload.rows || []);
  if (payload.action === 'export_settlement') return exportSettlement(payload.settlement);

  return json({ success: false, error: 'Unknown action' }, 400);
}

function appendExpense(payload) {
  const sheet = getSheet('Expenses');
  const row = payload.row || {};
  let receiptUrl = row.receipt_url || '';

  if (payload.file_base64) {
    receiptUrl = uploadReceipt(payload.file_base64, payload.mime_type, payload.trip_id, payload.date, payload.amount);
  }

  sheet.appendRow([
    row.date,
    row.trip_code,
    row.category,
    row.amount,
    row.gst,
    row.net,
    receiptUrl,
    row.notes,
    new Date(),
  ]);

  return json({ success: true, receipt_url: receiptUrl });
}

function batchExpenses(rows) {
  const sheet = getSheet('Expenses');
  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 8).setValues(rows.map((row) => [
      row.date,
      row.trip_code,
      row.category,
      row.amount,
      row.gst,
      row.net,
      row.receipt_url,
      row.notes,
    ]));
  }
  return json({ success: true, inserted: rows.length });
}

function exportSettlement(settlement) {
  const sheet = getSheet('Settlements');
  sheet.appendRow([
    settlement.tour_code,
    settlement.title,
    settlement.departure_date,
    settlement.total_bookings,
    settlement.total_collected,
    settlement.total_commissions_due,
    settlement.net_settlement_owner,
    settlement.lead_staff_name,
    new Date(),
  ]);
  return json({ success: true });
}

function uploadReceipt(base64, mimeType, tripId, date, amount) {
  const folder = DriveApp.getFolderById(MASTER_FOLDER_ID);
  const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType || 'image/jpeg', `${tripId || 'UNASSIGNED'}_${date}_${amount}.jpg`);
  return folder.createFile(blob).getUrl();
}

function getSheet(name) {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function json(body, status) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status || 200, ...body }))
    .setMimeType(ContentService.MimeType.JSON);
}
