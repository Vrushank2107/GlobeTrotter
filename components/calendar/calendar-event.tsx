export default function CalendarEvent({ title, time, location }: { title: string; time: string; location?: string }) {
  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded-r">
      <h4 className="font-medium text-blue-900">{title}</h4>
      <p className="text-sm text-blue-700">{time}</p>
      {location && <p className="text-sm text-blue-600">{location}</p>}
    </div>
  );
}
