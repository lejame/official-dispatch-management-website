import { Request, Response } from 'express';
import { handleError } from '../core/configs/errorHandler';
import { container } from '../core/configs/container.config';
import { TYPES } from '../types';
import { DocumentFieldService } from '../services/DocumentFieldService';
import { DocumentFieldDTO } from '../dtos/document/DocumentFieldDTO';

const documentFieldService = container.get<DocumentFieldService>(TYPES.DocumentFieldService);

const getAll = async (request: Request, response: Response) => {
    try {
        const responseDTO = await documentFieldService.getAllDocumentFields();
        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const createDocumentField = async (request: Request, response: Response) => {
    try {
        const { name } = request.body;
        const documentFieldDTO = new DocumentFieldDTO(undefined, name);
        const responseDTO = await documentFieldService.createDocumentField(documentFieldDTO);
        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const updateDocumentField = async (request: Request, response: Response) => {
    try {
        const { id, name } = request.body;
        const documentFieldDTO = new DocumentFieldDTO(id, name);
        const responseDTO = await documentFieldService.updateDocumentField(documentFieldDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const deleteDocumentField = async (request: Request, response: Response) => {
    try {
        const { id } = request.body;
        const documentFieldDTO = new DocumentFieldDTO(id, '');
        const responseDTO = await documentFieldService.deleteDocumentField(documentFieldDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

export const documentFieldController = { getAll, createDocumentField, updateDocumentField, deleteDocumentField };
