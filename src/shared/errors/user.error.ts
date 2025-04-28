import { DomainError } from './domain.error';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}

export class InvalidUserDataError extends DomainError {
  constructor(message: string) {
    super(`Invalid user data: ${message}`);
  }
} 