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
import { CityOrmEntity, DocumentOrmEntity, DocumentTypeOrmEntity, PersonOrmEntity } from "./infrastructure/persistence/orm-entities";
import { CITY_REPOSITORY, DOCUMENT_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, PERSON_REPOSITORY } from "./domain/repository";
import { CityTypeOrmRepository, DocumentTypeOrmRepository, DocumentTypeTypeOrmRepository, PersonTypeOrmRepository } from "./infrastructure/persistence/repositories";
import {
    DocumentTypeController,
    DocumentController,
    PersonController,
    CityController,
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
    GetStateUseCase,
    SearchCityUseCase,
} from "./application/use-cases";

const controllers = [
    DocumentTypeController,
    DocumentController,
    PersonController,
    CityController,
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
    // City & State
    GetStateUseCase,
    SearchCityUseCase,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonOrmEntity,
            DocumentOrmEntity,
            DocumentTypeOrmEntity,
            CityOrmEntity,
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
        { provide: CITY_REPOSITORY, useClass: CityTypeOrmRepository },
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
        CITY_REPOSITORY,
        IDENTITY_VERIFICATION_SERVICE
    ],
})
export class UsersModule {}
