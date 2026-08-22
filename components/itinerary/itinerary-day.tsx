export default function ItineraryDay({ day, date, activities }: { day: number; date: string; activities: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Day {day}</h3>
        <span className="text-gray-600">{date}</span>
      </div>
      {activities.length === 0 ? (
        <p className="text-gray-500">No activities planned</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <span className="text-gray-500">{activity.time}</span>
              <span className="font-medium">{activity.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
