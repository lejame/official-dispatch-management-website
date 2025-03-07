import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { INotification, NotificationModel } from '../models/Notification';

@injectable()
export class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(NotificationModel);
    }

    public async findByUserId(userId: string) {
        return this.model.find({ userId });
    }
}
