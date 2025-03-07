import { Schema, model, Document } from 'mongoose';
import { UserRole } from './enums';

export const DEFAULT_AVATAR =
    'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    dateOfJoin: Date;
    contractType: string;
    departmentId: string;
    role: UserRole;
    isLocked: boolean;
    avatar: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    dateOfJoin: { type: Date, required: true },
    contractType: { type: String, required: true },
    departmentId: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isLocked: { type: Boolean, default: false },
    avatar: {
        type: String,
        default: DEFAULT_AVATAR
    }
});

export const UserModel = model<IUser>('User', userSchema);
