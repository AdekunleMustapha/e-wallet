import { Result } from "src/shared/domain/result";
import { Document } from "../entities";
import { UniqueId } from "src/shared/domain/unique-id";
import { PaginationOptions, PaginationResult } from "./person.repository.interface";

export interface DocumentPaginationFilters {
    personId?: UniqueId,
    documentType?: UniqueId,
    documentName?: string,
    verifies?: boolean
}

export interface IDocumentRepository {

    save(doc: Document): Promise<Result<Document>>;

    update(doc: Document): Promise<Result<Document>>;

    getById(id: UniqueId): Promise<Result<Document>>;

    search(
        filters: DocumentPaginationFilters,
        options: PaginationOptions
    ): Promise<Result<PaginationResult<Document>>>;

    delete(id: UniqueId): Promise<Result<void>>;
}