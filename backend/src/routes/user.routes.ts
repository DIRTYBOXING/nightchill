import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const userController = new UserController();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, (req: Request, res: Response) => 
  userController.getProfile(req, res)
);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authenticate, (req: Request, res: Response) => 
  userController.updateProfile(req, res)
);

/**
 * @route   GET /api/users/me/journey
 * @desc    Get user journey progress
 * @access  Private
 */
router.get('/me/journey', authenticate, (req: Request, res: Response) => 
  userController.getJourneyProgress(req, res)
);

/**
 * @route   POST /api/users/me/checkin
 * @desc    Daily check-in
 * @access  Private
 */
router.post('/me/checkin', authenticate, (req: Request, res: Response) => 
  userController.dailyCheckIn(req, res)
);

export default router;
