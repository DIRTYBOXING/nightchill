# Flutter Screen Flows - NightChill MVP

## 5 Core Screens

### 1. Home Screen
**Route:** `/home`  
**Purpose:** Daily check-in and quick actions

**Firebase Collections Used:**
- `users` - Display current streak, points, profile
- `journeyProgress` - Today's check-in status
- `rewards` - Show latest unlocked achievements

**Key Widgets:**
```dart
HomeScreen
├── AppBar (profile photo, settings)
├── StreakCard (currentStreak, longestStreak)
├── DailyCheckInButton
│   └── Opens CheckInDialog
│       └── Updates journeyProgress + users
├── QuickActionButtons
│   ├── FindGym → Navigate to MapScreen
│   ├── Mentor → Navigate to ChatScreen
│   └── Rewards → Navigate to RewardsScreen
└── RecentActivity (last 3 checkins)
```

**Firestore Queries:**
```dart
// Get current user data
FirebaseFirestore.instance
  .collection('users')
  .doc(currentUserId)
  .snapshots()

// Get today's progress
FirebaseFirestore.instance
  .collection('journeyProgress')
  .where('userId', isEqualTo: currentUserId)
  .where('date', isEqualTo: todayTimestamp)
  .snapshots()
```

---

### 2. Map Screen
**Route:** `/map`  
**Purpose:** Find nearby gyms, mentors, sponsors

**Firebase Collections Used:**
- `locations` - All gyms, mentors, sponsors
- `users` - User's pathPreference for filtering

**Key Widgets:**
```dart
MapScreen
├── GoogleMap / FlutterMap
├── LocationMarkers (filtered by supportTags)
├── FilterBottomSheet
│   ├── SupportTagsFilter (Coffee, Mentor-Safe, Anxiety-Friendly)
│   ├── PathFilter (Spartan, Wellness, Both)
│   └── TypeFilter (Gym, Mentor, Sponsor)
├── LocationDetailCard
│   ├── Name, Description, Tags
│   ├── DirectionsButton
│   ├── CheckInButton → Creates checkin document
│   └── ContactButton (for mentors)
└── SearchBar
```

**Firestore Queries:**
```dart
// Get nearby locations with filters
GeoFirePoint center = GeoFirePoint(userLat, userLng);

FirebaseFirestore.instance
  .collection('locations')
  .where('supportTags', arrayContainsAny: selectedTags)
  .where('verified', isEqualTo: true)
  .get()
  // Then filter by distance in code
```

**GeoPoint Query:**
```dart
// Using geoflutterfire package
Geoflutterfire geo = Geoflutterfire();
GeoFirePoint center = geo.point(latitude: userLat, longitude: userLng);

Stream<List<DocumentSnapshot>> stream = geo.collection(
  collectionRef: FirebaseFirestore.instance.collection('locations')
).within(
  center: center, 
  radius: 10, // km
  field: 'geopoint'
);
```

---

### 3. Journey Screen
**Route:** `/journey`  
**Purpose:** Track progress, streaks, and milestones

**Firebase Collections Used:**
- `users` - Overall stats
- `journeyProgress` - Daily progress history
- `checkins` - All check-ins

**Key Widgets:**
```dart
JourneyScreen
├── TabBar (Overview, Calendar, Stats)
├── OverviewTab
│   ├── StreakCalendar (visual calendar with check-ins)
│   ├── MilestonesGrid (week_1, month_1, etc.)
│   ├── StatsCards
│   │   ├── Total Check-ins
│   │   ├── Gym Visits
│   │   └── Mentor Sessions
│   └── ProgressGraph (points over time)
├── CalendarTab
│   └── MonthView (with daily mood indicators)
└── StatsTab
    └── Detailed breakdowns
```

