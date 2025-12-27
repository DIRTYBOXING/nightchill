// ⚠️ THIS IS A PLACEHOLDER FILE
// 
// You need to generate your own firebase_options.dart by running:
//
//   flutterfire configure --project=nightchill-mvp
//
// This will create the real firebase_options.dart with your project's
// API keys and configuration.
//
// DO NOT commit the real firebase_options.dart to version control
// as it contains sensitive API keys.

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'run flutterfire configure to generate firebase_options.dart',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'run flutterfire configure to generate firebase_options.dart',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  // ⚠️ PLACEHOLDER VALUES - Replace with your actual Firebase config
  // Run: flutterfire configure --project=nightchill-mvp
  
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'YOUR_WEB_API_KEY',
    appId: 'YOUR_WEB_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'nightchill-mvp',
    authDomain: 'nightchill-mvp.firebaseapp.com',
    storageBucket: 'nightchill-mvp.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'YOUR_ANDROID_API_KEY',
    appId: 'YOUR_ANDROID_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'nightchill-mvp',
    storageBucket: 'nightchill-mvp.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_IOS_API_KEY',
    appId: 'YOUR_IOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'nightchill-mvp',
    storageBucket: 'nightchill-mvp.appspot.com',
    iosBundleId: 'com.nightchill.app',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'YOUR_MACOS_API_KEY',
    appId: 'YOUR_MACOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'nightchill-mvp',
    storageBucket: 'nightchill-mvp.appspot.com',
    iosBundleId: 'com.nightchill.app',
  );
}
