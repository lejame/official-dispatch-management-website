import { Request, Response } from 'express';
import { DocumentService } from '../services/DocumentService';
import { container } from '../core/configs/container.config';
import { TYPES } from '../types';
import { ResponseDTO } from '../dtos/ResponseDTO';

const documentService = container.get<DocumentService>(TYPES.DocumentService);

export const getStatistics = async (req: Request, res: Response) => {
    try {
        const { from, to } = req.body;

        const responseDTO = await documentService.getStatistics(from, to);
        return res.status(responseDTO.code).json(responseDTO);
    } catch (errors) {
        return new ResponseDTO(500, 'Lấy thông tin thống kê công văn đến thất bại', null, errors);
    }
};
