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

const SORTABLE_COLUMNS: Record<string, string> = {
    createdAt: "d.createdAt",
    documentName: "d.documentName",
    documentType: "d.documentType",
    personId: "d.personId",
    verifies: "d.verifies"
}

const MAX_PAGE_SIZE = 100;

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
            const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, options.limit));
            const page = Math.max(1, options.page);

            const queryBuilder = this.orm.createQueryBuilder();

            if(filters.documentName) {
                queryBuilder.andWhere("d.documentName = :documentName", {documentName: filters.documentName});
            }

            if(filters.documentType) {
                queryBuilder.andWhere("d.documentType = :documentType", {documentType: filters.documentType});
            }

            if(filters.personId) {
                queryBuilder.andWhere("d.personId = :personId", {personId: filters.personId});
            }

            if(filters.verifies) {
                queryBuilder.andWhere("d.verifies = :verifies", {verifies: filters.verifies});
            }

            const sortColumn = SORTABLE_COLUMNS[options.sortBy ?? ''] ?? SORTABLE_COLUMNS.createdAt;
            queryBuilder.orderBy(sortColumn, options.sortOrder === "ASC"? "ASC" : "DESC")
                .skip((page - 1) * limit)
                .take(limit);

            const [rows, total] = await queryBuilder.getManyAndCount();
            return Result.ok({
                data: rows.map(DocumentMapper.toDomain),
                total,
                limit,
                page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            return Result.fail(translateDBErrors(error, "search document"));
        }
    }
}