import { Injectable, Inject, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { AddressOutput, toAddressOutput, toCountryOutput } from "../dtos";
import { ADDRESS_REPOSITORY, COUNTRY_REPOSITORY, IAddressRepository, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { Address } from "../../domain/entities";

export type CreateAddressCommand = {
    countryId: string,
    state: string,
    city: string,
    streetName: string,
    postalCode?: string,
    buildingCode?: string,
    flatCode?: string,
}

@Injectable()
export class CreateAddressUseCase implements UseCase<CreateAddressCommand , AddressOutput> {
    private readonly logger = new Logger(CreateAddressUseCase.name);

    constructor(
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: CreateAddressCommand): Promise<Result<AddressOutput>> {
        this.logger.log("Executing create address use case");

        // validation
        const countryId = UniqueId.createFromString(dto.countryId);
        const countryResult = await this.countryRepository.getById(countryId);
        if(countryResult.isFailure) return Result.fail(countryResult.error);
        const country = countryResult.value;

        const addressResult = Address.create({
            city: dto.city,
            countryId: country.id,
            state: dto.state,
            streetName: dto.streetName,
            buildingCode: dto.buildingCode,
            flatCode: dto.flatCode,
            postalCode: dto.postalCode
        });
        if(addressResult.isFailure) return Result.fail(addressResult.error);

        // saving to db
        const saveResult = await this.addressRepository.save(addressResult.value);
        if(saveResult.isFailure) return Result.fail(saveResult.error);
        const address = saveResult.value;

        // response
        const countryOutput = toCountryOutput(country);
        return Result.ok(toAddressOutput(address, countryOutput));
    }
}