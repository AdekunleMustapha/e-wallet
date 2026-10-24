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

        } catch (error) {
            return Result.fail(translateDBErrors(error, "search address"));
        } 
    }
}