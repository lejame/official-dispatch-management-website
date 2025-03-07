import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { DocumentFieldModel, IDocumentField } from '../models/DocumentField';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { DocumentFieldRepository } from '../repositories/DocumentFieldRepository';
import { DocumentFieldDTO } from '../dtos/document/DocumentFieldDTO';

@injectable()
export class DocumentFieldService {
    private documentFieldRepository: DocumentFieldRepository;

    constructor(@inject(TYPES.DocumentFieldRepository) documentFieldRepository: DocumentFieldRepository) {
        this.documentFieldRepository = documentFieldRepository;
    }

    public async getAllDocumentFields(): Promise<ResponseDTO<IDocumentField[] | null>> {
        const documentFields = await this.documentFieldRepository.findAll();
        return new ResponseDTO(200, 'Lấy danh sách lĩnh vực tài liệu thành công', documentFields, []);
    }

    public async createDocumentField(documentFieldDTO: DocumentFieldDTO): Promise<ResponseDTO<IDocumentField | null>> {
        const errors = this.validateDocumentField(documentFieldDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Tạo lĩnh vực tài liệu thất bại', null, errors);
        }

        const existingDocumentField = documentFieldDTO.name
            ? await this.documentFieldRepository.findByName(documentFieldDTO.name)
            : null;

        if (existingDocumentField) {
            return new ResponseDTO(400, 'Tạo lĩnh vực tài liệu thất bại', null, ['Lĩnh vực tài liệu đã tồn tại']);
        }

        const documentField = new DocumentFieldModel({ name: documentFieldDTO.name });
        const createdDocumentField = await this.documentFieldRepository.create(documentField);

        return new ResponseDTO(201, 'Tạo lĩnh vực tài liệu thành công', createdDocumentField, []);
    }

    private validateDocumentField(documentFieldDTO: DocumentFieldDTO): string[] {
        const errors = [];

        if (!documentFieldDTO.name) {
            errors.push('Tên lĩnh vực tài liệu không được để trống');
        }

        return errors;
    }

    public async updateDocumentField(documentFieldDTO: DocumentFieldDTO): Promise<ResponseDTO<IDocumentField | null>> {
        const errors = this.validateDocumentField(documentFieldDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Cập nhật lĩnh vực tài liệu thất bại', null, errors);
        }

        if (!documentFieldDTO.id) {
            return new ResponseDTO(400, 'Cập nhật lĩnh vực tài liệu thất bại', null, [
                'ID lĩnh vực tài liệu không hợp lệ'
            ]);
        }

        const documentField = documentFieldDTO.id
            ? await this.documentFieldRepository.findById(documentFieldDTO.id)
            : null;

        if (!documentField) {
            return new ResponseDTO(404, 'Cập nhật lĩnh vực tài liệu thất bại', null, [
                'Lĩnh vực tài liệu không tồn tại'
            ]);
        }

        if (documentFieldDTO.name) {
            documentField.name = documentFieldDTO.name;
        }

        const updatedDocumentField = await this.documentFieldRepository.update(documentFieldDTO.id, documentField);

        return new ResponseDTO(200, 'Cập nhật lĩnh vực tài liệu thành công', updatedDocumentField, []);
    }

    public async deleteDocumentField(documentFieldDTO: DocumentFieldDTO): Promise<ResponseDTO<IDocumentField | null>> {
        if (!documentFieldDTO.id) {
            return new ResponseDTO(400, 'Xóa lĩnh vực tài liệu thất bại', null, ['ID lĩnh vực tài liệu không hợp lệ']);
        }

        const documentField = documentFieldDTO.id
            ? await this.documentFieldRepository.findById(documentFieldDTO.id)
            : null;

        if (!documentField) {
            return new ResponseDTO(404, 'Xóa lĩnh vực tài liệu thất bại', null, ['Lĩnh vực tài liệu không tồn tại']);
        }

        const deletedDocumentField = await this.documentFieldRepository.delete(documentFieldDTO.id);
        return new ResponseDTO(200, 'Xóa lĩnh vực tài liệu thành công', deletedDocumentField, []);
    }
}
