import { NextResponse } from 'next/server';
import { INITIAL_DESTINATIONS } from '@/lib/mock-data/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: INITIAL_DESTINATIONS,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch destinations';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
