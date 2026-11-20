import { DocumentType } from "../../domain/entities"

export type DocumentTypeOutput = {
    id: string,
    documentName: string
}

export function toDocumentTypeOutput(documentType: DocumentType): DocumentTypeOutput {
    return {
        id: documentType.id.value,
        documentName: documentType.documentTypeName
    }
}