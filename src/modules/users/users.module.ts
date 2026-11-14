import { Module } from "@nestjs/common";
import { NIN_HASHER, BVN_HASHER, IDENTITY_VERIFICATION_SERVICE } from "./domain/services";
import { HmacNINHasher, HmacBVNHasher, MockIdentifierService } from "./infrastructure/services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressOrmEntity, CountryOrmEntity, DocumentOrmEntity, DocumentTypeOrmEntity, GenderOrmEntity, PersonOrmEntity } from "./infrastructure/persistence/orm-entities";
import { ADDRESS_REPOSITORY, COUNTRY_REPOSITORY, DOCUMENT_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, GENDER_REPOSITORY, PERSON_REPOSITORY } from "./domain/repository";
import { AddressTypeOrmRepository, CountryTypeOrmRepository, DocumentTypeOrmRepository, DocumentTypeTypeOrmRepository, GenderTypeOrmRepository, PersonTypeOrmRepository } from "./infrastructure/persistence/repositories";
import {
    AddressController,
    CountryController,
    DocumentTypeController,
    DocumentController,
    GenderController,
    PersonController,
} from "./presentation/controllers";
import {
    CreateAddressUseCase,
    EditAddressUseCase,
    FindAddressByIdUseCase,
    SearchAddressUseCase,
    CreateCountryUseCase,
    EditCountryUseCase,
    GetCountryByIdUseCase,
    DeleteCountryUseCase,
    SearchCountryUseCase,
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
    CreateGenderUseCase,
    EditGenderUseCase,
    GetAllGenderUseCase,
    GetGenderByIdUseCase,
    DeleteGenderUseCase,
    CreatePersonUseCase,
    EditPersonUseCase,
    GetPersonByIdUseCase,
    SearchPersonUseCase,
} from "./application/use-cases";

const controllers = [
    AddressController,
    CountryController,
    DocumentTypeController,
    DocumentController,
    GenderController,
    PersonController,
];

const useCases = [
    // Address
    CreateAddressUseCase,
    EditAddressUseCase,
    FindAddressByIdUseCase,
    SearchAddressUseCase,
    // Country
    CreateCountryUseCase,
    EditCountryUseCase,
    GetCountryByIdUseCase,
    DeleteCountryUseCase,
    SearchCountryUseCase,
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
    // Gender
    CreateGenderUseCase,
    EditGenderUseCase,
    GetAllGenderUseCase,
    GetGenderByIdUseCase,
    DeleteGenderUseCase,
    // Person
    CreatePersonUseCase,
    EditPersonUseCase,
    GetPersonByIdUseCase,
    SearchPersonUseCase,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GenderOrmEntity, 
            PersonOrmEntity,
            CountryOrmEntity,
            AddressOrmEntity,
            DocumentOrmEntity,
            DocumentTypeOrmEntity,
        ])
    ],
    controllers: [...controllers],
    providers: [
        ...useCases,
        {provide: NIN_HASHER, useClass: HmacNINHasher},
        {provide: BVN_HASHER, useClass: HmacBVNHasher},
        // port (token)  ->  adapter (class)
        {provide: GENDER_REPOSITORY, useClass: GenderTypeOrmRepository},
        {provide: PERSON_REPOSITORY, useClass: PersonTypeOrmRepository},
        {provide: COUNTRY_REPOSITORY, useClass: CountryTypeOrmRepository},
        {provide: ADDRESS_REPOSITORY, useClass: AddressTypeOrmRepository},
        {provide: DOCUMENT_REPOSITORY, useClass: DocumentTypeOrmRepository},
        {provide: DOCUMENT_TYPE_REPOSITORY, useClass: DocumentTypeTypeOrmRepository},
        {provide: IDENTITY_VERIFICATION_SERVICE, useClass: MockIdentifierService}
    ],
    exports: [
        ...useCases,
        NIN_HASHER, 
        BVN_HASHER,
        GENDER_REPOSITORY,
        PERSON_REPOSITORY,
        COUNTRY_REPOSITORY,
        ADDRESS_REPOSITORY,
        DOCUMENT_REPOSITORY,
        DOCUMENT_TYPE_REPOSITORY,
        IDENTITY_VERIFICATION_SERVICE
    ],
})
export class UsersModule {}
