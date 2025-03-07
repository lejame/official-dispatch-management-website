import { Request, Response } from 'express';
import { handleError } from '../core/configs/errorHandler';
import { container } from '../core/configs/container.config';
import { TYPES } from '../types';
import { DocumentIncomingService } from '../services/DocumentIncomingService';
import { DocumentDTO } from '../dtos/document/DocumentDTO';
import { DocumentStatus } from '../models/enums';
import cloudinary from '../core/configs/cloudinary.config';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import logger from '../core/configs/logger.config';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatusCode } from 'axios';
import { removeVietnameseTones } from '../utils/string.format';

const documentService = container.get<DocumentIncomingService>(TYPES.DocumentIncomingService);

const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const responseDTO = await documentService.getAllIncomingDocuments();
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
                status,
                organization
            } = req.body;

            const attachmentUrl = req.file?.path;
            const originalAttachmentName = req.file?.originalname;
            const attachmentName = originalAttachmentName ? removeVietnameseTones(originalAttachmentName) : undefined;

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
                status as DocumentStatus,
                attachmentUrl,
                attachmentName,
                organization
            );

            const responseDTO = await documentService.createDocument(documentDTO);
            return res.status(responseDTO.code).send(responseDTO);
        } catch (error: unknown) {
            return handleError(res, error);
        }
    });
};

const updateDocument = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        if (!payload.id) {
            return res.status(400).send({ message: 'ID công văn không được để trống' });
        }

        const documentResponse = await documentService.updateDocumentStatus(payload.id, payload.status);

        if (!documentResponse.data) {
            return res.status(404).send({ message: 'Công văn không tồn tại' });
        }

        const documentDTO = new DocumentDTO(
            documentResponse.data.id,
            payload.title,
            documentResponse.data.type,
            payload.userId,
            documentResponse.data.categoryId,
            documentResponse.data.departmentId,
            documentResponse.data.fieldId,
            documentResponse.data.receivingDepartmentId,
            documentResponse.data.symbol,
            documentResponse.data.issueDate,
            documentResponse.data.expirationDate,
            documentResponse.data.recipient,
            payload.sender,
            documentResponse.data.pageCount,
            documentResponse.data.documentNumber,
            payload.status,
            documentResponse.data.attachmentUrl,
            documentResponse.data.attachmentName,
            documentResponse.data.organization,
            payload.notes
        );

        const updatedDocument = await documentService.updateDocument(documentDTO);

        return res.status(HttpStatusCode.Ok).send({ message: 'Cập nhật công văn thành công', data: updatedDocument });
    } catch (error) {
        return res
            .status(HttpStatusCode.InternalServerError)
            .send({ message: 'Cập nhật công văn thất bại', error: (error as Error).message });
    }
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

export const incomingDocumentController = {
    getAllDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus
};
