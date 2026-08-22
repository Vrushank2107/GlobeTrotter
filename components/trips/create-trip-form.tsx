export default function CreateTripForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
        <input type="text" className="w-full p-2 border rounded" placeholder="Enter trip name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input type="date" className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Create Trip
      </button>
    </form>
  );
}
