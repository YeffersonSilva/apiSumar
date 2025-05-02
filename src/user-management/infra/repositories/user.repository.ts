import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/user.entity';
import { UserRepositoryPort } from '../../domain/user.repository';
import { UuidService } from '../../../shared/services/uuid.service';
import { PasswordService } from '../../../shared/services/password.service';

export class PrismaUserRepository implements UserRepositoryPort {
  private prisma: PrismaClient;

  constructor(
    private readonly uuidService: UuidService,
    private readonly passwordService: PasswordService,
  ) {
    this.prisma = new PrismaClient();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.name,
      user.password,
      user.role as 'USER' | 'ADMIN',
    );
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        password: user.getPassword(),
        role: user.getRole(),
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.name,
      user.password,
      user.role as 'USER' | 'ADMIN',
    );
  }

  async list(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      (user) =>
        new User(
          user.id,
          user.email,
          user.name,
          user.password,
          user.role as 'USER' | 'ADMIN',
        ),
    );
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        email: user.getEmail(),
        name: user.getName(),
        password: user.getPassword(),
        role: user.getRole(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
