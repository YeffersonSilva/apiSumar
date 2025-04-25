import { User } from '../user/User';

/**
 * Puerto que define las operaciones del servicio de notificación.
 * Esta interfaz define el contrato que deben implementar los adaptadores secundarios.
 */
export interface NotificationServicePort {
  /**
   * Envía una notificación de bienvenida a un usuario
   * @param user Usuario al que se le enviará la notificación
   * @returns true si la notificación se envió correctamente
   */
  sendWelcomeNotification(user: User): Promise<boolean>;

  /**
   * Envía una notificación de cambio de contraseña
   * @param user Usuario al que se le enviará la notificación
   * @returns true si la notificación se envió correctamente
   */
  sendPasswordChangeNotification(user: User): Promise<boolean>;

  /**
   * Envía una notificación de recuperación de contraseña
   * @param user Usuario al que se le enviará la notificación
   * @param resetToken Token de recuperación
   * @returns true si la notificación se envió correctamente
   */
  sendPasswordResetNotification(
    user: User,
    resetToken: string,
  ): Promise<boolean>;
}
