import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CountryPaginationFilters, ICountryRepository } from "src/modules/users/domain/repository";
import { CountryOrmEntity } from "../orm-entities";
import { Repository } from "typeorm";
import { Country } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { CountryMapper } from "src/modules/users/application/mappers";
import { NotFoundError } from "src/shared/domain/errors";

@Injectable()
export class CountryTypeOrmRepository implements ICountryRepository {

    constructor(
        @InjectRepository(CountryOrmEntity)
        private readonly orm: Repository<CountryOrmEntity>
    ){}

    public async save(country: Country): Promise<Result<Country>> {
        try {
            await this.orm.insert(CountryMapper.toOrm(country));
            return Result.ok(country);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save country"));
        }
    }

    public async update(country: Country): Promise<Result<Country>> {
        try {
            const {id, ...columns} = CountryMapper.toOrm(country);
            const result = await this.orm.update({id}, columns);
            if(!result.affected) {
                return Result.fail(new NotFoundError("Country not found"));
            }
            return Result.ok(country);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update country"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<Country>> {
        try {
            const row = await this.orm.findOneBy({id: id.value});
            if(!row) {
                return Result.fail(new NotFoundError("Country not found"));
            }
            return Result.ok(CountryMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get country by id"));
        }
    }

    public async delete(id: UniqueId): Promise<Result<void>> {
        try {
            const result = await this.orm.delete({id: id.value});
            if(!result) {
                return Result.fail(new NotFoundError("Country not found"));
            }
            return Result.ok();
        } catch (error) {
            return Result.fail(translateDBErrors(error, "delete country"));
        }
    }

    public async search(filters: CountryPaginationFilters): Promise<Result<Country[]>> {
        try {

        } catch (error) {
            return Result.fail(translateDBErrors(error, "search country"));
        }
    }
}