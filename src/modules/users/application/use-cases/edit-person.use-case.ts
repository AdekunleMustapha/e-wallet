import { Injectable, Logger, Inject } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { AddressOutput, PersonOutput, toAddressOutput, toCountryOutput, toGenderOutput, toPersonOutput } from "../dtos";
import { ADDRESS_REPOSITORY, COUNTRY_REPOSITORY, GENDER_REPOSITORY, IAddressRepository, ICountryRepository, IGenderRepository, IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { BVN, BVNHash, Email, NIN, NINHash } from "../../domain/value-objects";
import { Address, Country } from "../../domain/entities";
import { BVN_HASHER, IBvnHasher, INinHasher, NIN_HASHER } from "../../domain/services";

export type EditPersonCommand = {
    id: string,
    email?: string,
    addressId?: string,
    nin?: string,
    bvn?: string
}

/**
 * Simple person info edit that allows change in email, address and adding of nin and bvn
 * Currently allows adding of nin and bvn without verifying it with dob or full name
 */
@Injectable()
export class EditPersonUseCase implements UseCase<EditPersonCommand, PersonOutput> {
    private readonly logger = new Logger(EditPersonUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository,
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository,
        @Inject(NIN_HASHER) private readonly ninHasher: INinHasher,
        @Inject(BVN_HASHER) private readonly bvnHasher: IBvnHasher
    ) {}

    public async execute(dto: EditPersonCommand): Promise<Result<PersonOutput>> {
        this.logger.log("Execute edit person use case");

        const id = UniqueId.createFromString(dto.id);

        // get person record
        const personResult = await this.personRepository.getById(id);
        if(personResult.isFailure) return Result.fail(personResult.error);
        const person = personResult.value;

        // validation
        let email: Email | undefined;
        if(dto.email) {
            const emailResult = Email.create(dto.email);
            if(emailResult.isFailure) return Result.fail(emailResult.error);
            email = emailResult.value;
        }

        let country: Country | undefined;
        let address: Address | undefined;
        if(dto.addressId) {
            const id = UniqueId.createFromString(dto.addressId);
            const addressResult = await this.addressRepository.getById(id);
            if(addressResult.isFailure) return Result.fail(addressResult.error);
            address = addressResult.value;
            
            const countryResult = await this.countryRepository.getById(address.countryId);
            if(countryResult.isFailure) return Result.fail(countryResult.error);
            country = countryResult.value;
        }

        let ninHash: NINHash | undefined; 
        if(dto.nin) {
            const ninResult = NIN.create(dto.nin);
            if(ninResult.isFailure) return Result.fail(ninResult.error);
            const ninHashResult = this.ninHasher.hash(ninResult.value);
            if(ninHashResult.isFailure) return Result.fail(ninHashResult.error);
            ninHash = ninHashResult.value;
        }

        let bvnHash: BVNHash | undefined;
        if(dto.bvn) {
            const bvnResult = BVN.create(dto.bvn);
            if(bvnResult.isFailure) return Result.fail(bvnResult.error);
            const bvnHashResult = this.bvnHasher.hash(bvnResult.value);
            if(bvnHashResult.isFailure) return Result.fail(bvnHashResult.error);
            bvnHash = bvnHashResult.value;
        }

        const genderResult = await this.genderRepository.getById(person.genderId);
        if(genderResult.isFailure) return Result.fail(genderResult.error);
        const gender = genderResult.value;

        // update person entity
        const updatePersonResult = person.update({
            addressId: address ? address.id : undefined,
            email
        });
        if(updatePersonResult.isFailure) return Result.fail(updatePersonResult.error);
        if(bvnHash) {
            const result = person.linkBvn(bvnHash);
            if(result.isFailure) return Result.fail(result.error);
        }
        if(ninHash) {
            const result = person.linkNin(ninHash);
            if(result.isFailure) return Result.fail(result.error);
        }

        // update person record;
        const updateResult = await this.personRepository.update(person);
        if(updateResult.isFailure) return Result.fail(updateResult.error);
        
        // return out put
        const genderOutput = toGenderOutput(gender);
        let addressOutput: AddressOutput | undefined;
        if(address && country) {
            addressOutput = toAddressOutput(address, toCountryOutput(country));
        }
        const personOutput = toPersonOutput(person, genderOutput, addressOutput);

        return Result.ok(personOutput);
    }
};