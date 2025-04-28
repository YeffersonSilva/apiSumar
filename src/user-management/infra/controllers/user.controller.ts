import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { createUserSchema } from '../dtos/create-user.dto';
import { UuidService } from '../../../shared/services/uuid.service';
import { PrismaUserRepository } from '../prisma/user.repository';
import { EmailNotificationService } from '../../../shared/services/email-notification.service';
import {
  UserAlreadyExistsError,
  InvalidUserDataError,
} from '../../../shared/errors/user.error';

/**
 * Controlador para operaciones relacionadas con usuarios.
 * Implementa los endpoints HTTP y maneja las respuestas.
 */
export class UserController {
  private readonly createUserUseCase: CreateUserUseCase;

  constructor() {
    const idService = new UuidService();
    const userRepository = new PrismaUserRepository(idService);
    const notificationService = new EmailNotificationService();
    this.createUserUseCase = new CreateUserUseCase(
      userRepository,
      idService,
      notificationService,
    );
  }

  /**
   * Crea un nuevo usuario.
   * @param req Request HTTP
   * @param res Response HTTP
   * @returns Response con el usuario creado o error
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      console.log('Received data:', req.body);

      // Validate input data
      const result = createUserSchema.safeParse(req.body);
      if (!result.success) {
        console.log('Validation error:', result.error);
        return res.status(400).json({
          error: 'Invalid data',
          details: result.error.errors,
        });
      }

      const { email, name, password } = result.data;

      // Execute use case
      const user = await this.createUserUseCase.execute(email, name, password);

      // Return success response
      return res.status(201).json({
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        createdAt: user.getCreatedAt(),
      });
    } catch (error) {
      console.error('Controller error:', error);

      if (error instanceof UserAlreadyExistsError) {
        return res.status(409).json({
          error: 'User already exists',
          message: error.message,
        });
      }

      if (error instanceof InvalidUserDataError) {
        return res.status(400).json({
          error: 'Invalid user data',
          message: error.message,
        });
      }

      // Unexpected error
      console.error('Unexpected error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  }
}
