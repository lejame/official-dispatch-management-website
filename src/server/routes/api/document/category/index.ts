import express from 'express';
import { documentCategoryController } from '../../../../controllers/document.category.controller';

const apiDocumentCategoryRouter = express.Router();

apiDocumentCategoryRouter.get('/', documentCategoryController.getAll);
apiDocumentCategoryRouter.post('/create', documentCategoryController.createDocumentCategory);
apiDocumentCategoryRouter.post('/update', documentCategoryController.editDocumentCategory);
apiDocumentCategoryRouter.post('/delete', documentCategoryController.deleteDocumentCategory);

export { apiDocumentCategoryRouter };
