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
    // Crear usuario normal
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'password123',
        role: 'USER',
      },
    });

    // Crear usuario admin
    const admin = await prisma.user.create({
      data: {
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'ADMIN',
      },
    });

    // Generar tokens
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
    });

    test('Acceso con token válido debe responder 200 OK', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email');
    });

    test('Acceso con token inválido debe responder 401 Unauthorized', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid token');
    });
  });

  describe('Role Middleware Tests', () => {
    test('Usuario USER intentando acceder a ruta ADMIN debe responder 403 Forbidden', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Insufficient permissions');
    });

    test('Usuario ADMIN accediendo a ruta ADMIN debe responder 200 OK', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Success Cases', () => {
    test('Usuario USER puede acceder a rutas protegidas que requieren solo autenticación', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('Usuario ADMIN puede acceder a cualquier ruta', async () => {
      // Probar acceso a ruta USER
      const userRouteResponse = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(userRouteResponse.body).toHaveProperty(
        'email',
        'testadmin@example.com',
      );

      // Probar acceso a ruta ADMIN
      const adminRouteResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(adminRouteResponse.body)).toBe(true);
    });
  });
});
