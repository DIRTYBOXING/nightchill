# NightChill

Journey-based wellness app helping people rebuild structure, discipline, and belonging through anxiety-friendly gyms, mentors, and coffee QR support.

## The 5 Screens

1. **Home** - Daily check-in and quick actions
2. **Map** - Find nearby gyms, mentors, sponsors
3. **Journey** - Track progress and streaks
4. **Rewards** - Unlock achievements and vouchers
5. **Chat** - Connect with mentors and community

## Support Tags System

Three tags help users find the right support:

- **☕ Coffee Support** - QR codes for coffee sponsorship
- **🤝 Mentor-Safe** - Verified mentors and guides
- **🛡️ Anxiety-Friendly** - Safe, accommodating spaces

## Two Paths

- **⚔️ Spartan Path** - High intensity, structured discipline
- **📊 Wellness Graph** - Data-driven, gentle progress

Users choose based on current needs, not permanent labels.

## Firebase Setup

### Collections (Schemas Ready)
All 7 collections have complete schemas with field definitions, indexes, and security rules:

- **users** - User profiles and journey data ([schema](firebase-users-schema.json))
- **locations** - Gyms, mentors, sponsors ([schema](firebase-locations-schema.json))
- **checkins** - User check-ins and visits ([schema](firebase-checkins-schema.json))
- **journeyProgress** - Streak and milestone tracking ([schema](firebase-journeyProgress-schema.json))
- **rewards** - Achievements and unlocks ([schema](firebase-rewards-schema.json))
- **qrVouchers** - Coffee QR codes ([schema](firebase-qrVouchers-schema.json))
- **chats** - Messages between users and mentors ([schema](firebase-chats-schema.json))

### Import Data
- `firebase-seed-data.json` - 4 example locations ready to import
- `map-support-tags.json` - Tag definitions and validation rules

### Flutter Implementation
See **[FLUTTER-SCREEN-FLOWS.md](FLUTTER-SCREEN-FLOWS.md)** for:
- Screen-by-screen implementation guide
- Firestore queries for each screen
- Widget structure and navigation
- Required packages

## Running the App

### 1. Deploy Firebase
```bash
firebase login
firebase use nightchill-mvp
firebase deploy --only firestore,storage
```

### 2. Import Seed Data
Go to Firebase Console → Firestore → Import data → Select `firebase-seed-data.json`

### 3. Configure Flutter
```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase for Flutter
flutterfire configure

# Get dependencies
flutter pub get

# Run app
flutter run
```

## Implementation Status

### ✅ Complete
- Firebase configuration (rules, indexes, storage)
- All 7 collection schemas
- Flutter app structure with bottom navigation
- **Home screen** - Streak display, check-in, recent activity
- **Map screen** - Location markers, filters, check-in

### ⏳ Next Steps
- Journey screen - Progress tracking
- Rewards screen - Badges and QR vouchers
- Chat screen - Mentor messaging
- Cloud Functions - QR generation, streak calculation

See **[SETUP-COMPLETE.md](SETUP-COMPLETE.md)** for detailed next steps and implementation guide.

**Small steps. Lasting strength. Real belonging.**
