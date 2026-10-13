import { UniqueId } from "src/shared/domain/unique-id";
import { BVNHash, Email, NINHash, Name } from "../value-objects";
import { DOB } from "../value-objects/dob.vo";
import { BaseEntity } from "src/shared/domain/base-entity";

type PersonProps = {
    id?: UniqueId,
    firstName: Name,
    lastName: Name,
    dob: DOB,
    email: Email,
    genderId: UniqueId,
    addressId?: UniqueId,
    ninHash?: NINHash,
    bvnHash?: BVNHash,
    createdAt?: Date,
    updatedAt?: Date
}

/**
 * Person Entity meant to reflect business logic of 
 * what is expected of person row data as well as representing what we
 * have in db. 
 * 
 * A person entity represents the data of our customers that we have
 * Each data they give, both mandatory and non-mandatory data they give
 * which equals the eligibility they have opening different forms of accounts
 */
export class Person extends BaseEntity {
    private _firstName: Name;
    private _lastName: Name;
    private _dob: DOB;
    private _email: Email;
    private _genderId: UniqueId;
    private _addressId: UniqueId | undefined;
    private _ninHash: NINHash | undefined;
    private _bvnHash: BVNHash | undefined;

    private constructor(props: PersonProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
        this._firstName = props.firstName;
        this._lastName = props.lastName;
        this._dob = props.dob;
        this._email = props.email;
        this._genderId = props.genderId;
        this._addressId = props.addressId;
        this._ninHash = props.ninHash;
        this._bvnHash = props.bvnHash;
    }
}