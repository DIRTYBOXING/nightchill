/**
 * NightChill Cloud Functions
 * 
 * These functions handle backend operations for the NightChill wellness app:
 * - QR code generation and redemption
 * - Help requests
 * - Nearby services lookup
 * - Admin operations
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const crypto = require('crypto');

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify the request is from an authenticated user
 */
function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  return context.auth;
}

/**
 * Verify the user is an admin
 */
function requireAdmin(context) {
  const auth = requireAuth(context);
  if (!auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Admin access required.'
    );
  }
  return auth;
}

/**
 * Generate a secure signature for QR codes
 */
function generateSignature(payload) {
  const secret = functions.config().qr?.secret || 'dev-secret-change-in-production';
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

// ============================================
// QR VOUCHER FUNCTIONS
// ============================================

/**
 * Create a coffee QR voucher
 * Called when a sponsor wants to buy coffee for someone
 */
exports.createCoffeeVoucher = functions.https.onCall(async (data, context) => {
  const auth = requireAuth(context);
  
  const { amount = 5, locationId = null, anonymous = true, message = '' } = data;
  
  // Validate amount
  if (amount < 5 || amount > 50) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Amount must be between $5 and $50.'
    );
  }
  
  // Create voucher document
  const voucherId = db.collection('qrVouchers').doc().id;
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
  
  const payload = {
    v: voucherId,
    s: auth.uid,
    a: amount,
    t: Date.now(),
    e: expiresAt.getTime()
  };
  
  const signature = generateSignature(payload);
  const qrData = Buffer.from(JSON.stringify({ ...payload, sig: signature })).toString('base64');
  
  // Generate QR code image
  const qrCodeBuffer = await QRCode.toBuffer(`nightchill://redeem?d=${qrData}`, {
    type: 'png',
    width: 400,
    margin: 2,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff'
    }
  });
  
  // Upload QR code to storage
  const bucket = storage.bucket();
  const qrFile = bucket.file(`qr_codes/${voucherId}.png`);
  await qrFile.save(qrCodeBuffer, {
    metadata: { contentType: 'image/png' }
  });
  
  // Get public URL
  const [qrCodeUrl] = await qrFile.getSignedUrl({
    action: 'read',
    expires: expiresAt
  });
  
  // Save voucher to Firestore
  const voucherData = {
    id: voucherId,
    sponsorUserId: auth.uid,
    anonymous,
    message,
    type: 'coffee',
    value: amount,
    locationId,
    qrCodeUrl,
    qrData,
    signature,
    status: 'active',
    recipientUserId: null,
    redeemedAt: null,
    redeemedLocationId: null,
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await db.collection('qrVouchers').doc(voucherId).set(voucherData);
  
  // Update sponsor stats
  await db.collection('users').doc(auth.uid).update({
    'stats.coffeesGiven': admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return {
    success: true,
    voucherId,
    qrCodeUrl,
    expiresAt: expiresAt.toISOString()
  };
});

/**
 * Redeem a coffee QR voucher
 */
exports.redeemOffer = functions.https.onCall(async (data, context) => {
  const auth = requireAuth(context);
  
  const { offerId, token } = data;
  
  if (!offerId && !token) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Offer ID or token required.'
    );
  }
  
  let voucherId = offerId;
  
  // If token provided, decode it
  if (token) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      const { sig, ...payload } = decoded;
      
      // Verify signature
      const expectedSig = generateSignature(payload);
      if (sig !== expectedSig) {
        throw new Error('Invalid signature');
      }
      
      // Check expiry
      if (Date.now() > payload.e) {
        throw new Error('Voucher expired');
      }
      
      voucherId = payload.v;
    } catch (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid or expired QR code.'
      );
    }
  }
  
  // Get voucher
  const voucherRef = db.collection('qrVouchers').doc(voucherId);
  const voucher = await voucherRef.get();
  
  if (!voucher.exists) {
    throw new functions.https.HttpsError('not-found', 'Voucher not found.');
  }
  
  const voucherData = voucher.data();
  
  // Check if already redeemed
  if (voucherData.status === 'redeemed') {
    throw new functions.https.HttpsError(
      'already-exists',
      'This voucher has already been redeemed.'
    );
  }
  
  // Check if expired
  if (voucherData.expiresAt.toDate() < new Date()) {
    await voucherRef.update({ status: 'expired' });
    throw new functions.https.HttpsError('deadline-exceeded', 'Voucher has expired.');
  }
  
  // Redeem the voucher
  await voucherRef.update({
    status: 'redeemed',
    recipientUserId: auth.uid,
    redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Update recipient stats
  await db.collection('users').doc(auth.uid).update({
    'stats.coffeesReceived': admin.firestore.FieldValue.increment(1),
    totalPoints: admin.firestore.FieldValue.increment(10),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return {
    success: true,
    value: voucherData.value,
    message: voucherData.anonymous ? 'A kind stranger bought you coffee!' : voucherData.message
  };
});

// ============================================
// HELP REQUEST FUNCTIONS
// ============================================

/**
 * Create a help request
 * Used when someone needs immediate support
 */
exports.createHelpRequest = functions.https.onCall(async (data, context) => {
  const auth = requireAuth(context);
  
  const { message, location, channel = 'crisis_screen' } = data;
  
  if (!message || message.trim().length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Message is required.'
    );
  }
  
  // Create help request document
  const helpRequest = {
    userId: auth.uid,
    message: message.trim(),
    location: location || null,
    channel,
    status: 'pending', // pending | acknowledged | resolved
    assignedMentorId: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const docRef = await db.collection('helpRequests').add(helpRequest);
  
  // TODO: Send notification to available mentors
  // TODO: Send alert to admin dashboard
  
  return {
    success: true,
    requestId: docRef.id,
    message: 'Your request has been received. A mentor will reach out soon.'
  };
});

// ============================================
// LOCATION FUNCTIONS
// ============================================

/**
 * Get nearby services (gyms, mentors, sponsors)
 */
exports.getNearbyServices = functions.https.onCall(async (data, context) => {
  requireAuth(context);
  
  const { lat, lng, radiusMeters = 5000, types = ['gym', 'restaurant'] } = data;
  
  if (!lat || !lng) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Latitude and longitude required.'
    );
  }
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  // Query locations from Firestore
  // Note: For production, use GeoFirestore or similar for efficient geo queries
  const locationsSnap = await db.collection('locations')
    .where('verified', '==', true)
    .limit(50)
    .get();
  
  const locations = [];
  
  locationsSnap.forEach(doc => {
    const data = doc.data();
    
    // Filter by type
    if (types.length > 0 && !types.includes(data.type)) {
      return;
    }
    
    // Calculate distance (simple Haversine approximation)
    if (data.geopoint) {
      const distance = calculateDistance(
        latitude, longitude,
        data.geopoint.latitude, data.geopoint.longitude
      );
      
      if (distance <= radiusMeters) {
        locations.push({
          id: doc.id,
          ...data,
          distance: Math.round(distance)
        });
      }
    }
  });
  
  // Sort by distance
  locations.sort((a, b) => a.distance - b.distance);
  
  return { locations };
});

