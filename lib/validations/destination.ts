import { z } from 'zod';

export const destinationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  country: z.string().min(2, 'Country is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  averageCost: z.number().min(0).optional(),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
