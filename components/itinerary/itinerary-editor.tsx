import { Activity } from '@/types';

export default function ItineraryEditor({ activities, onUpdate }: { activities?: Activity[]; onUpdate?: (activities: Activity[]) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Edit Itinerary ({activities?.length || 0} items)</h3>
      <div className="border rounded-lg p-4">
        <p className="text-gray-600">Itinerary editor timeline view</p>
      </div>
    </div>
  );
}
