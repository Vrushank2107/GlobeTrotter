// Destination type definitions placeholder
// Destination-related TypeScript types will be defined here

export interface Destination {
  id: string;
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
  popularActivities?: string[];
  averageCost?: number;
}
