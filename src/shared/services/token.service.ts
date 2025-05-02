import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '../config/env';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class TokenService {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRATION },
    });
  }

  generateToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
