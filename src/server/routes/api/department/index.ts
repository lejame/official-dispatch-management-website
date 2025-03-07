import express from 'express';
import { departmentController } from '../../../controllers/department.controller';

const apiDepartmentRouter = express.Router();

apiDepartmentRouter.get('/', departmentController.getAll);
apiDepartmentRouter.post('/create', departmentController.createDepartment);
apiDepartmentRouter.post('/update', departmentController.updateDepartment);
apiDepartmentRouter.post('/delete', departmentController.deleteDepartment);

export { apiDepartmentRouter };
