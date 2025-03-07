import { Response } from 'express';
import { ResponseDTO } from '../../dtos/ResponseDTO';
import logger from './logger.config';

export const handleError = (response: Response, error: unknown) => {
    const responseDTO = new ResponseDTO<undefined>(400, 'Lỗi không xác định đã xảy ra!', undefined, [
        'Lỗi không xác định đã xảy ra!'
    ]);

    if (error instanceof Error) {
        logger.error(error.message);
    }

    return response.status(responseDTO.code).send(responseDTO);
};
