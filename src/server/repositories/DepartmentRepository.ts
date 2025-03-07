import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { DepartmentModel, IDepartment } from '../models/Department';

@injectable()
export class DepartmentRepository extends BaseRepository<IDepartment> {
    constructor() {
        super(DepartmentModel);
    }

    public async findByName(name: string): Promise<IDepartment | null> {
        return await this.model.findOne({ name }).exec();
    }
}
