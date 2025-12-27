# 🚀 NightChill Complete Setup Guide

## Everything You Need - Step by Step

This guide will take you from zero to a running NightChill app. Follow each step in order.

---

# PHASE 1: PREREQUISITES (Do This First)

## Step 1.1: Install Required Software

### On Mac:
```bash
# 1. Install Homebrew (package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Flutter
brew install --cask flutter

# 3. Install Node.js (for Firebase CLI)
brew install node

# 4. Install Firebase CLI
npm install -g firebase-tools

# 5. Install FlutterFire CLI
dart pub global activate flutterfire_cli

# 6. Add to PATH (add this to ~/.zshrc)
echo 'export PATH="$PATH:$HOME/.pub-cache/bin"' >> ~/.zshrc
source ~/.zshrc

# 7. Verify everything is installed
flutter --version
firebase --version
flutterfire --version
```

### On Windows:
```powershell
# 1. Download and install Flutter from:
# https://docs.flutter.dev/get-started/install/windows

# 2. Download and install Node.js from:
# https://nodejs.org/

# 3. Open PowerShell as Administrator and run:
npm install -g firebase-tools

# 4. Install FlutterFire CLI
dart pub global activate flutterfire_cli

# 5. Add to PATH:
# Add %LOCALAPPDATA%\Pub\Cache\bin to your System PATH

# 6. Verify installation
flutter --version
firebase --version
```

## Step 1.2: Verify Installation

Run this command - you should see ✓ for each item:
```bash
flutter doctor
```

Fix any issues shown before continuing.

---

# PHASE 2: FIREBASE SETUP

## Step 2.1: Login to Firebase

```bash
# Login (opens browser)
firebase login

# Verify you're logged in
firebase projects:list
```

You should see your project: `nightchill-mvp`

## Step 2.2: Select Your Project

```bash
firebase use nightchill-mvp
```

## Step 2.3: Deploy Firebase Rules

From your project folder:
```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage:rules
```

## Step 2.4: Add Seed Data to Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project `nightchill-mvp`
3. Click **Firestore Database** in the left menu
4. Click **Start collection**
5. Create collection: `locations`
6. Add documents from `firebase/seed-data.json`

Or use the Firebase Admin SDK:
```bash
# Install admin SDK
npm install firebase-admin

# Run seed script (create this file)
node scripts/seed-database.js
```

---

# PHASE 3: FLUTTER APP SETUP

## Step 3.1: Navigate to Flutter App

```bash
cd flutter_app
```

## Step 3.2: Configure Firebase for Flutter

This is the **magic command** that connects everything:

```bash
flutterfire configure --project=nightchill-mvp
```

When prompted:
- ✅ Select **Android**
- ✅ Select **iOS** (if on Mac)
- ✅ Select **Web** (optional)
- Press Enter to confirm

This creates:
- `lib/firebase_options.dart`
- `android/app/google-services.json`
- `ios/Runner/GoogleService-Info.plist`

## Step 3.3: Install Dependencies

```bash
flutter pub get
```

## Step 3.4: Run the App

### On Android Emulator:
```bash
# List available emulators
flutter emulators

# Launch an emulator
flutter emulators --launch <emulator_id>

# Run the app
flutter run
```

### On iOS Simulator (Mac only):
```bash
# Open iOS Simulator
open -a Simulator

# Run the app
flutter run
```

### On Physical Device:
1. Enable Developer Mode on your phone
2. Connect via USB
3. Run:
```bash
flutter devices  # See connected devices
flutter run -d <device_id>
```

---

# PHASE 4: GOOGLE MAPS SETUP

## Step 4.1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Copy the API key

## Step 4.2: Enable Required APIs

In Google Cloud Console, enable:
- ✅ Maps SDK for Android
- ✅ Maps SDK for iOS
- ✅ Places API
- ✅ Geocoding API

## Step 4.3: Add API Key to Android

Edit `flutter_app/android/app/src/main/AndroidManifest.xml`:

```xml
<manifest ...>
    <application ...>
        <!-- Add this inside <application> tag -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_API_KEY_HERE"/>
    </application>
</manifest>
```

## Step 4.4: Add API Key to iOS

Edit `flutter_app/ios/Runner/AppDelegate.swift`:

