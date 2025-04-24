import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { PrismaUserRepository } from '../infrastructure/prisma/user.repository';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UserController } from '../interfaces/http/controllers/user.controller';

describe('User Registration', () => {
  let prisma: PrismaClient;
  let userRepository: PrismaUserRepository;
  let createUserUseCase: CreateUserUseCase;
  let userController: UserController;

  beforeAll(async () => {
    prisma = new PrismaClient();
    userRepository = new PrismaUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    userController = new UserController(createUserUseCase);

    // Configurar la ruta
    app.post('/users', (req, res) => userController.create(req, res));
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada prueba
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /users', () => {
    it('should register a new user with valid data', async () => {
      const validUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app).post('/users').send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(validUser.email);
      expect(response.body.name).toBe(validUser.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject registration with invalid email', async () => {
      const invalidUser = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app).post('/users').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Datos inválidos');
    });

    it('should reject registration with duplicate email', async () => {
      // Primero crear un usuario
      const user = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      await request(app).post('/users').send(user);

      // Intentar crear otro usuario con el mismo email
      const response = await request(app).post('/users').send(user);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email en uso');
    });

    it('should reject registration with weak password', async () => {
      const weakPasswordUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: '123', // Contraseña muy corta
      };

      const response = await request(app).post('/users').send(weakPasswordUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Datos inválidos');
    });

    it('should reject registration with short name', async () => {
      const shortNameUser = {
        email: 'test@example.com',
        name: 'T', // Nombre muy corto
        password: 'password123',
      };

      const response = await request(app).post('/users').send(shortNameUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Datos inválidos');
    });

    it('should reject registration with missing required fields', async () => {
      const incompleteUser = {
        email: 'test@example.com',
        // Falta name
        password: 'password123',
      };

      const response = await request(app).post('/users').send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Datos inválidos');
    });
  });
});
