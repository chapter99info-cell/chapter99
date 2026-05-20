import { createPayId, paymentReference } from '../lib/payid';
import { Expense, PaymentRequest } from '../types';

interface CashierProps {
  expenses: Expense[];
}

export function Cashier({ expenses }: CashierProps) {
  const paymentRequests: PaymentRequest[] = expenses.slice(0, 4).map((expense) => {
    const payId = createPayId(expense.amount, new Date(expense.createdAt));

    return {
      id: expense.id,
      amount: expense.amount,
      payId,
      reference: paymentReference(payId, expense.description),
      status: expense.syncedAt ? 'sent' : 'draft',
    };
  });

  return (
    <section className="dashboard-grid" aria-label="Cashier dashboard">
      <div className="panel hero-panel">
        <p className="eyebrow">Cashier</p>
        <h2>Payment queue</h2>
        <p>Generate PayID references and prepare cashier handoff from expense records.</p>
      </div>

      <div className="panel wide-panel">
        <h3>Payment requests</h3>
        <ul className="stack-list payment-list">
          {paymentRequests.map((request) => (
            <li key={request.id}>
              <span>
                <strong>{request.payId}</strong>
                <small>{request.reference}</small>
              </span>
              <span>
                <strong>${request.amount.toLocaleString()}</strong>
                <small>{request.status}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h3>Cash handling notes</h3>
        <p className="muted">
          Confirm payment receipts before marking requests as paid in Supabase.
        </p>
      </div>
    </section>
  );
}
