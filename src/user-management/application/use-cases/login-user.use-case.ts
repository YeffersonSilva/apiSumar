import { UserRepositoryPort } from '../../domain/interfaces/user.repository.interface';
import { PasswordService } from '../../../shared/services/password.service';
import { TokenService } from '../../../shared/services/token.service';

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.getPassword(),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    };

    const accessToken = this.tokenService.generateToken(payload);

    return {
      accessToken,
      user: {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    };
  }
}
