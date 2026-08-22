import { z } from 'zod';

export const tripDetailsSchema = z.object({
  title: z.string().min(3, 'Trip title must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  totalBudget: z.number().min(100, 'Budget must be at least ₹100'),
  travelers: z.number().min(1, 'At least 1 traveler required'),
  tags: z.array(z.string()).min(1, 'Select at least one travel style tag'),
  coverImage: z.string().optional(),
});

export const activitySchema = z.object({
  title: z.string().min(2, 'Activity title is required'),
  category: z.enum([
    'Sightseeing',
    'Food',
    'Adventure',
    'Culture',
    'Entertainment',
    'Nature',
    'Shopping',
    'Transport',
    'Accommodation',
  ]),
  location: z.string().min(2, 'Location is required'),
  time: z.string().min(1, 'Start time is required'),
  durationMinutes: z.number().min(15, 'Duration must be at least 15 minutes'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  dayNumber: z.number().min(1, 'Day number is required'),
  notes: z.string().optional(),
});

export const expenseSchema = z.object({
  title: z.string().min(2, 'Expense title is required'),
  category: z.enum(['Accommodation', 'Transport', 'Activities', 'Food', 'Misc']),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  paidBy: z.string().optional(),
});

export type TripDetailsFormData = z.infer<typeof tripDetailsSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
