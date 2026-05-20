import { AlertMessage, Asset, Expense } from '../types';

interface OwnerProps {
  alerts: AlertMessage[];
  assets: Asset[];
  expenses: Expense[];
}

export function Owner({ alerts, assets, expenses }: OwnerProps) {
  const activeAssets = assets.filter((asset) => asset.status === 'active').length;
  const latestExpenses = expenses.slice(0, 4);

  return (
    <section className="dashboard-grid" aria-label="Owner dashboard">
      <div className="panel hero-panel">
        <p className="eyebrow">Owner</p>
        <h2>Ownership cockpit</h2>
        <p>Track active assets, pending renewals, and the latest spending decisions.</p>
      </div>

      <div className="panel">
        <h3>Asset coverage</h3>
        <p className="big-number">
          {activeAssets}/{assets.length}
        </p>
        <p className="muted">Assets currently classified as active.</p>
      </div>

      <div className="panel">
        <h3>Priority alerts</h3>
        <ul className="stack-list">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <li key={alert.id}>
                <span>
                  <strong>{alert.title}</strong>
                  <small>{alert.message}</small>
                </span>
                <span className={`severity ${alert.severity}`}>{alert.severity}</span>
              </li>
            ))
          ) : (
            <li>No active alerts.</li>
          )}
        </ul>
      </div>

      <div className="panel wide-panel">
        <h3>Recent expenses</h3>
        <ul className="stack-list">
          {latestExpenses.map((expense) => (
            <li key={expense.id}>
              <span>
                <strong>{expense.description}</strong>
                <small>{expense.category} paid by {expense.paidBy}</small>
              </span>
              <strong>${expense.amount.toLocaleString()}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
