# Database Schema

## Overview

NightChill uses PostgreSQL as the primary database with Redis for caching. This document outlines the complete database schema for the wellness hub.

## Tables

### users

Stores user account information and preferences.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profile
  avatar_url TEXT,
  bio TEXT,
  
  -- Journey Progress
  journey_level SMALLINT DEFAULT 1 CHECK (journey_level BETWEEN 1 AND 5),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_check_ins INTEGER DEFAULT 0,
  
  -- Preferences
  theme_mode VARCHAR(10) DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'neon')),
  notifications_enabled BOOLEAN DEFAULT true,
  
  -- Privacy
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  
  -- Indexes
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### locations

Stores support locations (gyms, cafés, mentors, etc.).

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('coffee', 'gym', 'mentor', 'nutrition', 'partner')),
  
  -- Geolocation
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  
  -- Details
  description TEXT,
  amenities TEXT[], -- Array of amenities
  anxiety_level VARCHAR(10) CHECK (anxiety_level IN ('low', 'medium', 'high')),
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  
  -- Hours (stored as JSON)
  hours JSONB,
  
  -- Features
  has_qr_reward BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_beginner_friendly BOOLEAN DEFAULT false,
  
  -- Media
  images TEXT[], -- Array of image URLs
  
  -- Stats
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating BETWEEN 0 AND 5),
  review_count INTEGER DEFAULT 0,
  check_in_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Geospatial index for location queries
CREATE INDEX idx_locations_coords ON locations USING GIST (
  ll_to_earth(latitude, longitude)
);

CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_verified ON locations(is_verified);
```

### check_ins

Tracks user check-ins at locations.

```sql
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Check-in details
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  mood VARCHAR(20) CHECK (mood IN ('calm', 'anxious', 'neutral', 'motivated')),
  
  -- Rewards
  reward_earned_id UUID REFERENCES rewards(id),
  qr_code_scanned BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_check_ins_user ON check_ins(user_id, timestamp DESC);
CREATE INDEX idx_check_ins_location ON check_ins(location_id, timestamp DESC);
CREATE INDEX idx_check_ins_timestamp ON check_ins(timestamp);
```

### journey_progress

Tracks detailed journey progress for each user.

```sql
CREATE TABLE journey_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  level SMALLINT DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  
  -- Activity Tracking
  total_check_ins INTEGER DEFAULT 0,
  gym_visits INTEGER DEFAULT 0,
  mentor_sessions INTEGER DEFAULT 0,
  coffee_redemptions INTEGER DEFAULT 0,
  
  -- Streaks
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_check_in TIMESTAMP,
  
  -- Level Progress
  level_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  level_completion_percentage INTEGER DEFAULT 0 CHECK (level_completion_percentage BETWEEN 0 AND 100),
  
  -- Milestones (stored as array of milestone IDs)
  milestones_achieved TEXT[],
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journey_progress_level ON journey_progress(level);
```

### mentors

Stores mentor profiles.

```sql
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Profile
  title VARCHAR(100) NOT NULL,
  specialization TEXT[] NOT NULL,
  bio TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  
  -- Availability
  available BOOLEAN DEFAULT true,
  schedule_type VARCHAR(20) CHECK (schedule_type IN ('in-person', 'virtual', 'both')),
  
  -- Location (optional, if tied to a location)
  location_id UUID REFERENCES locations(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Stats
  total_sessions INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating BETWEEN 0 AND 5),
  review_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentors_user ON mentors(user_id);
