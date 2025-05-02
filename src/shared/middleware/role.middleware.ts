import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(requiredRole: 'USER' | 'ADMIN') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'No autenticado' 
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        status: 'error',
        message: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
} 