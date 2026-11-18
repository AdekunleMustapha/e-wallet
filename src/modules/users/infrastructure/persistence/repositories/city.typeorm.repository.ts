import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CityPaginationFilters, ICityRepository, PaginationOptions, PaginationResult } from "src/modules/users/domain/repository";
import { CityOrmEntity } from "../orm-entities";
import { Repository } from "typeorm";
import { City } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { NotFoundError } from "src/shared/domain/errors";
import { CityMapper } from "src/modules/users/application/mappers";

const SORTABLE_COLUMNS: Record<string, string> = {
    city: "c.city",
    state: "c.state",
    country: "c.country",
    createdAt: "c.createdAt",
};

const MAX_PAGE_SIZE = 100;

@Injectable()
export class CityTypeOrmRepository implements ICityRepository {

    constructor(
        @InjectRepository(CityOrmEntity)
        private readonly orm: Repository<CityOrmEntity>
    ) {}

    public async save(city: City): Promise<Result<City>> {
        try {
            await this.orm.insert(CityMapper.toOrm(city));
            return Result.ok(city);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save city"));
        } 
    }

    public async update(city: City): Promise<Result<City>> {
        try {
            const { id, ...columns } = CityMapper.toOrm(city);
            const result = await this.orm.update({ id }, columns);
            if (!result.affected) {
                return Result.fail(new NotFoundError("City not found"));
            }
            return Result.ok(city);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update city"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<City>> {
        try {
            const row = await this.orm.findOneBy({ id: id.value });
            if (!row) {
                return Result.fail(new NotFoundError("City not found"));
            }
            return Result.ok(CityMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get city by id"));
        }
    }

    public async search(filters: CityPaginationFilters, options: PaginationOptions): Promise<Result<PaginationResult<City>>> {
        try {
            const page = Math.max(1, Math.floor(options.page || 1));
            const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(options.limit || 20)));

            const queryBuilder = this.orm.createQueryBuilder('c');

            // partial match, ignoring case: "ike" finds "Ikeja"
            if (filters.city?.trim()) {
                // escape LIKE wildcards so a user typing "%" or "_" searches for those characters
                const escaped = filters.city.trim().replace(/[\\%_]/g, (c) => `\\${c}`);
                queryBuilder.andWhere('c.city ILIKE :city', { city: `%${escaped}%` });
            }

            // exact match, ignoring case: "lagos", "LAGOS" and "Lagos" all work
            if (filters.state?.trim()) {
                queryBuilder.andWhere('LOWER(c.state) = LOWER(:state)', { state: filters.state.trim() });
            }

            if (filters.country?.trim()) {
                queryBuilder.andWhere('LOWER(c.country) = LOWER(:country)', { country: filters.country.trim() });
            }

            const sortColumn = SORTABLE_COLUMNS[options.sortBy ?? ''] ?? SORTABLE_COLUMNS.city;
            // the request allows "asc"/"desc" in any case, so compare upper-cased
            queryBuilder.orderBy(sortColumn, options.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC")
                .addOrderBy('c.id', 'ASC') // stable order so pages never overlap
                .skip((page - 1) * limit)
                .take(limit);

            const [rows, total] = await queryBuilder.getManyAndCount();

            return Result.ok({
                data: rows.map(CityMapper.toDomain),
                total,
                limit,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            return Result.fail(translateDBErrors(error, "search city"));
        }
    }
}