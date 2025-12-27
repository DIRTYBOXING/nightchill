import { Router, Request, Response } from 'express';
import { RewardController } from '../controllers/reward.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const rewardController = new RewardController();

/**
 * @route   GET /api/rewards/available
 * @desc    Get user's available rewards
 * @access  Private
 */
router.get('/available', authenticate, (req: Request, res: Response) => 
  rewardController.getAvailable(req, res)
);

/**
 * @route   POST /api/rewards/:id/redeem
 * @desc    Redeem a reward
 * @access  Private
 */
router.post('/:id/redeem', authenticate, (req: Request, res: Response) => 
  rewardController.redeem(req, res)
);

/**
 * @route   POST /api/rewards/qr/validate
 * @desc    Validate a QR code
 * @access  Private
 */
router.post('/qr/validate', authenticate, (req: Request, res: Response) => 
  rewardController.validateQR(req, res)
);

/**
 * @route   GET /api/rewards/history
 * @desc    Get user's reward history
 * @access  Private
 */
router.get('/history', authenticate, (req: Request, res: Response) => 
  rewardController.getHistory(req, res)
);

export default router;
