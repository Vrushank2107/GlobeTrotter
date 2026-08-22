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
