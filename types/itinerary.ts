// Itinerary type definitions
// These types align with the Prisma ItineraryItem model

export interface ItineraryItem {
  id: string;
  tripId: string;
  activityId: string;
  date: Date;
  time: string;
  duration: string;
  orderIndex: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryDay {
  date: Date;
  items: ItineraryItem[];
}
