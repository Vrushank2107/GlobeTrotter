// Destination type definitions
// These types align with the Prisma Destination model

export interface Destination {
  id: string;
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
  averageCost?: number;
  createdAt: Date;
  updatedAt: Date;
}
