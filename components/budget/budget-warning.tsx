export default function BudgetWarning({ message, percentage }: { message: string; percentage: number }) {
  const severity = percentage >= 100 ? 'critical' : percentage >= 80 ? 'warning' : 'info';
  
  const bgColor = {
    critical: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }[severity];

  const textColor = {
    critical: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }[severity];

  return (
    <div className={`p-4 rounded-lg border ${bgColor}`}>
      <div className="flex items-center">
        <span className={`text-2xl mr-3 ${severity === 'critical' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️'}`}></span>
        <div>
          <h4 className={`font-semibold ${textColor}`}>Budget Alert</h4>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
