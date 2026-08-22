// Expense type definitions placeholder
// Expense-related TypeScript types will be defined here

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  name: string;
  amount: number;
  date: Date;
  notes?: string;
}

export type ExpenseCategory = 
  | 'accommodation' 
  | 'transport' 
  | 'food' 
  | 'activities' 
  | 'shopping' 
  | 'other';
