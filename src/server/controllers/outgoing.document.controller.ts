import { Request, Response } from 'express';
import { handleError } from '../core/configs/errorHandler';
import { container } from '../core/configs/container.config';
import { TYPES } from '../types';
import { OutgoingDocumentService } from '../services/OutgoingDocumentService';
import { DocumentDTO } from '../dtos/document/DocumentDTO';
import { DocumentStatus } from '../models/enums';
import cloudinary from '../core/configs/cloudinary.config';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import logger from '../core/configs/logger.config';
import { v4 as uuidv4 } from 'uuid';
import { removeVietnameseTones } from '../utils/string.format';

const documentService = container.get<OutgoingDocumentService>(TYPES.OutgoingDocumentService);

const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const responseDTO = await documentService.getAllOutgoingDocuments();
        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'documents',
        format: async () => 'pdf',
        public_id: () => uuidv4()
    }
});

const upload = multer({ storage: storage }).single('attachment');

const createDocument = async (req: Request, res: Response) => {
    upload(req, res, async (err: unknown) => {
        if (err) {
            logger.error('Tải lên tệp đính kèm thất bại', err);
            return res.status(500).send({ message: 'Tải lên tệp đính kèm thất bại', error: (err as Error).message });
        }

        console.log(req.file);
        try {
            const {
                title,
                type,
                userId,
                categoryId,
                departmentId,
                fieldId,
                receivingDepartmentId,
                symbol,
                issueDate,
                expirationDate,
                recipient,
                sender,
                pageCount,
                documentNumber,
                organization,
                notes
            } = req.body;

            const attachmentUrl = req.file?.path;
            const originalAttachmentName = req.file?.originalname;
            const attachmentName = originalAttachmentName ? removeVietnameseTones(originalAttachmentName) : undefined;
            console.log(attachmentUrl);

            const documentDTO = new DocumentDTO(
                '',
                title,
                type,
                userId,
                categoryId,
                departmentId,
                fieldId,
                receivingDepartmentId,
                symbol,
                issueDate,
                expirationDate,
                recipient,
                sender,
                pageCount,
                documentNumber,
                DocumentStatus.PENDING,
                attachmentUrl,
                attachmentName,
                organization,
                notes
            );

            const responseDTO = await documentService.createOutgoingDocument(documentDTO);
            return res.status(responseDTO.code).send(responseDTO);
        } catch (error: unknown) {
            return handleError(res, error);
        }
    });
};

const updateDocument = async (req: Request, res: Response) => {
    upload(req, res, async (err: unknown) => {
        if (err) {
            logger.error('Tải lên tệp đính kèm thất bại', err);
            return res.status(500).send({ message: 'Tải lên tệp đính kèm thất bại', error: (err as Error).message });
        }

        try {
            const {
                id,
                title,
                userId,
                categoryId,
                departmentId,
                fieldId,
                receivingDepartmentId,
                symbol,
                issueDate,
                expirationDate,
                recipient,
                sender,
                pageCount,
                documentNumber,
                status,
                organization,
                notes
            } = req.body;

            const attachmentUrl = req.file?.path;
            const originalAttachmentName = req.file?.originalname;
            const attachmentName = originalAttachmentName ? removeVietnameseTones(originalAttachmentName) : undefined;

            const documentDTO = new DocumentDTO(
                id,
                title,
                'outgoing',
                userId,
                categoryId,
                departmentId,
                fieldId,
                receivingDepartmentId,
                symbol,
                issueDate,
                expirationDate,
                recipient,
                sender,
                pageCount,
                documentNumber,
                status,
                attachmentUrl,
                attachmentName,
                organization,
                notes
            );

            const responseDTO = await documentService.updateDocument(documentDTO);
            return res.status(responseDTO.code).send(responseDTO);
        } catch (error: unknown) {
            return handleError(res, error);
        }
    });
};

const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const responseDTO = await documentService.deleteDocument(id);
        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};

const updateDocumentStatus = async (req: Request, res: Response) => {
    try {
        const { id, status } = req.body;
        const responseDTO = await documentService.updateDocumentStatus(id, status);
        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};

const getDocumentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const responseDTO = await documentService.getDocumentById(id);
        return res.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(res, error);
    }
};

export const outgoingDocumentController = {
    getAllDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus,
    getDocumentById
};
