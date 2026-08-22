import { INITIAL_TRIPS, COMMUNITY_TRIPS, INITIAL_DESTINATIONS } from '@/lib/mock-data/mockData';
import { Trip, Destination } from '@/types';

export async function getTrips(): Promise<Trip[]> {
  return INITIAL_TRIPS;
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  return INITIAL_TRIPS.find((t) => t.id === id);
}

export async function getUserTrips(_userId?: string): Promise<Trip[]> {
  return INITIAL_TRIPS;
}

export async function getCommunityTrips(): Promise<Trip[]> {
  return COMMUNITY_TRIPS;
}

export async function getPublicTripByShareCode(shareCode: string): Promise<Trip | undefined> {
  return COMMUNITY_TRIPS.find((t) => t.id === shareCode) || INITIAL_TRIPS[0];
}

export async function getDestinations(): Promise<Destination[]> {
  return INITIAL_DESTINATIONS;
}
