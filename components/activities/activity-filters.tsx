export default function ActivityFilters() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-full">All</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Sightseeing</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Food</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Adventure</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Culture</button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Entertainment</button>
    </div>
  );
}
