// User types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  passwordHash?: string;
  avatar?: string;
  bio?: string;
  journeyLevel: 1 | 2 | 3 | 4 | 5;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  themeMode: 'light' | 'dark' | 'neon';
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface UserProfile extends Omit<User, 'passwordHash'> {
  gymVisits?: number;
  mentorSessions?: number;
  coffeeRedemptions?: number;
  lastCheckIn?: string;
  milestonesAchieved?: string[];
}

// Location types
export type LocationType = 'coffee' | 'gym' | 'mentor' | 'nutrition' | 'partner';
export type AnxietyLevel = 'low' | 'medium' | 'high';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  description?: string;
  amenities?: string[];
  anxietyLevel?: AnxietyLevel;
  phone?: string;
  email?: string;
  website?: string;
  hours?: Record<string, { open: string; close: string }>;
  hasQRReward: boolean;
  isVerified: boolean;
  isBeginnerFriendly: boolean;
  images?: string[];
  rating: number;
  reviewCount: number;
  checkInCount: number;
  createdAt: string;
  updatedAt?: string;
}

// CheckIn types
export type Mood = 'calm' | 'anxious' | 'neutral' | 'motivated';

export interface CheckIn {
  id: string;
  userId: string;
  locationId: string;
  timestamp: string;
  note?: string;
  mood?: Mood;
  qrCodeScanned: boolean;
  rewardEarnedId?: string;
}

// Reward types
export type RewardType = 'coffee' | 'gym_pass' | 'discount' | 'badge';

export interface Reward {
  id: string;
  userId: string;
  type: RewardType;
  title: string;
  description?: string;
  qrCode?: string;
  redeemed: boolean;
  redeemedAt?: string;
  redeemedLocationId?: string;
  expiresAt?: string;
  partnerId?: string;
  earnedAt: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  reviewableType: 'location' | 'mentor';
  reviewableId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content?: string;
  isVerifiedVisit: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Chat types
export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  userId: string;
  role: ChatRole;
  content: string;
  context?: Record<string, unknown>;
  createdAt: string;
}

// API Response types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// Journey Progress types
export interface JourneyProgress {
  userId: string;
  level: 1 | 2 | 3 | 4 | 5;
  totalCheckIns: number;
  gymVisits: number;
  mentorSessions: number;
  coffeeRedemptions: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn?: string;
  levelStartDate: string;
  levelCompletionPercentage: number;
  milestonesAchieved: string[];
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  displayName?: string;
  password: string;
}
