# GlobeTrotter

**Plan smarter. Travel better.**

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.20+-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=flat-square&logo=tailwind-css)
![Recharts](https://img.shields.io/badge/Recharts-2.15+-FF4154?style=flat-square&logo=recharts)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

GlobeTrotter is a personalized multi-city travel planning platform built for the Odoo LDCE Hackathon. It helps travelers turn a travel idea into a complete, organized, budget-aware itinerary.

Instead of managing destinations, activities, dates, budgets, and plans across multiple applications, GlobeTrotter brings everything together into one simple workflow.


## 🎯 The Problem

Planning a multi-city trip often requires switching between multiple platforms for:

- Finding destinations
- Discovering activities
- Managing travel dates
- Organizing daily plans
- Estimating expenses
- Tracking the overall budget
- Sharing itineraries with others

This becomes especially difficult when a trip contains multiple cities and many activities.

## 🚀 Our Goal

Build a single platform where a user can:

**Discover → Plan → Organize → Budget → Visualize → Share**

their entire trip.


## 💡 Our Solution

GlobeTrotter provides an end-to-end trip planning experience.

A user can:

1. Create a new trip
2. Select multiple destinations
3. Discover activities
4. Build a day-by-day itinerary
5. Assign activities to specific dates
6. Estimate and track the trip budget with activity cost integration
7. Identify scheduling or budget problems
8. View the complete trip on a calendar
9. Share the trip publicly
10. Copy an existing public trip as a starting point

## 🌐 Live Demo

**Check out the deployed application:** [GlobeTrotter Live Demo](https://globe-trotter-sand.vercel.app/)


## ✨ Key Features

### 🆕 Enhanced Budget Analytics
- **Activity Cost Integration**: Automatically calculates total estimated costs from planned activities
- **Visual Budget Comparison**: Interactive bar charts comparing estimated vs actual spending by category
- **Expense Distribution**: Pie charts showing actual spending breakdown across categories
- **Smart Budget Alerts**: Real-time warnings when approaching or exceeding budget limits
- **Comprehensive Budget Dashboard**: Summary cards showing total budget, estimated activity costs, and actual expenses
- **Activities Cost Table**: Detailed view of all planned activities with their estimated costs and completion status
- **Category Mapping**: Intelligent mapping of activity categories to expense categories for accurate budget tracking

### 1. Multi-City Trip Planning

Create trips containing multiple cities and organize them in a logical sequence.

**Example:**

```
Ahmedabad
    ↓
Mumbai
    ↓
Goa
    ↓
Bengaluru
```

Each destination can contain its own activities, dates, and estimated expenses.


### 2. Day-by-Day Itinerary

Build a detailed itinerary for every day of the trip.

**Example:**

```
Day 1 — Mumbai

09:00  Breakfast
10:30  Gateway of India
13:00  Lunch
15:00  Marine Drive
19:30  Dinner
```

Users can add, edit, remove, and organize activities within their trip.


### 3. Smart Budget Planning

GlobeTrotter automatically calculates estimated trip expenses and integrates activity costs with actual spending.

**Features:**
- **Activity Cost Integration**: Estimated costs from planned activities are automatically calculated and displayed
- **Expense Tracking**: Log actual expenses and compare them with planned activity costs
- **Visual Budget Analytics**: Interactive charts showing estimated vs actual spending by category
- **Smart Budget Warnings**: Alerts when approaching or exceeding budget limits
- **Category Breakdown**: Detailed analysis of spending across Accommodation, Transport, Activities, Food, and Misc

**Example:**

```
Summary Cards:
Total Budget:        ₹50,000
Est. Activity Costs: ₹27,450
Actual Expenses:     ₹15,200

Category Breakdown:
Accommodation     ₹9,000 (Est) vs ₹8,500 (Actual)
Transport         ₹6,500 (Est) vs ₹4,200 (Actual)
Activities        ₹5,200 (Est) vs ₹2,500 (Actual)
Food              ₹6,750 (Est) vs ₹0 (Actual)
--------------------------------
Total             ₹27,450 (Est) vs ₹15,200 (Actual)
```

The budget section includes:
- Pie chart showing actual expense distribution
- Bar chart comparing estimated activity costs vs actual spending
- Detailed activities table with estimated costs and completion status
- Comprehensive expense log with category breakdown

Users can compare estimated expenses with their planned budget and track spending in real-time.


### 4. Smart Itinerary Insights

GlobeTrotter focuses on useful planning intelligence rather than adding AI simply for the sake of having an AI feature.

The system can identify situations such as:

- Too many activities in a single day
- Overlapping activities
- Unrealistic schedules
- Insufficient time between activities
- Excessive daily spending
- Trips exceeding the planned budget (based on both actual expenses and estimated activity costs)
- Approaching budget limits (85%+ of budget utilization)

**Example:**

```
Planning Insight

Day 2 contains approximately 10.5 hours of activities.

Suggestion:
Consider moving the adventure activity to Day 3 for a more comfortable schedule.
```

```
Budget Insight

Your estimated activity costs (₹32,000) exceed your target budget of ₹30,000 by ₹2,000.

Suggestion:
Consider adjusting accommodation or activity options to stay within budget.
```

The goal is to help users create itineraries that are not only complete, but also realistic and budget-conscious.


### 5. Destination and Activity Discovery

Users can explore destinations and activities using search, filters, and categories.

Supported activity categories include:

- Sightseeing
- Food
- Adventure
- Culture
- Entertainment
- Nature
- Shopping

Each destination/activity can provide relevant information such as estimated cost and description.


### 6. Calendar View

The calendar provides a visual overview of the complete trip.

Users can quickly understand:

- Where they are going
- Which city they are visiting
- What activities are planned
- When activities take place
- How the trip progresses across multiple dates


### 7. Trip Sharing

Users can publish their trips and share them with others.

A public trip can contain:

- Trip title
- Destinations
- Dates
- Activities
- Itinerary
- Budget summary

Other users can use **"Copy This Trip"** to create their own version of an existing itinerary.


### 8. Community

GlobeTrotter includes a lightweight travel community where users can discover publicly shared trips.

Users can browse:

- Popular trips
- Interesting destinations
- Public itineraries
- Other travelers' plans

The focus is on travel inspiration and reusable itineraries rather than building a complex social network.


## 🗺️ Core User Journey

```
Dashboard
    ↓
Create New Trip
    ↓
Select Destinations
    ↓
Select Activities
    ↓
Build Itinerary
    ↓
Smart Validation
    ↓
Budget Analysis
    ↓
Calendar View
    ↓
Share / Publish
```


## 🏗️ Architecture

GlobeTrotter follows a simple full-stack architecture designed to be maintainable and scalable.

```
Frontend
    ↓
Backend / API
    ↓
Database
```

**Frontend** provides the user interface.

**Backend** handles:

- Authentication
- Trip management
- Business logic
- Budget calculations
- Itinerary validation
- Data retrieval

**Database** stores:

- Users
- Trips
- Destinations
- Activities
- Trip stops
- Expenses
- Shared trips


## 📊 Data Model

The core relationships are:

```
User
 |
 └── Trip
       |
       ├── Trip Stop
       |      |
       |      └── City
       |
       ├── Trip Activity
       |      |
       |      └── Activity
       |
       └── Expense
```

**Main entities:**

- User
- Trip
- City / Destination
- Activity
- Trip Stop
- Trip Activity
- Expense
- Trip Share

This allows the application to dynamically generate and manage the user's itinerary rather than relying on hard-coded trip data.


## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework for production
- **React 18** - UI library
- **TypeScript 5.6** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Recharts 2.15** - Chart library for budget visualization
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side backend
- **TypeScript** - Type-safe JavaScript
- **NextAuth 4** - Authentication
- **Zod** - Schema validation

### Database
- **PostgreSQL** - Relational database
- **Prisma ORM 5.20** - Database toolkit
- **bcryptjs** - Password hashing

### Development
- **Git** - Version control
- **GitHub** - Code hosting
- **tsx** - TypeScript execution


## 📁 Project Structure

```
globetrotter/
|
├── app/
│   ├── dashboard/
│   ├── trips/
│   ├── explore/
│   ├── itinerary/
│   ├── calendar/
│   ├── community/
│   ├── profile/
│   └── api/
|
├── components/
│   ├── layout/
│   ├── trips/
│   ├── itinerary/
│   ├── destinations/
│   ├── activities/
│   ├── budget/
│   ├── calendar/
│   └── ui/
|
├── lib/
│   ├── db/
│   │   ├── prisma.ts
│   │   └── index.ts
│   ├── auth/
│   ├── validations/
│   └── utils/
|
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│       └── 20260822000000_init/
│           └── migration.sql
||
├── scripts/
│   ├── setup-db.sh
│   └── verify-db.ts
|
├── public/
│   └── images/
|
├── types/
│   ├── user.ts
│   ├── trip.ts
│   ├── destination.ts
│   ├── activity.ts
│   ├── expense.ts
│   ├── itinerary.ts
│   ├── community.ts
│   └── api.ts
|
├── .env.example
├── docker-compose.yml
├── package.json
├── DATABASE_SETUP.md
├── DATABASE_IMPLEMENTATION_SUMMARY.md
└── README.md
```


## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 18+
- npm / pnpm / yarn
- Docker and Docker Compose (recommended for local development)
- Git


### 1. Clone the Repository

```bash
git clone https://github.com/Vrushank2107/GlobeTrotter
cd globetrotter
```


### 2. Install Dependencies

```bash
npm install
```


### 3. Configure Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

**Example:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globetrotter"
AUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

Add any additional API keys required by the project.


### 4. Start the Database

**Option 1: Using Docker Compose (recommended):**

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the default credentials:
- Username: `postgres`
- Password: `postgres`
- Database: `globetrotter`
- Port: `5432`

**Option 2: Using your own PostgreSQL instance:**

1. Make sure PostgreSQL is installed and running
2. Run the setup script:
   ```bash
   ./scripts/setup-db.sh
   ```
3. Or manually create the database:
   ```bash
   createdb globetrotter
   ```
4. Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string

**Option 3: Using a cloud PostgreSQL service:**

Update the `DATABASE_URL` in your `.env` file with your cloud provider's connection string (e.g., Supabase, Neon, Railway).


### 5. Set Up the Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

If seed data is available:

```bash
npm run seed
```

### 6. Verify Database Setup (Optional)

```bash
npm run verify-db
```

This will verify:
- Database connection
- Table structure
- Constraints and indexes
- CRUD operations
- Seed data presence
- Relationship integrity

### 7. View Database (Optional)

**Using Prisma Studio (Recommended):**
```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

**Using psql:**
```bash
docker exec -it globetrotter-db psql -U postgres -d globetrotter
```


### 8. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## 🚀 Deployment

### Vercel Deployment

GlobeTrotter is currently deployed on Vercel: [https://globe-trotter-sand.vercel.app/](https://globe-trotter-sand.vercel.app/)

**Deployment Steps:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables:**
   Add these in Vercel project settings:
   ```
   DATABASE_URL=your-production-database-url
   AUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://globe-trotter-sand.vercel.app
   ```

4. **Deploy:**
   - Vercel will automatically deploy on every push to main
   - Or trigger manual deployment from the Vercel dashboard

**Production Database:**
- Use a managed PostgreSQL service (Supabase, Neon, Railway)
- Update `DATABASE_URL` with production connection string
- Run migrations: `npx prisma migrate deploy`

**Build Configuration:**
The project uses standard Next.js build configuration compatible with Vercel's automatic deployment.


## �️ Database Status

✅ **Database implementation is complete and verified**

### Database Schema
- **8 Models**: User, Destination, Activity, Trip, TripStop, ItineraryItem, Expense, TripShare
- **3 Enums**: TripStatus, ActivityCategory, ExpenseCategory
- **20+ Indexes**: Optimized for performance
- **Foreign Key Constraints**: CASCADE and RESTRICT rules
- **Unique Constraints**: Email, share codes, ordering

### Seed Data
- **1 Demo User**: demo@globetrotter.com / demo123
- **5 Destinations**: Mumbai, Goa, Bengaluru, Delhi, Jaipur
- **12 Activities**: Across all categories
- **1 Sample Trip**: "Western India Adventure" with 3 destinations
- **5 Itinerary Items**: Scheduled activities
- **3 Expenses**: Budget tracking
- **1 Trip Share**: Public sharing enabled

### Database Features
- ✅ Multi-city trip planning support
- ✅ Day-by-day itinerary scheduling
- ✅ Budget tracking with categories
- ✅ Activity discovery and categorization
- ✅ Trip sharing with access tracking
- ✅ Password hashing (bcryptjs)
- ✅ Proper relationship integrity
- ✅ Performance optimization

For detailed database documentation, see:
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Setup and troubleshooting guide
- [DATABASE_IMPLEMENTATION_SUMMARY.md](DATABASE_IMPLEMENTATION_SUMMARY.md) - Complete implementation details


## �🔐 Environment Variables

**Required:**

```env
DATABASE_URL=
AUTH_SECRET=
```

**Optional (External APIs):**

```env
MAPS_API_KEY=
TRAVEL_API_KEY=
AI_API_KEY=
```


## ✅ Testing Checklist

**🎉 All Features Tested & Verified - Production Ready!**

### Authentication ✅
- ✅ User registration
- ✅ Login  
- ✅ Logout
- ✅ Invalid credentials handling

### Trip Creation ✅
- ✅ Create trip
- ✅ Select dates
- ✅ Search destinations
- ✅ Add multiple cities
- ✅ Edit destinations
- ✅ Remove destinations

### Activities ✅
- ✅ Search activities
- ✅ Add activity
- ✅ Edit activity
- ✅ Remove activity
- ✅ Assign activity to date/time

### Itinerary ✅
- ✅ Multi-day itinerary
- ✅ Multiple destinations
- ✅ Activity ordering
- ✅ Schedule validation

### Budget ✅
- ✅ Expense calculation
- ✅ Category breakdown
- ✅ Budget comparison
- ✅ Over-budget warning
- ✅ Activity cost integration
- ✅ Visual budget analytics

### Calendar ✅
- ✅ Display trip dates
- ✅ Display activities
- ✅ Correct date assignment

### Sharing ✅
- ✅ Publish trip
- ✅ View public trip
- ✅ Copy public trip

### UI ✅
- ✅ Responsive desktop layout
- ✅ Tablet layout
- ✅ Mobile layout
- ✅ Loading states
- ✅ Empty states
- ✅ Error states
- ✅ Form validation


## 🎯 Hackathon Focus

GlobeTrotter was designed with one simple principle:

**Build the complete core experience instead of adding unnecessary features.**

The primary focus is the journey:

```
Idea
 ↓
Destination
 ↓
Activity
 ↓
Itinerary
 ↓
Budget
 ↓
Calendar
 ↓
Share
```

Every feature should contribute to making that journey faster, clearer, or smarter.


## 💎 Why GlobeTrotter?

Traditional travel planning often involves multiple disconnected tools.

GlobeTrotter combines:

**Discovery + Planning + Scheduling + Budgeting + Visualization + Sharing**

into a single workflow.

The platform doesn't just store a list of places.

It helps users answer:

> *"Can I realistically fit all of this into my trip and stay within my budget?"*

That is the core problem GlobeTrotter is designed to solve.


## 🌟 Hackathon Highlights

### Personalized
Every itinerary is created around the user's destinations, dates, activities, and budget.

### Dynamic
Trip information is stored and retrieved dynamically rather than relying on static UI data.

### Relational
Trips, cities, activities, expenses, and users are connected through a structured relational data model.

### Intelligent
The system identifies scheduling and budget issues and provides actionable planning insights.

### Visual Analytics
Interactive charts and graphs provide clear visualization of:
- Activity cost estimation vs actual spending
- Category-wise budget breakdown
- Multi-city expense distribution
- Budget utilization progress

### Shareable
Users can publish and reuse travel itineraries.

### Practical
The application focuses on solving an actual travel-planning problem rather than adding technology without a purpose.


## 🔮 Future Improvements

Potential future enhancements include:

- Real-time flight and hotel pricing
- Live maps and route optimization
- Weather-aware itinerary planning
- Public trip ratings and reviews
- Collaborative trip planning
- Real-time travel alerts
- Advanced personalized recommendations
- Offline itinerary access
- Mobile applications
- More advanced AI-assisted itinerary optimization
- Budget forecasting and expense prediction
- Multi-currency support for international travel
- Integration with travel booking services

---

## 🏆 Hackathon

**Odoo LDCE Hackathon 2026**

### Team Members

- **Vrushank Solanki**
- **Yaksh Rana**

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Contact

For questions or feedback about GlobeTrotter, please reach out to the team members.

---

<div align="center">

**GlobeTrotter**

*Plan smarter. Travel better.*

[🌐 Live Demo](https://globe-trotter-sand.vercel.app/) • [🐛 Report Issues](https://github.com/Vrushank2107/GlobeTrotter/issues)

</div>
