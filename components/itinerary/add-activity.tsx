import { Activity } from '@/types';

export default function AddActivity({ onAdd }: { onAdd?: (activity: Omit<Activity, 'id'>) => void }) {
  return (
    <button
      onClick={() =>
        onAdd?.({
          title: 'New Activity',
          category: 'Sightseeing',
          location: 'City Center',
          time: '10:00 AM',
          durationMinutes: 60,
          cost: 500,
          dayNumber: 1,
        })
      }
      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
    >
      + Add Activity
    </button>
  );
}
