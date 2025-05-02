import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { PrismaUserRepository } from '../repositories/user.repository';
import { UuidService } from '../../../shared/services/uuid.service';
import { PasswordService } from '../../../shared/services/password.service';
import { Authorized } from '../../../shared/decorators/auth.decorator';

/**
 * Controlador para operaciones relacionadas con usuarios.
 * Implementa los endpoints HTTP y maneja las respuestas.
 */
export class UserController {
  private createUserUseCase: CreateUserUseCase;

  constructor() {
    const uuidService = new UuidService();
    const passwordService = new PasswordService();
    const userRepository = new PrismaUserRepository(
      uuidService,
      passwordService,
    );
    this.createUserUseCase = new CreateUserUseCase(
      userRepository,
      uuidService,
      passwordService,
    );
  }

  /**
   * Crea un nuevo usuario.
   * @param req Request HTTP
   * @param res Response HTTP
   * @returns Response con el usuario creado o error
   */
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      console.log('Received data:', req.body);

      // Execute use case
      const result = await this.createUserUseCase.execute(req.body);

      // Return success response
      return res.status(201).json(result);
    } catch (error) {
      console.error('Controller error:', error);

      return res.status(400).json({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Error al crear usuario',
      });
    }
  }

  // Ruta protegida para cualquier usuario autenticado
  @Authorized()
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.sub;
      // Implementar lógica para obtener usuario actual
      return res
        .status(200)
        .json({ message: 'Obtener usuario actual', userId });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener usuario actual',
      });
    }
  }

  @Authorized()
  async updateCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.sub;
      return res
        .status(200)
        .json({ message: 'Actualizar usuario actual', userId });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al actualizar usuario actual',
      });
    }
  }

  // Ruta protegida solo para ADMIN
  @Authorized('ADMIN')
  async listUsers(req: Request, res: Response): Promise<Response> {
    try {
      // Implementar lógica para listar usuarios
      return res.status(200).json({ message: 'Listar usuarios' });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al listar usuarios',
      });
    }
  }

  // Ruta protegida solo para ADMIN
  @Authorized('ADMIN')
  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      // Implementar lógica para obtener usuario por ID
      return res.status(200).json({ message: 'Obtener usuario por ID', id });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener usuario',
      });
    }
  }

  // Ruta protegida solo para ADMIN
  @Authorized('ADMIN')
  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      // Implementar lógica para actualizar usuario
      return res.status(200).json({ message: 'Actualizar usuario', id });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al actualizar usuario',
      });
    }
  }

  // Ruta protegida solo para ADMIN
  @Authorized('ADMIN')
  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      // Implementar lógica para eliminar usuario
      return res.status(200).json({ message: 'Eliminar usuario', id });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al eliminar usuario',
      });
    }
  }
}
