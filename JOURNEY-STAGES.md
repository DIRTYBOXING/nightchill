# NightChill Journey - 5-Level Progression System

## Overview

The NightChill Journey is a 5-level progression system that helps users rebuild their lives through structured growth. Each stage represents a milestone in the journey from anxiety and isolation to leadership and community contribution.

## The 5 Journey Stages

### Level 1: Survival 🛡️
**Focus:** Breaking anxiety, finding safety

**Description:**  
This is the beginning. You're dealing with anxiety, fear, or overwhelming situations. The goal is simply to find safe spaces where you can breathe and feel supported without judgment.

**Key Activities:**
- Discover anxiety-friendly gyms
- Access coffee QR support
- Learn about safe spaces
- Complete first check-in
- Connect with understanding mentors

**Milestones:**
- ✅ First check-in completed
- ✅ Found one safe gym
- ✅ Received coffee support
- ✅ Connected with a mentor

**Typical Duration:** 1-2 weeks

---

### Level 2: Structure 🏗️
**Focus:** Building routine, first check-ins

**Description:**  
You've found safety and now it's time to build consistency. This stage is about creating simple routines and showing up regularly, even when it's hard.

**Key Activities:**
- Regular gym check-ins (3+ per week)
- Establish workout routine
- Track daily progress
- Engage with mentor regularly
- Start building streak

**Milestones:**
- ✅ 7-day check-in streak
- ✅ 10 total check-ins
- ✅ First mentor conversation
- ✅ Established gym routine

**Typical Duration:** 2-4 weeks

---

### Level 3: Discipline ⚔️
**Focus:** Consistent effort, streak building

**Description:**  
Structure has become habit. Now you're pushing yourself, building resilience, and seeing real progress. Discipline means showing up even when you don't feel like it.

**Key Activities:**
- Maintain 30+ day streak
- Set specific fitness goals
- Give coffee support to others
- Participate in gym community
- Track measurable progress

**Milestones:**
- ✅ 30-day check-in streak
- ✅ 50 total check-ins
- ✅ Gave coffee support to others
- ✅ Achieved first fitness goal

**Typical Duration:** 1-3 months

---

### Level 4: Purpose 🎯
**Focus:** Clear goals, mentorship engagement

**Description:**  
You've built discipline and now you're finding meaning. This stage is about setting bigger goals, helping others, and seeing your role in the community.

**Key Activities:**
- Mentor new members
- Share your story
- Set long-term goals
- Complete advanced milestones
- Give back to community

**Milestones:**
- ✅ 90-day check-in streak
- ✅ 100 total check-ins
- ✅ Mentored 3+ new members
- ✅ Sponsored 5+ coffee supports

**Typical Duration:** 3-6 months

---

### Level 5: Leadership 👑
**Focus:** Giving back, mentor role

**Description:**  
You've completed the journey and now you lead others. This stage is about becoming a role model, supporting the community, and helping others find their path.

**Key Activities:**
- Active mentor role
- Community leadership
- Support multiple members
- Share wisdom and experience
- Inspire others through example

**Milestones:**
- ✅ 180+ day check-in streak
- ✅ 250+ total check-ins
- ✅ Verified mentor status
- ✅ Led 10+ new members
- ✅ Community recognized

**Typical Duration:** Ongoing

---

## Journey Stage Transitions

### Automatic Progression
Journey stages advance automatically based on:
- Check-in streak length
- Total check-ins completed
- Mentor interactions
- Coffee support given/received
- Milestone achievements

### Manual Review
Some transitions require mentor verification:
- Structure → Discipline (mentor confirms routine established)
- Purpose → Leadership (mentor recommends for leadership role)

---

## Visual Progression

```
🛡️ Survival → 🏗️ Structure → ⚔️ Discipline → 🎯 Purpose → 👑 Leadership
   (Safety)     (Routine)     (Resilience)    (Meaning)    (Impact)
```

---

## Journey Stage Display

### In App UI:
- Home screen shows current stage with icon
- Progress bar to next stage
- Milestone checklist per stage
- Celebration animations on stage-up

### User Profile:
```json
{
  "journeyStage": "discipline",
  "stageProgress": 75,
  "completedMilestones": [
    "first_checkin",
    "week_1_streak",
    "month_1_streak"
  ],
  "nextMilestone": "month_3_streak"
}
```

---

## Firestore Implementation

### journeyProgress Collection:
```javascript
{
  userId: "user123",
  currentStage: "structure",
  stageStartedAt: Timestamp,
  completedStages: ["survival"],
  milestones: {
    survival: {
      first_checkin: true,
      found_safe_gym: true,
      received_coffee: true,
      connected_mentor: true
    },
    structure: {
      week_1_streak: true,
      ten_checkins: false,
      first_mentor_chat: true,
      established_routine: false
    }
  }
}
```

---

## Motivation & Philosophy

### Why 5 Levels?
- Not overwhelming (unlike 10+ levels)
- Each stage feels significant
- Clear progression path
- Matches psychological rebuilding phases

### Stage Names
- Meaningful, not gamified
- Resonates with lived experience
- Avoids violence/combat imagery
- Emphasizes growth and purpose

### Journey, Not Competition
- No leaderboards
- No comparison to others
- Personal progress focus
- Community support emphasis

---

## Implementation in Flutter

### Home Screen Widget:
```dart
Widget buildJourneyStage(String stage) {
  final stageInfo = {
    'survival': {'icon': '🛡️', 'name': 'Survival'},
    'structure': {'icon': '🏗️', 'name': 'Structure'},
    'discipline': {'icon': '⚔️', 'name': 'Discipline'},
    'purpose': {'icon': '🎯', 'name': 'Purpose'},
    'leadership': {'icon': '👑', 'name': 'Leadership'},
  };
  
  return Card(
    child: Column(
      children: [
        Text(stageInfo[stage]['icon'], style: TextStyle(fontSize: 48)),
        Text('Level: ${stageInfo[stage]['name']}'),
        LinearProgressIndicator(value: stageProgress / 100),
      ],
    ),
  );
}
```

---

## Next Steps for Development

### Phase 1: Basic Display
- [ ] Show current journey stage on Home screen
- [ ] Display stage icon and name
- [ ] Show progress to next stage

### Phase 2: Milestone Tracking
- [ ] Track milestone completion
- [ ] Show checklist per stage
- [ ] Celebrate milestone achievements

### Phase 3: Auto-Progression
- [ ] Calculate stage progression based on activity
- [ ] Trigger stage-up animations
- [ ] Send congratulations messages

### Phase 4: Community Integration
- [ ] Show stage in user profiles
- [ ] Filter mentors by stage
- [ ] Enable stage-specific chat channels

---

## Success Metrics

### User Engagement:
- Average time to progress through stages
- Completion rate per stage
- Retention by stage (expected higher in Discipline+)

### Community Health:
- Number of Leadership stage users
- Mentor-to-new-user ratio
- Coffee support given vs received

### Platform Goals:
- 70% reach Structure stage (1 month)
- 40% reach Discipline stage (3 months)
- 20% reach Purpose stage (6 months)
- 10% reach Leadership stage (1 year)

---

**Small steps. Lasting strength. Real belonging.**
