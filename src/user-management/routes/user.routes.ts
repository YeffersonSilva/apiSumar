import { Router } from 'express';
import { UserController } from '../infra/controllers/user.controller';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/', (req, res) => userController.create(req, res));

  return router;
}
