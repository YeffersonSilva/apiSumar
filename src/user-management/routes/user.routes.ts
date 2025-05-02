import { Router } from 'express';
import { UserController } from '../infra/controllers/user.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { roleMiddleware } from '../../shared/middleware/role.middleware';

export function createUserRoutes(userController: UserController) {
  const router = Router();

  // Rutas públicas
  router.post('/', (req, res) => userController.createUser(req, res));

  // Rutas protegidas que requieren autenticación
  router.get('/me', (req, res) => userController.getCurrentUser(req, res));
  router.put('/me', (req, res) => userController.updateCurrentUser(req, res));

  // Rutas que requieren rol ADMIN
  router.get('/', (req, res) => userController.listUsers(req, res));
  router.get('/:id', (req, res) => userController.getUserById(req, res));
  router.put('/:id', (req, res) => userController.updateUser(req, res));
  router.delete('/:id', (req, res) => userController.deleteUser(req, res));

  return router;
}
