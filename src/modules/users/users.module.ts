import { Module } from "@nestjs/common";
import { NIN_HASHER, BVN_HASHER } from "./domain/services";
import { HmacNINHasher, HmacBVNHasher } from "./infrastructure/services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressOrmEntity, CountryOrmEntity, DocumentOrmEntity, DocumentTypeOrmEntity, GenderOrmEntity, PersonOrmEntity } from "./infrastructure/persistence/orm-entities";
import { ADDRESS_REPOSITORY, COUNTRY_REPOSITORY, DOCUMENT_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, GENDER_REPOSITORY, PERSON_REPOSITORY } from "./domain/repository";
import { AddressTypeOrmRepository, CountryTypeOrmRepository, DocumentTypeOrmRepository, DocumentTypeTypeOrmRepository, GenderTypeOrmRepository, PersonTypeOrmRepository } from "./infrastructure/persistence/repositories";

@Module({
    imports: [
        // Creates the injectable Repository<GenderOrmEntity> / Repository<PersonOrmEntity>
        // that the adapters receive through @InjectRepository(...)
        TypeOrmModule.forFeature([
            GenderOrmEntity, 
            PersonOrmEntity,
            CountryOrmEntity,
            AddressOrmEntity,
            DocumentOrmEntity,
            DocumentTypeOrmEntity,
        ])
    ],
    providers: [
        {provide: NIN_HASHER, useClass: HmacNINHasher},
        {provide: BVN_HASHER, useClass: HmacBVNHasher},
        // port (token)  ->  adapter (class)
        {provide: GENDER_REPOSITORY, useClass: GenderTypeOrmRepository},
        {provide: PERSON_REPOSITORY, useClass: PersonTypeOrmRepository},
        {provide: COUNTRY_REPOSITORY, useClass: CountryTypeOrmRepository},
        {provide: ADDRESS_REPOSITORY, useClass: AddressTypeOrmRepository},
        {provide: DOCUMENT_REPOSITORY, useClass: DocumentTypeOrmRepository},
        {provide: DOCUMENT_TYPE_REPOSITORY, useClass: DocumentTypeTypeOrmRepository}
    ],
    exports: [
        NIN_HASHER, 
        BVN_HASHER,
        GENDER_REPOSITORY,
        PERSON_REPOSITORY,
        COUNTRY_REPOSITORY,
        ADDRESS_REPOSITORY,
        DOCUMENT_REPOSITORY,
        DOCUMENT_TYPE_REPOSITORY
    ],
})
export class UsersModule {}