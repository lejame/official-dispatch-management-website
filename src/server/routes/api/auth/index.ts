import express from 'express';
import { authenticationController } from '../../../controllers/authentication.controller';

const apiAuthRouter = express.Router();

apiAuthRouter.post('/forgot-password', authenticationController.forgotPassword);
apiAuthRouter.post('/reset-password', authenticationController.resetPassword);

export { apiAuthRouter };
