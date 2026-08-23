import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    let dbUser = null;

    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

    if (!dbUser) {
      dbUser = await prisma.user.findFirst();
    }

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please login or register.' },
        { status: 401 }
      );
    }

    const tripsPlanned = await prisma.trip.count({
      where: { userId: dbUser.id },
    });

    const expensesSum = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        trip: { userId: dbUser.id },
      },
    });

    const userStops = await prisma.tripStop.findMany({
      where: { trip: { userId: dbUser.id } },
      include: { destination: true },
    });

    const countriesSet = new Set(userStops.map((s) => s.destination?.country).filter(Boolean));
    const countriesVisited = countriesSet.size;

    const favoriteDestinations = Array.from(
      new Set(userStops.map((s) => `${s.destination?.name}, ${s.destination?.country}`).filter(Boolean))
    );

    return NextResponse.json({
      success: true,
      data: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbUser.name)}`,
        memberType: 'Pro Member',
        countriesVisited,
        tripsPlanned,
        totalBudgetSpent: Number(expensesSum._sum.amount || 0),
        bio: 'Explorer & traveler planning multi-city adventures worldwide.',
        favoriteDestinations,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
