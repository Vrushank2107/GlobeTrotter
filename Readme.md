GLOBETROTTER
Plan smarter. Travel better.

GlobeTrotter is a personalized multi-city travel planning platform built for the Odoo LDCE Hackathon. It helps travelers turn a travel idea into a complete, organized, budget-aware itinerary.

Instead of managing destinations, activities, dates, budgets, and plans across multiple applications, GlobeTrotter brings everything together into one simple workflow.


THE PROBLEM

Planning a multi-city trip often requires switching between multiple platforms for:

- Finding destinations
- Discovering activities
- Managing travel dates
- Organizing daily plans
- Estimating expenses
- Tracking the overall budget
- Sharing itineraries with others

This becomes especially difficult when a trip contains multiple cities and many activities.

OUR GOAL

Build a single platform where a user can:

Discover → Plan → Organize → Budget → Visualize → Share

their entire trip.


OUR SOLUTION

GlobeTrotter provides an end-to-end trip planning experience.

A user can:

1. Create a new trip
2. Select multiple destinations
3. Discover activities
4. Build a day-by-day itinerary
5. Assign activities to specific dates
6. Estimate and track the trip budget
7. Identify scheduling or budget problems
8. View the complete trip on a calendar
9. Share the trip publicly
10. Copy an existing public trip as a starting point


KEY FEATURES

1. MULTI-CITY TRIP PLANNING

Create trips containing multiple cities and organize them in a logical sequence.

Example:

Ahmedabad
    ↓
Mumbai
    ↓
Goa
    ↓
Bengaluru

Each destination can contain its own activities, dates, and estimated expenses.


2. DAY-BY-DAY ITINERARY

Build a detailed itinerary for every day of the trip.

Example:

Day 1 — Mumbai

09:00  Breakfast
10:30  Gateway of India
13:00  Lunch
15:00  Marine Drive
19:30  Dinner

Users can add, edit, remove, and organize activities within their trip.


3. SMART BUDGET PLANNING

GlobeTrotter automatically calculates estimated trip expenses.

Example:

Accommodation     ₹9,000
Transport         ₹6,500
Activities        ₹5,200
Food              ₹6,750
--------------------------------
Total             ₹27,450

Users can compare estimated expenses with their planned budget.

The application can highlight situations where the user is approaching or exceeding their budget.


4. SMART ITINERARY INSIGHTS

GlobeTrotter focuses on useful planning intelligence rather than adding AI simply for the sake of having an AI feature.

The system can identify situations such as:

- Too many activities in a single day
- Overlapping activities
- Unrealistic schedules
- Insufficient time between activities
- Excessive daily spending
- Trips exceeding the planned budget

Example:

Planning Insight

Day 2 contains approximately 10.5 hours of activities.

Suggestion:
Consider moving the adventure activity to Day 3 for a more comfortable schedule.

The goal is to help users create itineraries that are not only complete, but also realistic.


5. DESTINATION AND ACTIVITY DISCOVERY

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


6. CALENDAR VIEW

The calendar provides a visual overview of the complete trip.

Users can quickly understand:

- Where they are going
- Which city they are visiting
- What activities are planned
- When activities take place
- How the trip progresses across multiple dates


7. TRIP SHARING

Users can publish their trips and share them with others.

A public trip can contain:

- Trip title
- Destinations
- Dates
- Activities
- Itinerary
- Budget summary

Other users can use:

Copy This Trip

to create their own version of an existing itinerary.


8. COMMUNITY

GlobeTrotter includes a lightweight travel community where users can discover publicly shared trips.

Users can browse:

- Popular trips
- Interesting destinations
- Public itineraries
- Other travelers' plans

The focus is on travel inspiration and reusable itineraries rather than building a complex social network.


CORE USER JOURNEY

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


ARCHITECTURE

GlobeTrotter follows a simple full-stack architecture designed to be maintainable and scalable.

Frontend
    ↓
Backend / API
    ↓
Database

The frontend provides the user interface.

The backend handles:

- Authentication
- Trip management
- Business logic
- Budget calculations
- Itinerary validation
- Data retrieval

The database stores:

- Users
- Trips
- Destinations
- Activities
- Trip stops
- Expenses
- Shared trips


