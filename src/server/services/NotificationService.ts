import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { NotificationRepository } from '../repositories/NotificationRepository';

@injectable()
export class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor(@inject(TYPES.NotificationRepository) notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public async createNotification(userId: string, documentId: string, message: string) {
        return this.notificationRepository.create({ userId, documentId, message });
    }

    public async updateNotificationStatus(notificationId: string) {
        const notification = await this.notificationRepository.findById(notificationId);

        if (!notification) {
            throw new Error('Notification not found');
        }

        notification.isRead = true;

        return this.notificationRepository.update(notificationId, notification);
    }

    public async getAccountNotification(userId: string) {
        return this.notificationRepository.findByUserId(userId);
    }
}
