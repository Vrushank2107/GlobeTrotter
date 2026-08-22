// Trip type definitions placeholder
// Trip-related TypeScript types will be defined here

export interface Trip {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  startDate: Date;
  endDate: Date;
  order: number;
}
