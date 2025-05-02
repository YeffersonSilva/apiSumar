import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '../config/env';
import { CacheService } from './cache.service';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class TokenService {
  private readonly jwtService: JwtService;
  private readonly cacheService: CacheService;

  constructor() {
    this.jwtService = new JwtService({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRATION },
    });
    this.cacheService = new CacheService();
  }

  generateToken(payload: TokenPayload): string {
    const token = this.jwtService.sign(payload);
    // Guardar token en caché con el ID del usuario como clave
    this.cacheService.set(`token:${payload.sub}`, token);
    return token;
  }

  verifyToken(token: string): TokenPayload {
    try {
      const payload = this.jwtService.verify(token) as TokenPayload;

      // Verificar si el token está en caché
      const cachedToken = this.cacheService.get(`token:${payload.sub}`);
      if (!cachedToken || cachedToken !== token) {
        throw new Error('Token invalidado o expirado');
      }

      return payload;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  invalidateToken(userId: string): void {
    this.cacheService.del(`token:${userId}`);
  }
}
