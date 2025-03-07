import { inject, injectable } from 'inversify';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { DocumentStatisticsDTO } from '../dtos/statistics/DocumentStatisticsDTO';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { TYPES } from '../types';
import moment from 'moment';

@injectable()
export class DocumentService {
    private documentRepository: DocumentRepository;

    constructor(@inject(TYPES.DocumentRepository) documentRepository: DocumentRepository) {
        this.documentRepository = documentRepository;
    }

    public async getStatistics(from: string, to: string): Promise<ResponseDTO<DocumentStatisticsDTO | null>> {
        const fromDate = moment(from, 'DD/MM/YYYY').toDate();
        const toDate = moment(to, 'DD/MM/YYYY').toDate();

        const documents = await this.documentRepository.findAllWithPopulatedFields();

        const incomingDocuments = documents.filter(
            (doc) => doc.type === 'incoming' && doc.issueDate >= fromDate && doc.issueDate <= toDate
        );

        const outgoingDocuments = documents.filter(
            (doc) => doc.type === 'outgoing' && doc.issueDate >= fromDate && doc.issueDate <= toDate
        );

        const result = new DocumentStatisticsDTO(incomingDocuments, outgoingDocuments);

        return new ResponseDTO(200, 'Success', result, []);
    }
}
