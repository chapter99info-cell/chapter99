import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Cashier } from './components/Cashier';
import { Owner } from './components/Owner';
import { Portfolio } from './components/Portfolio';
import { Staff } from './components/Staff';
import { SuperAdmin } from './components/SuperAdmin';
import { assetExpiryAlerts, classifyAsset } from './lib/alert';
import { addExpense, listExpenses } from './lib/expenseDb';
import { notifyAlert } from './lib/notify';
import { summarizeSync, syncExpenses } from './lib/syncService';
import { Asset, DashboardMetric, Expense, PinRoute, SyncResult, UserRole } from './types';

const PIN_ROUTES: PinRoute[] = [
  { pin: '1111', role: 'portfolio', label: 'Portfolio' },
  { pin: '2222', role: 'owner', label: 'Owner' },
  { pin: '3333', role: 'staff', label: 'Staff' },
  { pin: '4444', role: 'cashier', label: 'Cashier' },
  { pin: '9999', role: 'superadmin', label: 'Super Admin' },
];

const demoExpenses: Expense[] = [
  {
    id: 'demo-expense-1',
    category: 'Maintenance',
    description: 'Pool pump service',
    amount: 1250,
    paidBy: 'Nok',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-expense-2',
    category: 'Utilities',
    description: 'Electricity top-up',
    amount: 2840,
    paidBy: 'Cashier',
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

const demoAssets: Asset[] = [
  classifyAsset({
    id: 'asset-1',
    name: 'Villa insurance',
    owner: 'Owner A',
    expiryDate: new Date(Date.now() + 20 * 86_400_000).toISOString().slice(0, 10),
  }),
  classifyAsset({
    id: 'asset-2',
    name: 'Rental license',
    owner: 'Owner B',
    expiryDate: new Date(Date.now() + 120 * 86_400_000).toISOString().slice(0, 10),
  }),
  classifyAsset({
    id: 'asset-3',
    name: 'Vehicle registration',
    owner: 'Operations',
    expiryDate: new Date(Date.now() - 5 * 86_400_000).toISOString().slice(0, 10),
  }),
];

function roleLabel(role: UserRole): string {
  return PIN_ROUTES.find((route) => route.role === role)?.label ?? role;
}

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [pinError, setPinError] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [syncMessage, setSyncMessage] = useState('Ready to sync.');

  const alerts = useMemo(() => assetExpiryAlerts(demoAssets), []);
  const metrics = useMemo<DashboardMetric[]>(
    () => [
      { label: 'Assets', value: String(demoAssets.length), detail: 'Tracked records' },
      { label: 'Alerts', value: String(alerts.length), detail: 'Renewal and expiry' },
      {
        label: 'Expenses',
        value: `$${expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}`,
        detail: 'Current captured total',
      },
    ],
    [alerts.length, expenses],
  );

  useEffect(() => {
    void listExpenses().then((storedExpenses) => {
      if (storedExpenses.length > 0) {
        setExpenses(storedExpenses);
      }
    });
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      void notifyAlert(alerts[0]);
    }
  }, [alerts]);

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedPin = String(formData.get('pin') ?? '');
    const route = PIN_ROUTES.find((candidate) => candidate.pin === submittedPin);

    if (!route) {
      setPinError('Invalid PIN. Try one of the configured role PINs.');
      return;
    }

    setPinError('');
    setRole(route.role);
  }

  async function handleAddExpense(expense: Omit<Expense, 'id' | 'createdAt'>) {
    const nextExpense = await addExpense(expense);
    setExpenses((currentExpenses) => [nextExpense, ...currentExpenses]);
  }

  async function handleSync(): Promise<SyncResult> {
    const result = await syncExpenses(expenses);
    setSyncMessage(summarizeSync(result));
    return result;
  }

  function renderDashboard() {
    if (!role) {
      return (
        <section className="pin-card" aria-label="PIN role router">
          <p className="eyebrow">Chapter99</p>
          <h1>Enter role PIN</h1>
          <p className="muted">Use the configured PIN router to open one of five role dashboards.</p>
          <form onSubmit={handlePinSubmit}>
            <input
              aria-label="PIN"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={8}
              name="pin"
              placeholder="PIN"
              required
              type="password"
            />
            <button type="submit">Continue</button>
          </form>
          {pinError ? <p className="error-text">{pinError}</p> : null}
          <div className="pin-hints" aria-label="Demo PINs">
            {PIN_ROUTES.map((route) => (
              <span key={route.role}>{route.label}: {route.pin}</span>
            ))}
          </div>
        </section>
      );
    }

    switch (role) {
      case 'portfolio':
        return <Portfolio assets={demoAssets} expenses={expenses} metrics={metrics} />;
      case 'owner':
        return <Owner alerts={alerts} assets={demoAssets} expenses={expenses} />;
      case 'staff':
        return <Staff expenses={expenses} onAddExpense={handleAddExpense} />;
      case 'cashier':
        return <Cashier expenses={expenses} />;
      case 'superadmin':
        return <SuperAdmin onSync={handleSync} syncMessage={syncMessage} />;
    }
  }

  return (
    <main className="app-shell">
      <nav className="top-bar">
        <span className="brand">Chapter99 Ops</span>
        {role ? (
          <div className="session-controls">
            <span>{roleLabel(role)}</span>
            <button type="button" onClick={() => setRole(null)}>
              Sign out
            </button>
          </div>
        ) : null}
      </nav>
      {renderDashboard()}
    </main>
  );
}
