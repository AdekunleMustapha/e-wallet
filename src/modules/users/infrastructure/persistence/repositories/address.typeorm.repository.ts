import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressPaginationFilters, IAddressRepository, PaginationOptions, PaginationResult } from "src/modules/users/domain/repository";
import { AddressOrmEntity } from "../orm-entities";
import { Repository } from "typeorm";
import { Address } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { AddressMapper } from "src/modules/users/application/mappers";
import { NotFoundError } from "src/shared/domain/errors";

const SORTABLE_COLUMNS: Record<string, string> = {
    createdAt: "s.createdAt",
    countryId: "s.countryId",
    buildingCode: "s.buildingCode",
    city: "s.city",
    flatCode: "s.flatCode",
    postalCode: "s.postalCode",
    state: "s.state",
    streetName: "s.streetName"
}

const MAX_PAGE_SIZE = 100;

@Injectable()
export class AddressTypeOrmRepository implements IAddressRepository {

    constructor(
        @InjectRepository(AddressOrmEntity)
        private readonly orm: Repository<AddressOrmEntity>
    ){}

    public async save(address: Address): Promise<Result<Address>> {
        try {
            await this.orm.insert(AddressMapper.toOrm(address));
            return Result.ok(address);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save address"));
        }
    }

    public async update(address: Address): Promise<Result<Address>> {
        try {
            const {id, ...columns} = AddressMapper.toOrm(address);
            const result = await this.orm.update({id}, columns);
            if(!result.affected) {
                return Result.fail(new NotFoundError("Address not found"));
            }
            return Result.ok(address);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update address"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<Address>> {
        try {
            const row = await this.orm.findOneBy({id: id.value});
            if(!row) {
                return Result.fail(new NotFoundError("Address not found"));
            }
            return Result.ok(AddressMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get address by id"));
        }
    }

    public async search(
        filters: AddressPaginationFilters, 
        options: PaginationOptions
    ): Promise<Result<PaginationResult<Address>>> {
        try {
            const page = Math.max(1, options.page);
            const limit = Math.min(MAX_PAGE_SIZE, Math.max(Math.floor(options.limit), 1));

            const queryBuilder = this.orm.createQueryBuilder('s');

            if(filters.countryId) {
                queryBuilder.andWhere('s.countryId = :countryId', {countryId: filters.countryId});
            }

            if(filters.buildingCode) {
                queryBuilder.andWhere('s.buildingCode = :buildingCode', {buildingCode: filters.buildingCode})
            }

            if(filters.city) {
                queryBuilder.andWhere('s.city = :city', {city: filters.city});
            }

            if(filters.flatCode) {
                queryBuilder.andWhere('s.flatCode = :flatCode', {flatCode: filters.flatCode});
            }

            if(filters.postalCode) {
                queryBuilder.andWhere('s.postalCode = :postalCode', {postalCode: filters.postalCode});
            }

            if(filters.state) {
                queryBuilder.andWhere('s.state = :state', {state: filters.state});
            }

            if(filters.streetName) {
                queryBuilder.andWhere('s.streetName = :streetName', {streetName: filters.streetName});
            }

            const sortColumn = SORTABLE_COLUMNS[options.sortBy ?? ''] ?? SORTABLE_COLUMNS.createdAt;
            queryBuilder.orderBy(sortColumn, options.sortOrder === "ASC"? "ASC" : "DESC")
                .skip((page - 1) * limit)
                .take(limit);

            const [rows, total] = await queryBuilder.getManyAndCount();

            return Result.ok(({
                data: rows.map(AddressMapper.toDomain),
                total,
                limit,
                page,
                totalPages: Math.ceil(total / limit)
            }));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "search address"));
        } 
    }
}