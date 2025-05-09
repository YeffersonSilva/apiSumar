import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UnauthorizedError } from '../errors/http-error';

export function Authorized(role?: 'USER' | 'ADMIN') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      try {
        // Ejecutar middleware de autenticación
        await new Promise((resolve, reject) => {
          authMiddleware(req, res, (err?: any) => {
            if (err) reject(err);
            resolve(true);
          });
        });

        // Si hay rol requerido, verificar
        if (role) {
          await new Promise((resolve, reject) => {
            roleMiddleware(role)(req, res, (err?: any) => {
              if (err) reject(err);
              resolve(true);
            });
          });
        }

        // Si todo está bien, ejecutar el método original
        return originalMethod.call(this, req, res, next);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }
        throw new UnauthorizedError('No autorizado');
      }
    };

    return descriptor;
  };
}
