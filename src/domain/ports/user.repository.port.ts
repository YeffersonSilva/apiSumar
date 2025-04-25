import { User } from '../user/User';

/**
 * Puerto que define las operaciones del repositorio de usuarios.
 * Esta interfaz define el contrato que deben implementar los adaptadores secundarios.
 */
export interface UserRepositoryPort {
  /**
   * Crea un nuevo usuario en el repositorio
   * @param user Usuario a crear
   * @returns Usuario creado
   */
  create(user: User): Promise<User>;

  /**
   * Busca un usuario por su email
   * @param email Email del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca un usuario por su ID
   * @param id ID del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  findById(id: string): Promise<User | null>;

  /**
   * Actualiza un usuario existente
   * @param user Usuario a actualizar
   * @returns Usuario actualizado
   */
  update(user: User): Promise<User>;

  /**
   * Elimina un usuario por su ID
   * @param id ID del usuario a eliminar
   * @returns true si se eliminó correctamente
   */
  delete(id: string): Promise<boolean>;
}
