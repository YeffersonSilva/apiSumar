import { IdService } from './interfaces/id.service.interface';

export type UserRole = 'USER' | 'ADMIN';

export class User {
  private readonly id: string;
  private readonly email: string;
  private readonly name: string;
  private readonly password: string;
  private readonly role: UserRole;
  private readonly createdAt: Date;

  private constructor(
    id: string,
    email: string,
    name: string,
    password: string,
    role: UserRole,
    createdAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }

  public static create(
    email: string,
    name: string,
    password: string,
    idService: IdService,
    role: UserRole = 'USER',
  ): User {
    // Basic validations
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (!name || name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    return new User(
      idService.generate(),
      email.toLowerCase().trim(),
      name.trim(),
      password,
      role,
      new Date(),
    );
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // Métodos de negocio
  public isEmail(email: string): boolean {
    return this.email === email.toLowerCase().trim();
  }
}