```swift
import UIKit
import Flutter
import GoogleMaps  // Add this

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GMSServices.provideAPIKey("YOUR_API_KEY_HERE")  // Add this
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

---

# PHASE 5: FIREBASE AUTHENTICATION

## Step 5.1: Enable Auth Methods

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** → **Sign-in method**
4. Enable:
   - ✅ Email/Password
   - ✅ Google
   - ✅ Apple (for iOS)

## Step 5.2: Configure Google Sign-In

### For Android:
1. In Firebase Console → Project Settings → Your apps → Android
2. Add SHA-1 fingerprint:
```bash
cd android
./gradlew signingReport
```
Copy the SHA-1 and add it to Firebase Console.

### For iOS:
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add to `ios/Runner/` folder
3. Add URL scheme to `ios/Runner/Info.plist`

---

# PHASE 6: ADMIN SETUP

## Step 6.1: Set Yourself as Admin

Create a Cloud Function to set admin claims:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only allow if called with a secret or by existing admin
  if (data.secret !== process.env.ADMIN_SECRET) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid secret');
  }
  
  await admin.auth().setCustomUserClaims(data.uid, { admin: true });
  return { success: true };
});
```

Deploy and call:
```bash
cd functions
npm install
firebase deploy --only functions
```

## Step 6.2: Alternative - Set Admin via Console

1. Go to Firebase Console → Authentication → Users
2. Find your user
3. Click the three dots → **Edit claims**
4. Add: `{"admin": true}`

---

# PHASE 7: TESTING

## Step 7.1: Test Authentication

1. Open the app
2. Create a new account with email/password
3. Verify you can log in

## Step 7.2: Test Map

1. Go to Map tab
2. Allow location permission
3. You should see map markers for seed data locations

## Step 7.3: Test Check-in

1. Tap on a location marker
2. Tap "Check In"
3. Verify check-in is recorded

## Step 7.4: Test Firestore Rules

Use Firebase Emulator for testing:
```bash
firebase emulators:start
```

---

# PHASE 8: DEPLOYMENT

## Step 8.1: Build for Android

```bash
cd flutter_app

# Build APK
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

## Step 8.2: Build for iOS (Mac only)

```bash
cd flutter_app

# Build for iOS
flutter build ios --release

# Open in Xcode to archive and upload
open ios/Runner.xcworkspace
```

## Step 8.3: Deploy to Web (Optional)

```bash
# Build web version
flutter build web

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

# PHASE 9: POST-LAUNCH

## Step 9.1: Set Up Analytics

```dart
// In your app, log events:
await FirebaseAnalytics.instance.logEvent(
  name: 'check_in',
  parameters: {'location_type': 'gym'},
);
```

## Step 9.2: Set Up Crashlytics

```dart
// In main.dart:
FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
```

## Step 9.3: Monitor Usage

1. Firebase Console → Analytics
2. Firebase Console → Crashlytics
3. Firebase Console → Performance

---

# 📋 COMPLETE CHECKLIST

## Prerequisites
- [ ] Flutter installed (`flutter --version` works)
- [ ] Firebase CLI installed (`firebase --version` works)
- [ ] FlutterFire CLI installed (`flutterfire --version` works)
- [ ] Flutter doctor shows all green

## Firebase
- [ ] Logged into Firebase (`firebase login`)
- [ ] Project selected (`firebase use nightchill-mvp`)
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Indexes deployed
- [ ] Seed data added
- [ ] Authentication enabled (Email, Google, Apple)

## Flutter App
- [ ] FlutterFire configured (`flutterfire configure`)
- [ ] `lib/firebase_options.dart` exists
- [ ] Dependencies installed (`flutter pub get`)
- [ ] App runs on emulator/device
- [ ] No red errors on startup

## Google Maps
- [ ] API key created
- [ ] Required APIs enabled
- [ ] API key added to Android
- [ ] API key added to iOS
- [ ] Maps display correctly in app

## Admin
- [ ] Admin claims set for your user
- [ ] Can access admin features

## Testing
- [ ] Authentication works
- [ ] Map loads with markers
- [ ] Check-in works
- [ ] Journey tracking works

## Deployment
- [ ] Android APK built
- [ ] iOS build completed (if applicable)
- [ ] Web deployed to Firebase Hosting (if applicable)

---

# 🆘 TROUBLESHOOTING

## "No Firebase App '[DEFAULT]' has been created"
```dart
// Make sure this is in main.dart BEFORE runApp():
await Firebase.initializeApp(
  options: DefaultFirebaseOptions.currentPlatform,
);
```

## "firebase_options.dart not found"
```bash
flutterfire configure --project=nightchill-mvp
```

## "Google Maps not showing"
1. Check API key is correct
2. Check APIs are enabled in Google Cloud Console
3. Check billing is enabled (Maps requires billing)

## "Permission denied" in Firestore
1. Check security rules are deployed
2. Check user is authenticated
3. Check admin claims if accessing admin features

## "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter run
```

## "CocoaPods error"
```bash
sudo gem install cocoapods
cd ios
pod install --repo-update
cd ..
flutter run
```

---

# 📞 SUPPORT

If you get stuck:
1. Take a screenshot of the error
2. Note which step you're on
3. Share in the PR comments

**We'll help you get unstuck!**

---

**NightChill - Small steps. Lasting strength. Real belonging.**
