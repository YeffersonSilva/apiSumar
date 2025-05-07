import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';
import { UnauthorizedError } from '../errors/http-error';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenService = new TokenService();
    const payload = tokenService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado');
  }
}