DATA MODEL

The core relationships are:

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

Main entities:

- User
- Trip
- City / Destination
- Activity
- Trip Stop
- Trip Activity
- Expense
- Trip Share

This allows the application to dynamically generate and manage the user's itinerary rather than relying on hard-coded trip data.


TECHNOLOGY STACK

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:
- Next.js API / Server-side backend
- TypeScript

Database:
- PostgreSQL
- Prisma ORM

Development:
- Git
- GitHub


PROJECT STRUCTURE

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
│   ├── auth/
│   ├── validations/
│   └── utils/
|
├── prisma/
│   └── schema.prisma
|
├── public/
│   └── images/
|
├── types/
|
├── .env.example
├── package.json
└── README.md


GETTING STARTED

PREREQUISITES

Make sure you have installed:

- Node.js 18+
- npm / pnpm / yarn
- PostgreSQL
- Git


1. CLONE THE REPOSITORY

git clone https://github.com/Vrushank2107/GlobeTrotter

cd globetrotter


2. INSTALL DEPENDENCIES

npm install


3. CONFIGURE ENVIRONMENT VARIABLES

Create a .env file.

Example:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/globetrotter"

AUTH_SECRET="your-secret"

NEXTAUTH_URL="http://localhost:3000"

Add any additional API keys required by the project.


4. SET UP THE DATABASE

npx prisma generate

npx prisma migrate dev

If seed data is available:

npm run seed


5. START THE DEVELOPMENT SERVER

npm run dev

Open:

http://localhost:3000


ENVIRONMENT VARIABLES

Example:

DATABASE_URL=
AUTH_SECRET=

Optional external APIs:

MAPS_API_KEY=
TRAVEL_API_KEY=
AI_API_KEY=


TESTING CHECKLIST

Authentication:

[ ] User registration
[ ] Login
[ ] Logout
[ ] Invalid credentials handling

Trip Creation:

[ ] Create trip
[ ] Select dates
[ ] Search destinations
[ ] Add multiple cities
[ ] Edit destinations
[ ] Remove destinations

Activities:

[ ] Search activities
[ ] Add activity
[ ] Edit activity
[ ] Remove activity
[ ] Assign activity to date/time

Itinerary:

[ ] Multi-day itinerary
[ ] Multiple destinations
[ ] Activity ordering
[ ] Schedule validation

Budget:

[ ] Expense calculation
[ ] Category breakdown
[ ] Budget comparison
[ ] Over-budget warning

Calendar:

[ ] Display trip dates
[ ] Display activities
[ ] Correct date assignment

Sharing:

[ ] Publish trip
[ ] View public trip
[ ] Copy public trip

UI:

[ ] Responsive desktop layout
[ ] Tablet layout
[ ] Mobile layout
[ ] Loading states
[ ] Empty states
[ ] Error states
[ ] Form validation


HACKATHON FOCUS

GlobeTrotter was designed with one simple principle:

Build the complete core experience instead of adding unnecessary features.

The primary focus is the journey:

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

Every feature should contribute to making that journey faster, clearer, or smarter.


WHY GLOBETROTTER?

Traditional travel planning often involves multiple disconnected tools.

GlobeTrotter combines:

Discovery + Planning + Scheduling + Budgeting + Visualization + Sharing

into a single workflow.

The platform doesn't just store a list of places.

It helps users answer:

"Can I realistically fit all of this into my trip and stay within my budget?"

That is the core problem GlobeTrotter is designed to solve.


HACKATHON HIGHLIGHTS

Personalized

Every itinerary is created around the user's destinations, dates, activities, and budget.


Dynamic

Trip information is stored and retrieved dynamically rather than relying on static UI data.


Relational

Trips, cities, activities, expenses, and users are connected through a structured relational data model.


Intelligent

The system identifies scheduling and budget issues and provides actionable planning insights.


Shareable

Users can publish and reuse travel itineraries.


Practical

The application focuses on solving an actual travel-planning problem rather than adding technology without a purpose.


FUTURE IMPROVEMENTS

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

Hackathon: Odoo LDCE Hackathon 2026

Team Members:

- Vrushank Solanki
- Yaksh Rana


GLOBETROTTER

Plan smarter. Travel better.
