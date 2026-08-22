import { Expense } from '@/types';

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Expenses</h3>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses recorded yet</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{expense.title}</p>
                <p className="text-sm text-gray-500">{expense.category}</p>
              </div>
              <span className="font-semibold">₹{expense.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
