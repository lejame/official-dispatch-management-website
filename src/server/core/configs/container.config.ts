// src/inversify.config.ts
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../types';
import { UserRepository } from '../../repositories/UserRepository';
import { UserService } from '../../services/UserService';
import { AuthenticationService } from '../../services/AuthenticationService';
import { DocumentCategoryService } from '../../services/DocumentCategoryService';
import { DocumentCategoryRepository } from '../../repositories/DocumentCategoryRepository';
import { DepartmentService } from '../../services/DepartmentService';
import { DepartmentRepository } from '../../repositories/DepartmentRepository';
import { DocumentFieldService } from '../../services/DocumentFieldService';
import { DocumentFieldRepository } from '../../repositories/DocumentFieldRepository';
import { DocumentIncomingService } from '../../services/DocumentIncomingService';
import { DocumentRepository } from '../../repositories/DocumentRepository';
import { DocumentService } from '../../services/DocumentService';
import { OutgoingDocumentService } from '../../services/OutgoingDocumentService';
import { NotificationRepository } from '../../repositories/NotificationRepository';
import { NotificationService } from '../../services/NotificationService';

const container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<AuthenticationService>(TYPES.AuthenticationService).to(AuthenticationService);

container.bind<DocumentCategoryService>(TYPES.DocumentCategoryService).to(DocumentCategoryService);
container.bind<DocumentCategoryRepository>(TYPES.DocumentCategoryRepository).to(DocumentCategoryRepository);

container.bind<DepartmentService>(TYPES.DepartmentService).to(DepartmentService);
container.bind<DepartmentRepository>(TYPES.DepartmentRepository).to(DepartmentRepository);

container.bind<DocumentFieldService>(TYPES.DocumentFieldService).to(DocumentFieldService);
container.bind<DocumentFieldRepository>(TYPES.DocumentFieldRepository).to(DocumentFieldRepository);

container.bind<DocumentIncomingService>(TYPES.DocumentIncomingService).to(DocumentIncomingService);
container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<OutgoingDocumentService>(TYPES.OutgoingDocumentService).to(OutgoingDocumentService);
container.bind<DocumentRepository>(TYPES.DocumentRepository).to(DocumentRepository);

container.bind<NotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
export { container };
