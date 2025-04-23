import request from 'supertest';
import app from '../app';

describe('API Tests', () => {
  describe('GET /', () => {
    it('should return 200 and a welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('API funcionando correctamente');
    });
  });

  describe('POST /users', () => {
    it('should validate user input', async () => {
      const invalidUser = {
        email: 'invalid-email',
        name: 'T',
        password: '123',
      };

      const response = await request(app).post('/users').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should create a valid user', async () => {
      const validUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app).post('/users').send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(validUser.email);
    });
  });
});
