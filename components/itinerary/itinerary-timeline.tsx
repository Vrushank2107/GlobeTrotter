export default function ItineraryTimeline({ activities }: { activities: any[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="relative pl-10">
            <div className="absolute left-2 w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium">{activity.name}</h4>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
