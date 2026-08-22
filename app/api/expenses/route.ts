import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getTrip } from '@/lib/services/tripService';
import { ExpenseCategory } from '@prisma/client';

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch expenses';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tripId, title, name, category, amount, date, notes } = body;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }

    let prismaCategory: ExpenseCategory = ExpenseCategory.other;
    const catLower = (category || '').toLowerCase();
    if (catLower === 'accommodation') prismaCategory = ExpenseCategory.accommodation;
    else if (catLower === 'transport') prismaCategory = ExpenseCategory.transport;
    else if (catLower === 'food') prismaCategory = ExpenseCategory.food;
    else if (catLower === 'activities') prismaCategory = ExpenseCategory.activities;
    else if (catLower === 'shopping') prismaCategory = ExpenseCategory.shopping;

    const expDate = date ? new Date(date) : new Date();

    await prisma.expense.create({
      data: {
        tripId: trip.id,
        name: title || name || 'Expense',
        category: prismaCategory,
        amount: Number(amount || 0),
        date: expDate,
        notes: notes || null,
      },
    });

    const updatedTrip = await getTrip(trip.id);

    return NextResponse.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to add expense';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
