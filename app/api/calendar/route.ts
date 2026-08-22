import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserTrips } from '@/lib/services/tripService';
import { Activity } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');

    let userId = userIdParam || undefined;
    if (!userId) {
      const demoUser = await prisma.user.findFirst();
      if (demoUser) userId = demoUser.id;
    }

    const trips = await getUserTrips(userId);
    const calendarEvents: Array<Record<string, unknown>> = [];

    trips.forEach((trip) => {
      trip.activities.forEach((act: Activity) => {
        calendarEvents.push({
          id: act.id,
          tripId: trip.id,
          tripTitle: trip.title,
          title: act.title,
          category: act.category,
          date: act.dateStr || trip.startDate,
          time: act.time,
          cost: act.cost,
          location: act.location,
        });
      });
    });

    return NextResponse.json({
      success: true,
      data: calendarEvents,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch calendar events';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
