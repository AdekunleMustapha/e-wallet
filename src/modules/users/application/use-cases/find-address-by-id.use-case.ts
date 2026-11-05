import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { AddressOutput, toAddressOutput, toCountryOutput } from "../dtos";
import { ADDRESS_REPOSITORY, COUNTRY_REPOSITORY, IAddressRepository, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type FindAddressByIdCommand = {id: string};

@Injectable()
export class FindAddressByIdUseCase implements UseCase<FindAddressByIdCommand, AddressOutput> {
    private readonly logger = new Logger(FindAddressByIdUseCase.name);

    constructor(
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: FindAddressByIdCommand): Promise<Result<AddressOutput>> {
        this.logger.log("Executing find address by id use case");

        const id = UniqueId.createFromString(dto.id);
        const savedResult = await this.addressRepository.getById(id);
        if(savedResult.isFailure) return Result.fail(savedResult.error);
        const address = savedResult.value;
        const countryResult = await this.countryRepository.getById(address.countryId);
        const countryOutput = toCountryOutput(countryResult.value);

        return Result.ok(toAddressOutput(address, countryOutput));
    }
}