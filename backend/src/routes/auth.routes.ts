import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req: Request, res: Response) => 
  authController.register(req, res)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', (req: Request, res: Response) => 
  authController.login(req, res)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', (req: Request, res: Response) => 
  authController.logout(req, res)
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', (req: Request, res: Response) => 
  authController.refreshToken(req, res)
);

export default router;
