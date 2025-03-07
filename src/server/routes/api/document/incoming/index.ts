import express from 'express';
import { incomingDocumentController } from '../../../../controllers/received.document.controller';

const apiDocumentIncomingRouter = express.Router();

apiDocumentIncomingRouter.get('/', incomingDocumentController.getAllDocuments);
apiDocumentIncomingRouter.post('/create', incomingDocumentController.createDocument);
apiDocumentIncomingRouter.post('/update', incomingDocumentController.updateDocument);
apiDocumentIncomingRouter.post('/delete', incomingDocumentController.deleteDocument);
apiDocumentIncomingRouter.post('/update-status', incomingDocumentController.updateDocumentStatus);

export { apiDocumentIncomingRouter };
