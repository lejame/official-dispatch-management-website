export class DocumentDTO {
    id?: string;
    title: string;
    type: string;
    userId: string;
    categoryId: string;
    departmentId: string;
    fieldId: string;
    receivingDepartmentId: string;
    symbol: string;
    issueDate: Date;
    expirationDate: Date;
    recipient: string;
    sender: string;
    pageCount: number;
    documentNumber: number;
    status: string;
    attachmentUrl?: string;
    attachmentName?: string;
    organization?: string;
    notes?: string;

    constructor(
        id: string | undefined,
        title: string,
        type: string,
        userId: string,
        categoryId: string,
        departmentId: string,
        fieldId: string,
        receivingDepartmentId: string,
        symbol: string,
        issueDate: Date,
        expirationDate: Date,
        recipient: string,
        sender: string,
        pageCount: number,
        documentNumber: number,
        status: string,
        attachmentUrl?: string,
        attachmentName?: string,
        organization?: string,
        notes?: string
    ) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.userId = userId;
        this.categoryId = categoryId;
        this.departmentId = departmentId;
        this.fieldId = fieldId;
        this.receivingDepartmentId = receivingDepartmentId;
        this.symbol = symbol;
        this.issueDate = issueDate;
        this.expirationDate = expirationDate;
        this.recipient = recipient;
        this.sender = sender;
        this.pageCount = pageCount;
        this.documentNumber = documentNumber;
        this.status = status;
        this.attachmentUrl = attachmentUrl;
        this.attachmentName = attachmentName;
        this.organization = organization;
        this.notes = notes;
    }
}
