import express from 'express';
import { apiRouter } from './api';
import { homeController } from '../controllers/home.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../models/enums';

const router = express.Router();

router.use('/api', apiRouter);

router.get('/admin_required', authenticateJWT, authorizeRoles(UserRole.ADMIN), homeController.get);
router.get('/authenticated_required', authenticateJWT, homeController.get);
router.get('/public_route', homeController.get);
router.get(
    '/multiple_role_route',
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.MODERATOR),
    homeController.get
);
export default router;
