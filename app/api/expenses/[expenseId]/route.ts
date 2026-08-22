import { NextResponse } from 'next/server';
import { INITIAL_TRIPS } from '@/lib/mock-data/mockData';

export async function DELETE(req: Request, { params }: { params: Promise<{ expenseId: string }> }) {
  const { expenseId } = await params;
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get('tripId');

  const trip = INITIAL_TRIPS.find((t) => t.id === tripId) || INITIAL_TRIPS[0];
  const updatedExpenses = trip.expenses.filter((e) => e.id !== expenseId);
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
}
