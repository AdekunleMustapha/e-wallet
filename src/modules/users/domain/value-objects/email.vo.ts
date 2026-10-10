import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

/**
 * Email validator value object
 */
export class Email {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    public static create(raw: string): Result<Email> {
        const email = raw.trim();
        if(email.length === 0) return Result.fail(new ValidationError("Email can't be empty"));
        if(email.length > 255) return Result.fail(new ValidationError("Max email character length is 255"));
        return Result.ok(new Email(email));
    }

    get value(): string {
        return this._value;
    }
}