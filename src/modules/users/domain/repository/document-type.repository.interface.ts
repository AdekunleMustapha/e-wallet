import { Result } from "src/shared/domain/result";
import { DocumentType } from "../entities";
import { UniqueId } from "src/shared/domain/unique-id";

export const DOCUMENT_TYPE_REPOSITORY = Symbol("DOCUMENT_TYPE_REPOSITORY");
export interface IDocumentTypeRepository {

    save(type: DocumentType): Promise<Result<DocumentType>>;

    update(type: DocumentType): Promise<Result<DocumentType>>;

    getById(id: UniqueId): Promise<Result<DocumentType>>;

    getAll(): Promise<Result<DocumentType[]>>;

    delete(id: UniqueId): Promise<Result<void>>;
}