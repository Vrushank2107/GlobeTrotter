import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrip } from '@/lib/services/tripService';
import { ActivityCategory } from '@prisma/client';

export async function GET() {
  try {
    const trip = await prisma.trip.findFirst({
      include: {
        itineraryItems: {
          include: {
            activity: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: trip?.itineraryItems || [] });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch itinerary';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tripId, title, category, location, time, durationMinutes, cost, dayNumber, notes } = body;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }

    const itemDate = new Date(trip.startDate);
    const dayOffset = (dayNumber || 1) - 1;
    itemDate.setDate(itemDate.getDate() + dayOffset);

    // Map category to Prisma enum
    let prismaCategory: ActivityCategory = ActivityCategory.sightseeing;
    const catLower = (category || '').toLowerCase();
    if (catLower === 'food') prismaCategory = ActivityCategory.food;
    else if (catLower === 'adventure') prismaCategory = ActivityCategory.adventure;
    else if (catLower === 'culture') prismaCategory = ActivityCategory.culture;
    else if (catLower === 'entertainment') prismaCategory = ActivityCategory.entertainment;
    else if (catLower === 'nature') prismaCategory = ActivityCategory.nature;
    else if (catLower === 'shopping') prismaCategory = ActivityCategory.shopping;

    // Create or find activity
    let activity = await prisma.activity.findFirst({
      where: { name: title },
    });

    if (!activity) {
      let dest = null;
      if (location) {
        dest = await prisma.destination.findFirst({
          where: { name: { contains: location, mode: 'insensitive' } },
        });
      }
      if (!dest) {
        dest = await prisma.destination.findFirst();
      }

      activity = await prisma.activity.create({
        data: {
          name: title || 'Activity',
          category: prismaCategory,
          description: notes || '',
          estimatedCost: Number(cost || 0),
          duration: `${durationMinutes || 60} mins`,
          destinationId: dest?.id || null,
        },
      });
    }

    const itemCount = await prisma.itineraryItem.count({
      where: { tripId: trip.id, date: itemDate },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: trip.id,
        activityId: activity.id,
        date: itemDate,
        time: time || '10:00 AM',
        duration: `${durationMinutes || 60} mins`,
        orderIndex: itemCount,
        notes: notes || null,
      },
    });

    const updatedTrip = await getTrip(trip.id);

    return NextResponse.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to add activity';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
