import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getPublicTripByShareCode } from '@/lib/services/tripService';
import { cookies } from 'next/headers';

export async function POST(req: Request, { params }: { params: Promise<{ shareCode: string }> }) {
  try {
    const { shareCode } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    // Get the public trip by share code
    const sourceTrip = await getPublicTripByShareCode(shareCode);

    if (!sourceTrip) {
      return NextResponse.json({ success: false, message: 'Shared trip not found or expired' }, { status: 404 });
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

    // Get the full source trip with all relations
    const fullSourceTrip = await prisma.trip.findUnique({
      where: { id: sourceTrip.id },
      include: {
        tripStops: true,
        itineraryItems: true,
        expenses: true,
      },
    });

    if (!fullSourceTrip) {
      return NextResponse.json({ success: false, message: 'Source trip data not found' }, { status: 404 });
    }

    const clonedTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: `Copy of ${fullSourceTrip.title}`,
        startDate: fullSourceTrip.startDate,
        endDate: fullSourceTrip.endDate,
        budget: fullSourceTrip.budget,
        status: 'planning',
        isPublic: false,
      },
    });

    // Copy trip stops
    for (const stop of fullSourceTrip.tripStops) {
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
    for (const item of fullSourceTrip.itineraryItems) {
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
    for (const exp of fullSourceTrip.expenses) {
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

    // Generate share code for the cloned trip
    await prisma.tripShare.create({
      data: {
        tripId: clonedTrip.id,
        shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });

    // Return the cloned trip data
    const clonedTripData = await prisma.trip.findUnique({
      where: { id: clonedTrip.id },
      include: {
        user: true,
        tripStops: {
          include: {
            destination: true,
          },
          orderBy: {
            orderIndex: 'asc' as const,
          },
        },
        itineraryItems: {
          include: {
            activity: {
              include: {
                destination: true,
              },
            },
          },
          orderBy: [
            { date: 'asc' as const },
            { orderIndex: 'asc' as const },
          ],
        },
        expenses: {
          orderBy: {
            date: 'asc' as const,
          },
        },
        tripShare: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: clonedTripData,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to clone shared trip';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}