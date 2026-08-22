-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('planning', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('sightseeing', 'food', 'adventure', 'culture', 'entertainment', 'nature', 'shopping');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('accommodation', 'transport', 'food', 'activities', 'shopping', 'other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "average_cost" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "description" TEXT,
    "estimated_cost" DECIMAL(10,2) NOT NULL,
    "duration" TEXT NOT NULL,
    "destination_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "budget" DECIMAL(12,2) NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'planning',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_stops" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_items" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itinerary_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_shares" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "share_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "access_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "destinations_country_idx" ON "destinations"("country");

-- CreateIndex
CREATE INDEX "destinations_name_idx" ON "destinations"("name");

-- CreateIndex
CREATE INDEX "activities_category_idx" ON "activities"("category");

-- CreateIndex
CREATE INDEX "activities_destination_id_idx" ON "activities"("destination_id");

-- CreateIndex
CREATE INDEX "trips_user_id_idx" ON "trips"("user_id");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE INDEX "trips_is_public_idx" ON "trips"("is_public");

-- CreateIndex
CREATE INDEX "trips_start_date_end_date_idx" ON "trips"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "trip_stops_trip_id_idx" ON "trip_stops"("trip_id");

-- CreateIndex
CREATE INDEX "trip_stops_destination_id_idx" ON "trip_stops"("destination_id");

-- CreateIndex
CREATE INDEX "trip_stops_trip_id_order_index_idx" ON "trip_stops"("trip_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "trip_stops_trip_id_order_index_key" ON "trip_stops"("trip_id", "order_index");

-- CreateIndex
CREATE INDEX "itinerary_items_trip_id_idx" ON "itinerary_items"("trip_id");

-- CreateIndex
CREATE INDEX "itinerary_items_activity_id_idx" ON "itinerary_items"("activity_id");

-- CreateIndex
CREATE INDEX "itinerary_items_trip_id_date_idx" ON "itinerary_items"("trip_id", "date");

-- CreateIndex
CREATE INDEX "itinerary_items_trip_id_date_order_index_idx" ON "itinerary_items"("trip_id", "date", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_items_trip_id_date_order_index_key" ON "itinerary_items"("trip_id", "date", "order_index");

-- CreateIndex
CREATE INDEX "expenses_trip_id_idx" ON "expenses"("trip_id");

-- CreateIndex
CREATE INDEX "expenses_category_idx" ON "expenses"("category");

-- CreateIndex
CREATE INDEX "expenses_date_idx" ON "expenses"("date");

-- CreateIndex
CREATE UNIQUE INDEX "trip_shares_trip_id_key" ON "trip_shares"("trip_id");

-- CreateIndex
CREATE INDEX "trip_shares_share_code_idx" ON "trip_shares"("share_code");

-- CreateIndex
CREATE INDEX "trip_shares_expires_at_idx" ON "trip_shares"("expires_at");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
