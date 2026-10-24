import { Injectable } from "@nestjs/common";
import { DocumentPaginationFilters, IDocumentRepository, PaginationOptions, PaginationResult } from "src/modules/users/domain/repository";
import { DocumentOrmEntity } from "../orm-entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Document } from "src/modules/users/domain/entities";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { translateDBErrors } from "src/infrastructure/database/translate-db-error";
import { DocumentMapper } from "src/modules/users/application/mappers";
import { NotFoundError } from "src/shared/domain/errors";

@Injectable()
export class DocumentTypeOrmRepository implements IDocumentRepository {

    constructor(
        @InjectRepository(DocumentOrmEntity)
        private readonly orm: Repository<DocumentOrmEntity>
    ){}

    public async save(doc: Document): Promise<Result<Document>> {
        try {
            await this.orm.insert(DocumentMapper.toOrm(doc));
            return Result.ok(doc);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "save document"));
        }
    }

    public async update(doc: Document): Promise<Result<Document>> {
        try {
            const {id, ...columns} = DocumentMapper.toOrm(doc);
            const result = await this.orm.update({id}, columns);
            if(!result.affected) {
                return Result.fail(new NotFoundError("Document not found"));
            }
            return Result.ok(doc);
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update document"));
        }
    }

    public async getById(id: UniqueId): Promise<Result<Document>> {
        try {
            const row = await this.orm.findOneBy({id: id.value});
            if(!row) {
                return Result.fail(new NotFoundError("Document not found"));
            }
            return Result.ok(DocumentMapper.toDomain(row));
        } catch (error) {
            return Result.fail(translateDBErrors(error, "update document"));
        }
    }

    public async delete(id: UniqueId): Promise<Result<void>> {
        try {
            const result = await this.orm.delete({id: id.value});
            if(!result.affected) {
                return Result.fail(new NotFoundError("Document not found"));
            }
            return Result.ok();
        } catch (error) {
            return Result.fail(translateDBErrors(error, "delete document"));
        }
    }

    public async search(
        filters: DocumentPaginationFilters, 
        options: PaginationOptions
    ): Promise<Result<PaginationResult<Document>>> {
        try {

        } catch (error) {
            return Result.fail(translateDBErrors(error, "search document"));
        } 
    }
}