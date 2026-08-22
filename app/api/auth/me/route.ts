import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    let dbUser = await prisma.user.findFirst();
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: 'Nirmal Purja',
          email: 'demo@globetrotter.com',
          passwordHash: '$2a$10$demo',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
      });
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

    return NextResponse.json({
      success: true,
      data: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        memberType: 'Pro Member',
        countriesVisited: 12,
        tripsPlanned,
        totalBudgetSpent: Number(expensesSum._sum.amount || 385000),
        bio: 'High-altitude mountaineer & explorer. Always looking for the next ridge to cross.',
        favoriteDestinations: ['Goa, India', 'Tokyo, Japan', 'Kathmandu, Nepal', 'Paris, France'],
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