**Firestore Queries:**
```dart
// Get user's journey progress for last 30 days
FirebaseFirestore.instance
  .collection('journeyProgress')
  .where('userId', isEqualTo: currentUserId)
  .where('date', isGreaterThan: thirtyDaysAgo)
  .orderBy('date', descending: true)
  .snapshots()

// Get all user check-ins
FirebaseFirestore.instance
  .collection('checkins')
  .where('userId', isEqualTo: currentUserId)
  .orderBy('checkedInAt', descending: true)
  .limit(50)
  .snapshots()
```

---

### 4. Rewards Screen
**Route:** `/rewards`  
**Purpose:** View achievements, badges, vouchers

**Firebase Collections Used:**
- `rewards` - All user rewards
- `qrVouchers` - Coffee vouchers

**Key Widgets:**
```dart
RewardsScreen
├── TabBar (Achievements, Vouchers)
├── AchievementsTab
│   ├── PointsDisplay (totalPoints)
│   ├── BadgesGrid
│   │   ├── UnlockedBadges (unlocked: true)
│   │   └── LockedBadges (unlocked: false, show progress)
│   └── MilestonesList
├── VouchersTab
│   ├── CreateVoucherButton → Opens QR generation
│   ├── ActiveVouchers (status: 'active')
│   ├── RedeemedVouchers (status: 'redeemed')
│   └── QRCodeDisplay (for redemption)
└── RewardDetailModal
    └── Shows description, unlock criteria
```

**Firestore Queries:**
```dart
// Get user's rewards
FirebaseFirestore.instance
  .collection('rewards')
  .where('userId', isEqualTo: currentUserId)
  .orderBy('unlockedAt', descending: true)
  .snapshots()

// Get user's vouchers (given and received)
FirebaseFirestore.instance
  .collection('qrVouchers')
  .where('sponsorUserId', isEqualTo: currentUserId)
  .orderBy('createdAt', descending: true)
  .snapshots()

FirebaseFirestore.instance
  .collection('qrVouchers')
  .where('recipientUserId', isEqualTo: currentUserId)
  .orderBy('redeemedAt', descending: true)
  .snapshots()
```

---

### 5. Chat Screen
**Route:** `/chat`  
**Purpose:** Message mentors and community

**Firebase Collections Used:**
- `chats` - All messages
- `users` - Display names, photos
- `locations` - Verify mentor status

**Key Widgets:**
```dart
ChatScreen
├── ChatListView (list of conversations)
│   └── ChatListTile
│       ├── MentorAvatar
│       ├── LastMessage
│       ├── UnreadBadge
│       └── OnTap → Navigate to ChatDetailScreen
└── FloatingActionButton (New Chat with Mentor)
    └── Opens MentorSelectionSheet

ChatDetailScreen
├── AppBar (mentor name, online status)
├── MessageList
│   └── MessageBubble
│       ├── Text/Content
│       ├── Timestamp
│       └── RelatedContent (check-in, milestone)
├── MessageInput
│   ├── TextField
│   ├── EmojiButton
│   └── SendButton
└── EncouragementQuickReplies
```

**Firestore Queries:**
```dart
// Get user's chat threads
FirebaseFirestore.instance
  .collection('chats')
  .where('participants', arrayContains: currentUserId)
  .orderBy('createdAt', descending: true)
  .snapshots()

// Get messages in a conversation
FirebaseFirestore.instance
  .collection('chats')
  .where('participants', arrayContains: currentUserId)
  .where('participants', arrayContains: mentorId)
  .orderBy('createdAt', descending: false)
  .snapshots()

// Send message
FirebaseFirestore.instance
  .collection('chats')
  .add({
    'participants': [currentUserId, mentorId],
    'senderId': currentUserId,
    'receiverId': mentorId,
    'message': messageText,
    'messageType': 'text',
    'read': false,
    'createdAt': FieldValue.serverTimestamp(),
  })
```

---

## Navigation Structure

