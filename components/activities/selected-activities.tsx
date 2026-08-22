export default function SelectedActivities({ activities }: { activities: string[] }) {
  return (
    <div className="bg-green-50 rounded-lg p-4">
      <h3 className="font-semibold text-green-900 mb-2">Selected Activities</h3>
      {activities.length === 0 ? (
        <p className="text-gray-600 text-sm">No activities selected yet</p>
      ) : (
        <ul className="space-y-1">
          {activities.map((activity, index) => (
            <li key={index} className="text-sm text-gray-700">{index + 1}. {activity}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
