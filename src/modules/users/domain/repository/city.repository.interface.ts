import { Result } from "src/shared/domain/result";
import { City } from "../entities";
import { PaginationOptions, PaginationResult} from "./person.repository.interface";
import { Country, NigeriaState } from "../enums";
import { UniqueId } from "src/shared/domain/unique-id";

export type CityPaginationFilters = {
    city?: string,
    state?: NigeriaState,
    country?: Country
}

export const CITY_REPOSITORY = Symbol("CITY_REPOSITORY");

export interface ICityRepository {
    save(person: City): Promise<Result<City>>;
    update(person: City): Promise<Result<City>>;
    search(
        filters: CityPaginationFilters,
        options: PaginationOptions
    ): Promise<Result<PaginationResult<City>>>;
    getById(id: UniqueId): Promise<Result<City>>;
}