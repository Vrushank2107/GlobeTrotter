'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, Expense, Trip, Destination, UserProfile, SmartInsight } from '../types';
import { INITIAL_TRIPS, INITIAL_DESTINATIONS, INITIAL_USER, COMMUNITY_TRIPS } from '../data/mockData';

interface TripContextType {
  user: UserProfile;
  trips: Trip[];
  destinations: Destination[];
  communityTrips: Trip[];
  activeTrip: Trip | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveTripId: (id: string) => void;
  addTrip: (newTrip: Omit<Trip, 'id' | 'spentBudget' | 'activities' | 'expenses' | 'smartInsights'>) => string;
  updateTrip: (id: string, updated: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addActivity: (tripId: string, activity: Omit<Activity, 'id'>) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  toggleActivityCompleted: (tripId: string, activityId: string) => void;
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
  cloneCommunityTrip: (communityTrip: Trip) => string;
  calculateSmartInsights: (activities: Activity[], totalBudget: number, spentBudget: number) => SmartInsight[];
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<UserProfile>(INITIAL_USER);
  const [trips, setTrips] = useState<Trip[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('globetrotter_trips');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_TRIPS;
  });

  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [communityTrips] = useState<Trip[]>(COMMUNITY_TRIPS);
  const [activeTripId, setActiveTripId] = useState<string>('trip_goa_01');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
    }
  }, [trips]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || null;

  const calculateSmartInsights = (activities: Activity[], totalBudget: number, spentBudget: number): SmartInsight[] => {
    const insights: SmartInsight[] = [];

    // 1. Budget check
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

    // 2. Heavy day check (more than 4 activities or total duration > 8 hours in a day)
    const activitiesByDay: Record<number, Activity[]> = {};
    activities.forEach((act) => {
      if (!activitiesByDay[act.dayNumber]) activitiesByDay[act.dayNumber] = [];
      activitiesByDay[act.dayNumber].push(act);
    });

    Object.entries(activitiesByDay).forEach(([dayNumStr, dayActs]) => {
      const dayNum = Number(dayNumStr);
      const totalMinutes = dayActs.reduce((sum, a) => sum + a.durationMinutes, 0);

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

  const addTrip = (newTripData: Omit<Trip, 'id' | 'spentBudget' | 'activities' | 'expenses' | 'smartInsights'>): string => {
    const id = `trip_custom_${Date.now()}`;
    const newTrip: Trip = {
      ...newTripData,
      id,
      spentBudget: 0,
      activities: [],
      expenses: [],
      smartInsights: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(id);
    return id;
  };

  const updateTrip = (id: string, updated: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const merged = { ...t, ...updated };
        merged.smartInsights = calculateSmartInsights(merged.activities, merged.totalBudget, merged.spentBudget);
        return merged;
      })
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (activeTripId === id) {
      const remaining = trips.filter((t) => t.id !== id);
      if (remaining.length > 0) setActiveTripId(remaining[0].id);
    }
  };

  const addActivity = (tripId: string, activityData: Omit<Activity, 'id'>) => {
    const actId = `act_${Date.now()}`;
    const newActivity: Activity = { ...activityData, id: actId };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedActivities = [...t.activities, newActivity];
        const updatedInsights = calculateSmartInsights(updatedActivities, t.totalBudget, t.spentBudget);
        return {
          ...t,
          activities: updatedActivities,
          smartInsights: updatedInsights,
        };
      })
    );
  };

  const deleteActivity = (tripId: string, activityId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedActivities = t.activities.filter((a) => a.id !== activityId);
        const updatedInsights = calculateSmartInsights(updatedActivities, t.totalBudget, t.spentBudget);
        return {
          ...t,
          activities: updatedActivities,
          smartInsights: updatedInsights,
        };
      })
    );
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

  const addExpense = (tripId: string, expenseData: Omit<Expense, 'id'>) => {
    const expId = `exp_${Date.now()}`;
    const newExpense: Expense = { ...expenseData, id: expId, tripId };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedExpenses = [...t.expenses, newExpense];
        const newSpentBudget = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
        const updatedInsights = calculateSmartInsights(t.activities, t.totalBudget, newSpentBudget);
        return {
          ...t,
          expenses: updatedExpenses,
          spentBudget: newSpentBudget,
          smartInsights: updatedInsights,
        };
      })
    );
  };

  const deleteExpense = (tripId: string, expenseId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedExpenses = t.expenses.filter((e) => e.id !== expenseId);
        const newSpentBudget = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
        const updatedInsights = calculateSmartInsights(t.activities, t.totalBudget, newSpentBudget);
        return {
          ...t,
          expenses: updatedExpenses,
          spentBudget: newSpentBudget,
          smartInsights: updatedInsights,
        };
      })
    );
  };

  const cloneCommunityTrip = (communityTrip: Trip): string => {
    const newId = `trip_copied_${Date.now()}`;
    const clonedTrip: Trip = {
      ...communityTrip,
      id: newId,
      title: `${communityTrip.title} (Copy)`,
      status: 'Planning',
      copiedFrom: communityTrip.title,
      isPublic: false,
    };
    setTrips((prev) => [clonedTrip, ...prev]);
    setActiveTripId(newId);
    return newId;
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
