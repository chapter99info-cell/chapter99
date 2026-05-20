// IndexedDB offline-first expense cache for remote areas without internet
import type { OfflineExpense } from '../types/compliance';

const DB_NAME    = 'trip2talk_offline';
const DB_VERSION = 1;
const STORE      = 'expenses';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'offline_id' });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function saveExpenseOffline(expense: OfflineExpense): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).put(expense);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

export async function getUnsyncedExpenses(): Promise<OfflineExpense[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readonly');
    const index = tx.objectStore(STORE).index('synced');
    const req   = index.getAll(IDBKeyRange.only(false));
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function markExpenseSynced(offline_id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const get   = store.get(offline_id);
    get.onsuccess = () => {
      const record = get.result;
      if (record) { record.synced = true; store.put(record); }
      resolve();
    };
    get.onerror = () => reject(get.error);
  });
}

export async function getAllOfflineExpenses(): Promise<OfflineExpense[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

// Invoke device native camera and return base64 string + blob
export async function captureReceiptPhoto(): Promise<{ base64: string; blob: Blob; mimeType: string } | null> {
  return new Promise((resolve) => {
    const input      = document.createElement('input');
    input.type       = 'file';
    input.accept     = 'image/*';
    input.capture    = 'environment'; // rear camera on mobile
    input.onchange   = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const reader     = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ base64, blob: file, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}
