// Trip type definitions
// These types align with the Prisma Trip and TripStop models

export type TripStatus = 'planning' | 'confirmed' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: TripStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripStop {
  id: string;
  tripId: string;
  destinationId: string;
  startDate: Date;
  endDate: Date;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
