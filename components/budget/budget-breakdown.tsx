export default function BudgetBreakdown({ categories }: { categories: { name: string; amount: number; percentage: number }[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Budget Breakdown</h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-grow">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-gray-600">₹{category.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-4 text-sm text-gray-500">{category.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
