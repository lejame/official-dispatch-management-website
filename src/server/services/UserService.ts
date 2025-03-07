import { injectable, inject } from 'inversify';
import * as bcrypt from 'bcrypt';
import { TYPES } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { IUser, UserModel } from '../models/User';
import { UserDTO } from '../dtos/user/UserDTO';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { UserRole } from '../models/enums';
import { DEFAULTS } from '../core/constants/Defaults';
import jwt from 'jsonwebtoken';

@injectable()
export class UserService {
    private userRepository: UserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async getAllUsers() {
        return this.userRepository.findAll();
    }

    public async createUser(userDTO: UserDTO): Promise<ResponseDTO<IUser | null>> {
        const errors = this.validateUser(userDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Tạo người dùng mới thất bại', null, errors);
        }

        const hashedPassword = await bcrypt.hash(userDTO.password, 10);

        const user = new UserModel({
            username: userDTO.username,
            email: userDTO.email,
            password: hashedPassword,
            fullname: userDTO.fullname,
            phone: userDTO.phone,
            address: userDTO.address,
            dateOfBirth: userDTO.dateOfBirth,
            dateOfJoin: userDTO.dateOfJoin,
            contractType: userDTO.contractType,
            departmentId: userDTO.departmentId,
            role: userDTO.role,
            isLocked: userDTO.isLocked,
            avatar: userDTO.avatar
        });

        const createdUser = await this.userRepository.create(user);

        return new ResponseDTO(201, 'Tạo người dùng mới thành công', createdUser, []);
    }

    public async updateUser(userDTO: UserDTO): Promise<ResponseDTO<IUser | null>> {
        const errors = this.validateUserForUpdate(userDTO);
        if (errors.length > 0) {
            return new ResponseDTO(400, 'Cập nhật người dùng thất bại', null, errors);
        }
        if (!userDTO.userId) {
            return new ResponseDTO(400, 'ID người dùng không được để trống', null, []);
        }
        const user = await this.userRepository.findById(userDTO.userId);
        if (!user) {
            return new ResponseDTO(404, 'Người dùng không tồn tại', null, []);
        }

        user.username = userDTO.username ?? user.username;
        user.email = userDTO.email ?? user.email;
        user.fullname = userDTO.fullname ?? user.fullname;
        user.phone = userDTO.phone ?? user.phone;
        user.address = userDTO.address ?? user.address;
        user.dateOfBirth = userDTO.dateOfBirth ?? user.dateOfBirth;
        user.dateOfJoin = userDTO.dateOfJoin ?? user.dateOfJoin;
        user.contractType = userDTO.contractType ?? user.contractType;
        user.departmentId = userDTO.departmentId ?? user.departmentId;
        user.role = userDTO.role ?? user.role;
        user.password = userDTO.password ?? user.password;
        user.isLocked = userDTO.isLocked ?? user.isLocked;
        user.avatar = userDTO.avatar ?? user.avatar;

        const updatedUser = await this.userRepository.update(user.id, user);

        return new ResponseDTO(200, 'Cập nhật người dùng thành công', updatedUser, []);
    }

    private validateUser(userDTO: UserDTO): string[] {
        const errors = [];

        if (!userDTO.username) {
            errors.push('Tên người dùng không được để trống');
        }

        if (!userDTO.email) {
            errors.push('Email không được để trống');
        }

        if (!userDTO.password) {
            errors.push('Mật khẩu không được để trống');
        }

        if (!userDTO.fullname) {
            errors.push('Họ và tên không được để trống');
        }

        if (!userDTO.phone) {
            errors.push('Số điện thoại không được để trống');
        }

        if (!userDTO.address) {
            errors.push('Địa chỉ không được để trống');
        }

        if (!userDTO.dateOfBirth) {
            errors.push('Ngày sinh không được để trống');
        }

        if (!userDTO.dateOfJoin) {
            errors.push('Ngày vào làm không được để trống');
        }

        if (!userDTO.contractType) {
            errors.push('Loại hợp đồng không được để trống');
        }

        if (!userDTO.role) {
            errors.push('Vai trò không được để trống');
        }

        return errors;
    }

    private validateUserForUpdate(userDTO: UserDTO): string[] {
        const errors = [];

        if (userDTO.username && userDTO.username.trim() === '') {
            errors.push('Tên người dùng không được để trống');
        }

        if (userDTO.email && userDTO.email.trim() === '') {
            errors.push('Email không được để trống');
        }

        if (userDTO.password && userDTO.password.trim() === '') {
            errors.push('Mật khẩu không được để trống');
        }

        if (userDTO.fullname && userDTO.fullname.trim() === '') {
            errors.push('Họ và tên không được để trống');
        }

        if (userDTO.phone && userDTO.phone.trim() === '') {
            errors.push('Số điện thoại không được để trống');
        }

        if (userDTO.address && userDTO.address.trim() === '') {
            errors.push('Địa chỉ không được để trống');
        }

        if (userDTO.dateOfBirth && isNaN(Date.parse(userDTO.dateOfBirth.toString()))) {
            errors.push('Ngày sinh không hợp lệ');
        }

        if (userDTO.dateOfJoin && isNaN(Date.parse(userDTO.dateOfJoin.toString()))) {
            errors.push('Ngày vào làm không hợp lệ');
        }

        if (userDTO.contractType && userDTO.contractType.trim() === '') {
            errors.push('Loại hợp đồng không được để trống');
        }

        if (userDTO.role && !Object.values(UserRole).includes(userDTO.role)) {
            errors.push('Vai trò không hợp lệ');
        }

        return errors;
    }

    public async lockUser(userId: string): Promise<ResponseDTO<IUser | null>> {
        const user = await this.userRepository.findById(userId);

        console.log(userId);
        console.log(user);
        if (!user) {
            return new ResponseDTO(404, 'Người dùng không tồn tại', null, []);
        }

        user.isLocked = true;
        const updatedUser = await this.userRepository.update(user.id, user);

        return new ResponseDTO(200, 'Khóa người dùng thành công', updatedUser, []);
    }

    public async unlockUser(userId: string): Promise<ResponseDTO<IUser | null>> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return new ResponseDTO(404, 'Người dùng không tồn tại', null, []);
        }

        user.isLocked = false;
        const updatedUser = await this.userRepository.update(user.id, user);

        return new ResponseDTO(200, 'Mở khóa người dùng thành công', updatedUser, []);
    }

    public async getUserById(userId: string): Promise<ResponseDTO<IUser | null>> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return new ResponseDTO(404, 'Người dùng không tồn tại', null, []);
        }

        return new ResponseDTO(200, 'Lấy thông tin người dùng thành công', user, []);
    }

    public async getUserByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findByEmail(email);
    }

    public createPasswordResetToken(user: IUser): string {
        const token = jwt.sign({ id: user.id }, DEFAULTS.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    public async resetPassword(token: string, newPassword: string): Promise<IUser | null> {
        try {
            const decoded = jwt.verify(token, DEFAULTS.JWT_SECRET) as { id: string };
            const user = await this.userRepository.findById(decoded.id);
            console.log(user);
            if (!user) return null;

            if (!newPassword) {
                throw new Error('Mật khẩu mới không được để trống');
            }

            user.password = bcrypt.hashSync(newPassword, 10);
            await user.save();

            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
