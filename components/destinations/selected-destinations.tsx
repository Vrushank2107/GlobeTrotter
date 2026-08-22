export default function SelectedDestinations({ destinations }: { destinations: string[] }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-2">Selected Destinations</h3>
      {destinations.length === 0 ? (
        <p className="text-gray-600 text-sm">No destinations selected yet</p>
      ) : (
        <ul className="space-y-1">
          {destinations.map((dest, index) => (
            <li key={index} className="text-sm text-gray-700">{index + 1}. {dest}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
