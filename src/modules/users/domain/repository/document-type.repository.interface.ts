import { Result } from "src/shared/domain/result";
import { DocumentType } from "../entities";
import { UniqueId } from "src/shared/domain/unique-id";

export interface IDocumentTypeRepository {

    save(type: DocumentType): Promise<Result<DocumentType>>;

    update(type: DocumentType): Promise<Result<DocumentType>>;

    getById(id: UniqueId): Promise<Result<DocumentType>>;

    getAll(): Promise<Result<DocumentType[]>>;

    delete(id: UniqueId): Promise<Result<void>>;
}