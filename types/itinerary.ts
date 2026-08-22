// Itinerary type definitions placeholder
// Itinerary-related TypeScript types will be defined here

export interface ItineraryItem {
  id: string;
  tripId: string;
  activityId: string;
  date: Date;
  time: string;
  duration: string;
  order: number;
  notes?: string;
}

export interface ItineraryDay {
  date: Date;
  items: ItineraryItem[];
}
