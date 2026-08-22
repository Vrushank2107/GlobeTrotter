export default function ActivityCard({ name, category, cost, duration }: { name: string; category: string; cost: number; duration: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-gray-600 text-sm">{category}</p>
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-500">{duration}</span>
        <span className="font-semibold">₹{cost.toLocaleString()}</span>
      </div>
    </div>
  );
}
