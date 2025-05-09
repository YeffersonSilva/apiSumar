import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/user.entity';
import { UserRepositoryPort } from '../../domain/interfaces/user.repository.interface';
import { PasswordService } from '../../../shared/services/password.service';
import { IdService } from '../../domain/interfaces/id.service.interface';

/**
 * Implementación del repositorio de usuarios usando Prisma.
 */
export class PrismaUserRepository implements UserRepositoryPort {
  private prisma: PrismaClient;

  constructor(
    private readonly idService: IdService,
    private readonly passwordService: PasswordService,
  ) {
    this.prisma = new PrismaClient();
  }

  async create(user: User): Promise<User> {
    try {
      const hashedPassword = await this.passwordService.hash(
        user.getPassword(),
      );

      const prismaUser = await this.prisma.user.create({
        data: {
          id: user.getId(),
          email: user.getEmail(),
          name: user.getName(),
          password: hashedPassword,
          createdAt: user.getCreatedAt(),
        },
      });

      return User.create(
        prismaUser.email,
        prismaUser.name,
        prismaUser.password,
        this.idService,
      );
    } catch (error) {
      console.error('Error creating user in repository:', error);
      throw new Error('Failed to create user in database');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!prismaUser) {
        return null;
      }

      return User.create(
        prismaUser.email,
        prismaUser.name,
        prismaUser.password,
        this.idService,
      );
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user in database');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!prismaUser) {
        return null;
      }

      return User.create(
        prismaUser.email,
        prismaUser.name,
        prismaUser.password,
        this.idService,
      );
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw new Error('Failed to find user in database');
    }
  }

  async update(user: User): Promise<User> {
    try {
      const hashedPassword = await this.passwordService.hash(
        user.getPassword(),
      );

      const prismaUser = await this.prisma.user.update({
        where: { id: user.getId() },
        data: {
          email: user.getEmail(),
          name: user.getName(),
          password: hashedPassword,
        },
      });

      return User.create(
        prismaUser.email,
        prismaUser.name,
        prismaUser.password,
        this.idService,
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user in database');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user from database');
    }
  }
}
