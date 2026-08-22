# GlobeTrotter Backend API Documentation

GlobeTrotter provides a RESTful Next.js API layer backed by PostgreSQL and Prisma ORM for multi-city travel planning, itinerary scheduling, budget tracking, and trip sharing.

---

## Base URL
`/api`

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message description",
  "errors": []
}
```

---

## 1. Authentication Endpoints

### Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Nirmal Purja",
    "email": "nirmal@globetrotter.io",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_uuid",
      "name": "Nirmal Purja",
      "email": "nirmal@globetrotter.io",
      "avatar": "https://images.unsplash.com/...",
      "createdAt": "2026-08-22T12:00:00.000Z"
    },
    "message": "User registered successfully"
  }
  ```

### User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "demo@globetrotter.com",
    "password": "demo123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_demo",
      "name": "Nirmal Purja",
      "email": "demo@globetrotter.com"
    },
    "message": "Login successful"
  }
  ```

### Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Query Params**: `userId` (optional)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_demo",
      "name": "Nirmal Purja",
      "email": "demo@globetrotter.com",
      "memberType": "Pro Member",
      "countriesVisited": 12,
      "tripsPlanned": 8,
      "totalBudgetSpent": 385000
    }
  }
  ```

---

## 2. Destinations & Activities Endpoints

### List Destinations
- **Method**: `GET`
- **Endpoint**: `/api/destinations`
- **Query Params**: `q` (optional search query)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "dest_goa",
        "name": "Goa",
        "country": "India",
        "region": "South Asia",
        "coverImage": "https://images.unsplash.com/...",
        "avgCostPerDay": 3500,
        "rating": 4.8
      }
    ]
  }
  ```

### List or Search Activities
- **Method**: `GET`
- **Endpoint**: `/api/activities`
- **Query Params**: `destinationId` (optional)
- **Response**: `200 OK`

### Create Custom Activity
- **Method**: `POST`
- **Endpoint**: `/api/activities`
- **Request Body**:
  ```json
  {
    "name": "Scuba Diving in Palolem",
    "category": "adventure",
    "description": "Certified guide dive",
    "estimatedCost": 4500,
    "duration": "180 mins",
    "destinationId": "dest_goa"
  }
  ```

---

## 3. Trips Endpoints

### Get User Trips
- **Method**: `GET`
- **Endpoint**: `/api/trips`
- **Query Params**: `userId` (optional)
- **Response**: `200 OK`

### Create New Multi-City Trip
- **Method**: `POST`
- **Endpoint**: `/api/trips`
- **Request Body**:
  ```json
  {
    "title": "Goa & Mumbai Coastal Getaway",
    "startDate": "2026-10-15",
    "endDate": "2026-10-22",
    "totalBudget": 45000,
    "isPublic": false,
    "destinations": [
      { "cityName": "Panaji", "country": "India", "startDate": "2026-10-15", "endDate": "2026-10-18" },
      { "cityName": "Palolem", "country": "India", "startDate": "2026-10-18", "endDate": "2026-10-22" }
    ]
  }
  ```

### Get Trip Details
- **Method**: `GET`
- **Endpoint**: `/api/trips/[tripId]`

### Update Trip
- **Method**: `PUT`
- **Endpoint**: `/api/trips/[tripId]`

### Delete Trip
- **Method**: `DELETE`
- **Endpoint**: `/api/trips/[tripId]`

### Clone Public Trip
- **Method**: `POST`
- **Endpoint**: `/api/trips/[tripId]/clone`

---

## 4. Itinerary & Expense Endpoints

### Add Activity to Itinerary
- **Method**: `POST`
- **Endpoint**: `/api/itinerary`
- **Request Body**:
  ```json
  {
    "tripId": "trip_goa_01",
    "title": "Parasailing",
    "category": "Adventure",
    "location": "Calangute Beach",
    "time": "10:00 AM",
    "durationMinutes": 180,
    "cost": 3500,
    "dayNumber": 2,
    "dateStr": "2026-10-16"
  }
  ```

### Delete Itinerary Item
- **Method**: `DELETE`
- **Endpoint**: `/api/itinerary/[itemId]?tripId=trip_goa_01`

### Add Expense
- **Method**: `POST`
- **Endpoint**: `/api/expenses`
- **Request Body**:
  ```json
  {
    "tripId": "trip_goa_01",
    "title": "Hotel Deposit",
    "category": "Accommodation",
    "amount": 15000,
    "date": "2026-10-15",
    "paidBy": "Nirmal Purja"
  }
  ```

### Delete Expense
- **Method**: `DELETE`
- **Endpoint**: `/api/expenses/[expenseId]?tripId=trip_goa_01`

---

## 5. Sharing, Community & Calendar Endpoints

### List Public Community Trips
- **Method**: `GET`
- **Endpoint**: `/api/community`

### Generate Trip Share Code
- **Method**: `POST`
- **Endpoint**: `/api/trips/[tripId]/share`

### Get Public Trip by Share Code
- **Method**: `GET`
- **Endpoint**: `/api/public-trip/[shareCode]`

### Get Calendar Schedule
- **Method**: `GET`
- **Endpoint**: `/api/calendar`
