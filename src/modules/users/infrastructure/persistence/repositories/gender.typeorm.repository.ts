import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IGenderRepository } from "src/modules/users/domain/repository";
import { GenderOrmEntity } from "../orm-entities";
import { Repository } from "typeorm";
import { Gender } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { GenderMapper } from "src/modules/users/application/mappers";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { NotFoundError } from "src/shared/domain/errors";

/**
 * Adapter: implements the domain's IGenderRepository using TypeORM + MySQL.
 * Nothing outside this file (and its mapper / ORM entity) knows TypeORM exists.
 */
@Injectable()
export class GenderTypeOrmRepository implements IGenderRepository {

    constructor(
        @InjectRepository(GenderOrmEntity) 
        private readonly orm: Repository<GenderOrmEntity>
    ){}

    public async save(gender: Gender): Promise<Result<Gender>> {
        try {
            await this.orm.insert(GenderMapper.toOrm(gender));
            return Result.ok(gender);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save gender"));
        }
    }

    public async update(gender: Gender): Promise<Result<Gender>> {
        try {
            const {id, ...columns} = GenderMapper.toOrm(gender);
            const result = await this.orm.update({ id }, columns);
            if(!result.affected) {
                return Result.fail(new NotFoundError("Gender not found"));
            }
            return Result.ok(gender);
        } catch(error) {
            return Result.fail(translateDBErrors(error, "update gender"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<Gender>> {
        try {
            const row = await this.orm.findOneBy({id: id.value});
            if(!row) {
                return Result.fail(new NotFoundError("Gender not found"));
            }
            return Result.ok(GenderMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get gender by id"));
        }
    }

    public async getAll(): Promise<Result<Gender[]>> {
        try {
            const rows = await this.orm.find({order: { genderName: "ASC"}});
            return Result.ok(rows.map(GenderMapper.toDomain));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get all genders"));
        }
    }

    public async delete(id: UniqueId): Promise<Result<void>> {
        try {
            const result = await this.orm.delete({id: id.value});
            if(!result.affected) {
                return Result.fail(new NotFoundError("Gender not found"));
            }
            return Result.ok();
        } catch (error) {
            return Result.fail(translateDBErrors(error, "delete gender"));
        }
    }
}