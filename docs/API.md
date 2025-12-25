# NightChill API Documentation

## Overview

The NightChill API is a RESTful API built with Node.js/Express that provides access to all wellness hub features. All endpoints return JSON responses.

**Base URL:** `https://api.nightchill.app/v1`

## Authentication

### Token-Based Authentication

All authenticated requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Endpoints

#### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token"
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  },
  "token": "jwt-token"
}
```

#### Logout
```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## User Endpoints

### Get Current User Profile
```http
GET /api/users/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "avatar": "https://cdn.nightchill.app/avatars/uuid.jpg",
  "bio": "Building resilience one step at a time.",
  "journeyLevel": 3,
  "currentStreak": 7,
  "longestStreak": 14,
  "totalCheckIns": 42,
  "themeMode": "neon",
  "notificationsEnabled": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update User Profile
```http
PUT /api/users/me
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "displayName": "New Name",
  "bio": "Updated bio",
  "themeMode": "dark",
  "notificationsEnabled": false
}
```

**Response:** `200 OK` (returns updated user object)

### Get User Journey Progress
```http
GET /api/users/me/journey
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "userId": "uuid",
  "level": 3,
  "totalCheckIns": 42,
  "gymVisits": 15,
  "mentorSessions": 3,
  "coffeeRedemptions": 8,
  "currentStreak": 7,
  "longestStreak": 14,
  "lastCheckIn": "2024-01-15T10:30:00Z",
  "levelStartDate": "2024-01-01T00:00:00Z",
  "levelCompletionPercentage": 65,
  "milestonesAchieved": [
    "first_check_in",
    "week_streak",
    "ten_gym_visits"
  ]
}
```

---

## Location Endpoints

### Get Nearby Locations
```http
GET /api/locations/nearby?lat={latitude}&lng={longitude}&type={type}&radius={radius}
```

**Query Parameters:**
- `lat` (required): Latitude (e.g., 51.5074)
- `lng` (required): Longitude (e.g., -0.1278)
- `type` (optional): Filter by type (coffee, gym, mentor, nutrition, partner)
- `radius` (optional): Search radius in kilometers (default: 5, max: 50)
- `anxietyLevel` (optional): Filter by anxiety level (low, medium, high)
- `beginnerFriendly` (optional): Filter beginner-friendly locations (true/false)
- `limit` (optional): Number of results (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "locations": [
    {
      "id": "uuid",
      "name": "Peaceful Grounds Café",
      "type": "coffee",
      "latitude": 51.5074,
      "longitude": -0.1278,
      "address": "123 Calm Street, London",
      "distance": 0.5,
      "anxietyLevel": "low",
      "hasQRReward": true,
      "isVerified": true,
      "isBeginnerFriendly": true,
      "rating": 4.8,
      "reviewCount": 125,
      "checkInCount": 450
    }
  ],
  "count": 1,
  "radius": 5
}
```

### Get Location Details
```http
GET /api/locations/{id}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Peaceful Grounds Café",
  "type": "coffee",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "address": "123 Calm Street",
  "city": "London",
  "country": "UK",
  "description": "A calm, welcoming café offering free coffee support...",
  "amenities": ["free_wifi", "quiet_space", "outdoor_seating"],
  "anxietyLevel": "low",
  "phone": "+44 20 1234 5678",
  "email": "hello@peacefulgrounds.com",
  "website": "https://peacefulgrounds.com",
  "hours": {
    "monday": { "open": "07:00", "close": "20:00" },
    "tuesday": { "open": "07:00", "close": "20:00" }
  },
  "hasQRReward": true,
  "isVerified": true,
  "isBeginnerFriendly": true,
  "images": [
    "https://cdn.nightchill.app/locations/uuid/1.jpg"
  ],
  "rating": 4.8,
  "reviewCount": 125,
  "checkInCount": 450,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Check In at Location
```http
POST /api/locations/{id}/checkin
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "note": "First visit, feeling calm",
  "mood": "calm",
  "qrCodeScanned": true
}
```

**Response:** `201 Created`
```json
{
  "checkIn": {
    "id": "uuid",
    "userId": "uuid",
    "locationId": "uuid",
    "timestamp": "2024-01-15T10:30:00Z",
    "note": "First visit, feeling calm",
    "mood": "calm",
    "qrCodeScanned": true
  },
  "reward": {
    "id": "uuid",
    "type": "coffee",
    "title": "Free Coffee",
    "qrCode": "qr-code-string"
  },
  "streakUpdated": true,
  "currentStreak": 8
}
```

### Get Location QR Code
```http
GET /api/locations/{id}/qr-code
```

**Response:** `200 OK`
```json
{
  "qrCodeUrl": "https://cdn.nightchill.app/qr/location-uuid.png",
  "qrCodeData": "nightchill://location/uuid"
}
```

### Add Location Review
```http
POST /api/locations/{id}/reviews
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "title": "Wonderful calming space",
  "content": "Great atmosphere, very welcoming staff..."
}
```

**Response:** `201 Created`

### Get Location Reviews
```http
GET /api/locations/{id}/reviews?page={page}&limit={limit}
```

**Response:** `200 OK`
```json
{
  "reviews": [
    {
      "id": "uuid",
      "userId": "uuid",
      "username": "user123",
      "rating": 5,
      "title": "Wonderful calming space",
      "content": "Great atmosphere...",
      "isVerifiedVisit": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 125,
    "pages": 13
  }
}
```

---

## Mentor Endpoints

### Get Nearby Mentors
```http
GET /api/mentors/nearby?lat={latitude}&lng={longitude}&radius={radius}
```

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in km (default: 10)
- `specialization` (optional): Filter by specialization
- `scheduleType` (optional): in-person, virtual, both

**Response:** `200 OK`
```json
{
  "mentors": [
    {
      "id": "uuid",
      "title": "Gym Owner & Mental Wellness Coach",
      "displayName": "John Smith",
      "specialization": ["fitness", "anxiety_support", "nutrition"],
      "bio": "Former athlete who understands pressure...",
      "verified": true,
      "available": true,
      "scheduleType": "both",
      "distance": 2.3,
      "rating": 4.9,
      "reviewCount": 45,
      "totalSessions": 230
    }
  ]
}
```

### Get Mentor Details
```http
GET /api/mentors/{id}
```

**Response:** `200 OK` (detailed mentor profile)

### Connect with Mentor
```http
POST /api/mentors/{id}/connect
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I'd like guidance on starting my fitness journey..."
}
```

**Response:** `201 Created`

### Schedule Mentor Session
```http
POST /api/mentors/sessions
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "mentorId": "uuid",
  "scheduledAt": "2024-01-20T14:00:00Z",
  "durationMinutes": 60,
  "sessionType": "virtual",
  "userNotes": "First session, feeling nervous"
}
```

**Response:** `201 Created`

### Get User's Mentor Sessions
```http
GET /api/mentors/sessions?status={status}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Reward Endpoints

