import { Document } from "../../domain/entities"
import { DocumentTypeOutput } from "./document-type.output"

export type DocumentOutput = {
    id: string,
    personId: string,
    documentType: DocumentTypeOutput,
    name: string,
    link: string,
    verified: boolean,
    createdAt: Date,
    updatedAt: Date
}

export function toDocumentOutput(
    document: Document, 
    documentType: DocumentTypeOutput
): DocumentOutput {
    return {
        id: document.id.value,
        personId: document.personId.value,
        documentType,
        name: document.documentName,
        link: document.documentLink,
        verified: document.verified,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt 
    }
}