CREATE INDEX idx_mentors_verified ON mentors(verified);
CREATE INDEX idx_mentors_available ON mentors(available);
CREATE INDEX idx_mentors_location ON mentors(location_id);
```

### mentor_sessions

Tracks mentor-user sessions.

```sql
CREATE TABLE mentor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Details
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  session_type VARCHAR(20) CHECK (session_type IN ('in-person', 'virtual')),
  location_id UUID REFERENCES locations(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  
  -- Notes
  mentor_notes TEXT,
  user_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_mentor_sessions_mentor ON mentor_sessions(mentor_id, scheduled_at DESC);
CREATE INDEX idx_mentor_sessions_user ON mentor_sessions(user_id, scheduled_at DESC);
CREATE INDEX idx_mentor_sessions_status ON mentor_sessions(status);
```

### rewards

Stores rewards earned by users.

```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Reward Details
  type VARCHAR(20) CHECK (type IN ('coffee', 'gym_pass', 'discount', 'badge')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Redemption
  qr_code TEXT UNIQUE,
  redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMP,
  redeemed_location_id UUID REFERENCES locations(id),
  
  -- Expiry
  expires_at TIMESTAMP,
  
  -- Partner
  partner_id UUID REFERENCES partners(id),
  
  -- Metadata
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rewards_user ON rewards(user_id, earned_at DESC);
CREATE INDEX idx_rewards_redeemed ON rewards(redeemed);
CREATE INDEX idx_rewards_expires ON rewards(expires_at);
CREATE INDEX idx_rewards_qr_code ON rewards(qr_code);
```

### partners

Stores partner organizations.

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  
  -- Contact
  email VARCHAR(255),
  phone VARCHAR(20),
  website TEXT,
  
  -- Details
  description TEXT,
  logo_url TEXT,
  
  -- Partnership
  partnership_level VARCHAR(20) CHECK (partnership_level IN ('bronze', 'silver', 'gold', 'platinum')),
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_active ON partners(active);
```

### reviews

Stores reviews for locations and mentors.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Reviewable (polymorphic)
  reviewable_type VARCHAR(20) CHECK (reviewable_type IN ('location', 'mentor')),
  reviewable_id UUID NOT NULL,
  
  -- Review Details
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  content TEXT,
  
  -- Flags
  is_verified_visit BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_reviewable ON reviews(reviewable_type, reviewable_id);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);
```

### notifications

Stores user notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Details
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Action
  action_url TEXT,
  action_label VARCHAR(100),
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(read);
```

### chat_messages

Stores chat messages (for chatbot interactions).

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message Details
  role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Context
  context JSONB, -- Additional context for AI
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_user ON chat_messages(user_id, created_at DESC);
```

---

## Relationships

```
users (1) ─── (many) check_ins
users (1) ─── (1) journey_progress
users (1) ─── (many) rewards
users (1) ─── (many) mentor_sessions
users (1) ─── (many) reviews
users (1) ─── (many) notifications
users (1) ─── (many) chat_messages
users (1) ─── (0..1) mentors

locations (1) ─── (many) check_ins
locations (1) ─── (many) reviews
locations (1) ─── (0..1) mentors

mentors (1) ─── (many) mentor_sessions
mentors (1) ─── (many) reviews

partners (1) ─── (many) rewards
partners (1) ─── (many) locations (implied)
```

---

## Triggers & Functions

### Update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON mentors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_progress_updated_at BEFORE UPDATE ON journey_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables
```

### Update check-in counters

```sql
CREATE OR REPLACE FUNCTION update_check_in_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's total check-ins
  UPDATE users 
  SET total_check_ins = total_check_ins + 1
  WHERE id = NEW.user_id;
  
  -- Update location's check-in count
  UPDATE locations
  SET check_in_count = check_in_count + 1
  WHERE id = NEW.location_id;
  
  -- Update journey progress
  UPDATE journey_progress
  SET 
    total_check_ins = total_check_ins + 1,
    last_check_in = NEW.timestamp
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_in_counter_trigger AFTER INSERT ON check_ins
  FOR EACH ROW EXECUTE FUNCTION update_check_in_counts();
```

### Calculate streak

```sql
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER := 0;
  last_check_in_date DATE;
  check_in_dates DATE[];
BEGIN
  -- Get all unique check-in dates for user, ordered by date DESC
  SELECT ARRAY_AGG(DISTINCT DATE(timestamp) ORDER BY DATE(timestamp) DESC)
  INTO check_in_dates
  FROM check_ins
  WHERE user_id = p_user_id;
  
  IF check_in_dates IS NULL OR ARRAY_LENGTH(check_in_dates, 1) = 0 THEN
    RETURN 0;
  END IF;
  
  last_check_in_date := check_in_dates[1];
  
  -- Check if streak is broken (no check-in yesterday or today)
  IF last_check_in_date < CURRENT_DATE - INTERVAL '1 day' THEN
    RETURN 0;
  END IF;
  
  -- Calculate consecutive days
  FOR i IN 1..ARRAY_LENGTH(check_in_dates, 1) LOOP
    IF i = 1 THEN
      current_streak := 1;
    ELSE
      IF check_in_dates[i] = check_in_dates[i-1] - INTERVAL '1 day' THEN
        current_streak := current_streak + 1;
      ELSE
        EXIT;
      END IF;
    END IF;
  END LOOP;
  
  RETURN current_streak;
END;
$$ language 'plpgsql';
```

---

## Indexes Summary

Performance-critical indexes:
- **Geospatial:** `idx_locations_coords` for nearby location queries
- **User queries:** `idx_users_email`, `idx_users_username`
- **Check-ins:** `idx_check_ins_user`, `idx_check_ins_location`
- **Time-based:** All timestamp indexes for sorting and filtering

---

## Sample Data

### Insert sample locations

```sql
INSERT INTO locations (name, type, latitude, longitude, address, city, country, anxiety_level, is_verified, is_beginner_friendly, has_qr_reward) VALUES
('Peaceful Grounds Café', 'coffee', 51.5074, -0.1278, '123 Calm Street', 'London', 'UK', 'low', true, true, true),
('Beginner Fitness Hub', 'gym', 51.5085, -0.1290, '45 Support Lane', 'London', 'UK', 'low', true, true, false),
('The Quiet Gym', 'gym', 51.5100, -0.1300, '78 Structure Road', 'London', 'UK', 'medium', true, true, false);
```

---

## Backup & Maintenance

### Backup Strategy
- **Daily:** Full database backup
- **Hourly:** Incremental backups
- **Weekly:** Archive to cold storage
- **Retention:** 30 days hot, 1 year cold

### Maintenance Tasks
- **Weekly:** Vacuum and analyze tables
- **Monthly:** Reindex large tables
- **Quarterly:** Review and optimize slow queries

---

## Security

### Row-Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_own_data ON users
  FOR ALL USING (id = current_setting('app.user_id')::UUID);

CREATE POLICY user_own_check_ins ON check_ins
  FOR ALL USING (user_id = current_setting('app.user_id')::UUID);

-- Locations are public (read-only for most users)
CREATE POLICY public_locations ON locations
  FOR SELECT USING (true);
```

### Data Encryption
- Sensitive fields encrypted at application layer
- Database connections use SSL/TLS
- Password hashes use bcrypt (cost factor: 12)

---

## Scaling Considerations

### Partitioning
- **check_ins:** Partition by date (monthly)
- **chat_messages:** Partition by date (quarterly)
- **notifications:** Partition by date (quarterly)

### Read Replicas
- Primary: Write operations
- Replica 1: Read queries (location searches, user profiles)
- Replica 2: Analytics and reporting

---

**Note:** This schema is designed for PostgreSQL 14+. Adjust as needed for your specific version.
