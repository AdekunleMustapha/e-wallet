import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

/**
 * BVN value object that checks bvn is indeed 11 digits
 */
export class BVN {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    public static create(raw: string): Result<BVN> {
        const bvn = raw.trim();
        if(!/^\d{11}$/.test(bvn)) return Result.fail(new ValidationError("BVN must be 11 digits"));
        return Result.ok(new BVN(bvn));
    }

    get unwrap(): string {
        return this._value;
    }

    get toString(): string {
        return "***********";
    }

    get toJSON(): string {
        return "***********";
    }
}