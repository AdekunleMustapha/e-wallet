import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { AddressOutput, PersonOutput, toAddressOutput, toCountryOutput, toGenderOutput, toPersonOutput } from "../dtos";
import { ADDRESS_REPOSITORY, COUNTRY_REPOSITORY, GENDER_REPOSITORY, IAddressRepository, ICountryRepository, IGenderRepository, IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { BVN, BVNHash, DOB, Email, Name, NIN, NINHash } from "../../domain/value-objects";
import { UniqueId } from "src/shared/domain/unique-id";
import { Address, Country, Person } from "../../domain/entities";

export type CreatePersonCommand = {
    firstName: string,
    lastName: string,
    dob: {
        year: string,
        month: string,
        day: string
    },
    email: string,
    genderId:string,
    addressId?: string,
}

/**
 * Simple person record creation
 * Currently allows adding of nin and bvn without verifying it with dob or full name
 */
@Injectable()
export class CreatePersonUseCase implements UseCase<CreatePersonCommand , PersonOutput> {
    private readonly logger = new Logger(CreatePersonUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository,
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ) {}

    public async execute(dto: CreatePersonCommand): Promise<Result<PersonOutput>> {
        this.logger.log("Execute create person use case");

        // validation
        const firstNameResult = Name.create(dto.firstName);
        if(firstNameResult.isFailure) return Result.fail(firstNameResult.error);
        const firstName = firstNameResult.value;

        const lastNameResult = Name.create(dto.lastName);
        if(lastNameResult.isFailure) return Result.fail(lastNameResult.error);
        const lastName = lastNameResult.value;

        const dobResult = DOB.create({day: dto.dob.day, month: dto.dob.month, year: dto.dob.year});
        if(dobResult.isFailure) return Result.fail(dobResult.error);
        const dob = dobResult.value;

        const emailResult = Email.create(dto.email);
        if(emailResult.isFailure) return Result.fail(emailResult.error);
        const email = emailResult.value;

        const genderId = UniqueId.createFromString(dto.genderId);
        const genderResult = await this.genderRepository.getById(genderId);
        if(genderResult.isFailure) return Result.fail(genderResult.error);
        const gender = genderResult.value;

        let address: Address | undefined;
        let country: Country | undefined;
        if(dto.addressId) {
            const addressId = UniqueId.createFromString(dto.addressId);
            const addressResult = await this.addressRepository.getById(addressId);
            if(addressResult.isFailure) return Result.fail(addressResult.error);
            address = addressResult.value;

            const countryResult = await this.countryRepository.getById(address.countryId);
            if(countryResult.isFailure) return Result.fail(countryResult.error);
            country = countryResult.value;
        }

        // person entity creation and record saving
        const person = Person.create({
            dob,
            email,
            firstName,
            genderId,
            lastName,
            addressId: address? address.id : undefined
        });
        const saveResult = await this.personRepository.save(person);
        if(saveResult.isFailure) return Result.fail(saveResult.error);
        
        // return out put
        const genderOutput = toGenderOutput(gender);
        let addressOutput: AddressOutput | undefined;
        if(address && country) {
            addressOutput = toAddressOutput(address, toCountryOutput(country));
        }
        const personOutput = toPersonOutput(person, genderOutput, addressOutput);
        
        // return Result
        return Result.ok(personOutput);
    }
};