# NightChill Data Storage Architecture

## Overview

This document describes the complete data storage architecture for NightChill, including Firebase Firestore, Cloud Storage, and caching strategies.

---

## 1. Firebase Firestore Collections

### Collection Overview

```
firestore/
├── users/                    # User profiles and preferences
├── locations/                # Gyms, mentors, sponsors
├── checkins/                 # User check-in records
├── journeyProgress/          # Journey stage tracking
├── rewards/                  # Badges and achievements
├── qrVouchers/              # Coffee QR codes
├── chats/                   # Mentor-user messages
├── notifications/           # Push notification records
└── adminLogs/               # Admin action audit trail
```

### 1.1 Users Collection

```javascript
// Collection: users
// Document ID: Firebase Auth UID

{
  // Core Profile
  id: "user_abc123",
  email: "user@example.com",
  displayName: "Alex Smith",
  photoURL: "gs://nightchill-mvp.appspot.com/user_photos/user_abc123/profile.jpg",
  
  // Journey
  journeyStage: "structure", // survival | structure | discipline | purpose | leadership
  pathPreference: "Spartan Path", // Spartan Path | Wellness Graph | Both
  
  // Streaks & Points
  currentStreak: 14,
  longestStreak: 30,
  totalPoints: 1250,
  
  // Timestamps
  joinedAt: Timestamp,
  lastCheckIn: Timestamp,
  lastActive: Timestamp,
  
  // Preferences
  preferences: {
    notifications: true,
    anxietyLevel: "medium", // low | medium | high
    preferredGymTypes: ["strength", "cardio"],
    theme: "neon" // light | dark | neon
  },
  
  // Support Flags
  anxietySupport: true,
  concessionEligible: false,
  concessionType: "none", // poverty | trial | none
  
  // Stats
  stats: {
    totalCheckIns: 45,
    gymVisits: 30,
    mentorSessions: 5,
    coffeesReceived: 3,
    coffeesGiven: 7
  },
  
  // Subscription
  subscription: {
    tier: "pro", // free | pro | mentor
    stripeCustomerId: "cus_xxx",
    expiresAt: Timestamp,
    autoRenew: true
  },
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 1.2 Locations Collection

```javascript
// Collection: locations
// Document ID: Auto-generated

