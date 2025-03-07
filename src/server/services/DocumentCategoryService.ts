import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { DocumentCategoryRepository } from '../repositories/DocumentCategoryRepository';
import { DocumentCategoryModel, IDocumentCategory } from '../models/DocumentCategory';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { DocumentCategoryDTO } from '../dtos/document/DocumentCategoryDTO';

@injectable()
export class DocumentCategoryService {
    private documentCategoryRepository: DocumentCategoryRepository;

    constructor(@inject(TYPES.DocumentCategoryRepository) documentCategoryRepository: DocumentCategoryRepository) {
        this.documentCategoryRepository = documentCategoryRepository;
    }

    public async getAllDocumentCategories(): Promise<ResponseDTO<IDocumentCategory[] | null>> {
        const documentCategories = await this.documentCategoryRepository.findAll();

        return new ResponseDTO(200, 'Lấy danh sách danh mục tài liệu thành công', documentCategories, []);
    }

    public async createDocumentCategory(
        DocumentCategoryDTO: DocumentCategoryDTO
    ): Promise<ResponseDTO<IDocumentCategory | null>> {
        const errors = this.validateDocumentCategory(DocumentCategoryDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Tạo danh mục tài liệu mới thất bại', null, errors);
        }

        if (!DocumentCategoryDTO.name) {
            return new ResponseDTO(400, 'Tạo danh mục tài liệu mới thất bại', null, [
                'Tên danh mục tài liệu không được để trống'
            ]);
        }

        const existingDocumentCategory = await this.documentCategoryRepository.findByName(DocumentCategoryDTO.name);

        if (existingDocumentCategory) {
            return new ResponseDTO(400, 'Tạo danh mục tài liệu mới thất bại', null, ['Danh mục tài liệu đã tồn tại']);
        }

        const documentCategory = new DocumentCategoryModel({ name: DocumentCategoryDTO.name });
        const createdDocumentCategory = await this.documentCategoryRepository.create(documentCategory);

        return new ResponseDTO(201, 'Tạo danh mục tài liệu mới thành công', createdDocumentCategory, []);
    }

    private validateDocumentCategory(documentCategoryDTO: DocumentCategoryDTO): string[] {
        const errors = [];

        if (!documentCategoryDTO.name) {
            errors.push('Tên danh mục tài liệu không được để trống');
        }

        return errors;
    }

    public async editDocumentCategory(
        documentCategoryDTO: DocumentCategoryDTO
    ): Promise<ResponseDTO<IDocumentCategory | null>> {
        const errors = this.validateDocumentCategory(documentCategoryDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Chỉnh sửa danh mục tài liệu thất bại', null, errors);
        }

        if (!documentCategoryDTO.documentCategoryId) {
            return new ResponseDTO(400, 'Chỉnh sửa danh mục tài liệu thất bại', null, [
                'ID danh mục tài liệu không được để trống'
            ]);
        }

        const documentCategory = await this.documentCategoryRepository.findById(documentCategoryDTO.documentCategoryId);

        if (!documentCategory) {
            return new ResponseDTO(404, 'Chỉnh sửa danh mục tài liệu thất bại', null, [
                'Danh mục tài liệu không tồn tại'
            ]);
        }

        if (documentCategoryDTO.name) {
            documentCategory.name = documentCategoryDTO.name;
        } else {
            return new ResponseDTO(400, 'Chỉnh sửa danh mục tài liệu thất bại', null, [
                'Tên danh mục tài liệu không được để trống'
            ]);
        }

        const updatedDocumentCategory = await this.documentCategoryRepository.update(
            documentCategoryDTO.documentCategoryId,
            documentCategory
        );

        return new ResponseDTO(200, 'Chỉnh sửa danh mục tài liệu thành công', updatedDocumentCategory, []);
    }

    public async deleteDocumentCategory(
        documentCategoryDTO: DocumentCategoryDTO
    ): Promise<ResponseDTO<IDocumentCategory | null>> {
        if (!documentCategoryDTO.documentCategoryId) {
            return new ResponseDTO(400, 'Xóa danh mục tài liệu thất bại', null, [
                'ID danh mục tài liệu không được để trống'
            ]);
        }
        const documentCategory = await this.documentCategoryRepository.findById(documentCategoryDTO.documentCategoryId);

        if (!documentCategory) {
            return new ResponseDTO(404, 'Xóa danh mục tài liệu thất bại', null, ['Danh mục tài liệu không tồn tại']);
        }

        const deletedDocumentCategory = await this.documentCategoryRepository.delete(
            documentCategoryDTO.documentCategoryId
        );

        return new ResponseDTO(200, 'Xóa danh mục tài liệu thành công', deletedDocumentCategory, []);
    }
}
