import { User } from '../../domain/user/User';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { IdService } from '../../domain/services/id.service';
import { NotificationServicePort } from '../../domain/ports/notification.service.port';
import {
  UserAlreadyExistsError,
  InvalidUserDataError,
} from '../../domain/errors/user.error';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly idService: IdService,
    private readonly notificationService: NotificationServicePort,
  ) {}

  async execute(email: string, name: string, password: string): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new UserAlreadyExistsError(email);
      }

      // Create user entity
      const user = User.create(email, name, password, this.idService);

      // Persist user
      const createdUser = await this.userRepository.create(user);

      // Send welcome notification
      await this.notificationService.sendWelcomeNotification(createdUser);

      return createdUser;
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InvalidUserDataError(error.message);
      }
      throw new Error('Unexpected error while creating user');
    }
  }
}
