# NightChill Technical Architecture

## Overview

NightChill is built as a cross-platform wellness hub with web and mobile applications, backed by a cloud infrastructure that emphasizes privacy, security, and scalability.

## Technology Stack

### Frontend
- **Web:** React.js with TypeScript
- **Mobile:** React Native (iOS & Android)
- **State Management:** Redux Toolkit or Zustand
- **Routing:** React Navigation (mobile) / React Router (web)
- **UI Components:** Custom component library
- **Maps:** Mapbox GL or Google Maps API
- **Styling:** Styled Components or Tailwind CSS

### Backend
- **Runtime:** Node.js with Express or Fastify
- **Language:** TypeScript
- **Database:** PostgreSQL (primary) + Redis (cache)
- **File Storage:** AWS S3 or Firebase Storage
- **Real-time:** Socket.io or Firebase Realtime Database
- **Search:** Elasticsearch (for location search)

### Infrastructure
- **Hosting:** AWS or Google Cloud Platform
- **CDN:** CloudFlare
- **Authentication:** Firebase Auth or Auth0
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (errors) + DataDog (metrics)

### Third-Party Services
- **Maps:** Mapbox or Google Maps
- **QR Codes:** QR code generator library
- **Push Notifications:** Firebase Cloud Messaging
- **Analytics:** Privacy-focused (Plausible or self-hosted)
- **Email:** SendGrid or AWS SES

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                             │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │   Web App       │              │   Mobile App    │      │
│  │   (React)       │              │ (React Native)  │      │
│  └────────┬────────┘              └────────┬────────┘      │
└───────────┼──────────────────────────────────┼─────────────┘
            │                                  │
            └─────────────┬────────────────────┘
                          │
                          ▼
            ┌─────────────────────────┐
            │      API Gateway        │
            │    (Load Balancer)      │
            └─────────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌──────────────┐
│   Auth        │ │   Map         │ │   User       │
│   Service     │ │   Service     │ │   Service    │
└───────┬───────┘ └───────┬───────┘ └──────┬───────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────┐                   ┌──────────────┐
│  PostgreSQL   │                   │    Redis     │
│  (Primary DB) │                   │   (Cache)    │
└───────────────┘                   └──────────────┘
```

## System Components

### 1. User Service
**Responsibilities:**
- User registration and profile management
- Journey progress tracking
- Wellness level management
- User preferences (theme mode, notifications)

**Key Endpoints:**
```
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/journey
PUT    /api/users/journey/checkin
GET    /api/users/progress
```

### 2. Map Service
**Responsibilities:**
- Location management (gyms, cafés, mentors)
- Geospatial queries (find nearby locations)
- Location verification and reviews
- QR code generation for locations

**Key Endpoints:**
```
GET    /api/locations/nearby?lat={lat}&lng={lng}&type={type}
GET    /api/locations/{id}
POST   /api/locations/{id}/checkin
GET    /api/locations/{id}/qr-code
POST   /api/locations/{id}/review
GET    /api/locations/types
```

### 3. Mentor Service
**Responsibilities:**
- Mentor profiles and availability
- Mentor-user matching
- Session scheduling
- Communication facilitation

**Key Endpoints:**
```
GET    /api/mentors/nearby?lat={lat}&lng={lng}
GET    /api/mentors/{id}
POST   /api/mentors/{id}/connect
GET    /api/mentors/sessions
POST   /api/mentors/sessions/schedule
```

### 4. Rewards Service
**Responsibilities:**
- QR code redemption
- Reward tracking and distribution
- Partner management
- Streak calculation

**Key Endpoints:**
```
POST   /api/rewards/redeem
GET    /api/rewards/available
GET    /api/rewards/history
POST   /api/rewards/qr/validate
```

### 5. Chat Service
**Responsibilities:**
- AI chatbot interactions
- Context management
- Resource suggestions
- Crisis detection and routing

**Key Endpoints:**
```
POST   /api/chat/message
GET    /api/chat/history
DELETE /api/chat/clear
```

### 6. Notification Service
**Responsibilities:**
- Push notifications
- Email notifications
- In-app notifications
- Notification preferences

**Key Endpoints:**
```
POST   /api/notifications/send
GET    /api/notifications
PUT    /api/notifications/{id}/read
PUT    /api/notifications/preferences
```

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  createdAt: Date;
  
  // Profile
  avatar?: string;
  bio?: string;
  
  // Journey
  journeyLevel: 1 | 2 | 3 | 4 | 5;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  
  // Preferences
  themeMode: 'light' | 'dark' | 'neon';
  notificationsEnabled: boolean;
  
  // Privacy
  privacySettings: PrivacySettings;
  consentGiven: boolean;
  consentDate?: Date;
}
```

