import { injectable } from 'inversify';
import { UserModel, IUser } from '../models/User';
import { BaseRepository } from './BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        return await this.model.findOne({ email }).exec();
    }
}
