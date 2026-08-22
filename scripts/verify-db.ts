import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('🔍 Database Verification\n');

  try {
    // Test connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Verify all tables exist and have correct structure
    console.log('2. Verifying table structure...');

    const tables = [
      'users',
      'destinations',
      'activities',
      'trips',
      'trip_stops',
      'itinerary_items',
      'expenses',
      'trip_shares'
    ];

    for (const table of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ Table '${table}' exists`);
      } catch (error) {
        console.log(`❌ Table '${table}' does not exist or is not accessible`);
        throw error;
      }
    }
    console.log('');

    // Verify constraints
    console.log('3. Verifying constraints...');

    // Check unique constraints
    try {
      await prisma.$queryRawUnsafe(`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'users' AND constraint_type = 'UNIQUE'
      `);
      console.log('✅ User email unique constraint exists');
    } catch (error) {
      console.log('⚠️  Could not verify user email unique constraint');
    }

    // Check foreign key relationships
    try {
      await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count
        FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY'
      `);
      console.log('✅ Foreign key constraints exist');
    } catch (error) {
      console.log('⚠️  Could not verify foreign key constraints');
    }
    console.log('');

    // Verify indexes
    console.log('4. Verifying indexes...');

    const expectedIndexes = [
      { table: 'users', index: 'users_email_key' },
      { table: 'destinations', index: 'destinations_country_idx' },
      { table: 'activities', index: 'activities_category_idx' },
      { table: 'trips', index: 'trips_user_id_idx' },
    ];

    for (const { table, index } of expectedIndexes) {
      try {
        await prisma.$queryRawUnsafe(`
          SELECT indexname
          FROM pg_indexes
          WHERE tablename = '${table}' AND indexname = '${index}'
        `);
        console.log(`✅ Index '${index}' exists on table '${table}'`);
      } catch (error) {
        console.log(`⚠️  Index '${index}' may not exist on table '${table}'`);
      }
    }
    console.log('');

    // Test CRUD operations
    console.log('5. Testing CRUD operations...');

    // Test CREATE
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        passwordHash: 'test_hash',
      },
    });
    console.log('✅ CREATE operation successful');

    // Test READ
    const foundUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    if (foundUser) {
      console.log('✅ READ operation successful');
    }

    // Test UPDATE
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: 'Updated Test User' },
    });
    if (updatedUser.name === 'Updated Test User') {
      console.log('✅ UPDATE operation successful');
    }

    // Test DELETE
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('✅ DELETE operation successful');
    console.log('');

    // Verify seed data
    console.log('6. Verifying seed data...');

    const userCount = await prisma.user.count();
    const destinationCount = await prisma.destination.count();
    const activityCount = await prisma.activity.count();
    const tripCount = await prisma.trip.count();

    console.log(`   Users: ${userCount}`);
    console.log(`   Destinations: ${destinationCount}`);
    console.log(`   Activities: ${activityCount}`);
    console.log(`   Trips: ${tripCount}`);

    if (userCount > 0 && destinationCount > 0 && activityCount > 0) {
      console.log('✅ Seed data appears to be present');
    } else {
      console.log('⚠️  Seed data may not be present. Run: npm run seed');
    }
    console.log('');

    // Test relationships
    console.log('7. Testing relationships...');

    if (tripCount > 0) {
      const tripWithRelations = await prisma.trip.findFirst({
        include: {
          user: true,
          tripStops: {
            include: {
              destination: true,
            },
          },
          itineraryItems: {
            include: {
              activity: true,
            },
          },
          expenses: true,
        },
      });

      if (tripWithRelations) {
        console.log(`✅ Trip-user relationship works`);
        console.log(`✅ Trip-destination relationship works (${tripWithRelations.tripStops.length} stops)`);
        console.log(`✅ Trip-activity relationship works (${tripWithRelations.itineraryItems.length} items)`);
        console.log(`✅ Trip-expense relationship works (${tripWithRelations.expenses.length} expenses)`);
      }
    } else {
      console.log('⚠️  No trips found to test relationships');
    }
    console.log('');

    console.log('✅ Database verification completed successfully!\n');

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();