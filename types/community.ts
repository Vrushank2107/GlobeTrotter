// Community type definitions
// These types align with the Prisma TripShare model

export interface PublicTrip {
  id: string;
  title: string;
  userId: string;
  userName: string;
  destinations: string[];
  startDate: Date;
  endDate: Date;
  budget: number;
  activityCount: number;
  likes: number;
  createdAt: Date;
}

export interface TripShare {
  id: string;
  tripId: string;
  shareCode: string;
  expiresAt?: Date;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}
