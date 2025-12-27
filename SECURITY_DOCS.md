# NightChill Security Documentation

## Overview

This document outlines security measures, configurations, and best practices for the NightChill application. Security is a top priority given the sensitive nature of mental health and wellness data.

---

## 1. Authentication Security

### 1.1 Firebase Authentication

```javascript
// Supported authentication methods
const authMethods = {
  email: true,          // Email/password with verification
  google: true,         // Google OAuth 2.0
  apple: true,          // Sign in with Apple
  phone: false,         // Disabled for privacy
  anonymous: false      // Disabled - require account
};
```

### 1.2 Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No common passwords (checked against list)

### 1.3 Session Management

- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- Automatic token refresh
- Single-device enforcement (optional)
- Logout invalidates all tokens

---

## 2. Data Encryption

### 2.1 In Transit

- TLS 1.3 for all API communications
- Certificate pinning in mobile app
- HSTS headers on web endpoints
- No HTTP fallback

### 2.2 At Rest

- AES-256 encryption for Firestore data
- Google Cloud KMS for key management
- Encrypted backups with separate keys
- Field-level encryption for sensitive data:
  - `anxietyLevel`
  - `concessionType`
  - `moodHistory`

### 2.3 Encryption Implementation

```javascript
// Field-level encryption for sensitive data
const sensitiveFields = [
  'users.anxietyLevel',
  'users.concessionType',
  'users.concessionEligible',
  'checkins.mood',
  'checkins.note'
];

// Encryption using Cloud KMS
async function encryptSensitiveField(value, fieldPath) {
  const [encryptedData] = await kmsClient.encrypt({
    name: keyName,
    plaintext: Buffer.from(value).toString('base64'),
  });
  return encryptedData.ciphertext;
}
```

---

## 3. Firestore Security Rules

### 3.1 Core Principles

1. **Deny by default** - All access denied unless explicitly allowed
2. **Least privilege** - Users can only access their own data
3. **Admin verification** - Admin operations require token claims
4. **Input validation** - All writes validated server-side

