import { Schema, model, Document } from 'mongoose';
import { DocumentType, DocumentStatus } from './enums';

export interface IDocument extends Document {
    createdAt: any;
    title: string;
    type: DocumentType; // Kiểu công văn
    userId: string; // Nhân viên xử lý
    categoryId: string; // Loại công văn
    departmentId: string; // Phòng ban
    fieldId: string; // Lĩnh vực
    receivingDepartmentId: string; // Phòng ban nhận
    symbol: string; // Số ký hiệu
    issueDate: Date; // Ngày ban hành
    expirationDate: Date; // Ngày hết hạn
    recipient: string; // Người nhận
    sender: string; // Người gửi
    pageCount: number; // Số trang
    documentNumber: number; // Số văn bản
    status: DocumentStatus; // Trạng thái công văn
    attachmentUrl?: string; // Đường dẫn tệp đính kèm
    attachmentName?: string;
    organization?: string; // Tổ chức gửi
    notes?: string; // Ghi chú
}

const documentSchema = new Schema<IDocument>({
    title: { type: String, required: true },
    type: { type: String, enum: Object.values(DocumentType), required: true },
    userId: { type: Schema.Types.String, ref: 'User', required: true },
    categoryId: { type: Schema.Types.String, ref: 'DocumentCategory', required: true },
    departmentId: { type: Schema.Types.String, ref: 'Department', required: true },
    fieldId: { type: Schema.Types.String, ref: 'DocumentField', required: true },
    receivingDepartmentId: { type: Schema.Types.String, ref: 'Department', required: false },
    symbol: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    recipient: { type: String, required: true },
    sender: { type: String, required: true },
    pageCount: { type: Number, required: true },
    documentNumber: { type: Number, required: true },
    status: { type: String, enum: Object.values(DocumentStatus), required: true },
    attachmentUrl: { type: String },
    attachmentName: { type: String },
    organization: { type: String },
    notes: { type: String }
});

export const DocumentModel = model<IDocument>('Document', documentSchema);