/**
 * Calculate distance between two points in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

// ============================================
// CHECK-IN FUNCTIONS
// ============================================

/**
 * Log a check-in at a location
 */
exports.logCheckIn = functions.https.onCall(async (data, context) => {
  const auth = requireAuth(context);
  
  const { locationId, mood = 'neutral', note = '' } = data;
  
  // Get user data
  const userRef = db.collection('users').doc(auth.uid);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'User not found.');
  }
  
  const userData = userSnap.data();
  
  // Get location data (optional)
  let locationData = null;
  if (locationId) {
    const locationSnap = await db.collection('locations').doc(locationId).get();
    if (locationSnap.exists) {
      locationData = locationSnap.data();
    }
  }
  
  // Calculate streak
  const lastCheckIn = userData.lastCheckIn?.toDate();
  const now = new Date();
  let newStreak = userData.currentStreak || 0;
  
  if (lastCheckIn) {
    const hoursSinceLastCheckIn = (now - lastCheckIn) / (1000 * 60 * 60);
    
    if (hoursSinceLastCheckIn >= 24 && hoursSinceLastCheckIn < 48) {
      // Continuing streak (checked in within 24-48 hours)
      newStreak += 1;
    } else if (hoursSinceLastCheckIn >= 48) {
      // Streak broken
      newStreak = 1;
    }
    // If less than 24 hours, don't increment (already checked in today)
  } else {
    // First check-in ever
    newStreak = 1;
  }
  
  // Calculate points
  const basePoints = 10;
  const streakBonus = Math.min(newStreak, 10) * 2; // Up to 20 bonus points
  const gymBonus = locationData?.type === 'gym' ? 15 : 0;
  const pointsEarned = basePoints + streakBonus + gymBonus;
  
  // Create check-in document
  const checkIn = {
    userId: auth.uid,
    locationId: locationId || null,
    locationType: locationData?.type || 'general',
    locationName: locationData?.name || 'Manual Check-in',
    mood,
    note,
    checkedInAt: admin.firestore.FieldValue.serverTimestamp(),
    pointsEarned,
    streakDay: newStreak,
    verified: !!locationId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const checkInRef = await db.collection('checkins').add(checkIn);
  
  // Update user stats
  await userRef.update({
    currentStreak: newStreak,
    longestStreak: Math.max(userData.longestStreak || 0, newStreak),
    totalPoints: admin.firestore.FieldValue.increment(pointsEarned),
    lastCheckIn: admin.firestore.FieldValue.serverTimestamp(),
    'stats.totalCheckIns': admin.firestore.FieldValue.increment(1),
    'stats.gymVisits': locationData?.type === 'gym' 
      ? admin.firestore.FieldValue.increment(1) 
      : userData.stats?.gymVisits || 0,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Check for milestone achievements
  await checkMilestones(auth.uid, newStreak, userData.stats?.totalCheckIns + 1);
  
  return {
    success: true,
    checkInId: checkInRef.id,
    pointsEarned,
    currentStreak: newStreak,
    message: getStreakMessage(newStreak)
  };
});

/**
 * Get encouraging message based on streak
 */
function getStreakMessage(streak) {
  if (streak === 1) return "First step taken! You've got this! 🌟";
  if (streak === 7) return "One week strong! You're building momentum! 💪";
  if (streak === 14) return "Two weeks! You're proving your discipline! 🔥";
  if (streak === 30) return "30 days! You're unstoppable! 👑";
  if (streak >= 100) return `${streak} days! You're a legend! 🏆`;
  if (streak >= 30) return `${streak} days! True warrior spirit! ⚔️`;
  if (streak >= 7) return `${streak} days! Keep the fire burning! 🔥`;
  return `Day ${streak}! Every step counts! 💪`;
}

/**
 * Check and award milestone achievements
 */
async function checkMilestones(userId, streak, totalCheckIns) {
  const milestones = [
    { id: 'first_step', condition: totalCheckIns >= 1, name: 'First Step', icon: '🌟' },
    { id: 'week_1', condition: streak >= 7, name: 'Week Warrior', icon: '💪' },
    { id: 'week_2', condition: streak >= 14, name: 'Fortnight Fighter', icon: '🔥' },
    { id: 'month_1', condition: streak >= 30, name: 'Monthly Master', icon: '👑' },
    { id: 'century', condition: streak >= 100, name: 'Century Club', icon: '🏆' },
    { id: 'checkin_10', condition: totalCheckIns >= 10, name: 'Getting Started', icon: '📍' },
    { id: 'checkin_50', condition: totalCheckIns >= 50, name: 'Committed', icon: '🎯' },
    { id: 'checkin_100', condition: totalCheckIns >= 100, name: 'Dedicated', icon: '⭐' },
  ];
  
  for (const milestone of milestones) {
    if (milestone.condition) {
      // Check if already awarded
      const existing = await db.collection('rewards')
        .where('userId', '==', userId)
        .where('rewardId', '==', milestone.id)
        .get();
      
      if (existing.empty) {
        // Award new milestone
        await db.collection('rewards').add({
          userId,
          rewardType: 'badge',
          rewardId: milestone.id,
          name: milestone.name,
          icon: milestone.icon,
          unlocked: true,
          unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Set admin claim on a user
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only existing admins or initial setup can call this
  if (context.auth?.token?.admin !== true) {
    // Check for setup secret
    const setupSecret = functions.config().admin?.setup_secret;
    if (!setupSecret || data.secret !== setupSecret) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Admin access required.'
      );
    }
  }
  
  const { uid, isAdmin } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID required.');
  }
  
  await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
  
  // Log admin action
  await db.collection('adminLogs').add({
    action: isAdmin ? 'GRANT_ADMIN' : 'REVOKE_ADMIN',
    targetUid: uid,
    performedBy: context.auth?.uid || 'setup',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true };
});

/**
 * Set mentor claim on a user
 */
exports.setMentorClaim = functions.https.onCall(async (data, context) => {
  requireAdmin(context);
  
  const { uid, isMentor } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID required.');
  }
  
  await admin.auth().setCustomUserClaims(uid, { mentor: isMentor });
  
  // Log admin action
  await db.collection('adminLogs').add({
    action: isMentor ? 'GRANT_MENTOR' : 'REVOKE_MENTOR',
    targetUid: uid,
    performedBy: context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true };
});

// ============================================
// SCHEDULED FUNCTIONS
// ============================================

/**
 * Clean up expired vouchers daily
 */
exports.cleanupExpiredVouchers = functions.pubsub
  .schedule('0 0 * * *') // Midnight daily
  .timeZone('Australia/Sydney')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    const expiredVouchers = await db.collection('qrVouchers')
      .where('status', '==', 'active')
      .where('expiresAt', '<', now)
      .get();
    
    const batch = db.batch();
    
    expiredVouchers.forEach(doc => {
      batch.update(doc.ref, {
        status: 'expired',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    
    console.log(`Marked ${expiredVouchers.size} vouchers as expired.`);
    return null;
  });

// ============================================
// EXPORT USER DATA (GDPR Compliance)
// ============================================

/**
 * Export all user data for GDPR compliance
 */
exports.exportUserData = functions.https.onCall(async (data, context) => {
  const auth = requireAuth(context);
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    user: null,
    checkins: [],
    journeyProgress: [],
    rewards: [],
    chats: []
  };
  
  // Get user profile
  const userSnap = await db.collection('users').doc(auth.uid).get();
  if (userSnap.exists) {
    exportData.user = userSnap.data();
  }
  
  // Get check-ins
  const checkinsSnap = await db.collection('checkins')
    .where('userId', '==', auth.uid)
    .orderBy('checkedInAt', 'desc')
    .get();
  checkinsSnap.forEach(doc => exportData.checkins.push(doc.data()));
  
  // Get journey progress
  const progressSnap = await db.collection('journeyProgress')
    .where('userId', '==', auth.uid)
    .orderBy('date', 'desc')
    .get();
  progressSnap.forEach(doc => exportData.journeyProgress.push(doc.data()));
  
  // Get rewards
  const rewardsSnap = await db.collection('rewards')
    .where('userId', '==', auth.uid)
    .get();
  rewardsSnap.forEach(doc => exportData.rewards.push(doc.data()));
  
  // Get chats (messages where user is participant)
  const chatsSnap = await db.collection('chats')
    .where('participants', 'array-contains', auth.uid)
    .orderBy('createdAt', 'desc')
    .limit(1000)
    .get();
  chatsSnap.forEach(doc => exportData.chats.push(doc.data()));
  
  return exportData;
});

console.log('NightChill Cloud Functions loaded successfully.');
