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

```bash
# Firebase setup
firebase init
firebase deploy

# Flutter app
flutter pub get
flutter run
```

**Small steps. Lasting strength. Real belonging.**
