import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

/// Firebase Service singleton for NightChill app
/// Handles Firebase Cloud Functions calls for help requests, offers, and nearby services
class FirebaseService {
  FirebaseService._privateConstructor();
  static final FirebaseService instance = FirebaseService._privateConstructor();

  final FirebaseFunctions _functions = FirebaseFunctions.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Use emulator for local development
  void useFunctionsEmulator(String host, int port) => 
      _functions.useFunctionsEmulator(host, port);

  /// Create a help request (crisis support)
  /// [message] - The help message from the user
  /// [location] - Optional location data {lat, lng}
  /// [channel] - The channel for the request (default: 'crisis_screen')
  Future<HttpsCallableResult> createHelpRequest({
    required String message,
    Map<String, dynamic>? location,
    String channel = 'crisis_screen',
  }) async {
    final callable = _functions.httpsCallable('createHelpRequest');
    return await callable.call({
      'message': message,
      'location': location,
      'channel': channel,
    });
  }

  /// Redeem an offer using QR code or token
  /// [offerId] - The ID of the offer to redeem
  /// [token] - The redemption token from QR code
  Future<HttpsCallableResult> redeemOffer({
    required String offerId,
    required String token,
  }) async {
    final callable = _functions.httpsCallable('redeemOffer');
    return await callable.call({
      'offerId': offerId,
      'token': token,
    });
  }

  /// Get nearby services (gyms, cafés, mentors, etc.)
  /// [lat] - Latitude
  /// [lng] - Longitude
  /// [radiusMeters] - Search radius in meters (default: 5000)
  /// [types] - List of service types to filter (default: ['gym', 'restaurant'])
  Future<HttpsCallableResult> getNearbyServices({
    required double lat,
    required double lng,
    int radiusMeters = 5000,
    List<String>? types,
  }) async {
    final callable = _functions.httpsCallable('getNearbyServices');
    return await callable.call({
      'lat': lat.toString(),
      'lng': lng.toString(),
      'radiusMeters': radiusMeters,
      'types': types ?? ['gym', 'restaurant'],
    });
  }

  /// Get mentor availability
  /// [mentorId] - The ID of the mentor
  Future<HttpsCallableResult> getMentorAvailability({
    required String mentorId,
  }) async {
    final callable = _functions.httpsCallable('getMentorAvailability');
    return await callable.call({'mentorId': mentorId});
  }

  /// Book a mentor session
  /// [mentorId] - The ID of the mentor
  /// [dateTime] - The requested date/time for the session
  /// [notes] - Optional notes for the mentor
  Future<HttpsCallableResult> bookMentorSession({
    required String mentorId,
    required DateTime dateTime,
    String? notes,
  }) async {
    final callable = _functions.httpsCallable('bookMentorSession');
    return await callable.call({
      'mentorId': mentorId,
      'dateTime': dateTime.toIso8601String(),
      'notes': notes,
    });
  }

  /// Log a daily check-in
  /// [mood] - User's mood (calm, anxious, neutral, motivated)
  /// [note] - Optional note about the check-in
  /// [locationId] - Optional location ID if checking in at a place
  Future<HttpsCallableResult> logCheckIn({
    required String mood,
    String? note,
    String? locationId,
  }) async {
    final callable = _functions.httpsCallable('logCheckIn');
    return await callable.call({
      'mood': mood,
      'note': note,
      'locationId': locationId,
    });
  }

  /// Send a chat message to the wellness bot
  /// [message] - The user's message
  /// [conversationId] - Optional conversation ID for context
  Future<HttpsCallableResult> sendChatMessage({
    required String message,
    String? conversationId,
  }) async {
    final callable = _functions.httpsCallable('sendChatMessage');
    return await callable.call({
      'message': message,
      'conversationId': conversationId,
    });
  }

  /// Get the current authenticated user
  User? get currentUser => _auth.currentUser;

  /// Check if user is authenticated
  bool get isAuthenticated => _auth.currentUser != null;

  /// Get the current user's ID
  String? get currentUserId => _auth.currentUser?.uid;
}
