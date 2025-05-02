import { Request, Response } from 'express';
import {
  LoginUserUseCase,
  LoginUserDto,
} from '../../application/use-cases/login-user.use-case';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Invalid data',
          details: result.error.errors,
        });
      }

      const loginDto: LoginUserDto = result.data;
      const response = await this.loginUserUseCase.execute(loginDto);

      return res.status(200).json(response);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      console.error('Unexpected error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  }
}
