import { UniqueId } from "src/shared/domain/unique-id";
import { BVNHash, Email, NINHash, Name } from "../value-objects";

type UserProps = {
    id?: UniqueId,
    firstName: Name,
    lastName: Name,
    email:Email,
    addressId?: UniqueId,
    ninHash?: NINHash,
    bvnHash?: BVNHash,
    documentId?: UniqueId,
    createdAt?: Date,
    updatedAt?: Date
}