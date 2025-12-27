import { Router, Request, Response } from 'express';
import { LocationController } from '../controllers/location.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();
const locationController = new LocationController();

/**
 * @route   GET /api/locations/nearby
 * @desc    Get nearby locations
 * @access  Public
 */
router.get('/nearby', optionalAuth, (req: Request, res: Response) => 
  locationController.getNearby(req, res)
);

/**
 * @route   GET /api/locations/:id
 * @desc    Get location details
 * @access  Public
 */
router.get('/:id', optionalAuth, (req: Request, res: Response) => 
  locationController.getById(req, res)
);

/**
 * @route   POST /api/locations/:id/checkin
 * @desc    Check in at a location
 * @access  Private
 */
router.post('/:id/checkin', authenticate, (req: Request, res: Response) => 
  locationController.checkIn(req, res)
);

/**
 * @route   GET /api/locations/:id/reviews
 * @desc    Get location reviews
 * @access  Public
 */
router.get('/:id/reviews', optionalAuth, (req: Request, res: Response) => 
  locationController.getReviews(req, res)
);

/**
 * @route   POST /api/locations/:id/reviews
 * @desc    Add a review to a location
 * @access  Private
 */
router.post('/:id/reviews', authenticate, (req: Request, res: Response) => 
  locationController.addReview(req, res)
);

export default router;
