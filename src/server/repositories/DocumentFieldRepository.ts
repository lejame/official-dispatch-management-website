import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { DocumentFieldModel, IDocumentField } from '../models/DocumentField';

@injectable()
export class DocumentFieldRepository extends BaseRepository<IDocumentField> {
    constructor() {
        super(DocumentFieldModel);
    }

    public async findByName(name: string): Promise<IDocumentField | null> {
        return await this.model.findOne({ name }).exec();
    }
}
