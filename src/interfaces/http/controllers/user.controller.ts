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
      console.log('Datos recibidos:', req.body);

      // Validar datos de entrada
      const result = createUserSchema.safeParse(req.body);
      if (!result.success) {
        console.log('Error de validación:', result.error);
        return res.status(400).json({
          error: 'Datos inválidos',
          details: result.error.errors,
        });
      }

      const { email, name, password } = result.data;

      // Ejecutar caso de uso
      const user = await this.createUserUseCase.execute(email, name, password);

      // Retornar respuesta exitosa
      return res.status(201).json({
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        createdAt: user.getCreatedAt(),
      });
    } catch (error) {
      console.error('Error en el controlador:', error);
      if (error instanceof Error) {
        // Manejar error de email duplicado
        if (error.message.includes('Ya existe un usuario con este email')) {
          return res.status(409).json({
            error: 'Email en uso',
            message: error.message,
          });
        }

        // Manejar otros errores de validación
        if (error.message.includes('Error al crear usuario')) {
          return res.status(400).json({
            error: 'Error de validación',
            message: error.message,
          });
        }
      }

      // Error inesperado
      console.error('Error inesperado:', error);
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Ocurrió un error inesperado',
      });
    }
  }
}