### 3.2 Complete Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== HELPER FUNCTIONS =====
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && request.auth.token.admin == true;
    }
    
    function isMentor() {
      return isSignedIn() && request.auth.token.mentor == true;
    }
    
    function isValidEmail(email) {
      return email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }
    
    function isValidJourneyStage(stage) {
      return stage in ['survival', 'structure', 'discipline', 'purpose', 'leadership'];
    }
    
    // ===== USERS COLLECTION =====
    
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      
      allow create: if isSignedIn() 
        && request.auth.uid == userId
        && request.resource.data.keys().hasAll(['email', 'displayName', 'createdAt'])
        && isValidEmail(request.resource.data.email);
      
      allow update: if isOwner(userId)
        && (!request.resource.data.diff(resource.data).affectedKeys()
            .hasAny(['createdAt', 'email'])); // Can't change email or createdAt
      
      allow delete: if isOwner(userId);
    }
    
    // ===== LOCATIONS COLLECTION =====
    
    match /locations/{locationId} {
      allow read: if isSignedIn();
      allow create, update, delete: if isAdmin();
    }
    
    // ===== CHECKINS COLLECTION =====
    
    match /checkins/{checkinId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      
      allow create: if isSignedIn() 
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.keys().hasAll(['userId', 'locationId', 'checkedInAt']);
      
      allow update, delete: if false; // Immutable
    }
    
    // ===== JOURNEY PROGRESS COLLECTION =====
    
    match /journeyProgress/{progressId} {
      allow read: if isOwner(resource.data.userId) || isAdmin() || isMentor();
      
      allow create: if isSignedIn() 
        && request.auth.uid == request.resource.data.userId;
      
      allow update: if isOwner(resource.data.userId)
        && isValidJourneyStage(request.resource.data.currentStage);
      
      allow delete: if false; // Preserve history
    }
    
    // ===== QR VOUCHERS COLLECTION =====
    
    match /qrVouchers/{voucherId} {
      // Can read if you're the sponsor, recipient, or it's anonymous
      allow read: if isSignedIn() && (
        request.auth.uid == resource.data.sponsorUserId ||
        request.auth.uid == resource.data.recipientUserId ||
        resource.data.anonymous == true
      );
      
      // Only sponsor can create
      allow create: if isSignedIn() 
        && request.auth.uid == request.resource.data.sponsorUserId
        && request.resource.data.status == 'active';
      
      // Can only update to redeem (status: active -> redeemed)
      allow update: if isSignedIn() 
        && resource.data.status == 'active' 
        && request.resource.data.status == 'redeemed'
        && request.resource.data.redeemedAt != null;
      
      allow delete: if false; // Preserve audit trail
    }
    
    // ===== CHATS COLLECTION =====
    
    match /chats/{chatId} {
      allow read: if isSignedIn() 
        && request.auth.uid in resource.data.participants;
      
      allow create: if isSignedIn() 
        && request.auth.uid == request.resource.data.senderId
        && request.auth.uid in request.resource.data.participants
        && request.resource.data.participants.size() == 2;
      
      // Can only mark as read
      allow update: if isSignedIn() 
        && request.auth.uid == resource.data.receiverId
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read', 'readAt']);
      
      allow delete: if false;
    }
    
    // ===== REWARDS COLLECTION =====
    
    match /rewards/{rewardId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAdmin();
      allow update: if (isOwner(resource.data.userId) || isAdmin())
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['rewardType', 'createdAt']);
      allow delete: if false;
    }
  }
}
```

---

## 4. Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User profile photos
    match /user_photos/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024  // Max 5MB
        && request.resource.contentType.matches('image/.*');
    }
    
    // Location images (admin only)
    match /location_images/{locationId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.admin == true
        && request.resource.size < 10 * 1024 * 1024  // Max 10MB
        && request.resource.contentType.matches('image/.*');
    }
    
    // QR code images
    match /qr_codes/{voucherId}.png {
      allow read: if request.auth != null;
      allow write: if false; // Generated server-side only
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. QR Code Security

### 5.1 QR Code Generation

```javascript
const crypto = require('crypto');

