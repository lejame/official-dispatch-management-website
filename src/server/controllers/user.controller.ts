import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { TYPES } from '../types';
import { container } from '../core/configs/container.config';
import { handleError } from '../core/configs/errorHandler';
import { UserDTO } from '../dtos/user/UserDTO';
import { uploadImageHandler } from '../middleware/upload.middleware';
import logger from '../core/configs/logger.config';
import { DEFAULT_AVATAR } from '../models/User';

const userService = container.get<UserService>(TYPES.UserService);

const getAll = async (request: Request, response: Response) => {
    try {
        const users = await userService.getAllUsers();
        return response.status(200).send(users);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const postCreate = async (request: Request, response: Response) => {
    try {
        const {
            userId,
            username,
            email,
            password,
            fullname,
            phone,
            address,
            dateOfBirth,
            dateOfJoin,
            contractType,
            departmentId,
            role
        } = request.body;

        const userDTO = new UserDTO(
            userId,
            username,
            email,
            password,
            fullname,
            phone,
            address,
            new Date(dateOfBirth),
            new Date(dateOfJoin),
            contractType,
            departmentId,
            role,
            false,
            DEFAULT_AVATAR
        );

        const responseDTO = await userService.createUser(userDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const putUpdate = async (request: Request, response: Response) => {
    try {
        const upload = uploadImageHandler(request, response);

        upload(request, response, async (err) => {
            if (err) {
                logger.error('Tải lên tệp đính kèm thất bại', err);
                return response
                    .status(500)
                    .send({ message: 'Tải lên tệp đính kèm thất bại', error: (err as Error).message });
            }

            const {
                _id,
                username,
                email,
                password,
                fullname,
                phone,
                address,
                dateOfBirth,
                dateOfJoin,
                contractType,
                departmentId,
                role,
                isLocked,
                imageUrl
            } = request.body;

            const avatarUrl = request.file?.path ?? imageUrl;

            console.log(avatarUrl);

            const userDTO = new UserDTO(
                _id,
                username,
                email,
                password,
                fullname,
                phone,
                address,
                new Date(dateOfBirth),
                new Date(dateOfJoin),
                contractType,
                departmentId,
                role,
                isLocked,
                avatarUrl
            );
            const responseDTO = await userService.updateUser(userDTO);

            return response.status(responseDTO.code).send(responseDTO);
        });
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const lockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const responseDTO = await userService.lockUser(id);

        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};

const unlockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const responseDTO = await userService.unlockUser(id);

        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        console.log(id);
        const responseDTO = await userService.getUserById(id);
        console.log(responseDTO);
        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};
export const userController = { getAll, postCreate, putUpdate, lockUser, unlockUser, getUserById };
