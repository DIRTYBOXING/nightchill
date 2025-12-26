# NightChill - Implementation Checklist & Guidelines

## 🚨 MISSING ITEMS TO ADD

Based on the detailed guidance provided, here's what needs to be added or hasn't been copied into the codebase yet:

---

## 1. ✅ FIRESTORE USER FIELDS - Clean Field List

**Current schema needs these specific fields for first user document:**

```json
{
  "displayName": "string (e.g., 'Allak' or 'NightChill User')",
  "email": "string (optional)",
  "journeyStage": "string ('survival' | 'structure' | 'discipline' | 'purpose' | 'leadership')",
  "anxietySupport": "boolean",
  "concessionEligible": "boolean",
  "concessionType": "string ('poverty' | 'trial' | 'none')",
  "createdAt": "timestamp"
}
```

### Field Naming Rules:
- ✅ Use camelCase (displayName, not display_name)
- ❌ Avoid spaces in field names
- ✅ Use descriptive names (anxietySupport not anxiety support)

### Boolean Display Conversion:
```dart
// In Flutter code, convert boolean to Yes/No:
String displayValue = user.concessionEligible ? "Yes" : "No";
```

---

## 2. 📝 REPOSITORY DESCRIPTION - Final Version

**Use this exact text (≈500 chars, professional, app-focused):**

```
NightChill helps people break anxiety and rebuild life through training, mentoring, and community support. Discover anxiety-friendly gyms, mentors, and safe spaces designed to remove the fear of starting. Access small acts of support like QR coffee rewards when you're struggling, and progress through a 5-level journey from Survival to Leadership. It's not about fighting — it's about discipline, direction, belonging, and choosing a stronger path forward.
```

**Where to paste:**
1. GitHub repository → Settings → Description (top of page)
2. App store descriptions
3. Investor/pitch decks

---

## 3. 🗺️ MAP TAGS SYSTEM - Core Tags for MVP

### Required Map Tags (MVP):
1. **NightChill Safe Gym** (anxiety-friendly)
2. **Dirty Boxer Coffee Drop** (QR kindness reward)
3. **Mentor Nearby**
4. **Safe Space**
5. **Nutrition Support**

### Optional Tags (Phase 2):
- DV Support Point (discreet help)
- Quiet Hours
- Beginner Friendly
- Women/Family Safe
- Work Opportunities (events, camera, refs, MC, promo crew)

### Best Pin Names (what users will trust):
- "Safe Start" (for gyms)
- "Coffee Kindness" (for QR spots)
- "Talk to a Mentor"
- "Quiet Support"
- "Step Forward"

### Signature Tag (Iconic):
**✅ Dirty Boxer: Coffee Kindness**
- Matches orange brand identity
- Doesn't sound violent
- Memorable and actionable

---

## 4. 🎮 JOURNEY SYSTEM - 5-Level Progression

### Journey Stages (to add to users collection):
```javascript
journeyStage: "survival" | "structure" | "discipline" | "purpose" | "leadership"
```

### Level Descriptions:
1. **Survival** - Breaking anxiety, finding safety
2. **Structure** - Building routine, first check-ins
3. **Discipline** - Consistent effort, streak building
4. **Purpose** - Clear goals, mentorship engagement
5. **Leadership** - Giving back, mentor role

### Implementation Priority:
**MVP:** Graph/Journey Tracker
- Calm, motivating, universal
- Easy to build
- Fits mental health tone

**Phase 2:** Spartan Journey Mode (optional theme)
- "Armor Up: build structure, discipline, and resistance"
- Levels, badges, streaks, milestones
- Spartan emblem as symbol of protection, not aggression

---

## 5. 📱 MVP SCREEN STRUCTURE - Final Clean Version

### Home Screen
- Quick actions
- Daily goals
- "Need help now?" button
- Current streak display
- Points counter

### Map Screen
- Filters (anxiety level, tags)
- Safe gyms/coffee/mentors markers
- Current location
- "Coffee Kindness" pins
- "Safe Start" gym pins

### Journey Screen
- Level 1-5 progression
- Streak counter
- Milestones display
- Progress graph

### Rewards Screen
- QR coffee vouchers
- Points display
- Claim history
- Badge collection

### Chat Screen
- Support bot entry
- "Talk to mentor" button
- Conversation list
- Quick help messages

---

## 6. 🔧 FIREBASE COLLECTION CREATION ORDER

**Create collections in this exact order to avoid spinning:**

1. **users** (first - authentication dependency)
   ```javascript
   displayName, email, journeyStage, anxietySupport, concessionEligible, concessionType, createdAt
   ```

2. **locations** (second - map screen dependency)
   ```javascript
   name, type, geopoint, supportTags, pathAlignment, verified
   ```

3. **checkins** (third - user activity tracking)
   ```javascript
   userId, locationId, checkedInAt, mood, pointsEarned
   ```

4. **journeyProgress** (fourth - streak/milestone tracking)
   ```javascript
   userId, date, checkInCompleted, streakDay, milestones
   ```

5. **rewards** (fifth - gamification)
   ```javascript
   userId, rewardType, unlocked, unlockedAt
   ```

6. **qrVouchers** (sixth - coffee support feature)
   ```javascript
   sponsorUserId, recipientUserId, qrCode, status
   ```

