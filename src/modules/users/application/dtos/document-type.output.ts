import { DocumentType } from "../../domain/entities"

export type DocumentTypeOutput = {
    id: string,
    name: string
}

export function toDocumentType(documentType: DocumentType): DocumentTypeOutput {
    return {
        id: documentType.id.value,
        name: documentType.documentTypeName
    }
}