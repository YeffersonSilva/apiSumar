import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashea una contraseña usando bcrypt
   * @param password Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * Verifica si una contraseña coincide con su hash
   * @param password Contraseña en texto plano
   * @param hashedPassword Hash de la contraseña
   * @returns true si la contraseña coincide
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
