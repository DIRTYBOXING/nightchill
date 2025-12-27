import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';

// Sample locations data (replace with database)
const locations: Map<string, any> = new Map();

// Initialize with sample data
const sampleLocations = [
  {
    id: uuidv4(),
    name: 'Peaceful Grounds Café',
    type: 'coffee',
    latitude: 51.5074,
    longitude: -0.1278,
    address: '123 Calm Street',
    city: 'London',
    country: 'UK',
    description: 'A calm, welcoming café offering free coffee support for those who need a quiet moment.',
    amenities: ['free_wifi', 'quiet_space', 'outdoor_seating'],
    anxietyLevel: 'low',
    hasQRReward: true,
    isVerified: true,
    isBeginnerFriendly: true,
    rating: 4.8,
    reviewCount: 125,
    checkInCount: 450,
  },
  {
    id: uuidv4(),
    name: 'The Quiet Gym',
    type: 'gym',
    latitude: 51.5100,
    longitude: -0.1300,
    address: '45 Support Lane',
    city: 'London',
    country: 'UK',
    description: 'An anxiety-friendly gym with trained staff and quiet hours for beginners.',
    amenities: ['quiet_hours', 'beginner_classes', 'personal_trainers'],
    anxietyLevel: 'low',
    hasQRReward: false,
    isVerified: true,
    isBeginnerFriendly: true,
    rating: 4.9,
    reviewCount: 89,
    checkInCount: 320,
  },
];

sampleLocations.forEach((loc) => locations.set(loc.id, loc));

export class LocationController {
  /**
   * Get nearby locations
   */
  async getNearby(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lng, type, radius = 5, anxietyLevel, beginnerFriendly, limit = 20 } = req.query;

      if (!lat || !lng) {
        throw new ValidationError('Latitude and longitude are required');
      }

      let results = Array.from(locations.values());

      // Filter by type
      if (type) {
        results = results.filter((loc) => loc.type === type);
      }

      // Filter by anxiety level
      if (anxietyLevel) {
        results = results.filter((loc) => loc.anxietyLevel === anxietyLevel);
      }

      // Filter by beginner friendly
      if (beginnerFriendly === 'true') {
        results = results.filter((loc) => loc.isBeginnerFriendly);
      }

      // Calculate distance (simplified)
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      
      results = results.map((loc) => ({
        ...loc,
        distance: this.calculateDistance(userLat, userLng, loc.latitude, loc.longitude),
      }));

      // Filter by radius
      const radiusKm = parseFloat(radius as string);
      results = results.filter((loc) => loc.distance <= radiusKm);

      // Sort by distance
      results.sort((a, b) => a.distance - b.distance);

      // Limit results
      results = results.slice(0, parseInt(limit as string));

      res.status(200).json({
        locations: results,
        count: results.length,
        radius: radiusKm,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get locations' } });
      }
    }
  }

  /**
   * Get location by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const location = locations.get(id);

      if (!location) {
        throw new NotFoundError('Location not found');
      }

      res.status(200).json(location);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get location' } });
      }
    }
  }

  /**
   * Check in at a location
   */
  async checkIn(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { note, mood, qrCodeScanned } = req.body;

      const location = locations.get(id);

      if (!location) {
        throw new NotFoundError('Location not found');
      }

      // Update location check-in count
      location.checkInCount += 1;
      locations.set(id, location);

      const checkIn = {
        id: uuidv4(),
        userId: req.user?.userId,
        locationId: id,
        timestamp: new Date().toISOString(),
        note,
        mood,
        qrCodeScanned: qrCodeScanned || false,
      };

      res.status(201).json({
        checkIn,
        message: 'You showed up. That\'s what matters.',
        streakUpdated: true,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to check in' } });
      }
    }
  }

  /**
   * Get location reviews
   */
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const location = locations.get(id);

      if (!location) {
        throw new NotFoundError('Location not found');
      }

      // Return empty reviews for now (would come from database)
      res.status(200).json({
        reviews: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get reviews' } });
      }
    }
  }

  /**
   * Add a review to a location
   */
  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating, title, content } = req.body;

      const location = locations.get(id);

      if (!location) {
        throw new NotFoundError('Location not found');
      }

      if (!rating || rating < 1 || rating > 5) {
        throw new ValidationError('Rating must be between 1 and 5');
      }

      const review = {
        id: uuidv4(),
        userId: req.user?.userId,
        locationId: id,
        rating,
        title,
        content,
        isVerifiedVisit: true,
        createdAt: new Date().toISOString(),
      };

      // Update location rating (simplified)
      location.reviewCount += 1;
      locations.set(id, location);

      res.status(201).json(review);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to add review' } });
      }
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export { locations };
