'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, Expense, Trip, Destination, UserProfile, SmartInsight } from '@/types/index';

interface TripContextType {
  user: UserProfile;
  trips: Trip[];
  destinations: Destination[];
  communityTrips: Trip[];
  activeTrip: Trip | null;
  searchQuery: string;
  loading: boolean;
  setSearchQuery: (query: string) => void;
  setActiveTripId: (id: string) => void;
  addTrip: (newTrip: Omit<Trip, 'id' | 'spentBudget' | 'activities' | 'expenses' | 'smartInsights'>) => Promise<string>;
  updateTrip: (id: string, updated: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addActivity: (tripId: string, activity: Omit<Activity, 'id'>) => Promise<void>;
  deleteActivity: (tripId: string, activityId: string) => Promise<void>;
  toggleActivityCompleted: (tripId: string, activityId: string) => void;
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (tripId: string, expenseId: string) => Promise<void>;
  cloneCommunityTrip: (communityTrip: Trip) => Promise<string>;
  calculateSmartInsights: (activities: Activity[], totalBudget: number, spentBudget: number) => SmartInsight[];
  refreshData: () => Promise<void>;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_guest',
  name: 'Traveler',
  email: 'user@globetrotter.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Traveler',
  memberType: 'Member',
  countriesVisited: 0,
  tripsPlanned: 0,
  totalBudgetSpent: 0,
  bio: 'Explorer & traveler planning multi-city adventures worldwide.',
  favoriteDestinations: [],
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [communityTrips, setCommunityTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved === 'true') {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar_collapsed', String(next));
        if (next) {
          document.body.classList.add('sidebar-collapsed');
        } else {
          document.body.classList.remove('sidebar-collapsed');
        }
      }
      return next;
    });
  };

  const safeFetchJson = async (res: Response) => {
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      return null;
    }
    return null;
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      // Fetch destinations
      const destRes = await fetch('/api/destinations');
      const destData = await safeFetchJson(destRes);
      if (destData?.success) {
        setDestinations(destData.data);
      }

      // Fetch user trips
      const tripsRes = await fetch('/api/trips');
      const tripsData = await safeFetchJson(tripsRes);
      if (tripsData?.success && Array.isArray(tripsData.data)) {
        setTrips(tripsData.data);
        if (tripsData.data.length > 0 && !activeTripId) {
          setActiveTripId(tripsData.data[0].id);
        }
      }

      // Fetch community trips
      const commRes = await fetch('/api/community');
      const commData = await safeFetchJson(commRes);
      if (commData?.success && Array.isArray(commData.data)) {
        setCommunityTrips(commData.data);
      }

      // Fetch current user
      const userRes = await fetch('/api/auth/me');
      const userData = await safeFetchJson(userRes);
      if (userData?.success && userData.data) {
        setUser(userData.data);
      }
    } catch (error) {
      console.error('Error fetching initial data from backend APIs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || null;

  const calculateSmartInsights = (activities: Activity[], totalBudget: number, spentBudget: number): SmartInsight[] => {
    const insights: SmartInsight[] = [];

    if (spentBudget > totalBudget) {
      insights.push({
        id: `ins_b_${Date.now()}`,
        type: 'over_budget',
        severity: 'critical',
        title: 'Budget Exceeded',
        message: `Your current logged expenses (₹${spentBudget.toLocaleString()}) exceed your planned budget of ₹${totalBudget.toLocaleString()} by ₹${(spentBudget - totalBudget).toLocaleString()}.`,
        suggestion: 'Consider adjusting accommodation or activity options.',
      });
    } else if (spentBudget > totalBudget * 0.85) {
      insights.push({
        id: `ins_b_warn_${Date.now()}`,
        type: 'tight_margin',
        severity: 'warning',
        title: 'Approaching Budget Limit',
        message: `You have spent ${Math.round((spentBudget / totalBudget) * 100)}% of your total trip budget.`,
        suggestion: 'Keep track of daily meal & transportation costs.',
      });
    }

    const activitiesByDay: Record<number, Activity[]> = {};
    activities.forEach((act) => {
      if (!activitiesByDay[act.dayNumber]) activitiesByDay[act.dayNumber] = [];
      activitiesByDay[act.dayNumber].push(act);
    });

    Object.entries(activitiesByDay).forEach(([dayNumStr, dayActs]) => {
      const dayNum = Number(dayNumStr);
      const totalMinutes = dayActs.reduce((sum, a) => sum + (a.durationMinutes || 60), 0);

      if (dayActs.length >= 4 || totalMinutes >= 480) {
        insights.push({
          id: `ins_day_${dayNum}_${Date.now()}`,
          type: 'heavy_day',
          severity: 'warning',
          title: `Packed Schedule on Day ${dayNum}`,
          message: `Day ${dayNum} contains ${dayActs.length} scheduled activities totaling ${(totalMinutes / 60).toFixed(1)} hours of planned duration.`,
          suggestion: 'Consider shifting one adventure activity to another day for a relaxed experience.',
          dayNumber: dayNum,
        });
      }
    });

    return insights;
  };

  const addTrip = async (newTripData: Omit<Trip, 'id' | 'spentBudget' | 'activities' | 'expenses' | 'smartInsights'>): Promise<string> => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTripData),
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        const createdTrip = data.data;
        setTrips((prev) => [createdTrip, ...prev]);
        setActiveTripId(createdTrip.id);
        return createdTrip.id;
      }
    } catch (err) {
      console.error('Failed to create trip via API:', err);
    }
    return '';
  };

  const updateTrip = async (id: string, updated: Partial<Trip>) => {
    // Optimistic local update for instant UI feedback (e.g. reordering stops)
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        setTrips((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...data.data,
                  destinations: updated.destinations || data.data.destinations,
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Failed to update trip via API:', err);
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      setTrips((prev) => prev.filter((t) => t.id !== id));
      if (activeTripId === id) {
        const remaining = trips.filter((t) => t.id !== id);
        if (remaining.length > 0) setActiveTripId(remaining[0].id);
      }
    } catch (err) {
      console.error('Failed to delete trip via API:', err);
    }
  };

  const addActivity = async (tripId: string, activityData: Omit<Activity, 'id'>) => {
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, ...activityData }),
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        setTrips((prev) => prev.map((t) => (t.id === tripId ? data.data : t)));
      }
    } catch (err) {
      console.error('Failed to add activity via API:', err);
    }
  };

  const deleteActivity = async (tripId: string, activityId: string) => {
    try {
      const res = await fetch(`/api/itinerary/${activityId}?tripId=${tripId}`, {
        method: 'DELETE',
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        setTrips((prev) => prev.map((t) => (t.id === tripId ? data.data : t)));
      }
    } catch (err) {
      console.error('Failed to delete activity via API:', err);
    }
  };

  const toggleActivityCompleted = (tripId: string, activityId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedActivities = t.activities.map((a) =>
          a.id === activityId ? { ...a, completed: !a.completed } : a
        );
        return { ...t, activities: updatedActivities };
      })
    );
  };

  const addExpense = async (tripId: string, expenseData: Omit<Expense, 'id'>) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, ...expenseData }),
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        setTrips((prev) => prev.map((t) => (t.id === tripId ? data.data : t)));
      }
    } catch (err) {
      console.error('Failed to add expense via API:', err);
    }
  };

  const deleteExpense = async (tripId: string, expenseId: string) => {
    try {
      const res = await fetch(`/api/expenses/${expenseId}?tripId=${tripId}`, {
        method: 'DELETE',
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        setTrips((prev) => prev.map((t) => (t.id === tripId ? data.data : t)));
      }
    } catch (err) {
      console.error('Failed to delete expense via API:', err);
    }
  };

  const cloneCommunityTrip = async (communityTrip: Trip): Promise<string> => {
    try {
      const res = await fetch(`/api/trips/${communityTrip.id}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await safeFetchJson(res);
      if (data?.success && data.data) {
        const cloned = data.data;
        setTrips((prev) => [cloned, ...prev]);
        setActiveTripId(cloned.id);
        return cloned.id;
      }
    } catch (err) {
      console.error('Failed to clone trip via API:', err);
    }
    return '';
  };

  return (
    <TripContext.Provider
      value={{
        user,
        trips,
        destinations,
        communityTrips,
        activeTrip,
        searchQuery,
        loading,
        setSearchQuery,
        setActiveTripId,
        addTrip,
        updateTrip,
        deleteTrip,
        addActivity,
        deleteActivity,
        toggleActivityCompleted,
        addExpense,
        deleteExpense,
        cloneCommunityTrip,
        calculateSmartInsights,
        refreshData,
        isSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