```dart
main.dart
└── MaterialApp
    ├── initialRoute: '/home'
    └── routes:
        ├── '/home' → HomeScreen
        ├── '/map' → MapScreen
        ├── '/journey' → JourneyScreen
        ├── '/rewards' → RewardsScreen
        ├── '/chat' → ChatScreen
        └── '/chat/:mentorId' → ChatDetailScreen

// Bottom Navigation Bar (on all 5 screens)
Scaffold(
  body: CurrentScreen(),
  bottomNavigationBar: BottomNavigationBar(
    items: [
      BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
      BottomNavigationBarItem(icon: Icon(Icons.trending_up), label: 'Journey'),
      BottomNavigationBarItem(icon: Icon(Icons.card_giftcard), label: 'Rewards'),
      BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chat'),
    ],
  ),
)
```

---

## Key Firebase Operations

### Check-In Flow
```dart
Future<void> performCheckIn(String locationId) async {
  final batch = FirebaseFirestore.instance.batch();
  
  // 1. Create check-in
  final checkinRef = FirebaseFirestore.instance.collection('checkins').doc();
  batch.set(checkinRef, {
    'userId': currentUserId,
    'locationId': locationId,
    'checkedInAt': FieldValue.serverTimestamp(),
    'pointsEarned': 10,
    'streakActive': true,
    // ... other fields
  });
  
  // 2. Update user stats
  final userRef = FirebaseFirestore.instance.collection('users').doc(currentUserId);
  batch.update(userRef, {
    'totalPoints': FieldValue.increment(10),
    'lastCheckIn': FieldValue.serverTimestamp(),
    'stats.totalCheckIns': FieldValue.increment(1),
  });
  
  // 3. Update today's journey progress
  final progressRef = FirebaseFirestore.instance
    .collection('journeyProgress')
    .doc('${currentUserId}_${todayDate}');
  batch.set(progressRef, {
    'userId': currentUserId,
    'date': todayTimestamp,
    'checkInCompleted': true,
    'pointsEarnedToday': FieldValue.increment(10),
    'updatedAt': FieldValue.serverTimestamp(),
  }, SetOptions(merge: true));
  
  await batch.commit();
}
```

### QR Voucher Generation (Cloud Function)
```dart
// Call from Flutter
final createVoucher = FirebaseFunctions.instance.httpsCallable('generateQRVoucher');
final result = await createVoucher({
  'locationId': selectedLocationId,
  'amount': 5.00,
  'message': 'Stay strong!',
  'anonymous': true,
});
```

### Streak Calculation (Cloud Function)
```dart
// Scheduled function runs daily at midnight
// Updates user.currentStreak based on journeyProgress records
```

---

## Flutter Packages Needed

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Firebase
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.0
  cloud_functions: ^4.5.0
  firebase_storage: ^11.5.0
  
  # Maps
  google_maps_flutter: ^2.5.0
  geoflutterfire: ^3.0.0
  geolocator: ^10.1.0
  
  # State Management
  provider: ^6.1.0
  
  # UI
  cached_network_image: ^3.3.0
  qr_flutter: ^4.1.0
  mobile_scanner: ^3.5.0
  
  # Utils
  intl: ^0.18.1
  timeago: ^3.6.0
```

---

## Next Implementation Steps

1. **Set up Firebase project**
   ```bash
   firebase init
   # Select: Firestore, Functions, Storage
   ```

2. **Import schema seed data**
   ```bash
   # Use firebase-seed-data.json
   ```

3. **Create Flutter project structure**
   ```bash
   flutter create nightchill
   cd nightchill
   ```

4. **Implement screens in order:**
   - Home (basic layout, no Firebase yet)
   - Map (Firebase locations query)
   - Journey (basic progress display)
   - Rewards (badge display)
   - Chat (simple messaging)

5. **Connect Firebase:**
   - Add FlutterFire CLI
   - Configure each screen's Firestore queries
   - Test data flow

**Start with Home and Map screens - they're the core MVP experience.**
