import express from 'express';
import { apiDocumentCategoryRouter } from './category';
import { apiDocumentFieldRouter } from './field';
import { apiDocumentIncomingRouter } from './incoming';
import { apiDocumentOutgoingRouter } from './outgoing';
import { apiDocumentStatisticRouter } from './statistics';

const apiDocumentRouter = express.Router();

apiDocumentRouter.use('/category', apiDocumentCategoryRouter);
apiDocumentRouter.use('/field', apiDocumentFieldRouter);
apiDocumentRouter.use('/incoming', apiDocumentIncomingRouter);
apiDocumentRouter.use('/outgoing', apiDocumentOutgoingRouter);
apiDocumentRouter.use('/statistics', apiDocumentStatisticRouter);

export { apiDocumentRouter };
