import { PrismaClient, ActivityCategory, ExpenseCategory, TripStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive database seed...');

  await prisma.itineraryItem.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.tripShare.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared all existing database data.');

  // 2. Create Users
  const demoPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@globetrotter.com',
      passwordHash: demoPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
    },
  });

  const sophiaUser = await prisma.user.create({
    data: {
      name: 'Sophia Chen',
      email: 'sophia@globetrotter.com',
      passwordHash: demoPassword,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
  });

  const mateoUser = await prisma.user.create({
    data: {
      name: 'Mateo Rossi',
      email: 'mateo@globetrotter.com',
      passwordHash: demoPassword,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const elenaUser = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@globetrotter.com',
      passwordHash: demoPassword,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
  });

  const aaravUser = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav@globetrotter.com',
      passwordHash: demoPassword,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  });

  const chloeUser = await prisma.user.create({
    data: {
      name: 'Chloe Dubois',
      email: 'chloe@globetrotter.com',
      passwordHash: demoPassword,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('Created 6 users (Demo User, 5 Community Creators)');

  // 3. Create Curated World Destinations
  const destData = [
    { key: 'mumbai', name: 'Mumbai', country: 'India', description: 'The financial capital of India, known for Bollywood, iconic seafronts, historic architecture, and street cuisine.', imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', averageCost: 3500 },
    { key: 'goa', name: 'Goa', country: 'India', description: 'Tropical coastal state famous for golden beaches, Portuguese heritage churches, water sports, and vibrant nightlife.', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', averageCost: 3000 },
    { key: 'bengaluru', name: 'Bengaluru', country: 'India', description: 'Silicon Valley of India, celebrated for pleasant climate, lush green parks, craft microbreweries, and tech hubs.', imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80', averageCost: 3200 },
    { key: 'delhi', name: 'Delhi', country: 'India', description: 'India historical capital blending ancient Mughal monuments like Red Fort with modern metropolis culture.', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', averageCost: 3200 },
    { key: 'jaipur', name: 'Jaipur', country: 'India', description: 'The Pink City of Rajasthan, home to majestic hill forts, royal palaces, vibrant bazaars, and traditional handicrafts.', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', averageCost: 2800 },
    { key: 'udaipur', name: 'Udaipur', country: 'India', description: 'The City of Lakes, renowned for romantic palace hotels, serene Lake Pichola cruises, and royal Mewar heritage.', imageUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=1200&q=80', averageCost: 3400 },
    { key: 'kerala', name: 'Kerala', country: 'India', description: 'God Own Country, featuring serene Alleppey backwater houseboats, Munnar tea gardens, and Ayurvedic retreats.', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', averageCost: 3600 },
    { key: 'agra', name: 'Agra', country: 'India', description: 'Home of the world-famous Taj Mahal, magnificent Agra Fort, and exquisite Mughal marble artisan crafts.', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', averageCost: 2500 },
    { key: 'tokyo', name: 'Tokyo', country: 'Japan', description: 'Ultramodern metropolis seamlessly blending neon skyscrapers, cutting-edge tech, historic shrines, and world-class culinary arts.', imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', averageCost: 9500 },
    { key: 'kyoto', name: 'Kyoto', country: 'Japan', description: 'Japan cultural heart with thousands of classical Zen temples, bamboo groves, geisha districts, and traditional ryokans.', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', averageCost: 8500 },
    { key: 'paris', name: 'Paris', country: 'France', description: 'The City of Light, world-renowned for Eiffel Tower, Louvre masterpieces, haute couture, romantic Seine cruises, and cafes.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', averageCost: 12000 },
    { key: 'zurich', name: 'Zurich', country: 'Switzerland', description: 'Scenic Alpine lakeside city featuring crystal-clear lake views, luxury shopping, historic Old Town, and gateway to Swiss Alps.', imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', averageCost: 14000 },
    { key: 'dubai', name: 'Dubai', country: 'United Arab Emirates', description: 'Futuristic desert metropolis featuring Burj Khalifa, luxury shopping malls, palm islands, and adrenaline desert safaris.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', averageCost: 11000 },
    { key: 'newyork', name: 'New York', country: 'United States', description: 'The Big Apple, featuring Central Park, Broadway shows, Times Square, world-renowned museums, and iconic skyline views.', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', averageCost: 13500 },
    { key: 'rome', name: 'Rome', country: 'Italy', description: 'The Eternal City packed with ancient Roman history, Colosseum, Vatican City, magnificent fountains, and authentic trattorias.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', averageCost: 10500 },
    { key: 'bali', name: 'Bali', country: 'Indonesia', description: 'Island of the Gods, featuring emerald rice terraces, cliffside temples, sacred monkey forests, volcano treks, and beach clubs.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', averageCost: 4500 },
  ];

  const destMap: Record<string, any> = {};

  for (const item of destData) {
    const created = await prisma.destination.create({
      data: {
        name: item.name,
        country: item.country,
        description: item.description,
        imageUrl: item.imageUrl,
        averageCost: item.averageCost,
      },
    });
    destMap[item.key] = created;
  }

  console.log(`Created ${Object.keys(destMap).length} world destinations.`);

  // 4. Create Activities for Destinations
  const activitiesData: Array<{
    destKey: string;
    name: string;
    category: ActivityCategory;
    description: string;
    estimatedCost: number;
    duration: string;
  }> = [
    // Mumbai
    { destKey: 'mumbai', name: 'Gateway of India & Promenade', category: ActivityCategory.sightseeing, description: 'Iconic waterfront monument built during British Raj overlooking Arabian Sea', estimatedCost: 0, duration: '1.5 hours' },
    { destKey: 'mumbai', name: 'Marine Drive Sunset Stroll', category: ActivityCategory.sightseeing, description: 'Relaxing evening walk along Queen Necklace promenade', estimatedCost: 0, duration: '2 hours' },
    { destKey: 'mumbai', name: 'Colaba Street Food & Bazaar Crawl', category: ActivityCategory.food, description: 'Sample famous Vada Pav, Pav Bhaji, and Iranian cafe keema bun', estimatedCost: 600, duration: '3 hours' },
    { destKey: 'mumbai', name: 'Elephanta Island Caves Excursion', category: ActivityCategory.culture, description: 'Ferry ride to UNESCO World Heritage ancient rock-cut Shiva cave temples', estimatedCost: 450, duration: '4.5 hours' },

    // Goa
    { destKey: 'goa', name: 'Calangute & Baga Water Sports', category: ActivityCategory.adventure, description: 'Parasailing, jet ski rides, and banana boat adventures along golden coast', estimatedCost: 1800, duration: '3 hours' },
    { destKey: 'goa', name: 'Old Goa Basilica of Bom Jesus', category: ActivityCategory.culture, description: 'Explore UNESCO 16th-century Portuguese Baroque cathedral and heritage site', estimatedCost: 150, duration: '2.5 hours' },
    { destKey: 'goa', name: 'Anjuna Night Flea Market', category: ActivityCategory.shopping, description: 'Lively beachfront market featuring handmade crafts, spices, and live acoustic music', estimatedCost: 1000, duration: '3 hours' },
    { destKey: 'goa', name: 'Spice Plantation & Traditional Buffet', category: ActivityCategory.nature, description: 'Guided tour of aromatic cardamom pepper gardens followed by authentic Goan lunch', estimatedCost: 750, duration: '4 hours' },

    // Bengaluru
    { destKey: 'bengaluru', name: 'Bangalore Palace Guided Tour', category: ActivityCategory.sightseeing, description: 'Tudor-style royal residence featuring grand ballrooms and vintage oil paintings', estimatedCost: 300, duration: '2 hours' },
    { destKey: 'bengaluru', name: 'Cubbon Park Morning Nature Walk', category: ActivityCategory.nature, description: 'Peaceful stroll through 300-acre lush botanical park in city center', estimatedCost: 0, duration: '2 hours' },
    { destKey: 'bengaluru', name: 'Indiranagar Craft Brewery Tour', category: ActivityCategory.entertainment, description: 'Sample fresh artisanal beers and gourmet dining in top microbreweries', estimatedCost: 2200, duration: '4 hours' },

    // Delhi
    { destKey: 'delhi', name: 'Red Fort & Chandni Chowk Rickshaw Ride', category: ActivityCategory.culture, description: 'Explore Mughal fortress and navigate historic narrow food lanes of Old Delhi', estimatedCost: 500, duration: '3.5 hours' },
    { destKey: 'delhi', name: 'Qutub Minar Archaeological Park', category: ActivityCategory.sightseeing, description: 'World tallest brick minaret standing at 73 meters built in 1192 AD', estimatedCost: 250, duration: '2 hours' },
    { destKey: 'delhi', name: 'Humayun Tomb Garden Sunset Walk', category: ActivityCategory.culture, description: 'Precursor to Taj Mahal featuring red sandstone white marble Persian garden architecture', estimatedCost: 300, duration: '2 hours' },

    // Jaipur
    { destKey: 'jaipur', name: 'Amber Fort & Elephant Ramparts', category: ActivityCategory.sightseeing, description: 'Majestic hilltop fort with Sheesh Mahal mirror palace and panoramic lake views', estimatedCost: 500, duration: '4 hours' },
    { destKey: 'jaipur', name: 'Hawa Mahal & Palace Photo Walk', category: ActivityCategory.culture, description: 'Iconic 953-window pink sandstone honeycomb facade built for royal ladies', estimatedCost: 200, duration: '1.5 hours' },
    { destKey: 'jaipur', name: 'Chokhi Dhani Rajasthani Folk Village', category: ActivityCategory.entertainment, description: 'Immersive cultural evening with puppet shows, folk dance, and royal Thali feast', estimatedCost: 1200, duration: '4 hours' },

    // Udaipur
    { destKey: 'udaipur', name: 'City Palace Lake Pichola Tour', category: ActivityCategory.sightseeing, description: 'Largest palace complex in Rajasthan overlooking tranquil waters', estimatedCost: 400, duration: '3 hours' },
    { destKey: 'udaipur', name: 'Lake Pichola Sunset Boat Cruise', category: ActivityCategory.nature, description: 'Scenic boat ride around Jag Mandir island palace as sun sets behind Aravalli hills', estimatedCost: 800, duration: '2 hours' },
    { destKey: 'udaipur', name: 'Bagore Ki Haveli Folk Dance Show', category: ActivityCategory.culture, description: 'Traditional Rajasthani Dharohar dance performance inside historic waterfront haveli', estimatedCost: 250, duration: '1.5 hours' },

    // Kerala
    { destKey: 'kerala', name: 'Alleppey Backwater Houseboat Cruise', category: ActivityCategory.nature, description: 'Glide along coconut-lined palm lagoons on luxury traditional Kettuvallam boat', estimatedCost: 4500, duration: '6 hours' },
    { destKey: 'kerala', name: 'Munnar Tea Garden & Mist Trek', category: ActivityCategory.nature, description: 'Walk through rolling green carpet tea plantations in Western Ghats', estimatedCost: 600, duration: '3.5 hours' },
    { destKey: 'kerala', name: 'Ayurvedic Full Body Rejuvenation Spa', category: ActivityCategory.nature, description: 'Traditional herbal oil massage by certified Kerala wellness therapists', estimatedCost: 2500, duration: '2 hours' },

    // Agra
    { destKey: 'agra', name: 'Taj Mahal Sunrise Guided Tour', category: ActivityCategory.sightseeing, description: 'Witness white marble monument of love glistening under golden morning rays', estimatedCost: 1100, duration: '3 hours' },
    { destKey: 'agra', name: 'Agra Fort Red Sandstone Citadel', category: ActivityCategory.culture, description: 'Imperial residence of Mughal emperors featuring Jahangir Palace and Diwan-i-Khas', estimatedCost: 600, duration: '2.5 hours' },

    // Tokyo
    { destKey: 'tokyo', name: 'TeamLab Planets Immersive Art Museum', category: ActivityCategory.entertainment, description: 'Walk through water and body-immersive digital art projections', estimatedCost: 2200, duration: '2.5 hours' },
    { destKey: 'tokyo', name: 'Tsukiji Outer Market Fresh Sushi Tasting', category: ActivityCategory.food, description: 'Sample fresh sashimi, tamagoyaki, and wagyu beef skewers from legendary stalls', estimatedCost: 2500, duration: '3 hours' },
    { destKey: 'tokyo', name: 'Shibuya Crossing & Harajuku Takeshita Street', category: ActivityCategory.shopping, description: 'Experience famous scrambled crossing and vibrant fashion pop-up shops', estimatedCost: 500, duration: '3 hours' },

    // Kyoto
    { destKey: 'kyoto', name: 'Fushimi Inari 10,000 Torii Gates Trail', category: ActivityCategory.culture, description: 'Hike through vermilion torii gates winding up sacred Mount Inari', estimatedCost: 0, duration: '3 hours' },
    { destKey: 'kyoto', name: 'Arashiyama Bamboo Grove & Monkey Park', category: ActivityCategory.nature, description: 'Towering bamboo stalk path followed by scenic river lookout', estimatedCost: 400, duration: '3 hours' },
    { destKey: 'kyoto', name: 'Traditional Matcha Tea Ceremony in Gion', category: ActivityCategory.culture, description: 'Experience Zen tea preparation with master in historic wooden machiya house', estimatedCost: 1800, duration: '1.5 hours' },

    // Paris
    { destKey: 'paris', name: 'Eiffel Tower Summit & Glass of Champagne', category: ActivityCategory.sightseeing, description: 'Elevator access to 276-meter summit for breathtaking 360-degree Paris panorama', estimatedCost: 3500, duration: '2.5 hours' },
    { destKey: 'paris', name: 'Louvre Museum Masterpieces Tour', category: ActivityCategory.culture, description: 'Skip-the-line guided access to Mona Lisa, Venus de Milo, and Winged Victory', estimatedCost: 2800, duration: '3.5 hours' },
    { destKey: 'paris', name: 'Seine River Sunset Gourmet Dinner Cruise', category: ActivityCategory.food, description: '3-course French dining while passing lit monuments like Notre-Dame and Orsay', estimatedCost: 6500, duration: '2.5 hours' },

    // Zurich
    { destKey: 'zurich', name: 'Lake Zurich Promenade & Cruise', category: ActivityCategory.nature, description: 'Relaxing boat excursion across crystal Alpine lake with mountain reflections', estimatedCost: 1500, duration: '2 hours' },
    { destKey: 'zurich', name: 'Altstadt Old Town & Lindenhof Hill Walk', category: ActivityCategory.sightseeing, description: 'Cobblestone alleyways, medieval guild houses, and Limmat river vantage point', estimatedCost: 0, duration: '2.5 hours' },
    { destKey: 'zurich', name: 'Day Trip to Jungfraujoch Top of Europe', category: ActivityCategory.adventure, description: 'Scenic cogwheel train climb to 3454m high glacier summit and Ice Palace', estimatedCost: 16000, duration: '8 hours' },

    // Dubai
    { destKey: 'dubai', name: 'Burj Khalifa At The Top 148th Floor', category: ActivityCategory.sightseeing, description: 'World highest outdoor observation deck looking down on Dubai skyline', estimatedCost: 5500, duration: '2 hours' },
    { destKey: 'dubai', name: 'Desert Safari Dune Bashing & BBQ Camp', category: ActivityCategory.adventure, description: '4x4 dune thrill drive, camel rides, falconry, and belly dance dinner show', estimatedCost: 4000, duration: '6 hours' },
    { destKey: 'dubai', name: 'Dubai Mall & Fountain Laser Light Show', category: ActivityCategory.entertainment, description: 'Watch world largest dancing fountain set to classical and modern music', estimatedCost: 0, duration: '2 hours' },

    // New York
    { destKey: 'newyork', name: 'Central Park Bicycle & Belvedere Castle Tour', category: ActivityCategory.nature, description: 'Cycle past Bethesda Terrace, Strawberry Fields, and scenic lake paths', estimatedCost: 1800, duration: '3 hours' },
    { destKey: 'newyork', name: 'Broadway Musical Ticket Times Square', category: ActivityCategory.entertainment, description: 'Prime orchestra seats for award-winning theater show in Midtown Manhattan', estimatedCost: 9500, duration: '3 hours' },
    { destKey: 'newyork', name: 'Statue of Liberty & Ellis Island Ferry', category: ActivityCategory.sightseeing, description: 'Cruise around Lady Liberty with museum access to immigration history', estimatedCost: 2200, duration: '4 hours' },

    // Rome
    { destKey: 'rome', name: 'Colosseum & Roman Forum Fast-Track Tour', category: ActivityCategory.culture, description: 'Walk through gladiatorial arena floor and ancient ruins of Roman Republic', estimatedCost: 3200, duration: '3.5 hours' },
    { destKey: 'rome', name: 'Vatican Museums & Sistine Chapel Tour', category: ActivityCategory.culture, description: 'Marvel at Michelangelo iconic ceiling frescoes and St. Peter Basilica', estimatedCost: 3800, duration: '4 hours' },
    { destKey: 'rome', name: 'Trastevere Food & Wine Walking Tour', category: ActivityCategory.food, description: 'Tasting artisan pasta, Roman cacio e pepe, fried risotto balls, and Chianti wine', estimatedCost: 4200, duration: '3 hours' },

    // Bali
    { destKey: 'bali', name: 'Ubud Sacred Monkey Forest & Tegallalang Terraces', category: ActivityCategory.nature, description: 'Walk among macaque monkeys and UNESCO green rice paddy swings', estimatedCost: 600, duration: '4 hours' },
    { destKey: 'bali', name: 'Uluwatu Sunset Temple & Kecak Fire Dance', category: ActivityCategory.culture, description: 'Clifftop Hindu temple views paired with traditional rhythmic chant dance', estimatedCost: 1200, duration: '3 hours' },
    { destKey: 'bali', name: 'Seminyak Beach Club Sunset Cocktails', category: ActivityCategory.entertainment, description: 'Lounge in oceanfront infinity pool cabana with tropical drinks and live DJ', estimatedCost: 2500, duration: '3.5 hours' },
  ];

  const activityMap: Record<string, string[]> = {};

  for (const act of activitiesData) {
    const destObj = destMap[act.destKey];
    if (!destObj) continue;

    const createdAct = await prisma.activity.create({
      data: {
        name: act.name,
        category: act.category,
        description: act.description,
        estimatedCost: act.estimatedCost,
        duration: act.duration,
        destinationId: destObj.id,
      },
    });

    if (!activityMap[act.destKey]) activityMap[act.destKey] = [];
    activityMap[act.destKey].push(createdAct.id);
  }

  console.log('Created rich activity catalog for all destinations.');

  // Fetch all verified DB activities for relational mapping
  const allDbActivities = await prisma.activity.findMany();
  const actByDestId: Record<string, string[]> = {};
  for (const a of allDbActivities) {
    if (a.destinationId) {
      if (!actByDestId[a.destinationId]) actByDestId[a.destinationId] = [];
      actByDestId[a.destinationId].push(a.id);
    }
  }

  // Helper to create trip atomically with nested relation creates
  async function createFullTrip(config: {
    user: any;
    title: string;
    startDate: string;
    endDate: string;
    budget: number;
    status: TripStatus;
    isPublic: boolean;
    shareCode: string;
    likesCount?: number;
    destKeys: string[];
    expenseItems: Array<{ name: string; category: ExpenseCategory; amount: number; date: string }>;
    itineraryDays: Array<{ destKey: string; activityIndex: number; date: string; time: string; duration: string; notes?: string }>;
  }) {
    const totalDays = Math.max(1, Math.floor((new Date(config.endDate).getTime() - new Date(config.startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const daysPerStop = Math.max(1, Math.floor(totalDays / (config.destKeys.length || 1)));

    const tripStopsCreate = config.destKeys.map((dKey, i) => {
      const dObj = destMap[dKey];
      if (!dObj?.id) return null;
      const stopStart = new Date(new Date(config.startDate).getTime() + i * daysPerStop * 24 * 60 * 60 * 1000);
      const stopEnd = new Date(stopStart.getTime() + daysPerStop * 24 * 60 * 60 * 1000);
      return {
        destinationId: dObj.id,
        startDate: stopStart,
        endDate: stopEnd,
        orderIndex: i,
      };
    }).filter((s): s is { destinationId: string; startDate: Date; endDate: Date; orderIndex: number } => Boolean(s));

    const expensesCreate = config.expenseItems.map((exp) => ({
      name: exp.name,
      category: exp.category,
      amount: exp.amount,
      date: new Date(exp.date),
    }));

    const itineraryCreate: Array<{
      activityId: string;
      date: Date;
      time: string;
      duration: string;
      orderIndex: number;
      notes?: string;
    }> = [];

    let itOrder = 0;
    for (const item of config.itineraryDays) {
      const dObj = destMap[item.destKey];
      const availableActs = (dObj?.id && actByDestId[dObj.id]) || [];
      const actId = availableActs[item.activityIndex % availableActs.length] || allDbActivities[0]?.id;
      if (actId) {
        itineraryCreate.push({
          activityId: actId,
          date: new Date(item.date),
          time: item.time,
          duration: item.duration,
          orderIndex: itOrder++,
          notes: item.notes,
        });
      }
    }

    try {
      const trip = await prisma.trip.create({
        data: {
          userId: config.user.id,
          title: config.title,
          startDate: new Date(config.startDate),
          endDate: new Date(config.endDate),
          budget: config.budget,
          status: config.status,
          isPublic: config.isPublic,
          tripStops: {
            create: tripStopsCreate,
          },
          expenses: {
            create: expensesCreate,
          },
          itineraryItems: {
            create: itineraryCreate,
          },
          tripShare: {
            create: {
              shareCode: config.shareCode,
              accessCount: config.likesCount || Math.floor(Math.random() * 50) + 10,
            },
          },
        },
      });

      return trip;
    } catch (err) {
      console.error(`Failed to create trip "${config.title}":`, err);
      throw err;
    }
  }

  // 5. Seed Demo User Trips (using demoUser as primary user)
  console.log('Seeding Demo User Trips...');

  // Trip 1: Grand European Odyssey
  await createFullTrip({
    user: demoUser,
    title: 'Grand European Odyssey',
    startDate: '2026-09-15',
    endDate: '2026-09-25',
    budget: 250000,
    status: TripStatus.confirmed,
    isPublic: true,
    shareCode: 'EURO2026',
    destKeys: ['paris', 'zurich', 'rome'],
    expenseItems: [
      { name: 'Boutique Hotel Le Marais Paris (3 Nights)', category: ExpenseCategory.accommodation, amount: 65000, date: '2026-09-15' },
      { name: 'Swiss Alpine Lakeside Resort Zurich (3 Nights)', category: ExpenseCategory.accommodation, amount: 55000, date: '2026-09-18' },
      { name: 'Heritage Trastevere Suites Rome (4 Nights)', category: ExpenseCategory.accommodation, amount: 45000, date: '2026-09-21' },
      { name: 'Air France & TGV Express Rail Passes', category: ExpenseCategory.transport, amount: 42000, date: '2026-09-15' },
      { name: 'Gourmet Dining & Seine River Dinner Cruise', category: ExpenseCategory.food, amount: 28000, date: '2026-09-17' },
      { name: 'Museum Excursions & Jungfraujoch Railway', category: ExpenseCategory.activities, amount: 15000, date: '2026-09-19' },
    ],
    itineraryDays: [
      { destKey: 'paris', activityIndex: 0, date: '2026-09-15', time: '10:00 AM', duration: '2.5 hours', notes: 'Reserved summit elevator tickets with champagne' },
      { destKey: 'paris', activityIndex: 1, date: '2026-09-16', time: '09:30 AM', duration: '3.5 hours', notes: 'Skip-the-line priority entry pass' },
      { destKey: 'paris', activityIndex: 2, date: '2026-09-17', time: '07:30 PM', duration: '2.5 hours', notes: 'Window seating booked on boat' },
      { destKey: 'zurich', activityIndex: 0, date: '2026-09-18', time: '02:00 PM', duration: '2 hours', notes: 'Scenic afternoon lake cruise' },
      { destKey: 'zurich', activityIndex: 2, date: '2026-09-19', time: '07:00 AM', duration: '8 hours', notes: 'Full day Alpine mountain pass tour' },
      { destKey: 'rome', activityIndex: 0, date: '2026-09-22', time: '09:00 AM', duration: '3.5 hours', notes: 'Arena floor access included' },
      { destKey: 'rome', activityIndex: 1, date: '2026-09-23', time: '08:30 AM', duration: '4 hours', notes: 'Strict dress code required' },
      { destKey: 'rome', activityIndex: 2, date: '2026-09-24', time: '06:00 PM', duration: '3 hours', notes: 'Traditional pasta making & wine tasting' },
    ],
  });

  // Trip 2: Western India Beach & Tech Trail
  await createFullTrip({
    user: demoUser,
    title: 'Western India Beach & Tech Trail',
    startDate: '2026-10-01',
    endDate: '2026-10-08',
    budget: 60000,
    status: TripStatus.planning,
    isPublic: true,
    shareCode: 'WEST2026',
    destKeys: ['mumbai', 'goa', 'bengaluru'],
    expenseItems: [
      { name: 'Bandra Hotel & Goa Beach Resort (7 Nights)', category: ExpenseCategory.accommodation, amount: 24000, date: '2026-10-01' },
      { name: 'Indigo Flights Mumbai-Goa-Bengaluru', category: ExpenseCategory.transport, amount: 15000, date: '2026-10-01' },
      { name: 'Seafood Shack & Brewery Crawls', category: ExpenseCategory.food, amount: 12000, date: '2026-10-03' },
      { name: 'Water Sports & Elephanta Cave Ferry', category: ExpenseCategory.activities, amount: 4000, date: '2026-10-04' },
    ],
    itineraryDays: [
      { destKey: 'mumbai', activityIndex: 0, date: '2026-10-01', time: '09:00 AM', duration: '1.5 hours', notes: 'Morning photo stop at Gateway' },
      { destKey: 'mumbai', activityIndex: 1, date: '2026-10-01', time: '05:30 PM', duration: '2 hours', notes: 'Sunset breeze along Marine Drive' },
      { destKey: 'goa', activityIndex: 0, date: '2026-10-03', time: '10:00 AM', duration: '3 hours', notes: 'Parasailing package booked' },
      { destKey: 'goa', activityIndex: 2, date: '2026-10-04', time: '07:00 PM', duration: '3 hours', notes: 'Anjuna night flea market souvenirs' },
      { destKey: 'bengaluru', activityIndex: 2, date: '2026-10-07', time: '06:00 PM', duration: '4 hours', notes: 'Sample craft IPAs in Indiranagar' },
    ],
  });

  // Trip 3: Golden Triangle & Royal Rajasthan
  await createFullTrip({
    user: demoUser,
    title: 'Golden Triangle & Royal Rajasthan',
    startDate: '2026-05-01',
    endDate: '2026-05-10',
    budget: 85000,
    status: TripStatus.completed,
    isPublic: true,
    shareCode: 'RAJ2026',
    destKeys: ['delhi', 'agra', 'jaipur', 'udaipur'],
    expenseItems: [
      { name: 'Heritage Haveli Stays (9 Nights)', category: ExpenseCategory.accommodation, amount: 35000, date: '2026-05-01' },
      { name: 'Private Air-Conditioned SUV Chauffeur', category: ExpenseCategory.transport, amount: 22000, date: '2026-05-01' },
      { name: 'Royal Rajasthani Thali Dining', category: ExpenseCategory.food, amount: 16000, date: '2026-05-03' },
      { name: 'Taj Mahal & Fort Monument Passes', category: ExpenseCategory.activities, amount: 7000, date: '2026-05-04' },
    ],
    itineraryDays: [
      { destKey: 'delhi', activityIndex: 0, date: '2026-05-01', time: '10:00 AM', duration: '3.5 hours', notes: 'Rickshaw ride in Chandni Chowk' },
      { destKey: 'agra', activityIndex: 0, date: '2026-05-03', time: '05:45 AM', duration: '3 hours', notes: 'Sunrise at Taj Mahal' },
      { destKey: 'jaipur', activityIndex: 0, date: '2026-05-05', time: '09:00 AM', duration: '4 hours', notes: 'Amber Fort palace tour' },
      { destKey: 'udaipur', activityIndex: 1, date: '2026-05-08', time: '05:30 PM', duration: '2 hours', notes: 'Lake Pichola sunset boat ride' },
    ],
  });

  // Trip 4: Futuristic Tokyo & Kyoto Culture
  await createFullTrip({
    user: demoUser,
    title: 'Futuristic Tokyo & Kyoto Culture',
    startDate: '2026-11-10',
    endDate: '2026-11-18',
    budget: 180000,
    status: TripStatus.planning,
    isPublic: true,
    shareCode: 'TOKYO2026',
    destKeys: ['tokyo', 'kyoto'],
    expenseItems: [
      { name: 'Shinjuku Hotel & Kyoto Traditional Ryokan', category: ExpenseCategory.accommodation, amount: 95000, date: '2026-11-10' },
      { name: '7-Day JR Shinkansen Bullet Train Pass', category: ExpenseCategory.transport, amount: 24000, date: '2026-11-10' },
      { name: 'Tsukiji Omakase & Kyoto Kaiseki Dining', category: ExpenseCategory.food, amount: 26000, date: '2026-11-12' },
      { name: 'TeamLab Tickets & Tea Ceremony', category: ExpenseCategory.activities, amount: 10000, date: '2026-11-11' },
    ],
    itineraryDays: [
      { destKey: 'tokyo', activityIndex: 0, date: '2026-11-11', time: '11:00 AM', duration: '2.5 hours', notes: 'Barefoot water exhibit pass' },
      { destKey: 'tokyo', activityIndex: 1, date: '2026-11-12', time: '08:00 AM', duration: '3 hours', notes: 'Fresh tuna sushi breakfast' },
      { destKey: 'kyoto', activityIndex: 0, date: '2026-11-15', time: '07:00 AM', duration: '3 hours', notes: 'Early morning climb up Mount Inari' },
      { destKey: 'kyoto', activityIndex: 2, date: '2026-11-16', time: '03:00 PM', duration: '1.5 hours', notes: 'Kimono dress experience & tea ceremony' },
    ],
  });

  // 6. Seed Community Trips by Other Users
  console.log('Seeding Community Trips by Other Users...');

  // Community Trip 1: Sophia Chen
  await createFullTrip({
    user: sophiaUser,
    title: 'Romantic Paris & Swiss Alpine Escape',
    startDate: '2026-08-10',
    endDate: '2026-08-18',
    budget: 220000,
    status: TripStatus.confirmed,
    isPublic: true,
    shareCode: 'PARIS2026',
    likesCount: 142,
    destKeys: ['paris', 'zurich'],
    expenseItems: [
      { name: 'Luxury Hotel Central Paris', category: ExpenseCategory.accommodation, amount: 90000, date: '2026-08-10' },
      { name: 'TGV Lyria High-Speed Train', category: ExpenseCategory.transport, amount: 28000, date: '2026-08-10' },
      { name: 'French Fine Dining & Bistro Wine', category: ExpenseCategory.food, amount: 35000, date: '2026-08-12' },
    ],
    itineraryDays: [
      { destKey: 'paris', activityIndex: 0, date: '2026-08-10', time: '04:00 PM', duration: '2.5 hours' },
      { destKey: 'paris', activityIndex: 2, date: '2026-08-11', time: '08:00 PM', duration: '2.5 hours' },
      { destKey: 'zurich', activityIndex: 2, date: '2026-08-15', time: '08:00 AM', duration: '8 hours' },
    ],
  });

  // Community Trip 2: Mateo Rossi
  await createFullTrip({
    user: mateoUser,
    title: 'Dubai Luxury & Desert Safari Adventure',
    startDate: '2026-12-01',
    endDate: '2026-12-07',
    budget: 150000,
    status: TripStatus.planning,
    isPublic: true,
    shareCode: 'DUBAI2026',
    likesCount: 98,
    destKeys: ['dubai'],
    expenseItems: [
      { name: 'Marina Waterfront Hotel Dubai', category: ExpenseCategory.accommodation, amount: 60000, date: '2026-12-01' },
      { name: '4x4 Desert Safari & Dune Buggy', category: ExpenseCategory.activities, amount: 15000, date: '2026-12-03' },
    ],
    itineraryDays: [
      { destKey: 'dubai', activityIndex: 0, date: '2026-12-02', time: '04:00 PM', duration: '2 hours' },
      { destKey: 'dubai', activityIndex: 1, date: '2026-12-03', time: '03:00 PM', duration: '6 hours' },
    ],
  });

  // Community Trip 3: Aarav Sharma
  await createFullTrip({
    user: aaravUser,
    title: 'South India Backwaters & Spice Trail',
    startDate: '2026-11-01',
    endDate: '2026-11-08',
    budget: 48000,
    status: TripStatus.confirmed,
    isPublic: true,
    shareCode: 'KERALA2026',
    likesCount: 87,
    destKeys: ['bengaluru', 'kerala'],
    expenseItems: [
      { name: 'Luxury Houseboat Alleppey', category: ExpenseCategory.accommodation, amount: 20000, date: '2026-11-01' },
      { name: 'Kerala Seafood & Spice Tasting', category: ExpenseCategory.food, amount: 9000, date: '2026-11-03' },
    ],
    itineraryDays: [
      { destKey: 'bengaluru', activityIndex: 1, date: '2026-11-01', time: '08:00 AM', duration: '2 hours' },
      { destKey: 'kerala', activityIndex: 0, date: '2026-11-04', time: '11:00 AM', duration: '6 hours' },
    ],
  });

  // Community Trip 4: Elena Rostova
  await createFullTrip({
    user: elenaUser,
    title: 'Japanese Cherry Blossom & Culinary Trail',
    startDate: '2026-04-01',
    endDate: '2026-04-10',
    budget: 195000,
    status: TripStatus.planning,
    isPublic: true,
    shareCode: 'JAPAN2026',
    likesCount: 115,
    destKeys: ['tokyo', 'kyoto'],
    expenseItems: [
      { name: 'Tokyo Boutique & Kyoto Ryokan', category: ExpenseCategory.accommodation, amount: 90000, date: '2026-04-01' },
      { name: 'Michelin Star Culinary Experiences', category: ExpenseCategory.food, amount: 45000, date: '2026-04-03' },
    ],
    itineraryDays: [
      { destKey: 'tokyo', activityIndex: 1, date: '2026-04-02', time: '08:30 AM', duration: '3 hours' },
      { destKey: 'kyoto', activityIndex: 0, date: '2026-04-06', time: '07:30 AM', duration: '3 hours' },
    ],
  });

  // Community Trip 5: Chloe Dubois
  await createFullTrip({
    user: chloeUser,
    title: 'New York City Lights & Broadway Magic',
    startDate: '2026-12-20',
    endDate: '2026-12-27',
    budget: 210000,
    status: TripStatus.planning,
    isPublic: true,
    shareCode: 'NYC2026',
    likesCount: 76,
    destKeys: ['newyork'],
    expenseItems: [
      { name: 'Midtown Manhattan Hotel', category: ExpenseCategory.accommodation, amount: 110000, date: '2026-12-20' },
      { name: 'Broadway Show Tickets & Dining', category: ExpenseCategory.activities, amount: 35000, date: '2026-12-22' },
    ],
    itineraryDays: [
      { destKey: 'newyork', activityIndex: 0, date: '2026-12-21', time: '10:00 AM', duration: '3 hours' },
      { destKey: 'newyork', activityIndex: 1, date: '2026-12-22', time: '07:00 PM', duration: '3 hours' },
    ],
  });

  // Community Trip 6: Mateo Rossi
  await createFullTrip({
    user: mateoUser,
    title: 'Eternal City & Roman Heritage Walk',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    budget: 140000,
    status: TripStatus.planning,
    isPublic: true,
    shareCode: 'ROME2026',
    likesCount: 64,
    destKeys: ['rome'],
    expenseItems: [
      { name: 'Piazza Navona Heritage Suite', category: ExpenseCategory.accommodation, amount: 65000, date: '2026-10-15' },
      { name: 'Authentic Roman Trattoria & Gelato', category: ExpenseCategory.food, amount: 22000, date: '2026-10-17' },
    ],
    itineraryDays: [
      { destKey: 'rome', activityIndex: 0, date: '2026-10-16', time: '09:00 AM', duration: '3.5 hours' },
      { destKey: 'rome', activityIndex: 1, date: '2026-10-18', time: '08:30 AM', duration: '4 hours' },
    ],
  });

  console.log('Successfully seeded database with comprehensive data!');
  console.log('\n--- GlobeTrotter Login Credentials ---');
  console.log('Demo User Email: demo@globetrotter.com (Password: demo123)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
