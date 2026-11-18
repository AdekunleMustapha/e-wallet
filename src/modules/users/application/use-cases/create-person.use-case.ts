import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput } from "../dtos";
import { CITY_REPOSITORY, ICityRepository, IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { DOB, Email, Name, Password, PhoneNumber } from "../../domain/value-objects";
import { Person } from "../../domain/entities";
import { Country, Gender, NigeriaState, Tier } from "../../domain/enums";
import { NotFoundError, ValidationError } from "src/shared/domain/errors";
import { IPasswordHasherService, PASSWORD_HASHER } from "../../domain/services";

export type CreatePersonCommand = {
    firstName: string;
    lastName: string;
    middleName?: string;
    dob: {
        year: string;
        month: string;
        day: string;
    };
    email: string;
    phoneNumber: string;
    gender: Gender;
    country: Country;
    state: NigeriaState;
    city: string;
    addressLine1: string;
    postalCode?: string;
    password: string;
};

@Injectable()
export class CreatePersonUseCase implements UseCase<CreatePersonCommand, PersonOutput> {
    private readonly logger = new Logger(CreatePersonUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasherService,
        @Inject(CITY_REPOSITORY) private readonly cityRepository: ICityRepository
    ) {}

    public async execute(dto: CreatePersonCommand): Promise<Result<PersonOutput>> {
        this.logger.log("Execute create person use case");

        // Validation
        const firstNameResult = Name.create(dto.firstName);
        if (firstNameResult.isFailure) return Result.fail(firstNameResult.error);
        const firstName = firstNameResult.value;

        const lastNameResult = Name.create(dto.lastName);
        if (lastNameResult.isFailure) return Result.fail(lastNameResult.error);
        const lastName = lastNameResult.value;

        let middleName: Name | undefined;
        if (dto.middleName) {
            const middleNameResult = Name.create(dto.middleName);
            if (middleNameResult.isFailure) return Result.fail(middleNameResult.error);
            middleName = middleNameResult.value;
        }

        const dobResult = DOB.create({ day: dto.dob.day, month: dto.dob.month, year: dto.dob.year });
        if (dobResult.isFailure) return Result.fail(dobResult.error);
        const dob = dobResult.value;

        const emailResult = Email.create(dto.email);
        if (emailResult.isFailure) return Result.fail(emailResult.error);
        const email = emailResult.value;

        const phoneResult = PhoneNumber.create(dto.phoneNumber);
        if (phoneResult.isFailure) return Result.fail(phoneResult.error);
        const phoneNumber = phoneResult.value;

        const passwordResult = Password.create(dto.password);
        if (passwordResult.isFailure) return Result.fail(passwordResult.error);

        const passwordHashResult = this.passwordHasher.hash(passwordResult.value);
        if (passwordHashResult.isFailure) return Result.fail(passwordHashResult.error);
        const passwordHash = passwordHashResult.value;

        if (!Object.values(Gender).includes(dto.gender)) {
            return Result.fail(new ValidationError("Invalid gender"));
        }

        if (!Object.values(Country).includes(dto.country)) {
            return Result.fail(new ValidationError("Invalid country"));
        }

        if (!Object.values(NigeriaState).includes(dto.state)) {
            return Result.fail(new ValidationError("Invalid state"));
        }

        const cityResult = await this.cityRepository.search({ city: dto.city, state: dto.state }, { limit: 1, page: 1 });
        if (cityResult.isFailure) return Result.fail(cityResult.error);
        if (!cityResult.value.data.length) {
            return Result.fail(new NotFoundError("City not found in the specified state"));
        }
        const city = cityResult.value.data[0].city.name;

        if (!dto.addressLine1?.trim()) {
            return Result.fail(new ValidationError("Address line 1 cannot be empty"));
        }

        // Person entity creation
        const person = Person.create({
            firstName,
            lastName,
            middleName,
            dob,
            email,
            phoneNumber,
            gender: dto.gender,
            country: dto.country,
            state: dto.state,
            city,
            addressLine1: dto.addressLine1.trim(),
            postalCode: dto.postalCode?.trim(),
            passwordHash,
            tier: Tier.TIER_ONE
        });

        const saveResult = await this.personRepository.save(person);
        if (saveResult.isFailure) return Result.fail(saveResult.error);

        return Result.ok(toPersonOutput(person));
    }
}
