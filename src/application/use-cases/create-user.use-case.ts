import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, name: string, password: string): Promise<User> {
    // Validar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }

    try {
      // Crear la entidad User
      const user = User.create(email, name, password);

      // Persistir el usuario
      
      return await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
      }
      throw new Error('Error inesperado al crear usuario');
    }
  }
}