### Get Available Rewards
```http
GET /api/rewards/available
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "rewards": [
    {
      "id": "uuid",
      "type": "coffee",
      "title": "Free Coffee at Peaceful Grounds",
      "description": "Redeem at any time",
      "qrCode": "qr-code-string",
      "redeemed": false,
      "expiresAt": "2024-02-01T00:00:00Z",
      "earnedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Redeem Reward
```http
POST /api/rewards/{id}/redeem
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "locationId": "uuid"
}
```

**Response:** `200 OK`

### Validate QR Code
```http
POST /api/rewards/qr/validate
```

**Request Body:**
```json
{
  "qrCode": "qr-code-string",
  "locationId": "uuid"
}
```

**Response:** `200 OK`
```json
{
  "valid": true,
  "reward": {
    "id": "uuid",
    "type": "coffee",
    "title": "Free Coffee"
  }
}
```

### Get Reward History
```http
GET /api/rewards/history?page={page}&limit={limit}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Chat Endpoints

### Send Chat Message
```http
POST /api/chat/message
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I'm feeling anxious about going to a gym"
}
```

**Response:** `200 OK`
```json
{
  "response": "That's completely normal. Would you like me to show you anxiety-friendly gyms near you? They're beginner-safe and have staff trained to support first-timers.",
  "suggestions": [
    "Show me nearby gyms",
    "Tell me about coffee support",
    "Find mentors"
  ],
  "resources": [
    {
      "type": "location",
      "id": "uuid",
      "title": "The Quiet Gym"
    }
  ]
}
```

### Get Chat History
```http
GET /api/chat/history?limit={limit}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "I'm feeling anxious...",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "That's completely normal...",
      "createdAt": "2024-01-15T10:30:05Z"
    }
  ]
}
```

### Clear Chat History
```http
DELETE /api/chat/clear
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## Notification Endpoints

### Get Notifications
```http
GET /api/notifications?read={true|false}&page={page}&limit={limit}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "streak_milestone",
      "title": "7 Day Streak! 🎉",
      "message": "You've checked in for 7 days in a row. That's progress!",
      "actionUrl": "/journey",
      "actionLabel": "View Journey",
      "read": false,
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### Mark Notification as Read
```http
PUT /api/notifications/{id}/read
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Update Notification Preferences
```http
PUT /api/notifications/preferences
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pushEnabled": true,
  "emailEnabled": false,
  "streakReminders": true,
  "mentorMessages": true,
  "rewards": true
}
```

**Response:** `200 OK`

---

## Check-In Endpoints

### Get User Check-Ins
```http
GET /api/checkins?startDate={date}&endDate={date}&page={page}&limit={limit}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "checkIns": [
    {
      "id": "uuid",
      "location": {
        "id": "uuid",
        "name": "Peaceful Grounds Café",
        "type": "coffee"
      },
      "timestamp": "2024-01-15T10:30:00Z",
      "note": "First visit, feeling calm",
      "mood": "calm",
      "qrCodeScanned": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context if applicable"
    }
  }
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_REQUEST` | Malformed request or missing required fields |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication token |
| 403 | `FORBIDDEN` | User doesn't have permission |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists (e.g., duplicate check-in) |
| 422 | `VALIDATION_ERROR` | Request validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

- **Anonymous requests:** 100 requests/hour
- **Authenticated requests:** 1000 requests/hour
- **Check-ins:** 50 per day per user
- **Chat messages:** 100 per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Webhooks

Partners can register webhooks for events:

### Events
- `reward.redeemed` - When a reward is redeemed at partner location
- `location.checkin` - When user checks in at partner location
- `review.created` - When a review is posted

### Webhook Payload
```json
{
  "event": "reward.redeemed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "rewardId": "uuid",
    "userId": "uuid",
    "locationId": "uuid"
  }
}
```

---

## API Versioning

Current version: `v1`

Version is specified in the URL: `/api/v1/...`

Breaking changes will result in a new API version.

---

## SDKs & Libraries

Official SDKs:
- JavaScript/TypeScript: `@nightchill/sdk-js`
- React: `@nightchill/sdk-react`
- React Native: `@nightchill/sdk-react-native`

---

## Support

- API Status: https://status.nightchill.app
- Documentation: https://docs.nightchill.app
- Support: support@nightchill.app
