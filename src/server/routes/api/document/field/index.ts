import express from 'express';
import { documentFieldController } from '../../../../controllers/document.field.controller';

const apiDocumentFieldRouter = express.Router();

apiDocumentFieldRouter.get('/', documentFieldController.getAll);
apiDocumentFieldRouter.post('/create', documentFieldController.createDocumentField);
apiDocumentFieldRouter.post('/update', documentFieldController.updateDocumentField);
apiDocumentFieldRouter.post('/delete', documentFieldController.deleteDocumentField);

export { apiDocumentFieldRouter };
