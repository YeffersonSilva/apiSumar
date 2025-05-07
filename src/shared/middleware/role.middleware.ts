import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../errors/http-error';

export function roleMiddleware(requiredRole: 'USER' | 'ADMIN') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('No autenticado');
    }

    if (req.user.role !== requiredRole) {
      throw new ForbiddenError(
        'No tienes permisos para acceder a este recurso',
      );
    }

    next();
  };
}
