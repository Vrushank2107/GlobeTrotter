# Database Setup Guide

This guide provides detailed instructions for setting up the PostgreSQL database for GlobeTrotter.

## Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or Docker)

## Quick Start (Recommended)

### Using Docker Compose

1. Start the database:
   ```bash
   docker-compose up -d
   ```

2. Verify the database is running:
   ```bash
   docker-compose ps
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

### Using Local PostgreSQL

1. Ensure PostgreSQL is installed and running:
   ```bash
   # macOS with Homebrew
   brew services start postgresql@15

   # Linux
   sudo service postgresql start
   ```

2. Run the setup script:
   ```bash
   ./scripts/setup-db.sh
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

## Environment Configuration

The `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globetrotter"
AUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

For different database setups, update the `DATABASE_URL` accordingly:

**Local PostgreSQL with custom credentials:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/globetrotter"
```

**Cloud PostgreSQL (e.g., Supabase, Neon):**
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

## Database Schema

The database consists of the following tables:

- `users` - User accounts and authentication
- `destinations` - Travel destinations/cities
- `activities` - Things to do at destinations
- `trips` - User travel itineraries
- `trip_stops` - Destinations within a trip
- `itinerary_items` - Scheduled activities
- `expenses` - Trip expense tracking
- `trip_shares` - Public trip sharing

## Seed Data

The seed script creates:

- 1 demo user (email: `demo@globetrotter.com`, password: `demo123`)
- 5 destinations (Mumbai, Goa, Bengaluru, Delhi, Jaipur)
- Multiple activities for each destination
- 1 sample trip with 3 destinations
- Sample itinerary items and expenses
- A public trip share

## Common Issues

### Database Connection Failed

**Error:** `Can't reach database server at localhost:5432`

**Solution:**
- Ensure PostgreSQL is running
- Check that the port 5432 is available
- Verify DATABASE_URL in .env file

### Migration Failed

**Error:** `Migration failed with error`

**Solution:**
- Reset the database: `npx prisma migrate reset`
- Or drop and recreate: `dropdb globetrotter && createdb globetrotter`

### Seed Failed

**Error:** `Error seeding database`

**Solution:**
- Ensure migrations have been run
- Check database connection
- Verify all dependencies are installed

## Database Management

### View Database Contents

```bash
# Using Prisma Studio
npx prisma studio

# Using psql
psql postgresql://postgres:postgres@localhost:5432/globetrotter
```

### Reset Database

```bash
# Warning: This deletes all data
npx prisma migrate reset
```

### Create New Migration

```bash
npx prisma migrate dev --name migration_name
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Production Considerations

For production deployment:

1. Use a managed PostgreSQL service (Supabase, Neon, AWS RDS)
2. Enable SSL connections
3. Use strong database passwords
4. Set up database backups
5. Configure connection pooling
6. Use environment-specific secrets
7. Never commit .env files

## Cloud Database Options

### Supabase
- Free tier available
- Built-in authentication
- Real-time subscriptions
- Sign up: https://supabase.com

### Neon
- Serverless PostgreSQL
- Branching support
- Auto-scaling
- Sign up: https://neon.tech

### Railway
- Simple deployment
- Built-in CI/CD
- Multiple databases supported
- Sign up: https://railway.app
