import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

/**
 * NIN hash value object that validates and checks if the
 * raw hash is indeed 64 characters hash value string
 */
export class NINHash {
    private readonly _hash: string;

    constructor(hash: string) {
        this._hash = hash;
    }

    public static create(raw: string): Result<NINHash> {
        const hash = raw.trim();
        if(!/^[a-f0-9]{64}$/.test(hash)) return Result.fail(new ValidationError("Incorrect hash"));
        return Result.ok(new NINHash(hash));
    }

    get hash(): string {
        return this._hash;
    }

    public equals(otherHash: NINHash): boolean {
        return this._hash === otherHash.hash;
    }
}