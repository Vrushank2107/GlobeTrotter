export default function TripSummary({ destinations, days, budget }: { destinations: number; days: number; budget: number }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 mb-2">Trip Summary</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-600">{destinations}</p>
          <p className="text-sm text-gray-600">Destinations</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">{days}</p>
          <p className="text-sm text-gray-600">Days</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">₹{budget.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Budget</p>
        </div>
      </div>
    </div>
  );
}
