import { NextResponse } from 'next/server';
import { getDestinations } from '@/lib/services/tripService';

export async function GET() {
  try {
    const destinations = await getDestinations();
    return NextResponse.json({
      success: true,
      data: destinations,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch destinations';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
