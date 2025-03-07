import express from 'express';
import { outgoingDocumentController } from '../../../../controllers/outgoing.document.controller';

const apiDocumentOutgoingRouter = express.Router();

apiDocumentOutgoingRouter.get('/', outgoingDocumentController.getAllDocuments);
apiDocumentOutgoingRouter.post('/create', outgoingDocumentController.createDocument);
apiDocumentOutgoingRouter.post('/update', outgoingDocumentController.updateDocument);
apiDocumentOutgoingRouter.post('/delete', outgoingDocumentController.deleteDocument);
apiDocumentOutgoingRouter.post('/update-status', outgoingDocumentController.updateDocumentStatus);
apiDocumentOutgoingRouter.post('/get-by-id', outgoingDocumentController.getDocumentById);

export { apiDocumentOutgoingRouter };
