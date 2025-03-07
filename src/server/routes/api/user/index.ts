import express from 'express';
import { userController } from '../../../controllers/user.controller';

const apiUserRouter = express.Router();

apiUserRouter.get('/', userController.getAll);
apiUserRouter.post('/create', userController.postCreate);
apiUserRouter.post('/update', userController.putUpdate);
apiUserRouter.post('/lock', userController.lockUser);
apiUserRouter.post('/unlock', userController.unlockUser);
apiUserRouter.post('/get-user-by-id', userController.getUserById);

export { apiUserRouter };
