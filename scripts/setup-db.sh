#!/bin/bash

# Database setup script for GlobeTrotter
# This script helps set up the PostgreSQL database

echo "GlobeTrotter Database Setup"
echo "============================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo ""
    echo "To install PostgreSQL:"
    echo "  - macOS: brew install postgresql@15"
    echo "  - Ubuntu: sudo apt-get install postgresql"
    echo "  - Or use Docker Compose: docker-compose up -d"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL is not running"
    echo ""
    echo "To start PostgreSQL:"
    echo "  - macOS with Homebrew: brew services start postgresql@15"
    echo "  - Linux: sudo service postgresql start"
    echo "  - Or use Docker Compose: docker-compose up -d"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Check if database exists
DB_EXISTS=$(psql -lqt | cut -d \| -f 1 | grep -w globetrotter | wc -l)

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "Creating database 'globetrotter'..."
    createdb globetrotter
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database"
        exit 1
    fi
else
    echo "✅ Database 'globetrotter' already exists"
fi

echo ""
echo "Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Ensure .env file has correct DATABASE_URL"
echo "  2. Run: npx prisma migrate dev --name init"
echo "  3. Run: npm run seed"
