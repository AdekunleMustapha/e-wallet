import { UniqueId } from "src/shared/domain/unique-id";
import { BVNHash, Email, NINHash, Name } from "../value-objects";
import { DOB } from "../value-objects/dob.vo";

type UserProps = {
    id?: UniqueId,
    firstName: Name,
    lastName: Name,
    dob: DOB,
    email: Email,
    genderId: UniqueId,
    addressId?: UniqueId,
    ninHash?: NINHash,
    bvnHash?: BVNHash,
    documentId?: UniqueId,
    createdAt?: Date,
    updatedAt?: Date
}