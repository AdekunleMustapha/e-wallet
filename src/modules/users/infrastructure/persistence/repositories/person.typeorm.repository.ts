import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { 
    IPersonRepository, 
    PaginationOptions, 
    PaginationResult, 
    PersonPaginationFilters 
} from "src/modules/users/domain/repository";
import { PersonOrmEntity } from "../orm-entities";
import { Brackets, Repository } from "typeorm";
import { Person } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { PersonMapper } from "src/modules/users/application/mappers";
import { NotFoundError } from "src/shared/domain/errors";

/**
 * Only these keys may be used for sorting. `sortBy` comes from the outside
 * world, so it is looked up here and never concatenated into the query.
 */
const SORTABLE_COLUMNS: Record<string, string> = {
    createdAt: "p.createdAt",
    email: "p.email",
    dob: "p.dob",
    firstName: "p.firstName",
    lastName: "p.lastName",
    phoneNumber: "p.phoneNumber",
    tier: "p.tier",
};

const MAX_PAGE_SIZE = 100;

@Injectable()
export class PersonTypeOrmRepository implements IPersonRepository {

    constructor(
        @InjectRepository(PersonOrmEntity)
        private readonly orm: Repository<PersonOrmEntity>
    ) {}

    public async save(person: Person): Promise<Result<Person>> {
        try {
            await this.orm.insert(PersonMapper.toOrm(person));
            return Result.ok(person);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save person"));
        }
    }

    public async update(person: Person): Promise<Result<Person>> {
        try {
            const { id, ...columns } = PersonMapper.toOrm(person);
            const result = await this.orm.update({ id }, columns);
            if (!result.affected) {
                return Result.fail(new NotFoundError("Person not found"));
            }
            return Result.ok(person);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update person"));
        }
    }

    public async search(
        filters: PersonPaginationFilters, 
        options: PaginationOptions
    ): Promise<Result<PaginationResult<Person>>> {
        try {
            const page = Math.max(1, Math.floor(options.page));
            const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(options.limit)));

            const queryBuilder = this.orm.createQueryBuilder('p');

            if (filters.gender) {
                queryBuilder.andWhere('p.gender = :gender', { gender: filters.gender });
            }

            if (filters.phoneNumber) {
                queryBuilder.andWhere('p.phoneNumber = :phoneNumber', { phoneNumber: filters.phoneNumber });
            }

            // exact matches, ignoring case: "lagos", "LAGOS" and "Lagos" all work
            if (filters.country?.trim()) {
                queryBuilder.andWhere('LOWER(p.country) = LOWER(:country)', { country: filters.country.trim() });
            }

            if (filters.state?.trim()) {
                queryBuilder.andWhere('LOWER(p.state) = LOWER(:state)', { state: filters.state.trim() });
            }

            if (filters.city?.trim()) {
                queryBuilder.andWhere('LOWER(p.city) = LOWER(:city)', { city: filters.city.trim() });
            }

            if (filters.tier) {
                queryBuilder.andWhere('p.tier = :tier', { tier: filters.tier });
            }

            if (filters.dob) {
                const dobString = `${filters.dob.year}-${filters.dob.month}-${filters.dob.day}`;
                queryBuilder.andWhere('p.dob = :dob', { dob: dobString });
            }

            if (filters.searchQuery?.trim()) {
                // case-insensitive partial match; escape LIKE wildcards so "%" or "_" are searched literally
                const escaped = filters.searchQuery.trim().replace(/[\\%_]/g, (c) => `\\${c}`);
                queryBuilder.andWhere(
                    new Brackets((b) =>
                        b
                            .where('p.firstName ILIKE :q', { q: `%${escaped}%` })
                            .orWhere('p.lastName ILIKE :q')
                            .orWhere('p.middleName ILIKE :q')
                            .orWhere('p.email ILIKE :q')
                            .orWhere('p.phoneNumber ILIKE :q')
                    ),
                );
            }

            const sortColumn = SORTABLE_COLUMNS[options.sortBy ?? ''] ?? SORTABLE_COLUMNS.createdAt;
            // the request allows "asc"/"desc" in any case, so compare upper-cased
            queryBuilder.orderBy(sortColumn, options.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC")
                .addOrderBy('p.id', 'ASC') // stable order so pages never overlap
                .skip((page - 1) * limit)
                .take(limit);

            const [rows, total] = await queryBuilder.getManyAndCount();

            return Result.ok({
                data: rows.map(PersonMapper.toDomain),
                total,
                limit,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            return Result.fail(translateDBErrors(error, "search persons"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<Person>> {
        try {
            const row = await this.orm.findOneBy({ id: id.value });
            if (!row) {
                return Result.fail(new NotFoundError("Person not found"));
            }
            return Result.ok(PersonMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get person by id"));
        }
    }
}