import { prisma } from '@/lib/db/prisma';
import { Trip, Destination, ActivityCategory, ExpenseCategory, TripStatus } from '@/types';

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseDurationMinutes(durationStr: string): number {
  if (!durationStr) return 60;
  const match = durationStr.match(/(\d+)/);
  if (!match) return 60;
  const val = parseInt(match[1], 10);
  if (durationStr.toLowerCase().includes('hour')) {
    return val * 60;
  }
  return val;
}

export function mapPrismaTripToTrip(prismaTrip: any): Trip {
  const startDateObj = new Date(prismaTrip.startDate);
  const endDateObj = new Date(prismaTrip.endDate);

  const destinations = (prismaTrip.tripStops || []).map((stop: any) => ({
    id: stop.id,
    cityName: stop.destination?.name || 'Unknown',
    country: stop.destination?.country || 'Unknown',
    startDate: new Date(stop.startDate).toISOString().split('T')[0],
    endDate: new Date(stop.endDate).toISOString().split('T')[0],
    image: stop.destination?.imageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    estimatedCost: stop.destination?.averageCost ? Number(stop.destination.averageCost) : 0,
  }));

  const expenses = (prismaTrip.expenses || []).map((exp: any) => {
    let cat: 'Accommodation' | 'Transport' | 'Activities' | 'Food' | 'Misc' = 'Misc';
    const c = (exp.category || '').toLowerCase();
    if (c === 'accommodation') cat = 'Accommodation';
    else if (c === 'transport') cat = 'Transport';
    else if (c === 'activities') cat = 'Activities';
    else if (c === 'food') cat = 'Food';

    return {
      id: exp.id,
      tripId: exp.tripId,
      title: exp.name,
      category: cat,
      amount: Number(exp.amount),
      date: new Date(exp.date).toISOString().split('T')[0],
      notes: exp.notes || undefined,
    };
  });

  const spentBudget = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

  const activities = (prismaTrip.itineraryItems || []).map((item: any) => {
    const itemDateObj = new Date(item.date);
    const dayDiff = Math.max(1, Math.floor((itemDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    let catName = capitalize(item.activity?.category || 'Sightseeing') as ActivityCategory;
    if (catName === 'Sightseeing') catName = 'Sightseeing';

    return {
      id: item.id,
      itemId: item.id,
      title: item.activity?.name || 'Activity',
      category: catName,
      location: item.activity?.destination?.name || 'Destination',
      time: item.time || '10:00 AM',
      durationMinutes: parseDurationMinutes(item.duration),
      cost: item.activity?.estimatedCost ? Number(item.activity.estimatedCost) : 0,
      notes: item.notes || item.activity?.description || undefined,
      dayNumber: dayDiff,
      dateStr: itemDateObj.toISOString().split('T')[0],
      completed: false,
    };
  });

  let status: TripStatus = 'Planning';
  const st = (prismaTrip.status || '').toLowerCase();
  if (st === 'confirmed') status = 'Confirmed';
  else if (st === 'completed') status = 'Completed';
  else if (st === 'cancelled') status = 'Cancelled';

  const coverImage =
    destinations[0]?.image ||
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80';

  const tags = destinations.map((d: any) => d.cityName);
  if (tags.length === 0) tags.push('Adventure');

  return {
    id: prismaTrip.id,
    title: prismaTrip.title,
    description: `${prismaTrip.title} - ${destinations.map((d: any) => d.cityName).join(', ')}`,
    coverImage,
    startDate: startDateObj.toISOString().split('T')[0],
    endDate: endDateObj.toISOString().split('T')[0],
    destinations,
    totalBudget: Number(prismaTrip.budget),
    spentBudget,
    status,
    travelers: 2,
    tags,
    activities,
    expenses,
    smartInsights: [],
    isPublic: prismaTrip.isPublic || false,
    shareCode: prismaTrip.tripShare?.shareCode || undefined,
    authorName: prismaTrip.user?.name || 'Explorer',
    authorAvatar: prismaTrip.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    likesCount: 24,
  };
}

export function mapPrismaDestinationToDestination(prismaDest: any): Destination {
  const popularActivities = (prismaDest.activities || []).map((act: any) => ({
    name: act.name,
    category: capitalize(act.category || 'Sightseeing') as ActivityCategory,
    estCost: Number(act.estimatedCost || 0),
  }));

  const c = (prismaDest.country || '').toLowerCase();
  const n = (prismaDest.name || '').toLowerCase();

  let region = 'South Asia';
  if (
    c.includes('japan') || n.includes('tokyo') || n.includes('kyoto') || n.includes('osaka') ||
    c.includes('thailand') || n.includes('bangkok') || n.includes('phuket') ||
    c.includes('singapore') || c.includes('indonesia') || n.includes('bali') ||
    c.includes('china') || n.includes('shanghai') || c.includes('korea') || n.includes('seoul')
  ) {
    region = 'East & Southeast Asia';
  } else if (
    c.includes('france') || n.includes('paris') ||
    c.includes('switzerland') || n.includes('zurich') || n.includes('interlaken') || n.includes('zermatt') ||
    c.includes('italy') || n.includes('rome') || n.includes('venice') ||
    c.includes('spain') || n.includes('barcelona') ||
    c.includes('uk') || c.includes('united kingdom') || n.includes('london') ||
    c.includes('germany') || n.includes('berlin') ||
    c.includes('greece') || n.includes('santorini')
  ) {
    region = 'Europe';
  } else if (
    c.includes('usa') || c.includes('united states') || c.includes('america') || n.includes('new york') || n.includes('los angeles') ||
    c.includes('canada') || n.includes('toronto') || n.includes('vancouver') ||
    c.includes('mexico') || n.includes('cancun')
  ) {
    region = 'North America';
  } else if (
    c.includes('uae') || c.includes('united arab emirates') || c.includes('dubai') || n.includes('dubai') || n.includes('abu dhabi') ||
    c.includes('egypt') || n.includes('cairo') || c.includes('qatar')
  ) {
    region = 'Middle East';
  } else if (
    c.includes('australia') || n.includes('sydney') || n.includes('melbourne') ||
    c.includes('zealand') || n.includes('auckland')
  ) {
    region = 'Oceania';
  }

  const tags: string[] = ['Sightseeing'];
  if (n.includes('goa') || n.includes('bali') || n.includes('phuket') || n.includes('cancun')) {
    tags.push('Beach', 'Nature', 'Relaxation');
  } else if (n.includes('paris') || n.includes('kyoto') || n.includes('jaipur') || n.includes('rome') || n.includes('delhi')) {
    tags.push('Culture', 'History', 'Food');
  } else if (n.includes('tokyo') || n.includes('bengaluru') || n.includes('new york') || n.includes('singapore') || n.includes('mumbai')) {
    tags.push('City', 'Technology', 'Shopping', 'Food');
  } else {
    tags.push('Culture', 'City');
  }

  return {
    id: prismaDest.id,
    name: prismaDest.name,
    country: prismaDest.country,
    region,
    coverImage: prismaDest.imageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    description: prismaDest.description || '',
    popularActivities,
    avgCostPerDay: prismaDest.averageCost ? Number(prismaDest.averageCost) : 2500,
    rating: 4.8,
    tags,
  };
}

const tripInclude = {
  user: true,
  tripStops: {
    include: {
      destination: true,
    },
    orderBy: {
      orderIndex: 'asc' as const,
    },
  },
  itineraryItems: {
    include: {
      activity: {
        include: {
          destination: true,
        },
      },
    },
    orderBy: [
      { date: 'asc' as const },
      { orderIndex: 'asc' as const },
    ],
  },
  expenses: {
    orderBy: {
      date: 'asc' as const,
    },
  },
  tripShare: true,
};

export async function getTrips(): Promise<Trip[]> {
  const prismaTrips = await prisma.trip.findMany({
    include: tripInclude,
    orderBy: { createdAt: 'desc' },
  });
  return prismaTrips.map(mapPrismaTripToTrip);
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  const prismaTrip = await prisma.trip.findUnique({
    where: { id },
    include: tripInclude,
  });
  return prismaTrip ? mapPrismaTripToTrip(prismaTrip) : undefined;
}

export async function getUserTrips(userId?: string): Promise<Trip[]> {
  const where = userId ? { userId } : {};
  const prismaTrips = await prisma.trip.findMany({
    where,
    include: tripInclude,
    orderBy: { createdAt: 'desc' },
  });
  return prismaTrips.map(mapPrismaTripToTrip);
}

export async function getCommunityTrips(): Promise<Trip[]> {
  const prismaTrips = await prisma.trip.findMany({
    where: { isPublic: true },
    include: tripInclude,
    orderBy: { createdAt: 'desc' },
  });
  return prismaTrips.map(mapPrismaTripToTrip);
}

export async function getPublicTripByShareCode(shareCode: string): Promise<Trip | undefined> {
  const share = await prisma.tripShare.findFirst({
    where: { shareCode },
    include: {
      trip: {
        include: tripInclude,
      },
    },
  });
  return share?.trip ? mapPrismaTripToTrip(share.trip) : undefined;
}

export async function getDestinations(): Promise<Destination[]> {
  const prismaDestinations = await prisma.destination.findMany({
    include: {
      activities: true,
    },
  });
  return prismaDestinations.map(mapPrismaDestinationToDestination);
}
