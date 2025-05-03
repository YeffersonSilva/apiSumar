import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Auth Routes Tests', () => {
  let userToken: string;
  let adminToken: string;
  let invalidToken: string;

  beforeAll(async () => {
    // Create regular user
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'password123',
        role: 'USER',
        name: 'Test User',
      },
    });

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'ADMIN',
        name: 'Test Admin',
      },
    });

    // Generate tokens
    userToken = jwt.sign(
      { userId: user.id, role: 'USER' },
      process.env.JWT_SECRET || 'secret',
    );
    adminToken = jwt.sign(
      { userId: admin.id, role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret',
    );
    invalidToken = 'invalid.token.here';
  });

  afterAll(async () => {
    // Clean up database
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testuser@example.com', 'testadmin@example.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('Auth Middleware Tests', () => {
    test('Access without token should return 401 Unauthorized', async () => {
      const response = await request(app).get('/api/users/me').expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    test('Access with valid token should return 200 OK', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email');
    });

    test('Access with invalid token should return 401 Unauthorized', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid token');
    });

    test('Access with expired token should return 401 Unauthorized', async () => {
      // Create token that expires in 1 second
      const expiredToken = jwt.sign(
        { userId: 'test-user-id', role: 'USER' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1s' },
      );

      // Wait 2 seconds to ensure token expires
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token expired');
    });
  });

  describe('Role Middleware Tests', () => {
    test('USER role trying to access ADMIN route should return 403 Forbidden', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Insufficient permissions');
    });

    test('ADMIN role accessing ADMIN route should return 200 OK', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Success Cases', () => {
    test('USER can access protected routes requiring only authentication', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('ADMIN can access any route', async () => {
      // Test USER route access
      const userRouteResponse = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(userRouteResponse.body).toHaveProperty(
        'email',
        'testadmin@example.com',
      );

      // Test ADMIN route access
      const adminRouteResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(adminRouteResponse.body)).toBe(true);
    });
  });
});
