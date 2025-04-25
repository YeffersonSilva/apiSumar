import { User } from '../user/User';

/**
 * Puerto que define las operaciones del servicio de autenticación.
 * Esta interfaz define el contrato que deben implementar los adaptadores secundarios.
 */
export interface AuthServicePort {
  /**
   * Verifica las credenciales de un usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Usuario autenticado o null si las credenciales son inválidas
   */
  verifyCredentials(email: string, password: string): Promise<User | null>;

  /**
   * Genera un token de autenticación para un usuario
   * @param user Usuario para el cual generar el token
   * @returns Token de autenticación
   */
  generateToken(user: User): Promise<string>;

  /**
   * Verifica un token de autenticación
   * @param token Token a verificar
   * @returns ID del usuario si el token es válido
   */
  verifyToken(token: string): Promise<string | null>;
}
