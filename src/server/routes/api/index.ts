import express from 'express';
import { apiUserRouter } from './user';
import { apiDocumentRouter } from './document';
import { homeController } from '../../controllers/home.controller';
import { authenticationController } from '../../controllers/authentication.controller';
import { apiDepartmentRouter } from './department';
import { apiNotificationRouter } from './notification';
import { apiAuthRouter } from './auth';

const apiRouter = express.Router();

apiRouter.get('/', homeController.get);
apiRouter.post('/login', authenticationController.postLogin);
apiRouter.use('/user', apiUserRouter);
apiRouter.use('/document', apiDocumentRouter);
apiRouter.use('/department', apiDepartmentRouter);
apiRouter.use('/notification', apiNotificationRouter);
apiRouter.use('/auth', apiAuthRouter);

export { apiRouter };
