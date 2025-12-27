import { Request, Response } from 'express';
import { users } from './auth.controller';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';
import { UserProfile } from '../models/types';

export class UserController {
  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const user = users.get(userId!);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        journeyLevel: user.journeyLevel,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalCheckIns: user.totalCheckIns,
        themeMode: user.themeMode,
        notificationsEnabled: user.notificationsEnabled,
        createdAt: user.createdAt,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get profile' } });
      }
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const user = users.get(userId!);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const { displayName, bio, themeMode, notificationsEnabled } = req.body;

      // Validate theme mode
      if (themeMode && !['light', 'dark', 'neon'].includes(themeMode)) {
        throw new ValidationError('Invalid theme mode');
      }

      // Update user
      if (displayName !== undefined) user.displayName = displayName;
      if (bio !== undefined) user.bio = bio;
      if (themeMode !== undefined) user.themeMode = themeMode;
      if (notificationsEnabled !== undefined) user.notificationsEnabled = notificationsEnabled;

      users.set(userId!, user);

      res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        themeMode: user.themeMode,
        notificationsEnabled: user.notificationsEnabled,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update profile' } });
      }
    }
  }

  /**
   * Get user journey progress
   */
  async getJourneyProgress(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const user = users.get(userId!);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.status(200).json({
        userId: user.id,
        level: user.journeyLevel,
        totalCheckIns: user.totalCheckIns,
        gymVisits: user.gymVisits || 0,
        mentorSessions: user.mentorSessions || 0,
        coffeeRedemptions: user.coffeeRedemptions || 0,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastCheckIn: user.lastCheckIn,
        levelCompletionPercentage: this.calculateLevelProgress(user),
        milestonesAchieved: user.milestonesAchieved || [],
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get journey progress' } });
      }
    }
  }

  /**
   * Daily check-in
   */
  async dailyCheckIn(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const user = users.get(userId!);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const { mood, note } = req.body;
      const now = new Date();

      // Update streak
      const lastCheckIn = user.lastCheckIn ? new Date(user.lastCheckIn) : null;
      if (lastCheckIn) {
        const hoursSinceLastCheckIn = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastCheckIn > 48) {
          user.currentStreak = 1;
        } else if (hoursSinceLastCheckIn > 20) {
          user.currentStreak += 1;
        }
      } else {
        user.currentStreak = 1;
      }

      // Update longest streak
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }

      user.totalCheckIns += 1;
      user.lastCheckIn = now.toISOString();

      // Check for level up
      const oldLevel = user.journeyLevel;
      user.journeyLevel = this.calculateLevel(user);

      users.set(userId!, user);

      res.status(200).json({
        message: 'Check-in successful! You showed up. That matters.',
        currentStreak: user.currentStreak,
        totalCheckIns: user.totalCheckIns,
        levelUp: user.journeyLevel > oldLevel,
        newLevel: user.journeyLevel,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to check in' } });
      }
    }
  }

  private calculateLevelProgress(user: Partial<UserProfile>): number {
    const levelRequirements = [0, 3, 10, 21, 50]; // Check-ins needed for each level
    const currentLevel = user.journeyLevel || 1;
    const currentCheckIns = user.totalCheckIns || 0;

    if (currentLevel >= 5) return 100;

    const prevRequired = levelRequirements[currentLevel - 1];
    const nextRequired = levelRequirements[currentLevel];
    const progress = ((currentCheckIns - prevRequired) / (nextRequired - prevRequired)) * 100;

    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  private calculateLevel(user: Partial<UserProfile>): 1 | 2 | 3 | 4 | 5 {
    const checkIns = user.totalCheckIns || 0;
    if (checkIns >= 50) return 5;
    if (checkIns >= 21) return 4;
    if (checkIns >= 10) return 3;
    if (checkIns >= 3) return 2;
    return 1;
  }
}
