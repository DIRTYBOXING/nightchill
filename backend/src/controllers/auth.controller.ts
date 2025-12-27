import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ValidationError, ConflictError, UnauthorizedError } from '../middleware/errorHandler';
import { getJwtSecret, getJwtExpiry } from '../utils/jwt';

// Temporary in-memory storage (replace with database)
const users: Map<string, any> = new Map();

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, displayName, password } = req.body;

      // Validation
      if (!email || !username || !password) {
        throw new ValidationError('Email, username, and password are required');
      }

      // Check if user exists
      const existingUser = Array.from(users.values()).find(
        (u) => u.email === email || u.username === username
      );

      if (existingUser) {
        throw new ConflictError('User with this email or username already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const userId = uuidv4();
      const user = {
        id: userId,
        email,
        username,
        displayName: displayName || username,
        passwordHash,
        journeyLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        totalCheckIns: 0,
        themeMode: 'light',
        notificationsEnabled: true,
        createdAt: new Date().toISOString(),
      };

      users.set(userId, user);

      // Generate token
      const token = this.generateToken(userId, email);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Registration failed' } });
      }
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Find user
      const user = Array.from(users.values()).find((u) => u.email === email);

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user.id, user.email);

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
        },
        token,
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UnauthorizedError) {
        res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
      } else {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Login failed' } });
      }
    }
  }

  /**
   * Logout user
   */
  async logout(_req: Request, res: Response): Promise<void> {
    // In a real app, you would invalidate the token here
    res.status(204).send();
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }

      // Verify refresh token and generate new access token
      // This is a simplified implementation
      const decoded = jwt.verify(
        refreshToken,
        getJwtSecret()
      ) as { userId: string; email: string };

      const token = this.generateToken(decoded.userId, decoded.email);

      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' } });
    }
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      getJwtSecret(),
      { expiresIn: getJwtExpiry() }
    );
  }
}

// Export users map for use in other controllers (temporary)
export { users };
