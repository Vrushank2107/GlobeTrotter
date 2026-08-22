import { PrismaClient, ActivityCategory, ExpenseCategory, TripStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (for development only)
  await prisma.itineraryItem.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.tripShare.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@globetrotter.com',
      passwordHash: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  });
  console.log('Created demo user');

  // Create destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Mumbai',
        country: 'India',
        description: 'The financial capital of India, known for Bollywood, beaches, and vibrant street life.',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
        averageCost: 2500,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Goa',
        country: 'India',
        description: 'Famous for its beaches, Portuguese heritage, and vibrant nightlife.',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
        averageCost: 2000,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Bengaluru',
        country: 'India',
        description: 'The IT hub of India, known for its pleasant climate and tech culture.',
        imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
        averageCost: 2200,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Delhi',
        country: 'India',
        description: 'The capital city, rich in history with monuments like Red Fort and India Gate.',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
        averageCost: 2300,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Jaipur',
        country: 'India',
        description: 'The Pink City, known for its palaces, forts, and vibrant culture.',
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
        averageCost: 1800,
      },
    }),
  ]);
  console.log(`Created ${destinations.length} destinations`);

  // Create activities for each destination
  const mumbaiActivities = await prisma.activity.createMany({
    data: [
      {
        name: 'Gateway of India',
        category: ActivityCategory.sightseeing,
        description: 'Iconic monument overlooking the Arabian Sea',
        estimatedCost: 0,
        duration: '1 hour',
        destinationId: destinations[0].id,
      },
      {
        name: 'Marine Drive',
        category: ActivityCategory.sightseeing,
        description: 'Scenic waterfront promenade',
        estimatedCost: 0,
        duration: '2 hours',
        destinationId: destinations[0].id,
      },
      {
        name: 'Street Food Tour',
        category: ActivityCategory.food,
        description: 'Explore Mumbai famous street food',
        estimatedCost: 500,
        duration: '3 hours',
        destinationId: destinations[0].id,
      },
      {
        name: 'Elephanta Caves',
        category: ActivityCategory.culture,
        description: 'UNESCO World Heritage site with ancient rock-cut temples',
        estimatedCost: 200,
        duration: '4 hours',
        destinationId: destinations[0].id,
      },
    ],
  });

  const goaActivities = await prisma.activity.createMany({
    data: [
      {
        name: 'Beach Hopping',
        category: ActivityCategory.nature,
        description: 'Visit famous beaches like Baga, Calangute, and Palolem',
        estimatedCost: 0,
        duration: '6 hours',
        destinationId: destinations[1].id,
      },
      {
        name: 'Water Sports',
        category: ActivityCategory.adventure,
        description: 'Parasailing, jet skiing, and banana boat rides',
        estimatedCost: 1500,
        duration: '3 hours',
        destinationId: destinations[1].id,
      },
      {
        name: 'Old Goa Churches',
        category: ActivityCategory.culture,
        description: 'Visit UNESCO-listed churches and cathedrals',
        estimatedCost: 100,
        duration: '4 hours',
        destinationId: destinations[1].id,
      },
      {
        name: 'Night Market',
        category: ActivityCategory.shopping,
        description: 'Shop at the famous Anjuna flea market',
        estimatedCost: 1000,
        duration: '3 hours',
        destinationId: destinations[1].id,
      },
    ],
  });

  const bengaluruActivities = await prisma.activity.createMany({
    data: [
      {
        name: 'Bangalore Palace',
        category: ActivityCategory.sightseeing,
        description: 'Tudor-style palace inspired by Windsor Castle',
        estimatedCost: 250,
        duration: '2 hours',
        destinationId: destinations[2].id,
      },
      {
        name: 'Cubbon Park',
        category: ActivityCategory.nature,
        description: 'Lush green park in the heart of the city',
        estimatedCost: 0,
        duration: '2 hours',
        destinationId: destinations[2].id,
      },
      {
        name: 'Pub Hopping',
        category: ActivityCategory.entertainment,
        description: 'Experience Bengaluru famous pub culture',
        estimatedCost: 2000,
        duration: '4 hours',
        destinationId: destinations[2].id,
      },
      {
        name: 'ISKCON Temple',
        category: ActivityCategory.culture,
        description: 'Beautiful temple complex',
        estimatedCost: 50,
        duration: '2 hours',
        destinationId: destinations[2].id,
      },
    ],
  });

  console.log('Created activities for destinations');

  // Create a sample trip
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: 'Western India Adventure',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-10'),
      budget: 50000,
      status: TripStatus.planning,
      isPublic: true,
      tripStops: {
        create: [
          {
            destinationId: destinations[0].id,
            startDate: new Date('2026-09-01'),
            endDate: new Date('2026-09-04'),
            orderIndex: 0,
          },
          {
            destinationId: destinations[1].id,
            startDate: new Date('2026-09-04'),
            endDate: new Date('2026-09-07'),
            orderIndex: 1,
          },
          {
            destinationId: destinations[2].id,
            startDate: new Date('2026-09-07'),
            endDate: new Date('2026-09-10'),
            orderIndex: 2,
          },
        ],
      },
      expenses: {
        create: [
          {
            category: ExpenseCategory.accommodation,
            name: 'Hotels (9 nights)',
            amount: 18000,
            date: new Date('2026-09-01'),
          },
          {
            category: ExpenseCategory.transport,
            name: 'Flights and local transport',
            amount: 12000,
            date: new Date('2026-09-01'),
          },
          {
            category: ExpenseCategory.food,
            name: 'Food estimate',
            amount: 8000,
            date: new Date('2026-09-01'),
          },
        ],
      },
    },
  });
  console.log('Created sample trip');

  // Create itinerary items
  const mumbaiActivityIds = (await prisma.activity.findMany({
    where: { destinationId: destinations[0].id },
    select: { id: true },
  })).map(a => a.id);

  const goaActivityIds = (await prisma.activity.findMany({
    where: { destinationId: destinations[1].id },
    select: { id: true },
  })).map(a => a.id);

  await prisma.itineraryItem.createMany({
    data: [
      {
        tripId: trip.id,
        activityId: mumbaiActivityIds[0],
        date: new Date('2026-09-01'),
        time: '09:00',
        duration: '1 hour',
        orderIndex: 0,
      },
      {
        tripId: trip.id,
        activityId: mumbaiActivityIds[1],
        date: new Date('2026-09-01'),
        time: '11:00',
        duration: '2 hours',
        orderIndex: 1,
      },
      {
        tripId: trip.id,
        activityId: mumbaiActivityIds[2],
        date: new Date('2026-09-01'),
        time: '13:00',
        duration: '3 hours',
        orderIndex: 2,
      },
      {
        tripId: trip.id,
        activityId: goaActivityIds[0],
        date: new Date('2026-09-04'),
        time: '10:00',
        duration: '6 hours',
        orderIndex: 0,
      },
      {
        tripId: trip.id,
        activityId: goaActivityIds[1],
        date: new Date('2026-09-05'),
        time: '09:00',
        duration: '3 hours',
        orderIndex: 0,
      },
    ],
  });
  console.log('Created itinerary items');

  // Create trip share
  await prisma.tripShare.create({
    data: {
      tripId: trip.id,
      shareCode: 'WEST2026',
      expiresAt: new Date('2026-12-31'),
    },
  });
  console.log('Created trip share');

  console.log('Database seed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@globetrotter.com');
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
