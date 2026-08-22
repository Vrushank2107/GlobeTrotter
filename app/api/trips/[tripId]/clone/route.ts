import { NextResponse } from 'next/server';
import { COMMUNITY_TRIPS, INITIAL_TRIPS } from '@/lib/mock-data/mockData';

export async function POST(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const communityTrip = COMMUNITY_TRIPS.find((t) => t.id === tripId) || COMMUNITY_TRIPS[0];

  const clonedTrip = {
    ...communityTrip,
    id: `trip_cloned_${Date.now()}`,
    title: `Copy of ${communityTrip.title}`,
    status: 'Planning' as const,
    isPublic: false,
  };

  INITIAL_TRIPS.unshift(clonedTrip);

  return NextResponse.json({
    success: true,
    data: clonedTrip,
  });
}
