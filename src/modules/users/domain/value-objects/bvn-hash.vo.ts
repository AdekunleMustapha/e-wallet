import { Result } from "src/shared/domain/result";
import { ValidationError } from "src/shared/domain/errors";

/**
 * BVN hash is a validator that ensures the
 * hashed bvn is up to 64 characters
 */
export class BVNHash {
    private readonly _hash: string;

    constructor(value: string) {
        this._hash = value;
    }

    public static create(raw: string): Result<BVNHash> {
        const hash = raw.trim();
        if(!/^[a-f0-9]{64}$/.test(hash)) return Result.fail(new ValidationError("Invalid bvn hash"));
        return Result.ok(new BVNHash(hash));
    }

    public equals(anotherHash: BVNHash): boolean {
        return this._hash === anotherHash.hash;
    }

    get hash(): string {
        return this._hash;
    }
}