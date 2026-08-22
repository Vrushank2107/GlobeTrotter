import { NextResponse } from 'next/server';
import { INITIAL_TRIPS } from '@/lib/mock-data/mockData';
import { Trip } from '@/types';

let storedTrips: Trip[] = [...INITIAL_TRIPS];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: storedTrips,
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
    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      title: body.title || 'New Coastal Trip',
      description: body.description || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      startDate: body.startDate || '2026-10-15',
      endDate: body.endDate || '2026-10-22',
      status: body.status || 'Planning',
      travelers: body.travelers || 2,
      totalBudget: body.totalBudget || 40000,
      spentBudget: 0,
      tags: body.tags || ['Beach', 'Culture'],
      destinations: body.destinations || [],
      activities: [],
      expenses: [],
      smartInsights: [],
    };

    storedTrips.unshift(newTrip);

    return NextResponse.json({
      success: true,
      data: newTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to create trip';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
