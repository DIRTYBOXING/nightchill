import request from 'supertest';
import app from '../src/server';

describe('NightChill API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /ready', () => {
    it('should return ready status', async () => {
      const response = await request(app).get('/ready');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ready');
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Welcome to NightChill API');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('Auth Endpoints', () => {
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      password: 'securePassword123',
    };

    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(testUser.email);
        expect(response.body.user.username).toBe(testUser.username);
      });

      it('should fail with missing required fields', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({ email: 'test2@example.com' });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login with valid credentials', async () => {
        // First register
        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'login@example.com',
            username: 'loginuser',
            password: 'securePassword123',
          });

        // Then login
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'login@example.com',
            password: 'securePassword123',
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
      });

      it('should fail with invalid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
          });

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Protected Endpoints', () => {
    let authToken: string;

    beforeAll(async () => {
      // Register and get token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'protected@example.com',
          username: 'protecteduser',
          password: 'securePassword123',
        });

      authToken = response.body.token;
    });

    describe('GET /api/users/me', () => {
      it('should return user profile with valid token', async () => {
        const response = await request(app)
          .get('/api/users/me')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', 'protected@example.com');
      });

      it('should fail without token', async () => {
        const response = await request(app).get('/api/users/me');
        expect(response.status).toBe(401);
      });
    });

    describe('GET /api/users/me/journey', () => {
      it('should return journey progress', async () => {
        const response = await request(app)
          .get('/api/users/me/journey')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('level');
        expect(response.body).toHaveProperty('totalCheckIns');
        expect(response.body).toHaveProperty('currentStreak');
      });
    });
  });

  describe('Location Endpoints', () => {
    describe('GET /api/locations/nearby', () => {
      it('should return nearby locations', async () => {
        const response = await request(app)
          .get('/api/locations/nearby')
          .query({ lat: 51.5074, lng: -0.1278 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('locations');
        expect(Array.isArray(response.body.locations)).toBe(true);
      });

      it('should fail without coordinates', async () => {
        const response = await request(app).get('/api/locations/nearby');
        expect(response.status).toBe(422);
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
