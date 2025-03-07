import { Request, Response } from 'express';
import { TYPES } from '../types';
import { container } from '../core/configs/container.config';
import { AuthenticationService } from '../services/AuthenticationService';
import { LoginDTO } from '../dtos/authentication/LoginDTO';
import { handleError } from '../core/configs/errorHandler';
import { UserService } from '../services/UserService';
import { sendResetPasswordEmail } from '../utils/email';

const authenticationService = container.get<AuthenticationService>(TYPES.AuthenticationService);
const userService = container.get<UserService>(TYPES.UserService);

const postLogin = async (request: Request, response: Response) => {
    try {
        const loginDTO = new LoginDTO(request);
        const responseDTO = await authenticationService.validateUser(loginDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: 'Email không tồn tại' });
        }

        const token = userService.createPasswordResetToken(user);
        await sendResetPasswordEmail(user.email, token);

        res.status(200).send({ message: 'Email đặt lại mật khẩu đã được gửi' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Có lỗi xảy ra' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
        const user = await userService.resetPassword(token, password);
        if (!user) {
            return res.status(400).send({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        res.status(200).send({ message: 'Đặt lại mật khẩu thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Có lỗi xảy ra' });
    }
};

export const authenticationController = { postLogin, forgotPassword, resetPassword };
