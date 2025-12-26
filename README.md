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

### Collections
- `users` - User profiles and journey data
- `locations` - Gyms, mentors, sponsors (see `firebase-locations-schema.json`)
- `checkins` - User check-ins and visits
- `journeyProgress` - Streak and milestone tracking
- `rewards` - Achievements and unlocks
- `qrVouchers` - Coffee QR codes
- `chats` - Messages between users and mentors

### Seed Data
Import `firebase-seed-data.json` to get started with example locations.

### Tags Reference
See `map-support-tags.json` for tag definitions and validation rules.

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