{
  id: "loc_gym_001",
  type: "gym", // gym | mentor | sponsor
  name: "Iron Haven Fitness",
  
  // Location
  address: "123 Warrior Way, Sydney NSW 2000",
  geopoint: new GeoPoint(-33.8688, 151.2093),
  geohash: "r3gx2f9", // For geo queries
  
  // Tags
  supportTags: ["Anxiety-Friendly", "Mentor-Safe", "Coffee Support"],
  pathAlignment: "Spartan Path",
  dirtyBoxerTags: ["Iron Discipline", "Real Talk Only"],
  
  // Details
  description: "High-intensity training with anxiety-friendly hours.",
  hours: "5am-11pm daily",
  amenities: ["showers", "lockers", "parking"],
  anxietyLevel: "low", // low | medium | high
  
  // Contact
  contact: {
    phone: "+61 2 1234 5678",
    email: "info@ironhaven.fit",
    website: "https://ironhaven.fit"
  },
  
  // Images
  images: [
    "gs://nightchill-mvp.appspot.com/location_images/loc_gym_001/main.jpg",
    "gs://nightchill-mvp.appspot.com/location_images/loc_gym_001/interior.jpg"
  ],
  
  // Stats
  stats: {
    totalCheckIns: 342,
    averageRating: 4.7,
    reviewCount: 28
  },
  
  // Verification
  verified: true,
  verifiedAt: Timestamp,
  verifiedBy: "admin_user_id",
  
  // Partnership
  partnerTier: "verified", // basic | verified | premium
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 1.3 Check-ins Collection

```javascript
// Collection: checkins
// Document ID: Auto-generated

{
  id: "checkin_001",
  userId: "user_abc123",
  locationId: "loc_gym_001",
  locationType: "gym",
  locationName: "Iron Haven Fitness",
  
  // Check-in Details
  checkedInAt: Timestamp,
  
  // Mood Tracking (optional, encrypted)
  mood: "motivated", // calm | anxious | neutral | motivated | struggling
  note: "Good session today", // Encrypted
  
  // Points
  pointsEarned: 25,
  streakDay: 14,
  
  // Verification
  verified: true, // Location-verified check-in
  verificationMethod: "geofence", // geofence | qr | manual
  
  // Metadata
  createdAt: Timestamp
}
```

### 1.4 Journey Progress Collection

```javascript
// Collection: journeyProgress
// Document ID: {userId}_{date}

{
  id: "user_abc123_2024-01-15",
  userId: "user_abc123",
  date: "2024-01-15",
  
  // Current Stage
  currentStage: "structure",
  stageProgress: 65, // Percentage to next stage
  
  // Daily Metrics
  metrics: {
    checkInsToday: 1,
    pointsToday: 25,
    streakMaintained: true
  },
  
  // Milestones
  completedMilestones: [
    "first_checkin",
    "week_1_streak",
    "found_safe_gym"
  ],
  
  // Stage History
  stageHistory: [
    { stage: "survival", completedAt: Timestamp },
    { stage: "structure", startedAt: Timestamp }
  ],
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 1.5 QR Vouchers Collection

```javascript
// Collection: qrVouchers
// Document ID: Auto-generated (UUID)

{
  id: "voucher_uuid_001",
  
  // Sponsor Info
  sponsorUserId: "user_sponsor_123",
  anonymous: true, // Hide sponsor identity
  
  // Voucher Details
  type: "coffee",
  value: 5.00, // Dollar value
  locationId: "loc_cafe_001", // Optional: specific location
  
  // QR Code
  qrCodeUrl: "gs://nightchill-mvp.appspot.com/qr_codes/voucher_uuid_001.png",
  qrData: "base64_encoded_signed_data",
  signature: "hmac_signature",
  
  // Status
  status: "active", // active | redeemed | expired | cancelled
  
  // Redemption
  recipientUserId: null, // Filled when redeemed
  redeemedAt: null,
  redeemedLocationId: null,
  
  // Expiry
  expiresAt: Timestamp, // 24-48 hours from creation
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 1.6 Chats Collection

```javascript
// Collection: chats
// Document ID: Auto-generated

{
  id: "chat_001",
  
  // Participants
  participants: ["user_abc123", "mentor_xyz789"],
  senderId: "user_abc123",
  receiverId: "mentor_xyz789",
  
  // Message
  message: "Hi, I'd like to discuss my journey",
  messageType: "text", // text | image | appointment
  
  // Read Status
  read: false,
  readAt: null,
  
  // Appointment (if messageType is appointment)
  appointment: {
    proposedTime: Timestamp,
    location: "Iron Haven Fitness",
    status: "pending" // pending | confirmed | cancelled
  },
  
  // Metadata
  createdAt: Timestamp
}
```

### 1.7 Rewards Collection

```javascript
// Collection: rewards
// Document ID: Auto-generated

{
  id: "reward_001",
  userId: "user_abc123",
  
  // Reward Info
  rewardType: "badge", // badge | achievement | voucher
  rewardId: "streak_warrior_30", // Reference to reward definition
  name: "Streak Warrior",
  description: "Maintained a 30-day check-in streak",
  icon: "🔥",
  
  // Status
  unlocked: true,
  unlockedAt: Timestamp,
  
  // Progress (for progressive rewards)
  progress: 30,
  target: 30,
  
  // Metadata
  createdAt: Timestamp
}
```

---

## 2. Cloud Storage Structure

```
gs://nightchill-mvp.appspot.com/
├── user_photos/
│   └── {userId}/
│       ├── profile.jpg
│       └── profile_thumb.jpg
├── location_images/
│   └── {locationId}/
│       ├── main.jpg
│       ├── interior.jpg
│       └── thumbnails/
│           ├── main_thumb.jpg
│           └── interior_thumb.jpg
├── qr_codes/
│   └── {voucherId}.png
├── exports/
│   └── {userId}/
│       └── data_export_{timestamp}.zip
└── assets/
    ├── badges/
    │   ├── streak_warrior.png
    │   ├── first_step.png
    │   └── coffee_giver.png
    └── icons/
        ├── gym_marker.png
        ├── mentor_marker.png
        └── coffee_marker.png
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User photos - user can only access their own
    match /user_photos/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    
    // Location images - public read, admin write
    match /location_images/{locationId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // QR codes - authenticated read, server-side write only
    match /qr_codes/{voucherId} {
      allow read: if request.auth != null;
      allow write: if false; // Cloud Functions only
    }
    
    // Exports - user can only access their own
    match /exports/{userId}/{fileName} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Cloud Functions only
    }
    
    // Assets - public read
    match /assets/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 3. Caching Strategy

### 3.1 Firestore Offline Persistence

```dart
// Enable offline persistence in Flutter
Future<void> initFirestore() async {
  FirebaseFirestore.instance.settings = const Settings(
    persistenceEnabled: true,
    cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
  );
}
```

### 3.2 Cache Priorities

| Data Type | Cache Duration | Offline Support |
|-----------|----------------|-----------------|
| User Profile | 1 hour | Full |
| Locations | 24 hours | Full |
| Check-ins | Immediate sync | Write-through |
| Journey Progress | 1 hour | Full |
| Chat Messages | Real-time | Queue offline |
| QR Vouchers | No cache | Online only |

### 3.3 Image Caching

```dart
// Using cached_network_image package
CachedNetworkImage(
  imageUrl: location.imageUrl,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
  cacheManager: CacheManager(
    Config(
      'locationImages',
      stalePeriod: Duration(days: 7),
      maxNrOfCacheObjects: 100,
    ),
  ),
)
```

---

## 4. Data Backup Strategy

### 4.1 Automated Backups

```javascript
// Cloud Function for daily backups
exports.scheduledBackup = functions.pubsub
  .schedule('0 2 * * *') // 2 AM daily
  .timeZone('Australia/Sydney')
  .onRun(async (context) => {
    const client = new firestore.v1.FirestoreAdminClient();
    const projectId = process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    
    const bucket = `gs://${projectId}-backups`;
    const timestamp = new Date().toISOString().split('T')[0];
    
    await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: `${bucket}/firestore/${timestamp}`,
      collectionIds: [] // All collections
    });
    
    console.log(`Backup completed: ${timestamp}`);
  });
