import express from 'express';
import { notificationController } from '../../../controllers/notification.controller';

const apiNotificationRouter = express.Router();

apiNotificationRouter.post('/get-account-notifications', notificationController.getAccountNotification);
apiNotificationRouter.post('/create', notificationController.createNotification);
apiNotificationRouter.post('/update-status', notificationController.updateNotificationStatus);

export { apiNotificationRouter };
