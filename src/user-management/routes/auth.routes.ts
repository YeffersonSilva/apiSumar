import { Router } from 'express';
import { AuthController } from '../infra/controllers/auth.controller';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { PrismaUserRepository } from '../infra/prisma/user.repository';
import { UuidService } from '../../shared/services/uuid.service';
import { PasswordService } from '../../shared/services/password.service';
import { TokenService } from '../../shared/services/token.service';

export function createAuthRoutes(): Router {
  const router = Router();
  const idService = new UuidService();
  const passwordService = new PasswordService();
  const tokenService = new TokenService();
  const userRepository = new PrismaUserRepository(idService, passwordService);
  const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    passwordService,
    tokenService,
  );
  const authController = new AuthController(loginUserUseCase);

  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}
