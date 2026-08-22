export default function PlanningInsight({ message, type }: { message: string; type: 'warning' | 'info' | 'success' }) {
  const bgColor = {
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200'
  }[type];

  return (
    <div className={`p-4 rounded-lg border ${bgColor}`}>
      <h4 className="font-semibold mb-1">Planning Insight</h4>
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  );
}
