import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DEFAULTS } from '../core/constants/Defaults';
import { UserRole } from '../models/enums';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Access token không tồn tại' });
    }

    try {
        const decoded = jwt.verify(token, DEFAULTS.JWT_SECRET) as { id: string; email: string; role: UserRole };
        req.user = decoded;
        next();
    } catch {
        return res.status(401).send({ message: 'Access token không hợp lệ' });
    }
};

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).send({ message: 'Bạn không có quyền truy cập vào trang này' });
        }
        next();
    };
};
