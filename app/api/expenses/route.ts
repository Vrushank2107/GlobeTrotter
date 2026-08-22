import { NextResponse } from 'next/server';
import { INITIAL_TRIPS } from '@/lib/mock-data/mockData';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_TRIPS[0].expenses });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tripId, ...expenseData } = body;

    const trip = INITIAL_TRIPS.find((t) => t.id === tripId) || INITIAL_TRIPS[0];
    const newExpense = {
      id: `exp_${Date.now()}`,
      tripId: tripId || trip.id,
      ...expenseData,
    };

    const updatedExpenses = [newExpense, ...trip.expenses];
    const newSpentBudget = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);

    const updatedTrip = {
      ...trip,
      expenses: updatedExpenses,
      spentBudget: newSpentBudget,
    };

    return NextResponse.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to add expense';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
