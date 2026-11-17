import { Module } from "@nestjs/common";
import { 
    NIN_HASHER, 
    BVN_HASHER, 
    PASSWORD_HASHER, 
    IDENTITY_VERIFICATION_SERVICE 
} from "./domain/services";
import { 
    HmacNINHasher, 
    HmacBVNHasher, 
    HmacPasswordHasher, 
    MockIdentifierService 
} from "./infrastructure/services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentOrmEntity, DocumentTypeOrmEntity, PersonOrmEntity } from "./infrastructure/persistence/orm-entities";
import { DOCUMENT_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, PERSON_REPOSITORY } from "./domain/repository";
import { DocumentTypeOrmRepository, DocumentTypeTypeOrmRepository, PersonTypeOrmRepository } from "./infrastructure/persistence/repositories";
import {
    DocumentTypeController,
    DocumentController,
    PersonController,
} from "./presentation/controllers";
import {
    CreateDocumentTypeUseCase,
    EditDocumentTypeUseCase,
    GetAllDocumentTypeUseCase,
    GetDocumentTypeByIdUseCase,
    DeleteDocumentTypeUseCase,
    CreateDocumentUseCase,
    EditDocumentUseCase,
    GetDocumentByIdUseCase,
    DeleteDocumentUseCase,
    SearchDocumentUseCase,
    CreatePersonUseCase,
    GetPersonByIdUseCase,
    SearchPersonUseCase,
    LinkBvnUseCase,
    LinkNinUseCase,
    UpgradeTierUseCase,
    ChangePasswordUseCase,
} from "./application/use-cases";

const controllers = [
    DocumentTypeController,
    DocumentController,
    PersonController,
];

const useCases = [
    // Document Type
    CreateDocumentTypeUseCase,
    EditDocumentTypeUseCase,
    GetAllDocumentTypeUseCase,
    GetDocumentTypeByIdUseCase,
    DeleteDocumentTypeUseCase,
    // Document
    CreateDocumentUseCase,
    EditDocumentUseCase,
    GetDocumentByIdUseCase,
    DeleteDocumentUseCase,
    SearchDocumentUseCase,
    // Person
    CreatePersonUseCase,
    GetPersonByIdUseCase,
    SearchPersonUseCase,
    LinkBvnUseCase,
    LinkNinUseCase,
    UpgradeTierUseCase,
    ChangePasswordUseCase,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonOrmEntity,
            DocumentOrmEntity,
            DocumentTypeOrmEntity,
        ])
    ],
    controllers: [...controllers],
    providers: [
        ...useCases,
        { provide: NIN_HASHER, useClass: HmacNINHasher },
        { provide: BVN_HASHER, useClass: HmacBVNHasher },
        { provide: PASSWORD_HASHER, useClass: HmacPasswordHasher },
        { provide: PERSON_REPOSITORY, useClass: PersonTypeOrmRepository },
        { provide: DOCUMENT_REPOSITORY, useClass: DocumentTypeOrmRepository },
        { provide: DOCUMENT_TYPE_REPOSITORY, useClass: DocumentTypeTypeOrmRepository },
        { provide: IDENTITY_VERIFICATION_SERVICE, useClass: MockIdentifierService }
    ],
    exports: [
        ...useCases,
        NIN_HASHER, 
        BVN_HASHER,
        PASSWORD_HASHER,
        PERSON_REPOSITORY,
        DOCUMENT_REPOSITORY,
        DOCUMENT_TYPE_REPOSITORY,
        IDENTITY_VERIFICATION_SERVICE
    ],
})
export class UsersModule {}
