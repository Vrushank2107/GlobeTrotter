import { Trip } from '@/types';

export default function TripCalendar({ trip }: { trip?: Trip }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">{trip ? trip.title : 'Trip'} Calendar</h3>
      <div className="border rounded-lg p-4">
        <p className="text-gray-600">Calendar schedule view for activities</p>
      </div>
    </div>
  );
}
