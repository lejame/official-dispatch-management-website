import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { container } from '../core/configs/container.config';
import { TYPES } from '../types';

const notificationService = container.get<NotificationService>(TYPES.NotificationService);

export const createNotification = async (req: Request, res: Response) => {
    const { userId, documentId, message } = req.body;
    try {
        const notification = await notificationService.createNotification(userId, documentId, message);
        res.status(201).send(notification);
    } catch (error) {
        res.status(500);
        console.log(error);
    }
};

export const updateNotificationStatus = async (req: Request, res: Response) => {
    const { notificationId } = req.body;
    try {
        const notification = await notificationService.updateNotificationStatus(notificationId);
        res.status(200).send(notification);
    } catch (error) {
        res.status(500);
        console.log(error);
    }
};

export const getAccountNotification = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const notifications = await notificationService.getAccountNotification(userId);
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ message: 'Lấy thông báo thất bại!', error });
    }
};

export const notificationController = {
    createNotification,
    updateNotificationStatus,
    getAccountNotification
};
