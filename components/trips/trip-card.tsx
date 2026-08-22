export default function TripCard({ title, destination, dates }: { title: string; destination: string; dates: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm">{destination}</p>
      <p className="text-gray-500 text-sm mt-2">{dates}</p>
    </div>
  );
}
