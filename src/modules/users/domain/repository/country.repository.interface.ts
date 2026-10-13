import { UniqueId } from "src/shared/domain/unique-id";
import { Country } from "../entities";
import { Result } from "src/shared/domain/result";

export interface CountryPaginationFilters {
    countryName?: string;
    countryCode?: number;
}

export interface ICountryRepository {
    
    save(country: Country): Promise<Result<Country>>;

    update(country: Country): Promise<Result<Country>>;

    search(filters: CountryPaginationFilters): Promise<Result<Country[]>>;

    getById(id: UniqueId): Promise<Result<Country>>;

    delete(id: UniqueId): Promise<Result<void>>;
}