import { model, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    documentId: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    userId: { type: String, required: true },
    documentId: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = model<INotification>('Notification', notificationSchema);
