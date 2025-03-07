import express from 'express';
import { getStatistics } from '../../../../controllers/statistics.controller';

const apiDocumentStatisticRouter = express.Router();

apiDocumentStatisticRouter.post('/', getStatistics);

export { apiDocumentStatisticRouter };