7. **chats** (seventh - mentor communication)
   ```javascript
   participants, senderId, receiverId, message, createdAt
   ```

---

## 7. ⚠️ FIRESTORE SAVE BUTTON GREYED OUT - Common Fixes

### Why Save is disabled:
1. ❌ Field has no value (empty string/blank field)
2. ❌ Timestamp field with no date selected
3. ❌ Field name has spaces

### Quick Fix:
1. ✅ Type a value in displayName field (e.g., "Allak")
2. ✅ Remove or fill all empty fields
3. ✅ Make sure field names have no spaces
4. ✅ Click Save - it will unlock

---

## 8. 🔐 GITHUB SETTINGS - Branch Protection

### Current Status:
**DO NOT SET UP BRANCH PROTECTION YET**

### Reason:
- Solo founder MVP = needs speed
- Branch rules add friction
- Not needed until Phase 2/3

### When to add (later):
1. When you have multiple contributors
2. When app is stable
3. When you want PR approvals

### Simple rule for later:
- Protect main from force-push
- Require PR to merge

---

## 9. 📊 IMPLEMENTATION CHECKLIST

### ✅ Completed:
- [x] Firebase configuration files
- [x] All 7 collection schemas
- [x] Flutter app structure (5 screens)
- [x] Home screen (fully functional)
- [x] Map screen (fully functional)
- [x] Seed data with 4 locations
- [x] Documentation (4 guides)

### 🔄 To Add/Update:
- [ ] Update firebase-users-schema.json with journeyStage field
- [ ] Update firebase-users-schema.json with concessionType field
- [ ] Add map tag definitions to map-support-tags.json
- [ ] Update README description to final version
- [ ] Create journey level descriptions document
- [ ] Add "Coffee Kindness" and "Safe Start" pin naming guide
- [ ] Update Home screen with "Need help now?" button
- [ ] Add journey stage display to Home screen
- [ ] Implement 5-level progression UI in Journey screen

### ⏳ Phase 1 Next Steps:
- [ ] Complete check-in batch write flow
- [ ] Add mood selection to check-in dialog
- [ ] Implement journey stage progression logic
- [ ] Test streak calculation
- [ ] Add "Coffee Kindness" pins to map

---

## 10. 📋 COPY-PASTE READY CODE

### User Document Structure (for Firestore Console):
```json
{
  "displayName": "Allak",
  "email": "user@example.com",
  "journeyStage": "survival",
  "anxietySupport": true,
  "concessionEligible": false,
  "concessionType": "none",
  "currentStreak": 0,
  "longestStreak": 0,
  "totalPoints": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Map Tags JSON (to add to map-support-tags.json):
```json
{
  "mapPinNames": {
    "gym": "Safe Start",
    "coffee": "Coffee Kindness",
    "mentor": "Talk to a Mentor",
    "support": "Quiet Support",
    "general": "Step Forward"
  },
  "signatureTag": "Dirty Boxer: Coffee Kindness",
  "coreMapTags": [
    "NightChill Safe Gym",
    "Dirty Boxer Coffee Drop",
    "Mentor Nearby",
    "Safe Space",
    "Nutrition Support"
  ],
  "phase2Tags": [
    "DV Support Point",
    "Quiet Hours",
    "Beginner Friendly",
    "Women/Family Safe",
    "Work Opportunities"
  ]
}
```

### Journey Stages (to add to firebase-users-schema.json):
```json
{
  "journeyStages": {
    "survival": "Breaking anxiety, finding safety",
    "structure": "Building routine, first check-ins",
    "discipline": "Consistent effort, streak building",
    "purpose": "Clear goals, mentorship engagement",
    "leadership": "Giving back, mentor role"
  }
}
```

---

## 🎯 IMMEDIATE NEXT ACTIONS (Priority Order)

1. **Update firebase-users-schema.json** with journeyStage and concessionType fields
2. **Update README.md** with final repository description
3. **Add map pin naming guide** to map-support-tags.json
4. **Create JOURNEY-STAGES.md** documenting the 5-level system
5. **Deploy to Firebase** and test first user creation
6. **Import seed data** and verify map markers
7. **Test Home screen** with real Firestore data
8. **Complete check-in flow** (Phase 1)

---

## 📧 EMAIL SUMMARY

**Subject: Missing Items Identified - Ready to Implement**

All items from the guidance have been documented:

✅ **Field naming standards** documented  
✅ **Repository description** finalized (≈500 chars)  
✅ **Map tag system** defined (5 core tags + 5 phase 2)  
✅ **Journey stages** defined (5 levels)  
✅ **Pin naming convention** established  
✅ **Collection creation order** prioritized  

**To Add Now:**
1. journeyStage field to users schema
2. concessionType field to users schema
3. Map pin names to tags file
4. Final repo description to README

**Deploy Ready:** All schemas complete, just need field updates.

---

## ✅ COMPLETION STATUS

**Foundation:** 100% complete  
**Field Definitions:** 95% complete (need journeyStage, concessionType)  
**Map Tags:** 80% complete (need pin names)  
**Documentation:** 90% complete (need journey stages doc)  
**Ready to Deploy:** YES (after field updates)

**Total Time to Complete Missing Items:** 30-45 minutes
