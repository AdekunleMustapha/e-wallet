import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DocumentTypeOrmEntity } from "../orm-entities";
import { Repository } from "typeorm";
import { IDocumentTypeRepository } from "src/modules/users/domain/repository";
import { DocumentType } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { DocumentTypeMapper } from "src/modules/users/application/mappers";
import { NotFoundError } from "src/shared/domain/errors";

@Injectable()
export class DocumentTypeTypeOrmRepository implements IDocumentTypeRepository {

    constructor(
        @InjectRepository(DocumentTypeOrmEntity)
        private readonly orm: Repository<DocumentTypeOrmEntity>
    ){}

    public async save(type: DocumentType): Promise<Result<DocumentType>> {
        try {
            await this.orm.insert(DocumentTypeMapper.toOrm(type));
            return Result.ok(type);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save document type"));
        }
    }

    public async update(type: DocumentType): Promise<Result<DocumentType>> {
        try {
            const {id, ...columns} = DocumentTypeMapper.toOrm(type);
            const result = await this.orm.update({id}, columns);
            if(!result.affected) {
                return Result.fail(new NotFoundError("Document type not found"));
            }
            return Result.ok(type);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update document type"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<DocumentType>> {
        try {
            const row = await this.orm.findOneBy({id: id.value});
            if(!row) {
                return Result.fail(new NotFoundError("Document type not found"));
            }
            return Result.ok(DocumentTypeMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get document type by id"));
        }
    }

    public async getAll(): Promise<Result<DocumentType[]>> {
        try {
            const rows = await this.orm.find({order: {createdAt: "ASC"}});
            return Result.ok(rows.map(DocumentTypeMapper.toDomain));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "get all document type"));
        }
    }

    public async delete(id: UniqueId): Promise<Result<void>> {
        try {
            const result = await this.orm.delete({id: id.value});
            if(!result.affected) {
                return Result.fail(new NotFoundError("Document type not found"));
            }
            return Result.ok();
        } catch (error) {
            return Result.fail(translateDBErrors(error, "delete document type"));
        }
    }
}