```

### 4.2 Backup Retention

- Daily backups: Kept for 7 days
- Weekly backups: Kept for 4 weeks
- Monthly backups: Kept for 12 months
- Yearly backups: Kept indefinitely

---

## 5. Data Migration

### 5.1 Version Control

```javascript
// Store schema version in metadata collection
// Collection: _metadata
{
  id: "schema_version",
  version: "1.2.0",
  lastMigration: Timestamp,
  migrations: [
    { version: "1.0.0", appliedAt: Timestamp },
    { version: "1.1.0", appliedAt: Timestamp },
    { version: "1.2.0", appliedAt: Timestamp }
  ]
}
```

### 5.2 Migration Script Example

```javascript
// migrations/1.2.0_add_subscription.js
exports.migrate = async (db) => {
  const users = await db.collection('users').get();
  const batch = db.batch();
  
  users.forEach(doc => {
    if (!doc.data().subscription) {
      batch.update(doc.ref, {
        subscription: {
          tier: 'free',
          stripeCustomerId: null,
          expiresAt: null,
          autoRenew: false
        }
      });
    }
  });
  
  await batch.commit();
  console.log(`Migrated ${users.size} users to v1.2.0`);
};
```

---

## 6. Data Export (GDPR/Privacy Compliance)

### 6.1 User Data Export Function

```javascript
exports.exportUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Authentication required');
  
  const userId = context.auth.uid;
  const exportData = {};
  
  // Collect all user data
  exportData.profile = await db.collection('users').doc(userId).get();
  exportData.checkins = await db.collection('checkins')
    .where('userId', '==', userId).get();
  exportData.progress = await db.collection('journeyProgress')
    .where('userId', '==', userId).get();
  exportData.rewards = await db.collection('rewards')
    .where('userId', '==', userId).get();
  exportData.chats = await db.collection('chats')
    .where('participants', 'array-contains', userId).get();
  
  // Create ZIP file
  const zip = await createDataExportZip(userId, exportData);
  
  // Upload to storage
  const exportPath = `exports/${userId}/data_export_${Date.now()}.zip`;
  await storage.bucket().upload(zip, { destination: exportPath });
  
  // Generate download URL
  const [url] = await storage.bucket().file(exportPath)
    .getSignedUrl({ action: 'read', expires: Date.now() + 24 * 60 * 60 * 1000 });
  
  return { downloadUrl: url, expiresIn: '24 hours' };
});
```

---

## 7. Performance Optimization

### 7.1 Indexes

All composite indexes are defined in `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "locations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "supportTags", "arrayConfig": "CONTAINS" },
        { "fieldPath": "verified", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "checkins",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "checkedInAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 7.2 Query Optimization Tips

1. **Limit results**: Always use `.limit()` for list queries
2. **Use pagination**: Implement cursor-based pagination
3. **Denormalize**: Store frequently accessed data together
4. **Use subcollections**: For large nested data (e.g., chat messages)

---

**Last Updated:** December 2024