function generateSecureQRCode(sponsorId, locationId, amount) {
  // Generate unique voucher ID
  const voucherId = crypto.randomUUID();
  
  // Create signature
  const payload = {
    v: voucherId,
    s: sponsorId,
    l: locationId,
    a: amount,
    t: Date.now(),
    e: Date.now() + (24 * 60 * 60 * 1000) // 24 hour expiry
  };
  
  const signature = crypto
    .createHmac('sha256', process.env.QR_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return {
    payload,
    signature,
    qrData: `nightchill://redeem?d=${Buffer.from(JSON.stringify({...payload, sig: signature})).toString('base64')}`
  };
}
```

### 5.2 QR Code Validation

```javascript
async function validateQRCode(qrData) {
  try {
    // Decode QR data
    const decoded = JSON.parse(Buffer.from(qrData, 'base64').toString());
    const { sig, ...payload } = decoded;
    
    // Verify signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.QR_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    if (sig !== expectedSig) {
      throw new Error('Invalid signature');
    }
    
    // Check expiry
    if (Date.now() > payload.e) {
      throw new Error('QR code expired');
    }
    
    // Check if already redeemed
    const voucher = await db.collection('qrVouchers').doc(payload.v).get();
    if (voucher.exists && voucher.data().status === 'redeemed') {
      throw new Error('Already redeemed');
    }
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

---

## 6. Rate Limiting

### 6.1 API Rate Limits

| Endpoint | Authenticated | Unauthenticated |
|----------|---------------|-----------------|
| Login | 5/min | 3/min |
| Check-in | 10/min | N/A |
| QR Redeem | 5/min | N/A |
| Chat Send | 30/min | N/A |
| Location Search | 60/min | 10/min |
| General API | 1000/hour | 100/hour |

### 6.2 Implementation

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  keyGenerator: (req) => req.user?.uid || req.ip,
});
```

---

## 7. Admin Security

### 7.1 Setting Admin Claims

```javascript
// Only callable by super-admin or initial setup
async function setAdminClaim(uid, isAdmin) {
  await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
  
  // Log admin change
  await db.collection('adminLogs').add({
    action: isAdmin ? 'GRANT_ADMIN' : 'REVOKE_ADMIN',
    targetUid: uid,
    performedBy: currentAdminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ipAddress: requestIp
  });
}
```

### 7.2 Admin Action Logging

All admin actions are logged:
- User management (ban, delete, modify)
- Location management (add, edit, remove)
- Reward management
- System configuration changes

---

## 8. Data Protection

### 8.1 Personal Data Inventory

| Data Type | Sensitivity | Retention | Encryption |
|-----------|-------------|-----------|------------|
| Email | Medium | Account lifetime | At rest |
| Display Name | Low | Account lifetime | At rest |
| Location Check-ins | Medium | 2 years | At rest |
| Mood Data | High | 1 year | Field-level |
| Anxiety Preferences | High | Account lifetime | Field-level |
| Chat Messages | Medium | 1 year | At rest |
| Journey Progress | Low | Account lifetime | At rest |

### 8.2 Data Deletion

```javascript
async function deleteUserData(userId) {
  const batch = db.batch();
  
  // Delete user document
  batch.delete(db.collection('users').doc(userId));
  
  // Delete check-ins
  const checkins = await db.collection('checkins')
    .where('userId', '==', userId).get();
  checkins.forEach(doc => batch.delete(doc.ref));
  
  // Delete journey progress
  const progress = await db.collection('journeyProgress')
    .where('userId', '==', userId).get();
  progress.forEach(doc => batch.delete(doc.ref));
  
  // Delete chat messages
  const chats = await db.collection('chats')
    .where('participants', 'array-contains', userId).get();
  chats.forEach(doc => batch.delete(doc.ref));
  
  // Delete storage files
  await storage.bucket().deleteFiles({
    prefix: `user_photos/${userId}/`
  });
  
  // Commit deletion
  await batch.commit();
  
  // Delete auth account
  await admin.auth().deleteUser(userId);
  
  // Log deletion
  await db.collection('deletionLogs').add({
    userId,
    deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    dataTypes: ['user', 'checkins', 'progress', 'chats', 'storage', 'auth']
  });
}
```

---

## 9. Vulnerability Management

### 9.1 Dependency Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: npm audit --audit-level=high
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 9.2 Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 10. Incident Response

### 10.1 Security Incident Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| Critical | Active breach, data exposure | Immediate | Database breach |
| High | Vulnerability exploited | < 4 hours | Auth bypass |
| Medium | Potential vulnerability | < 24 hours | XSS found |
| Low | Minor security issue | < 1 week | Weak password allowed |

### 10.2 Incident Response Steps

1. **Identify** - Detect and confirm the incident
2. **Contain** - Limit the damage (disable affected features)
3. **Eradicate** - Remove the threat
4. **Recover** - Restore normal operations
5. **Learn** - Document lessons learned

### 10.3 Contact

Security issues should be reported to: **security@nightchill.app**

---

## 11. Compliance Checklist

- [x] Australian Privacy Act 1988
- [x] Australian Privacy Principles (APPs)
- [x] OWASP Top 10 mitigations
- [x] Firebase security best practices
- [x] Data encryption (transit + rest)
- [x] Access logging
- [x] Regular security audits
- [ ] SOC 2 Type II (planned)
- [ ] ISO 27001 (planned)

---

**Last Security Review:** December 2024
**Next Scheduled Review:** March 2025
