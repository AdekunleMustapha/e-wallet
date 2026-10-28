import { UniqueId } from "src/shared/domain/unique-id";
import { Address } from "../entities";
import { Result } from "src/shared/domain/result";
import { PaginationOptions, PaginationResult } from "./person.repository.interface";

export interface AddressPaginationFilters {
    state?: string;
    city?: string;
    countryId?: UniqueId;
    streetName?: string;
    postalCode?: string;
    buildingCode?: string;
    flatCode?: string;
}

export const ADDRESS_REPOSITORY = Symbol("ADDRESS_REPOSITORY");

export interface IAddressRepository {
    
    save(address: Address): Promise<Result<Address>>;

    update(address: Address): Promise<Result<Address>>;

    search(
        filters: AddressPaginationFilters,
        options: PaginationOptions
    ): Promise<Result<PaginationResult<Address>>>;

    getById(id: UniqueId): Promise<Result<Address>>;
}