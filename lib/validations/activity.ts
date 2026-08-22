import { z } from 'zod';

export const createActivitySchema = z.object({
  name: z.string().min(2, 'Activity name is required'),
  category: z.enum([
    'sightseeing',
    'food',
    'adventure',
    'culture',
    'entertainment',
    'nature',
    'shopping',
    'Sightseeing',
    'Food',
    'Adventure',
    'Culture',
    'Entertainment',
    'Nature',
    'Shopping',
  ]),
  description: z.string().optional(),
  estimatedCost: z.number().min(0),
  duration: z.string().min(1, 'Duration is required'),
  destinationId: z.string().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
