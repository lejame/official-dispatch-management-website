import { Request, Response } from 'express';
import { DocumentCategoryDTO } from '../dtos/document/DocumentCategoryDTO';
import { handleError } from '../core/configs/errorHandler';
import { container } from '../core/configs/container.config';
import { DocumentCategoryService } from '../services/DocumentCategoryService';
import { TYPES } from '../types';

const documentCategoryService = container.get<DocumentCategoryService>(TYPES.DocumentCategoryService);

const getAll = async (request: Request, response: Response) => {
    try {
        const responseDTO = await documentCategoryService.getAllDocumentCategories();

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const createDocumentCategory = async (request: Request, response: Response) => {
    try {
        const { name } = request.body;
        const documentCategoryDTO = new DocumentCategoryDTO(undefined, name);
        const responseDTO = await documentCategoryService.createDocumentCategory(documentCategoryDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const editDocumentCategory = async (request: Request, response: Response) => {
    try {
        const { id, name } = request.body;
        const documentCategoryDTO = new DocumentCategoryDTO(id, name);
        const responseDTO = await documentCategoryService.editDocumentCategory(documentCategoryDTO);
        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const deleteDocumentCategory = async (request: Request, response: Response) => {
    try {
        const { id } = request.body;
        const documentCategoryDTO = new DocumentCategoryDTO(id, '');
        const responseDTO = await documentCategoryService.deleteDocumentCategory(documentCategoryDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

export const documentCategoryController = {
    getAll,
    createDocumentCategory,
    deleteDocumentCategory,
    editDocumentCategory
};
