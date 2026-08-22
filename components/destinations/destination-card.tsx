export default function DestinationCard({ name, country, image }: { name: string; country: string; image?: string }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      {image && <div className="h-48 bg-gray-200">{/* Image placeholder */}</div>}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600 text-sm">{country}</p>
      </div>
    </div>
  );
}
