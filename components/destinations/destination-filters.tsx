export default function DestinationFilters() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-full">All</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Popular</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Beach</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Mountain</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">City</button>
    </div>
  );
}
