import { NextResponse } from 'next/server';
import { INITIAL_TRIPS, COMMUNITY_TRIPS } from '@/lib/mock-data/mockData';

export async function GET(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const allTrips = [...INITIAL_TRIPS, ...COMMUNITY_TRIPS];
  const trip = allTrips.find((t) => t.id === tripId);

  if (!trip) {
    return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: trip,
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const body = await req.json();
    const trip = INITIAL_TRIPS.find((t) => t.id === tripId) || INITIAL_TRIPS[0];
    const updatedTrip = { ...trip, ...body };

    return NextResponse.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update trip';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  return NextResponse.json({
    success: true,
    message: `Trip ${tripId} deleted successfully`,
  });
}
