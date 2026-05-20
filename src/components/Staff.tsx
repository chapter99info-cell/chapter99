import { Expense } from '../types';

interface StaffProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
}

export function Staff({ expenses, onAddExpense }: StaffProps) {
  async function handleSubmit(formData: FormData) {
    await onAddExpense({
      category: String(formData.get('category') ?? 'General'),
      description: String(formData.get('description') ?? 'Staff expense'),
      amount: Number(formData.get('amount') ?? 0),
      paidBy: String(formData.get('paidBy') ?? 'Staff'),
    });
  }

  return (
    <section className="dashboard-grid" aria-label="Staff dashboard">
      <div className="panel hero-panel">
        <p className="eyebrow">Staff</p>
        <h2>Daily operations</h2>
        <p>Capture expenses and keep operating records ready for sync.</p>
      </div>

      <form className="panel form-panel" action={handleSubmit}>
        <h3>Add expense</h3>
        <label>
          Category
          <input name="category" placeholder="Maintenance" required />
        </label>
        <label>
          Description
          <input name="description" placeholder="Pump service" required />
        </label>
        <label>
          Amount
          <input name="amount" min="0" placeholder="1200" step="0.01" type="number" required />
        </label>
        <label>
          Paid by
          <input name="paidBy" placeholder="Team member" required />
        </label>
        <button type="submit">Save expense</button>
      </form>

      <div className="panel">
        <h3>Latest entries</h3>
        <ul className="stack-list">
          {expenses.slice(0, 5).map((expense) => (
            <li key={expense.id}>
              <span>
                <strong>{expense.description}</strong>
                <small>{expense.category}</small>
              </span>
              <strong>${expense.amount.toLocaleString()}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
