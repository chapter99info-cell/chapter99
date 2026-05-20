import { Asset, DashboardMetric, Expense } from '../types';

interface PortfolioProps {
  assets: Asset[];
  expenses: Expense[];
  metrics: DashboardMetric[];
}

export function Portfolio({ assets, expenses, metrics }: PortfolioProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <section className="dashboard-grid" aria-label="Portfolio dashboard">
      <div className="panel hero-panel">
        <p className="eyebrow">Portfolio</p>
        <h2>Executive overview</h2>
        <p>
          Consolidated view of property assets, operating cost, and alerts across Chapter99.
        </p>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            {metric.detail ? <small>{metric.detail}</small> : null}
          </article>
        ))}
      </div>

      <div className="panel">
        <h3>Asset health</h3>
        <ul className="stack-list">
          {assets.map((asset) => (
            <li key={asset.id}>
              <span>
                <strong>{asset.name}</strong>
                <small>{asset.owner}</small>
              </span>
              <span className={`status-pill ${asset.status}`}>{asset.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h3>Expense snapshot</h3>
        <p className="big-number">${totalExpenses.toLocaleString()}</p>
        <p className="muted">Current captured expense total from local/Supabase records.</p>
      </div>
    </section>
  );
}
