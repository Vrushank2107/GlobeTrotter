import { NextResponse } from 'next/server';
import { getPublicTripByShareCode } from '@/lib/services/tripService';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await params;
    const trip = await getPublicTripByShareCode(shareCode);

    if (!trip) {
      return NextResponse.json(
        { success: false, message: 'Public trip not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch public trip';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
