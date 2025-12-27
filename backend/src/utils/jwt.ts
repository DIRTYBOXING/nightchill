/**
 * Get the JWT secret from environment variables.
 * Throws an error if JWT_SECRET is not set in production.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    // Only allow default in development/test
    console.warn('WARNING: Using default JWT secret. Set JWT_SECRET in production!');
    return 'development-secret-do-not-use-in-production';
  }
  
  return secret;
}

/**
 * Get JWT expiry from environment or default
 */
export function getJwtExpiry(): string {
  return process.env.JWT_EXPIRY || '7d';
}

/**
 * Get refresh token expiry from environment or default
 */
export function getRefreshTokenExpiry(): string {
  return process.env.REFRESH_TOKEN_EXPIRY || '30d';
}
