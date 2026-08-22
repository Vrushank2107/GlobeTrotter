// Activity type definitions
// These types align with the Prisma Activity model

export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'adventure'
  | 'culture'
  | 'entertainment'
  | 'nature'
  | 'shopping';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
  estimatedCost: number;
  duration: string;
  destinationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
