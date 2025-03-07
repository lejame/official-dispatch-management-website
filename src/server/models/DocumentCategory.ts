import { Schema, model, Document } from 'mongoose';

export interface IDocumentCategory extends Document {
    name: string;
}

const documentCategorySchema = new Schema<IDocumentCategory>({
    name: { type: String, required: true }
});

export const DocumentCategoryModel = model<IDocumentCategory>('DocumentCategory', documentCategorySchema);
