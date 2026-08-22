// Activity type definitions placeholder
// Activity-related TypeScript types will be defined here

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
  estimatedCost: number;
  duration: string;
  cityId?: string;
}

export type ActivityCategory = 
  | 'sightseeing' 
  | 'food' 
  | 'adventure' 
  | 'culture' 
  | 'entertainment' 
  | 'nature' 
  | 'shopping';
