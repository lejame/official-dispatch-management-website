import { inject, injectable } from 'inversify';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { TYPES } from '../types';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { DocumentModel, IDocument } from '../models/Document';
import { DocumentDTO } from '../dtos/document/DocumentDTO';
import { DocumentStatus } from '../models/enums';

@injectable()
export class OutgoingDocumentService {
    private documentRepository: DocumentRepository;

    constructor(@inject(TYPES.DocumentRepository) documentRepository: DocumentRepository) {
        this.documentRepository = documentRepository;
    }

    public async getAllOutgoingDocuments(): Promise<ResponseDTO<IDocument[] | null>> {
        try {
            const documents = await this.documentRepository.findAllWithPopulatedFields();
            const outgoingDocuments = documents.filter((doc) => doc.type === 'outgoing');
            return new ResponseDTO(200, 'Lấy danh sách công văn đi thành công', outgoingDocuments, []);
        } catch (error) {
            return new ResponseDTO(500, 'Lấy danh sách công văn đi thất bại', null, [(error as Error).message]);
        }
    }

    public async createOutgoingDocument(documentDTO: DocumentDTO): Promise<ResponseDTO<IDocument | null>> {
        const errors = this.validateDocument(documentDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Tạo công văn đi thất bại', null, errors);
        }

        const document = new DocumentModel(documentDTO);
        const createdDocument = await this.documentRepository.create(document);

        return new ResponseDTO(201, 'Tạo công văn đi thành công', createdDocument, []);
    }

    public async updateDocument(documentDTO: DocumentDTO): Promise<ResponseDTO<IDocument | null>> {
        const errors = this.validateDocument(documentDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Cập nhật công văn thất bại', null, errors);
        }

        if (!documentDTO.id) {
            return new ResponseDTO(400, 'Cập nhật công văn thất bại', null, ['ID công văn không được để trống']);
        }

        const document = await this.documentRepository.findById(documentDTO.id);

        if (!document) {
            return new ResponseDTO(404, 'Cập nhật công văn thất bại', null, ['Công văn không tồn tại']);
        }

        Object.assign(document, documentDTO);
        const updatedDocument = await this.documentRepository.update(documentDTO.id, document);

        return new ResponseDTO(200, 'Cập nhật công văn thành công', updatedDocument, []);
    }

    public async deleteDocument(id: string): Promise<ResponseDTO<null>> {
        const document = await this.documentRepository.findById(id);

        if (!document) {
            return new ResponseDTO(404, 'Xóa công văn thất bại', null, ['Công văn không tồn tại']);
        }

        await this.documentRepository.delete(id);
        return new ResponseDTO(200, 'Xóa công văn thành công', null, []);
    }

    public async updateDocumentStatus(id: string, status: string): Promise<ResponseDTO<IDocument | null>> {
        const document = await this.documentRepository.findById(id);

        if (!document) {
            return new ResponseDTO(404, 'Cập nhật trạng thái công văn thất bại', null, ['Công văn không tồn tại']);
        }

        // Kiểm tra trạng thái yêu cầu và cập nhật tương ứng
        if (status === 'approved') {
            document.status = DocumentStatus.APPROVED;
        } else if (status === 'rejected') {
            document.status = DocumentStatus.REJECTED;
        } else {
            document.status = DocumentStatus.HANDLED; // Mặc định là handled nếu không xác định trạng thái
        }

        const updatedDocument = await this.documentRepository.update(id, document);

        return new ResponseDTO(200, 'Cập nhật trạng thái công văn đi thành công', updatedDocument, []);
    }

    private validateDocument(documentDTO: DocumentDTO): string[] {
        const errors = [];

        if (!documentDTO.title) {
            errors.push('Tiêu đề không được để trống');
        }

        if (!documentDTO.type) {
            errors.push('Kiểu công văn không được để trống');
        }

        if (!documentDTO.userId) {
            errors.push('Nhân viên xử lý không được để trống');
        }

        if (!documentDTO.categoryId) {
            errors.push('Loại công văn không được để trống');
        }

        if (!documentDTO.departmentId) {
            errors.push('Phòng ban không được để trống');
        }

        if (!documentDTO.fieldId) {
            errors.push('Lĩnh vực không được để trống');
        }

        if (!documentDTO.receivingDepartmentId) {
            errors.push('Phòng ban nhận không được để trống');
        }

        if (!documentDTO.symbol) {
            errors.push('Số ký hiệu không được để trống');
        }

        if (!documentDTO.issueDate) {
            errors.push('Ngày ban hành không được để trống');
        }

        if (!documentDTO.expirationDate) {
            errors.push('Ngày hết hạn không được để trống');
        }

        if (!documentDTO.recipient) {
            errors.push('Người nhận không được để trống');
        }

        if (!documentDTO.sender) {
            errors.push('Người gửi không được để trống');
        }

        if (!documentDTO.pageCount) {
            errors.push('Số trang không được để trống');
        }

        if (!documentDTO.documentNumber) {
            errors.push('Số văn bản không được để trống');
        }

        return errors;
    }

    public async getDocumentById(id: string): Promise<ResponseDTO<IDocument | null>> {
        const document = await this.documentRepository.findById(id);

        if (!document) {
            return new ResponseDTO(404, 'Công văn không tồn tại', null, []);
        }

        return new ResponseDTO(200, 'Lấy công văn thành công', document, []);
    }
}
