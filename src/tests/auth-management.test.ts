import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../user-management/infra/controllers/auth.controller';
import { LoginUserUseCase } from '../user-management/application/use-cases/login-user.use-case';
import { UserRepositoryPort } from '../user-management/domain/interfaces/user.repository.interface';
import { PasswordService } from '../shared/services/password.service';
import { TokenService } from '../shared/services/token.service';
import { User, UserRole } from '../user-management/domain/user.entity';
import { UuidService } from '../shared/services/uuid.service';

describe('Auth Management', () => {
  let authController: AuthController;
  let loginUserUseCase: LoginUserUseCase;
  let userRepository: UserRepositoryPort;
  let passwordService: PasswordService;

  const mockUser = User.create(
    'test@example.com',
    'Test User',
    'hashedPassword123',
    new UuidService(),
    'USER' as UserRole,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'test-secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        LoginUserUseCase,
        PasswordService,
        TokenService,
        {
          provide: UserRepositoryPort,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get(AuthController);
    loginUserUseCase = module.get(LoginUserUseCase);
    userRepository = module.get(UserRepositoryPort);
    passwordService = module.get(PasswordService);
  });

  describe('login', () => {
    it('should return token and user data when credentials are valid', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordService, 'compare').mockResolvedValue(true);

      // Act
      const result = await authController.login(
        { body: loginDto } as any,
        { status: jest.fn().mockReturnThis(), json: jest.fn() } as any,
      );

      // Assert
      expect(result.status).toHaveBeenCalledWith(200);
      expect(result.json).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: expect.any(String),
          user: expect.objectContaining({
            id: mockUser.getId(),
            email: mockUser.getEmail(),
            role: mockUser.getRole(),
          }),
        }),
      );
    });

    it('should return 401 when user is not found', async () => {
      // Arrange
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      // Act
      const result = await authController.login(
        { body: loginDto } as any,
        { status: jest.fn().mockReturnThis(), json: jest.fn() } as any,
      );

      // Assert
      expect(result.status).toHaveBeenCalledWith(401);
      expect(result.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid credentials',
        }),
      );
    });

    it('should return 401 when password is incorrect', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordService, 'compare').mockResolvedValue(false);

      // Act
      const result = await authController.login(
        { body: loginDto } as any,
        { status: jest.fn().mockReturnThis(), json: jest.fn() } as any,
      );

      // Assert
      expect(result.status).toHaveBeenCalledWith(401);
      expect(result.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid credentials',
        }),
      );
    });

    it('should return 400 when data is invalid', async () => {
      // Arrange
      const loginDto = {
        email: 'invalid-email',
        password: '123', // too short
      };

      // Act
      const result = await authController.login(
        { body: loginDto } as any,
        { status: jest.fn().mockReturnThis(), json: jest.fn() } as any,
      );

      // Assert
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid data',
        }),
      );
    });
  });
});
