import bcrypt from 'bcrypt';

export class PasswordService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashea una contraseña usando bcrypt
   * @param password Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verifica si una contraseña coincide con su hash
   * @param password Contraseña en texto plano
   * @param hash Hash de la contraseña
   * @returns true si la contraseña coincide
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
