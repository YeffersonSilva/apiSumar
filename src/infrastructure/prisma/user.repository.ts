import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        password: user.getPassword(),
        createdAt: user.getCreatedAt(),
      },
    });

    return User.create(prismaUser.email, prismaUser.name, prismaUser.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!prismaUser) {
      return null;
    }

    return User.create(prismaUser.email, prismaUser.name, prismaUser.password);
  }
}
