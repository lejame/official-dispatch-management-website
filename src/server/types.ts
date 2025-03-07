import { UserRole } from './models/enums';

declare module 'express' {
    export interface Request {
        user?: {
            id: string;
            email: string;
            role: UserRole;
        };
    }
}

const TYPES = {
    UserService: Symbol.for('UserService'),
    UserRepository: Symbol.for('UserRepository'),
    AuthenticationService: Symbol.for('AuthenticationService'),
    DocumentCategoryService: Symbol.for('DocumentCategoryService'),
    DocumentCategoryRepository: Symbol.for('DocumentCategoryRepository'),
    DepartmentService: Symbol.for('DepartmentService'),
    DepartmentRepository: Symbol.for('DepartmentRepository'),
    DocumentFieldService: Symbol.for('DocumentFieldService'),
    DocumentFieldRepository: Symbol.for('DocumentFieldRepository'),
    DocumentIncomingService: Symbol.for('DocumentIncomingService'),
    DocumentRepository: Symbol.for('DocumentRepository'),
    OutgoingDocumentService: Symbol.for('OutgoingDocumentService'),
    DocumentService: Symbol.for('DocumentService'),
    NotificationService: Symbol.for('NotificationService'),
    NotificationRepository: Symbol.for('NotificationRepository')
};

export { TYPES };
