import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrips, getTrip } from '@/lib/services/tripService';

export async function GET() {
  try {
    const trips = await getTrips();
    return NextResponse.json({
      success: true,
      data: trips,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch trips';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Get demo user or first user from DB
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@globetrotter.com',
          passwordHash: '$2a$10$demo',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        },
      });
    }

    const startDate = body.startDate ? new Date(body.startDate) : new Date('2026-10-15');
    const endDate = body.endDate ? new Date(body.endDate) : new Date('2026-10-22');
    const budget = body.totalBudget ? Number(body.totalBudget) : 40000;

    // Create trip record in database
    const createdTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: body.title || 'New Coastal Trip',
        startDate,
        endDate,
        budget,
        status: 'planning',
        isPublic: false,
      },
    });

    // Create trip stops if destinations provided
    if (Array.isArray(body.destinations) && body.destinations.length > 0) {
      for (let i = 0; i < body.destinations.length; i++) {
        const dest = body.destinations[i];
        let dbDest = null;
        if (dest.id) {
          dbDest = await prisma.destination.findUnique({ where: { id: dest.id } });
        }
        if (!dbDest && dest.cityName) {
          dbDest = await prisma.destination.findFirst({
            where: { name: { contains: dest.cityName, mode: 'insensitive' } },
          });
        }
        if (!dbDest) {
          dbDest = await prisma.destination.findFirst();
        }

        if (dbDest) {
          await prisma.tripStop.create({
            data: {
              tripId: createdTrip.id,
              destinationId: dbDest.id,
              startDate: dest.startDate ? new Date(dest.startDate) : startDate,
              endDate: dest.endDate ? new Date(dest.endDate) : endDate,
              orderIndex: i,
            },
          });
        }
      }
    } else {
      // Default trip stop to first destination (e.g. Goa/Mumbai)
      const firstDest = await prisma.destination.findFirst();
      if (firstDest) {
        await prisma.tripStop.create({
          data: {
            tripId: createdTrip.id,
            destinationId: firstDest.id,
            startDate,
            endDate,
            orderIndex: 0,
          },
        });
      }
    }

    // Generate public share code
    await prisma.tripShare.create({
      data: {
        tripId: createdTrip.id,
        shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });

    const fullTrip = await getTrip(createdTrip.id);

    return NextResponse.json({
      success: true,
      data: fullTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to create trip';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
