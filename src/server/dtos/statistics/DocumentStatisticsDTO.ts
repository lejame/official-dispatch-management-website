import { IDocument } from '../../models/Document';

export class DocumentStatisticsDTO {
    incomingDocuments: IDocument[];
    outgoingDocuments: IDocument[];

    constructor(incomingDocuments: IDocument[], outgoingDocuments: IDocument[]) {
        this.incomingDocuments = incomingDocuments;
        this.outgoingDocuments = outgoingDocuments;
    }
}