### Location
```typescript
interface Location {
  id: string;
  name: string;
  type: 'coffee' | 'gym' | 'mentor' | 'nutrition' | 'partner';
  
  // Geolocation
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  
  // Details
  description: string;
  amenities: string[];
  anxietyLevel: 'low' | 'medium' | 'high';
  
  // Contact
  phone?: string;
  email?: string;
  website?: string;
  
  // Hours
  hours: OperatingHours;
  
  // Features
  hasQRReward: boolean;
  isVerified: boolean;
  isBeginnerFriendly: boolean;
  
  // Media
  images: string[];
  
  // Stats
  rating: number;
  reviewCount: number;
  checkInCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### CheckIn
```typescript
interface CheckIn {
  id: string;
  userId: string;
  locationId: string;
  timestamp: Date;
  
  // Optional
  note?: string;
  mood?: 'calm' | 'anxious' | 'neutral' | 'motivated';
  
  // Rewards
  rewardEarned?: string;
  qrCodeScanned: boolean;
}
```

### Journey Progress
```typescript
interface JourneyProgress {
  userId: string;
  level: 1 | 2 | 3 | 4 | 5;
  
  // Tracking
  totalCheckIns: number;
  gymVisits: number;
  mentorSessions: number;
  coffeeRedemptions: number;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  
  // Level Progress
  levelStartDate: Date;
  levelCompletionPercentage: number;
  
  // Milestones
  milestonesAchieved: string[];
}
```

### Mentor
```typescript
interface Mentor {
  id: string;
  userId: string; // Links to User table
  
  // Profile
  title: string; // "Gym Owner", "Personal Trainer", etc.
  specialization: string[];
  bio: string;
  verified: boolean;
  
  // Availability
  available: boolean;
  scheduleType: 'in-person' | 'virtual' | 'both';
  
  // Location
  locationId?: string; // If tied to a gym/location
  latitude?: number;
  longitude?: number;
  
  // Stats
  totalSessions: number;
  rating: number;
  reviewCount: number;
  
  createdAt: Date;
}
```

### Reward
```typescript
interface Reward {
  id: string;
  userId: string;
  
  type: 'coffee' | 'gym_pass' | 'discount' | 'badge';
  title: string;
  description: string;
  
  // Redemption
  qrCode?: string;
  redeemed: boolean;
  redeemedAt?: Date;
  redeemedLocationId?: string;
  
  // Expiry
  expiresAt?: Date;
  
  // Partner
  partnerId?: string;
  
  earnedAt: Date;
}
```

## Security Considerations

### Authentication
- JWT tokens with refresh mechanism
- OAuth2 integration (Google, Apple Sign-In)
- Multi-factor authentication (optional)
- Password requirements: bcrypt hashing

### Data Privacy
- GDPR compliance
- User data export functionality
- Right to be forgotten (account deletion)
- Encrypted sensitive data at rest
- HTTPS/TLS for all communications

### API Security
- Rate limiting per user/IP
- Input validation and sanitization
- CORS configuration
- SQL injection prevention (parameterized queries)
- XSS protection

### QR Code Security
- Time-limited codes
- Single-use redemption
- Cryptographic signing
- Server-side validation

## Scalability

### Database
- Read replicas for query distribution
- Connection pooling
- Indexed queries on frequently accessed fields
- Partitioning for large tables (check-ins, locations)

### Caching Strategy
- Redis for:
  - User sessions
  - Frequently accessed locations
  - API response caching
  - Real-time data

### CDN
- Static assets (images, CSS, JS)
- QR code images
- User avatars

### Load Balancing
- Geographic distribution
- Health checks
- Auto-scaling based on traffic

## Monitoring & Logging

### Application Metrics
- Response times
- Error rates
- User activity
- Check-in frequency

### Infrastructure Metrics
- CPU/Memory usage
- Database performance
- Network traffic
- Storage capacity

### User Analytics (Privacy-Focused)
- Feature usage (aggregated)
- Journey level distribution
- Popular locations
- NO personal tracking without consent

## Deployment

### Environments
- **Development:** Local development with Docker
- **Staging:** Cloud environment for testing
- **Production:** Multi-region deployment

### CI/CD Pipeline
```yaml
1. Code Push → GitHub
2. Automated Tests Run
3. Build Docker Images
4. Deploy to Staging
5. Integration Tests
6. Manual Approval
7. Deploy to Production
8. Health Checks
```

### Rollback Strategy
- Blue-green deployment
- Database migration rollback scripts
- Automated health checks
- Instant rollback capability

## Third-Party Integrations

### Maps
- Mapbox GL JS or Google Maps
- Geolocation API
- Reverse geocoding
- Distance calculation

### QR Codes
- QR code generation library (qrcode.js)
- Secure signing for validation
- Dynamic QR codes for tracking

### Chat AI
- OpenAI GPT-4 or similar
- Custom training for supportive tone
- Crisis keyword detection
- Resource recommendation system

## Performance Targets

- **API Response Time:** < 200ms (p95)
- **Page Load Time:** < 2s
- **Map Rendering:** < 1s
- **Uptime:** 99.9%
- **Mobile App Size:** < 50MB

## Future Technical Considerations

- GraphQL API for flexible queries
- WebSocket for real-time updates
- Progressive Web App (PWA) support
- Offline-first architecture
- Machine learning for personalized recommendations
- Voice assistant integration

---

**Note:** This architecture is designed to scale with the app's growth while maintaining privacy, security, and performance standards.
