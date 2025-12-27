/**
 * Seed Database Script
 * 
 * This script populates your Firestore database with initial data
 * including sample locations (gyms, mentors, sponsors).
 * 
 * Usage:
 *   1. Set up Firebase Admin SDK credentials
 *   2. Run: node scripts/seed-database.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// You need to download your service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample locations data
const locations = [
  {
    type: 'gym',
    name: 'Iron Haven Fitness',
    address: '123 Warrior Way, Sydney NSW 2000',
    geopoint: new admin.firestore.GeoPoint(-33.8688, 151.2093),
    supportTags: ['Anxiety-Friendly', 'Mentor-Safe', 'Coffee Support'],
    pathAlignment: 'Spartan Path',
    dirtyBoxerTags: ['Real Talk Only', 'Iron Discipline', 'Warrior Training'],
    description: 'High-intensity training with anxiety-accommodating private hours. On-site mentors and coffee QR support.',
    contact: {
      phone: '+61 2 1234 5678',
      email: 'info@ironhaven.fit',
      website: 'https://ironhaven.fit'
    },
    hours: '5am-11pm daily',
    amenities: ['showers', 'lockers', 'parking', 'personal_training'],
    anxietyLevel: 'low',
    verified: true,
    partnerTier: 'verified',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    type: 'gym',
    name: 'Calm Strength Studio',
    address: '456 Wellness Blvd, Melbourne VIC 3000',
    geopoint: new admin.firestore.GeoPoint(-37.8136, 144.9631),
    supportTags: ['Anxiety-Friendly', 'Mentor-Safe'],
    pathAlignment: 'Wellness Graph',
    dirtyBoxerTags: ['Progress Over Perfect', 'Safe Space Training', 'Mind-Body Balance'],
    description: 'Gentle-paced wellness facility with progress tracking and mental health integration.',
    contact: {
      email: 'hello@calmstrength.co',
      website: 'https://calmstrength.co'
    },
    hours: '6am-9pm daily',
    amenities: ['meditation_room', 'yoga_studio', 'cafe'],
    anxietyLevel: 'low',
    verified: true,
    partnerTier: 'verified',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    type: 'mentor',
    name: 'Marcus Steel',
    geopoint: new admin.firestore.GeoPoint(-33.8688, 151.2093),
    supportTags: ['Mentor-Safe', 'Coffee Support'],
    pathAlignment: 'Spartan Path',
    dirtyBoxerTags: ['Battle-Tested', 'Accountability Partner', 'Real Talk Only'],
    description: 'Former boxer helping others rebuild through structured discipline. Meets at partner gyms and coffee spots.',
    contact: {
      email: 'marcus@nightchill.app'
    },
    verified: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    type: 'mentor',
    name: 'Sarah Chen',
    geopoint: new admin.firestore.GeoPoint(-37.8136, 144.9631),
    supportTags: ['Mentor-Safe', 'Anxiety-Friendly'],
    pathAlignment: 'Wellness Graph',
    dirtyBoxerTags: ['Empathy Guide', 'Journey Companion', 'No Judgment Zone'],
    description: 'Mental health advocate specializing in anxiety management and gentle wellness approaches.',
    contact: {
      email: 'sarah@nightchill.app'
    },
    verified: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    type: 'sponsor',
    name: 'Community Coffee Coalition',
    address: 'Multiple locations',
    geopoint: new admin.firestore.GeoPoint(-33.8688, 151.2093),
    supportTags: ['Coffee Support', 'Anxiety-Friendly'],
    pathAlignment: 'Both',
    dirtyBoxerTags: ['No Judgment Zone', 'Show Up Messy'],
    description: 'Local coffee shops with QR code system for anonymous coffee sponsorship. Part of Dirty Boxer Coffee Kindness.',
    contact: {
      website: 'https://coffeecoalition.org'
    },
    verified: true,
    partnerTier: 'premium',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    type: 'gym',
    name: 'Phoenix Rising Boxing',
    address: '789 Fighter Lane, Brisbane QLD 4000',
    geopoint: new admin.firestore.GeoPoint(-27.4698, 153.0251),
    supportTags: ['Anxiety-Friendly', 'Mentor-Safe', 'Coffee Support'],
    pathAlignment: 'Spartan Path',
    dirtyBoxerTags: ['Keep Fighting', 'Scars Welcome', 'Warrior Training'],
    description: 'Boxing gym with special programs for those rebuilding their lives. Beginner-friendly with experienced mentors.',
    contact: {
      phone: '+61 7 9876 5432',
      email: 'info@phoenixboxing.com.au'
    },
    hours: '6am-10pm daily',
    amenities: ['boxing_ring', 'weights', 'personal_training', 'showers'],
    anxietyLevel: 'medium',
    verified: true,
    partnerTier: 'premium',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Sample reward definitions
const rewardDefinitions = [
  { rewardId: 'first_step', name: 'First Step', icon: '🌟', description: 'Complete your first check-in' },
  { rewardId: 'week_1', name: 'Week Warrior', icon: '💪', description: 'Maintain a 7-day streak' },
  { rewardId: 'week_2', name: 'Fortnight Fighter', icon: '🔥', description: 'Maintain a 14-day streak' },
  { rewardId: 'month_1', name: 'Monthly Master', icon: '👑', description: 'Maintain a 30-day streak' },
  { rewardId: 'century', name: 'Century Club', icon: '🏆', description: 'Maintain a 100-day streak' },
  { rewardId: 'checkin_10', name: 'Getting Started', icon: '📍', description: 'Complete 10 check-ins' },
  { rewardId: 'checkin_50', name: 'Committed', icon: '🎯', description: 'Complete 50 check-ins' },
  { rewardId: 'checkin_100', name: 'Dedicated', icon: '⭐', description: 'Complete 100 check-ins' },
  { rewardId: 'coffee_giver', name: 'Coffee Kindness', icon: '☕', description: 'Sponsor coffee for someone' },
  { rewardId: 'mentor_connect', name: 'Seeking Wisdom', icon: '🤝', description: 'Connect with a mentor' },
  { rewardId: 'gym_visit_10', name: 'Gym Regular', icon: '🏋️', description: 'Visit the gym 10 times' },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');
  
  // Add locations
  console.log('📍 Adding locations...');
  const locationsRef = db.collection('locations');
  
  for (const location of locations) {
    const docRef = await locationsRef.add(location);
    console.log(`   ✅ Added: ${location.name} (${docRef.id})`);
  }
  
  console.log(`\n   Total locations added: ${locations.length}`);
  
  // Add reward definitions
  console.log('\n🏆 Adding reward definitions...');
  const rewardsRef = db.collection('rewardDefinitions');
  
  for (const reward of rewardDefinitions) {
    await rewardsRef.doc(reward.rewardId).set({
      ...reward,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   ✅ Added: ${reward.name} ${reward.icon}`);
  }
  
  console.log(`\n   Total rewards added: ${rewardDefinitions.length}`);
  
  // Create metadata document
  console.log('\n📋 Creating metadata...');
  await db.collection('_metadata').doc('schema_version').set({
    version: '1.0.0',
    lastMigration: admin.firestore.FieldValue.serverTimestamp(),
    migrations: [
      { version: '1.0.0', appliedAt: admin.firestore.FieldValue.serverTimestamp() }
    ]
  });
  console.log('   ✅ Schema version set to 1.0.0');
  
  console.log('\n✨ Database seeding complete!\n');
  console.log('Next steps:');
  console.log('1. Run your Flutter app: flutter run');
  console.log('2. Sign up for an account');
  console.log('3. Check the Map tab to see locations');
  console.log('4. Try checking in at a location!\n');
  
  process.exit(0);
}

// Run the seed
seedDatabase().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
