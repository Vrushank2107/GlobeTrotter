import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrip } from '@/lib/services/tripService';

export async function DELETE(req: Request, { params }: { params: Promise<{ expenseId: string }> }) {
  try {
    const { expenseId } = await params;
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    const existingExp = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    const targetTripId = tripId || existingExp?.tripId;

    if (existingExp) {
      await prisma.expense.delete({
        where: { id: expenseId },
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
    const errMessage = error instanceof Error ? error.message : 'Failed to delete expense';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
