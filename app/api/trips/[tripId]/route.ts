import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrip } from '@/lib/services/tripService';

export async function GET(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);

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

    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);
    if (body.totalBudget) updateData.budget = Number(body.totalBudget);
    if (body.status) {
      const st = (body.status || '').toLowerCase();
      if (['planning', 'confirmed', 'completed', 'cancelled'].includes(st)) {
        updateData.status = st;
      }
    }
    if (typeof body.isPublic === 'boolean') updateData.isPublic = body.isPublic;

    await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
    });

    if (Array.isArray(body.destinations)) {
      await prisma.tripStop.deleteMany({ where: { tripId } });
      for (let i = 0; i < body.destinations.length; i++) {
        const dest = body.destinations[i];
        let dbDest = null;
        const targetDestId = dest.destinationId || (dest.id && !dest.id.startsWith('stop_') ? dest.id : null);
        if (targetDestId) {
          dbDest = await prisma.destination.findUnique({ where: { id: targetDestId } });
        }
        if (!dbDest && dest.cityName) {
          dbDest = await prisma.destination.findFirst({
            where: { name: { contains: dest.cityName, mode: 'insensitive' } },
          });
        }
        if (!dbDest && dest.cityName) {
          dbDest = await prisma.destination.create({
            data: {
              name: dest.cityName,
              country: dest.country || 'India',
              description: `Explore ${dest.cityName}.`,
              imageUrl: dest.image || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
              averageCost: 3500,
            },
          });
        }
        if (dbDest) {
          await prisma.tripStop.create({
            data: {
              tripId,
              destinationId: dbDest.id,
              startDate: dest.startDate ? new Date(dest.startDate) : (updateData.startDate || new Date()),
              endDate: dest.endDate ? new Date(dest.endDate) : (updateData.endDate || new Date()),
              orderIndex: i,
            },
          });
        }
      }
    }

    const updatedTrip = await getTrip(tripId);

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
  try {
    const { tripId } = await params;
    await prisma.trip.delete({
      where: { id: tripId },
    });

    return NextResponse.json({
      success: true,
      message: `Trip ${tripId} deleted successfully`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to delete trip';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
