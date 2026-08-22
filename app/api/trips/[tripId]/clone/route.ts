import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrip } from '@/lib/services/tripService';
import { cookies } from 'next/headers';

export async function POST(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    const sourceTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        tripStops: true,
        itineraryItems: true,
        expenses: true,
      },
    });

    if (!sourceTrip) {
      return NextResponse.json({ success: false, message: 'Source trip not found' }, { status: 404 });
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const clonedTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: `Copy of ${sourceTrip.title}`,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        budget: sourceTrip.budget,
        status: 'planning',
        isPublic: false,
      },
    });

    // Copy trip stops
    for (const stop of sourceTrip.tripStops) {
      await prisma.tripStop.create({
        data: {
          tripId: clonedTrip.id,
          destinationId: stop.destinationId,
          startDate: stop.startDate,
          endDate: stop.endDate,
          orderIndex: stop.orderIndex,
        },
      });
    }

    // Copy itinerary items
    for (const item of sourceTrip.itineraryItems) {
      await prisma.itineraryItem.create({
        data: {
          tripId: clonedTrip.id,
          activityId: item.activityId,
          date: item.date,
          time: item.time,
          duration: item.duration,
          orderIndex: item.orderIndex,
          notes: item.notes,
        },
      });
    }

    // Copy expenses
    for (const exp of sourceTrip.expenses) {
      await prisma.expense.create({
        data: {
          tripId: clonedTrip.id,
          category: exp.category,
          name: exp.name,
          amount: exp.amount,
          date: exp.date,
          notes: exp.notes,
        },
      });
    }

    // Generate share code
    await prisma.tripShare.create({
      data: {
        tripId: clonedTrip.id,
        shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });

    const fullTrip = await getTrip(clonedTrip.id);

    return NextResponse.json({
      success: true,
      data: fullTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to clone trip';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
