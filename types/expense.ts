// Expense type definitions
// These types align with the Prisma Expense model

export type ExpenseCategory =
  | 'accommodation'
  | 'transport'
  | 'food'
  | 'activities'
  | 'shopping'
  | 'other';

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  name: string;
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
