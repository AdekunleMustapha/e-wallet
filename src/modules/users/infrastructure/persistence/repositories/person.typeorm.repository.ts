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
    lastName: "p.lastName"
}

const MAX_PAGE_SIZE = 100;

@Injectable()
export class PersonTypeOrmEntity implements IPersonRepository {

    constructor(
        @InjectRepository(PersonOrmEntity)
        private readonly orm: Repository<PersonOrmEntity>
    ){}

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
            const {id, ...columns} = PersonMapper.toOrm(person);
            const result = await this.orm.update({id}, columns);
            if(!result.affected) {
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

            if(filters.genderId) {
                queryBuilder.andWhere('p.genderId = :genderId', {genderId: filters.genderId});
            }

            if(filters.addressId) {
                queryBuilder.andWhere("p.addressId = :addressId", {addressId: filters.addressId});
            }

            if(filters.dob) {
                queryBuilder.andWhere("p.dob = :dob", {dob: filters.dob});
            }

            if(filters.searchQuery?.trim()) {
                // escape LIKE wildcards so a user typing "%" or "_" searches for those characters
                const escaped = filters.searchQuery.trim().replace(/[\\%_]/g, (c) => `\\${c}`);
                queryBuilder.andWhere(
                    new Brackets((b) =>
                        b
                            .where('p.firstName LIKE :q', {q: `%${escaped}%`})
                            .orWhere('p.lastName LIKE :q')
                            .orWhere('p.email LIKE :q')
                    ),
                );
            }

            const sortColumn = SORTABLE_COLUMNS[options.sortBy ?? ''] ?? SORTABLE_COLUMNS.createdAt;
            queryBuilder.orderBy(sortColumn, options.sortOrder === "ASC"? "ASC" : "DESC")
                .skip((page - 1) * limit)
                .take(limit)

            const [rows, total] = await queryBuilder.getManyAndCount();

            return Result.ok({
                data: rows.map(PersonMapper.toDomain),
                total,
                limit,
                page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            return Result.fail(translateDBErrors(error, "search persons"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<Person>> {
        try {
            const row = await this.orm.findOneBy({id: id.value});
            if(!row) {
                return Result.fail(new NotFoundError("Person not found"));
            }
            return Result.ok(PersonMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get person by id"));
        }
    }
}