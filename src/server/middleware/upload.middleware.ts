import { Request, RequestHandler, Response } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../core/configs/cloudinary.config';
import multer from 'multer';

export const uploadMiddlaware = (
    request: Request,
    response: Response,
    folder: string = 'Files',
    fileType: 'attachment' | 'image'
): RequestHandler => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder,
            public_id: () => crypto.randomUUID()
        }
    });

    return multer({ storage: storage }).single(fileType);
};

export const uploadImageHandler = (request: Request, response: Response): RequestHandler => {
    return uploadMiddlaware(request, response, 'Images', 'image');
};
