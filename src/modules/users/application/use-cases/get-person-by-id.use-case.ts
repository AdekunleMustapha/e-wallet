import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput, toAddressOutput, toCountryOutput, toGenderOutput } from "../dtos";
import { PERSON_REPOSITORY, IPersonRepository } from "../../domain/repository";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";
import { ADDRESS_REPOSITORY, IAddressRepository } from "../../domain/repository";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { NotFoundError } from "src/shared/domain/errors";

export type GetPersonByIdCommand = { id: string };

@Injectable()
export class GetPersonByIdUseCase implements UseCase<GetPersonByIdCommand, PersonOutput> {
    private readonly logger = new Logger(GetPersonByIdUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository,
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: GetPersonByIdCommand): Promise<Result<PersonOutput>> {
        this.logger.log("Executing get person by id use case");

        const id = UniqueId.createFromString(dto.id);
        const personResult = await this.personRepository.getById(id);
        if(personResult.isFailure) return Result.fail(personResult.error);

        const person = personResult.value;

        const genderResult = await this.genderRepository.getById(person.genderId);
        if(genderResult.isFailure) return Result.fail(genderResult.error);
        const genderOutput = toGenderOutput(genderResult.value);

        if(!person.addressId) {
            return Result.fail(new NotFoundError("Person has no linked address"));
        }

        const addressResult = await this.addressRepository.getById(person.addressId);
        if(addressResult.isFailure) return Result.fail(addressResult.error);

        const countryResult = await this.countryRepository.getById(addressResult.value.countryId);
        if(countryResult.isFailure) return Result.fail(countryResult.error);

        const addressOutput = toAddressOutput(addressResult.value, toCountryOutput(countryResult.value));

        return Result.ok(toPersonOutput(person, addressOutput, genderOutput));
    }
}
