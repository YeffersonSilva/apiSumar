import { User } from '../../domain/user/User';
import { NotificationServicePort } from '../../domain/ports/notification.service.port';

/**
 * Implementación del servicio de notificación usando email.
 */
export class EmailNotificationService implements NotificationServicePort {
  async sendWelcomeNotification(user: User): Promise<boolean> {
    try {
      // TODO: Implementar el envío real de email
      console.log(`Sending welcome email to ${user.getEmail()}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome notification:', error);
      return false;
    }
  }

  async sendPasswordChangeNotification(user: User): Promise<boolean> {
    try {
      // TODO: Implementar el envío real de email
      console.log(`Sending password change notification to ${user.getEmail()}`);
      return true;
    } catch (error) {
      console.error('Error sending password change notification:', error);
      return false;
    }
  }

  async sendPasswordResetNotification(
    user: User,
    resetToken: string,
  ): Promise<boolean> {
    try {
      // TODO: Implementar el envío real de email
      console.log(
        `Sending password reset notification to ${user.getEmail()} with token ${resetToken}`,
      );
      return true;
    } catch (error) {
      console.error('Error sending password reset notification:', error);
      return false;
    }
  }
}
