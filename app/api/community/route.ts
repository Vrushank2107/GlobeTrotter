import { NextResponse } from 'next/server';
import { getCommunityTrips } from '@/lib/services/tripService';

export async function GET() {
  try {
    const communityTrips = await getCommunityTrips();
    return NextResponse.json({
      success: true,
      data: communityTrips,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch community trips';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
