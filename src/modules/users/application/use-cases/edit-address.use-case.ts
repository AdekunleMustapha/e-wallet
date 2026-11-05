import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { AddressOutput, toAddressOutput, toCountryOutput } from "../dtos";
import { ADDRESS_REPOSITORY, IAddressRepository } from "../../domain/repository";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Address } from "../../domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type EditAddressCommand = {
    id: string;
    countryId: string;
    state: string;
    city: string;
    streetName: string;
    postalCode?: string;
    buildingCode?: string;
    flatCode?: string;
};

@Injectable()
export class EditAddressUseCase implements UseCase<EditAddressCommand, AddressOutput> {
    private readonly logger = new Logger(EditAddressUseCase.name);

    constructor(
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: EditAddressCommand): Promise<Result<AddressOutput>> {
        this.logger.log("Executing edit address use case");

        const id = UniqueId.createFromString(dto.id);
        const addressResult = await this.addressRepository.getById(id);
        if(addressResult.isFailure) return Result.fail(addressResult.error);

        const countryId = UniqueId.createFromString(dto.countryId);
        const updatedAddressResult = Address.create({
            countryId,
            state: dto.state,
            city: dto.city,
            streetName: dto.streetName,
            postalCode: dto.postalCode,
            buildingCode: dto.buildingCode,
            flatCode: dto.flatCode,
        });
        if(updatedAddressResult.isFailure) return Result.fail(updatedAddressResult.error);

        const result = await this.addressRepository.update(updatedAddressResult.value);
        if(result.isFailure) return Result.fail(result.error);

        const countryResult = await this.countryRepository.getById(result.value.countryId);
        if(countryResult.isFailure) return Result.fail(countryResult.error);

        return Result.ok(toAddressOutput(result.value, toCountryOutput(countryResult.value)));
    }
}
