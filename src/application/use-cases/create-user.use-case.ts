import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, name: string, password: string): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Create user entity
      const user = User.create(email, name, password);

      // Persist user
      return await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
      throw new Error('Unexpected error while creating user');
    }
  }
}
