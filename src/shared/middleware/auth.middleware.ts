import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token no proporcionado',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenService = new TokenService();
    const payload = tokenService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
    });
  }
}
