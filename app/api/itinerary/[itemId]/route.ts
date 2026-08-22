import { NextResponse } from 'next/server';
import { INITIAL_TRIPS } from '@/lib/mock-data/mockData';

export async function DELETE(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get('tripId');

  const trip = INITIAL_TRIPS.find((t) => t.id === tripId) || INITIAL_TRIPS[0];
  const updatedActivities = trip.activities.filter((a) => a.id !== itemId);

  const updatedTrip = {
    ...trip,
    activities: updatedActivities,
  };

  return NextResponse.json({
    success: true,
    data: updatedTrip,
  });
}
