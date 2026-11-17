import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

export class Password {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    public static create(raw: string): Result<Password> {
        const value = raw.trim();

        if (value.length < 8 || value.length > 64) return Result.fail(new ValidationError("Password must be 8-64 characters"));
        if (!/[a-z]/.test(value)) return Result.fail(new ValidationError("Password needs a lowercase letter"));
        if (!/[A-Z]/.test(value)) return Result.fail(new ValidationError("Password needs an uppercase letter"));
        if (!/[^A-Za-z0-9]/.test(value)) return Result.fail(new ValidationError("Password needs a special character"));

        return Result.ok(new Password(value));
    }

    get value(): string {
        return this._value;
    }
}