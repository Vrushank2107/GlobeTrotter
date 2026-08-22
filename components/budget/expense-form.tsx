import { Expense } from '@/types';

export default function ExpenseForm({ onSubmit }: { onSubmit?: (expense: Omit<Expense, 'id'>) => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit({
            title: 'Sample Expense',
            category: 'Accommodation',
            amount: 100,
            date: new Date().toISOString().split('T')[0],
          });
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Name</label>
        <input type="text" className="w-full p-2 border rounded" placeholder="Enter expense name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select className="w-full p-2 border rounded">
          <option>Accommodation</option>
          <option>Transport</option>
          <option>Food</option>
          <option>Activities</option>
          <option>Misc</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input type="number" className="w-full p-2 border rounded" placeholder="Enter amount" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Expense
      </button>
    </form>
  );
}
