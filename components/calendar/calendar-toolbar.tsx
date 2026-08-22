export default function CalendarToolbar({ onPrevious, onNext, onToday }: { onPrevious: () => void; onNext: () => void; onToday: () => void }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <button onClick={onPrevious} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
        <button onClick={onToday} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Today</button>
        <button onClick={onNext} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
      </div>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Month</button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Week</button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Day</button>
      </div>
    </div>
  );
}
