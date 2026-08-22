export default function BudgetOverview({ total, spent, remaining }: { total: number; spent: number; remaining: number }) {
  const percentage = (spent / total) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Budget Overview</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Budget</span>
          <span className="text-2xl font-bold">₹{total.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent: ₹{spent.toLocaleString()}</span>
          <span className="text-gray-600">Remaining: ₹{remaining.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
