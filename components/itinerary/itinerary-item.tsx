export default function ItineraryItem({ time, name, duration, cost }: { time: string; name: string; duration: string; cost: number }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm font-medium text-gray-600">{time}</span>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-gray-500">{duration}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="font-semibold">₹{cost.toLocaleString()}</span>
      </div>
    </div>
  );
}
