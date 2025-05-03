import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Auth Routes Tests', () => {
  let userToken: string;
  let adminToken: string;
  let invalidToken: string;
  let testUser: any;
  let testAdmin: any;

  beforeAll(async () => {
    // Limpiar cualquier dato residual de pruebas anteriores
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testuser@example.com', 'testadmin@example.com'],
        },
      },
    });

    // Crear usuario normal
    testUser = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'password123',
        role: 'USER',
        name: 'Test User',
      },
    });

    // Crear usuario admin
    testAdmin = await prisma.user.create({
      data: {
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'ADMIN',
        name: 'Test Admin',
      },
    });

    // Generar tokens
    userToken = jwt.sign(
      { userId: testUser.id, role: 'USER' },
      process.env.JWT_SECRET || 'secret',
    );
    adminToken = jwt.sign(
      { userId: testAdmin.id, role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret',
    );
    invalidToken = 'invalid.token.here';
  });

  afterAll(async () => {
    // Limpiar la base de datos
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
    test('Acceso sin token debe responder 401 Unauthorized', async () => {
      const response = await request(app).get('/api/users/me').expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
      expect(response.body).toHaveProperty('statusCode', 401);
    });

    test('Acceso con token válido debe responder 200 OK', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('role', 'USER');
      expect(response.body).not.toHaveProperty('password');
    });

    test('Acceso con token inválido debe responder 401 Unauthorized', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid token');
      expect(response.body).toHaveProperty('statusCode', 401);
    });

    test('Acceso con formato de token incorrecto debe responder 401 Unauthorized', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-format-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('Role Middleware Tests', () => {
    test('Usuario USER intentando acceder a ruta ADMIN debe responder 403 Forbidden', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Insufficient permissions');
      expect(response.body).toHaveProperty('statusCode', 403);
      expect(response.body).toHaveProperty('requiredRole', 'ADMIN');
    });

    test('Usuario ADMIN accediendo a ruta ADMIN debe responder 200 OK', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('role');
    });
  });

  describe('Success Cases', () => {
    test('Usuario USER puede acceder a rutas protegidas que requieren solo autenticación', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('role', 'USER');
      expect(response.body).not.toHaveProperty('password');
    });

    test('Usuario ADMIN puede acceder a cualquier ruta', async () => {
      // Probar acceso a ruta USER
      const userRouteResponse = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(userRouteResponse.body).toHaveProperty('email', testAdmin.email);
      expect(userRouteResponse.body).toHaveProperty('role', 'ADMIN');
      expect(userRouteResponse.body).not.toHaveProperty('password');

      // Probar acceso a ruta ADMIN
      const adminRouteResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(adminRouteResponse.body)).toBe(true);
      expect(adminRouteResponse.body.length).toBeGreaterThan(0);
      expect(adminRouteResponse.body[0]).toHaveProperty('email');
      expect(adminRouteResponse.body[0]).toHaveProperty('role');
    });
  });
});
