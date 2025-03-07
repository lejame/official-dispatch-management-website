import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { DocumentModel, IDocument } from '../models/Document';

@injectable()
export class DocumentRepository extends BaseRepository<IDocument> {
    constructor() {
        super(DocumentModel);
    }

    public async findAllWithPopulatedFields(): Promise<IDocument[]> {
        return this.model
            .find()
            .populate('userId', 'username email fullname')
            .populate('categoryId', 'name')
            .populate('departmentId', 'name')
            .populate('fieldId', 'name')
            .populate('receivingDepartmentId', 'name')
            .exec();
    }

    public async update(id: string, document: Partial<IDocument>): Promise<IDocument | null> {
        return this.model.findByIdAndUpdate(id, document, { new: true }).exec();
    }

    public async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }
}
