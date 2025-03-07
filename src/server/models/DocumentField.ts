import { Schema, model, Document } from 'mongoose';

export interface IDocumentField extends Document {
    name: string;
}

const documentFieldSchema = new Schema<IDocumentField>({
    name: { type: String, required: true }
});

export const DocumentFieldModel = model<IDocumentField>('DocumentField', documentFieldSchema);
