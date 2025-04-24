import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { createUserSchema } from '../dtos/create-user.dto';

/**
 * Controlador para operaciones relacionadas con usuarios.
 * Implementa los endpoints HTTP y maneja las respuestas.
 */
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

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
      if (error instanceof Error) {
        // Handle duplicate email error
        if (error.message.includes('Email already exists')) {
          return res.status(409).json({
            error: 'Email in use',
            message: error.message,
          });
        }

        // Handle other validation errors
        if (error.message.includes('Error creating user')) {
          return res.status(400).json({
            error: 'Validation error',
            message: error.message,
          });
        }
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
