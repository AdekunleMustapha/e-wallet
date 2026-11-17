import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

export class PasswordHash {
    private readonly _hash: string;

    constructor(hash: string) {
        this._hash = hash;
    }

    public static create(value: string): Result<PasswordHash> {
        const hash = value.trim();
        if(!/^[a-f0-9]{64}$/.test(hash)) return Result.fail(new ValidationError("Incorrect hash"));
        return Result.ok(new PasswordHash(hash));
    }

    get hash(): string {
        return this._hash;
    }

    public compareHash(otherHash: string): boolean {
        return this._hash === otherHash;
    }
}