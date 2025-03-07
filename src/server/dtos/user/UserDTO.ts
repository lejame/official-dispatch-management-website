import { UserRole, ContractType } from '../../models/enums';

export class UserDTO {
    userId?: string;
    username: string;
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    dateOfJoin: Date;
    contractType: ContractType;
    departmentId: string;
    role: UserRole;
    isLocked: boolean;
    avatar: string;

    constructor(
        userId: string | undefined,
        username: string,
        email: string,
        password: string,
        fullname: string,
        phone: string,
        address: string,
        dateOfBirth: Date,
        dateOfJoin: Date,
        contractType: ContractType,
        departmentId: string,
        role: UserRole,
        isLocked: boolean,
        avatar: string
    ) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.dateOfJoin = dateOfJoin;
        this.contractType = contractType;
        this.departmentId = departmentId;
        this.role = role;
        this.isLocked = isLocked;
        this.avatar = avatar;
    }
}
