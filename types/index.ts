export type ActivityCategory =
  | 'Sightseeing'
  | 'Food'
  | 'Adventure'
  | 'Culture'
  | 'Entertainment'
  | 'Nature'
  | 'Shopping'
  | 'Transport'
  | 'Accommodation';

export interface Activity {
  id: string;
  itemId?: string;
  title: string;
  category: ActivityCategory;
  location: string;
  time: string; // e.g. "10:30 AM"
  durationMinutes: number;
  cost: number;
  notes?: string;
  dayNumber: number; // 1, 2, 3...
  dateStr?: string; // e.g. "2026-10-15"
  completed?: boolean;
}

export interface TripStop {
  id: string;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  image: string;
  estimatedCost: number;
}

export type ExpenseCategory = 'Accommodation' | 'Transport' | 'Activities' | 'Food' | 'Misc';

export interface Expense {
  id: string;
  tripId?: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paidBy?: string;
}

export interface SmartInsight {
  id: string;
  type: 'schedule_overlap' | 'heavy_day' | 'over_budget' | 'tight_margin';
  severity: 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  suggestion?: string;
  dayNumber?: number;
}

export type TripStatus = 'Planning' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  destinations: TripStop[];
  totalBudget: number;
  spentBudget: number;
  status: TripStatus;
  travelers: number;
  tags: string[];
  activities: Activity[];
  expenses: Expense[];
  smartInsights: SmartInsight[];
  isPublic?: boolean;
  shareCode?: string;
  copiedFrom?: string;
  authorName?: string;
  authorAvatar?: string;
  likesCount?: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  coverImage: string;
  description: string;
  popularActivities: { name: string; category: ActivityCategory; estCost: number }[];
  avgCostPerDay: number;
  rating: number;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberType: string;
  countriesVisited: number;
  tripsPlanned: number;
  totalBudgetSpent: number;
  bio: string;
  favoriteDestinations: string[];
}
