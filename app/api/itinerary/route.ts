import { NextResponse } from 'next/server';
import { INITIAL_TRIPS } from '@/lib/mock-data/mockData';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_TRIPS[0].activities });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tripId, ...activityData } = body;

    const trip = INITIAL_TRIPS.find((t) => t.id === tripId) || INITIAL_TRIPS[0];
    const newActivity = {
      id: `act_${Date.now()}`,
      ...activityData,
    };

    const updatedTrip = {
      ...trip,
      activities: [newActivity, ...trip.activities],
    };

    return NextResponse.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to add activity';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
