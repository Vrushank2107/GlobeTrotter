import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrip } from '@/lib/services/tripService';

export async function DELETE(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    // Find the item first to get tripId if not supplied
    const existingItem = await prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });

    const targetTripId = tripId || existingItem?.tripId;

    if (existingItem) {
      await prisma.itineraryItem.delete({
        where: { id: itemId },
      });
    }

    if (!targetTripId) {
      return NextResponse.json({ success: false, message: 'Trip ID not specified' }, { status: 400 });
    }

    const updatedTrip = await getTrip(targetTripId);

    return NextResponse.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to delete activity';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
