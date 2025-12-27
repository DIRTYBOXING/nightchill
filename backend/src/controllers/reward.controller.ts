import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';

// Sample rewards data (replace with database)
const rewards: Map<string, any> = new Map();

export class RewardController {
  /**
   * Get user's available rewards
   */
  async getAvailable(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Filter rewards for user
      const userRewards = Array.from(rewards.values())
        .filter((r) => r.userId === userId && !r.redeemed)
        .filter((r) => !r.expiresAt || new Date(r.expiresAt) > new Date());

      res.status(200).json({
        rewards: userRewards,
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get rewards' } });
    }
  }

  /**
   * Redeem a reward
   */
  async redeem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { locationId } = req.body;
      const userId = req.user?.userId;

      const reward = rewards.get(id);

      if (!reward) {
        throw new NotFoundError('Reward not found');
      }

      if (reward.userId !== userId) {
        throw new NotFoundError('Reward not found');
      }

      if (reward.redeemed) {
        throw new ValidationError('Reward has already been redeemed');
      }

      if (reward.expiresAt && new Date(reward.expiresAt) < new Date()) {
        throw new ValidationError('Reward has expired');
      }

      // Mark as redeemed
      reward.redeemed = true;
      reward.redeemedAt = new Date().toISOString();
      reward.redeemedLocationId = locationId;

      rewards.set(id, reward);

      res.status(200).json({
        message: 'Reward redeemed successfully!',
        reward,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to redeem reward' } });
      }
    }
  }

  /**
   * Validate a QR code
   */
  async validateQR(req: Request, res: Response): Promise<void> {
    try {
      const { qrCode, locationId } = req.body;

      if (!qrCode) {
        throw new ValidationError('QR code is required');
      }

      // Find reward by QR code
      const reward = Array.from(rewards.values()).find((r) => r.qrCode === qrCode);

      if (!reward) {
        res.status(200).json({
          valid: false,
          message: 'Invalid QR code',
        });
        return;
      }

      if (reward.redeemed) {
        res.status(200).json({
          valid: false,
          message: 'This reward has already been redeemed',
        });
        return;
      }

      res.status(200).json({
        valid: true,
        reward: {
          id: reward.id,
          type: reward.type,
          title: reward.title,
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to validate QR code' } });
      }
    }
  }

  /**
   * Get user's reward history
   */
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { page = '1', limit = '20' } = req.query;

      // Get all rewards for user
      const userRewards = Array.from(rewards.values())
        .filter((r) => r.userId === userId)
        .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedRewards = userRewards.slice(startIndex, startIndex + limitNum);

      res.status(200).json({
        rewards: paginatedRewards,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: userRewards.length,
          pages: Math.ceil(userRewards.length / limitNum),
        },
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get reward history' } });
    }
  }
}

// Function to create a reward for a user
export function createReward(userId: string, type: string, title: string): any {
  const reward = {
    id: uuidv4(),
    userId,
    type,
    title,
    description: `Earned for showing up!`,
    qrCode: `NC-${uuidv4().substring(0, 8).toUpperCase()}`,
    redeemed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    earnedAt: new Date().toISOString(),
  };

  rewards.set(reward.id, reward);
  return reward;
}

export { rewards };
