import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { DocumentCategoryModel, IDocumentCategory } from '../models/DocumentCategory';

@injectable()
export class DocumentCategoryRepository extends BaseRepository<IDocumentCategory> {
    constructor() {
        super(DocumentCategoryModel);
    }

    public async findByName(name: string): Promise<IDocumentCategory | null> {
        return await this.model.findOne({ name }).exec();
    }
}
