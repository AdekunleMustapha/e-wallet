import { UniqueId } from "src/shared/domain/unique-id";
import { BVNHash, Email, NINHash, Name, PasswordHash, PhoneNumber } from "../value-objects";
import { DOB } from "../value-objects/dob.vo";
import { BaseEntity } from "src/shared/domain/base-entity";
import { Result } from "src/shared/domain/result";
import { ConflictError, ValidationError } from "src/shared/domain/errors";
import { Country, Gender, Tier } from "../enums";

type PersonProps = {
    id?: UniqueId;
    firstName: Name;
    lastName: Name;
    middleName?: Name;
    dob: DOB;
    email: Email;
    gender: Gender;
    phoneNumber: PhoneNumber;
    country: Country;
    state: string;
    city: string;
    addressLine1: string;
    postalCode?: string;
    tier: Tier;
    passwordHash: PasswordHash;
    ninHash?: NINHash;
    bvnHash?: BVNHash;
    createdAt?: Date;
    updatedAt?: Date;
};

/**
 * Person Entity meant to reflect business logic of 
 * what is expected of person row data as well as representing what we
 * have in db. 
 * 
 * A person entity represents the data of our customers that we have.
 * Each data they give, both mandatory and non-mandatory data,
 * equals the eligibility they have opening different forms of accounts.
 */
export class Person extends BaseEntity {
    private _firstName: Name;
    private _lastName: Name;
    private _middleName?: Name;
    private _dob: DOB;
    private _email: Email;
    private _gender: Gender;
    private _phoneNumber: PhoneNumber;
    private _country: Country;
    private _state: string;
    private _city: string;
    private _addressLine1: string;
    private _postalCode?: string;
    private _tier: Tier;
    private _passwordHash: PasswordHash;
    private _ninHash: NINHash | undefined;
    private _bvnHash: BVNHash | undefined;

    private constructor(props: PersonProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
        this._firstName = props.firstName;
        this._lastName = props.lastName;
        this._middleName = props.middleName;
        this._dob = props.dob;
        this._email = props.email;
        this._gender = props.gender;
        this._phoneNumber = props.phoneNumber;
        this._country = props.country;
        this._state = props.state;
        this._city = props.city;
        this._addressLine1 = props.addressLine1;
        this._postalCode = props.postalCode;
        this._tier = props.tier;
        this._passwordHash = props.passwordHash;
        this._ninHash = props.ninHash;
        this._bvnHash = props.bvnHash;
    }

    /**
     * Business creation: a brand-new person. Id and timestamps are generated.
     * Tier defaults to Tier 1 if not specified.
     */
    public static create(
        props: Omit<PersonProps, 'id' | 'createdAt' | 'updatedAt' | 'tier'> & { tier?: Tier }
    ): Person {
        return new Person({
            ...props,
            tier: props.tier ?? Tier.TIER_ONE,
        });
    }

    /**
     * Rebuild from stored data (used by the persistence mapper only).
     * Keeps the stored id and timestamps.
     */
    public static reconstitute(props: PersonProps): Person {
        return new Person(props);
    }

    public linkNin(ninHash: NINHash): Result<void> {
        const existingNin = this._ninHash;
        if (existingNin) {
            return Result.fail(new ConflictError("NIN already linked for this user"));
        }
        this._ninHash = ninHash;
        this.updateTimestamp();
        return Result.ok();
    }

    public linkBvn(bvnHash: BVNHash): Result<void> {
        const existingBvn = this._bvnHash;
        if (existingBvn) {
            return Result.fail(new ConflictError("BVN already linked for this user"));
        }
        this._bvnHash = bvnHash;
        this.updateTimestamp();
        return Result.ok();
    }

    public upgradeTier(newTier: Tier): Result<void> {
        if (this._tier > newTier) {
            return Result.fail(new ValidationError("Can't down grade user tier"));
        }
        this._tier = newTier;
        this.updateTimestamp();
        return Result.ok();
    }

    public changePassword(newHash: PasswordHash): Result<void> {
        if (this._passwordHash.compareHash(newHash.hash)) {
            return Result.fail(new ConflictError("New password can't be the same with previous password"));
        }
        this._passwordHash = newHash;
        this.updateTimestamp();
        return Result.ok();
    } 

    /**
     * Used internally for correcting user data from third party identifiers
     */
    public update(props: {
        firstName?: Name;
        lastName?: Name;
        middleName?: Name;
        dob?: DOB;
        phoneNumber?: PhoneNumber;
        gender?: Gender;
        country?: Country;
        state?: string;
        city?: string;
        addressLine1?: string;
        postalCode?: string;
    }): Result<void> {
        if (props.firstName) this._firstName = props.firstName;
        if (props.lastName) this._lastName = props.lastName;
        if (props.middleName !== undefined) this._middleName = props.middleName;
        if (props.dob) this._dob = props.dob;
        if (props.phoneNumber) this._phoneNumber = props.phoneNumber;
        if (props.gender) this._gender = props.gender;
        if (props.country) this._country = props.country;
        if (props.state) this._state = props.state;
        if (props.city) this._city = props.city;
        if (props.addressLine1) this._addressLine1 = props.addressLine1;
        if (props.postalCode !== undefined) this._postalCode = props.postalCode;
        this.updateTimestamp();
        return Result.ok();
    }

    get firstName(): Name { return this._firstName; }
    get lastName(): Name { return this._lastName; }
    get middleName(): Name | undefined { return this._middleName; }
    get dob(): DOB { return this._dob; }
    get email(): Email { return this._email; }
    get gender(): Gender { return this._gender; }
    get phoneNumber(): PhoneNumber { return this._phoneNumber; }
    get country(): Country { return this._country; }
    get state(): string { return this._state; }
    get city(): string { return this._city; }
    get addressLine1(): string { return this._addressLine1; }
    get postalCode(): string | undefined { return this._postalCode; }
    get tier(): Tier { return this._tier; }
    get passwordHash(): PasswordHash { return this._passwordHash; }
    get ninHash(): NINHash | undefined { return this._ninHash; }
    get bvnHash(): BVNHash | undefined { return this._bvnHash; }
}
