import { Result } from "src/shared/domain/result";
import { Person } from "../entities";
import { DOB } from "../value-objects/dob.vo";
import { UniqueId } from "src/shared/domain/unique-id";

export interface PersonPaginationFilters {
    genderId?: string,
    dob?: DOB,
    addressId?: UniqueId,
    searchQuery?: string
}

export interface PaginationOptions {
    limit: number,
    page: number,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
}

export interface PaginationResult<T> {
    data: T[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
}

export const PERSON_REPOSITORY = Symbol("PERSON_REPOSITORY");

export interface IPersonRepository {

    save(person: Person): Promise<Result<Person>>;

    update(person: Person): Promise<Result<Person>>;

    search(
        filters: PersonPaginationFilters,
        options: PaginationOptions
    ): Promise<Result<PaginationResult<Person>>>;

    getById(id: UniqueId): Promise<Result<Person>>;
}