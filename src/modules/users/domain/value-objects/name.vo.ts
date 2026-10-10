import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

/**
 * Name value object, handles validation of name 
 * which ensure within 1-255 characters
 */
export class Name {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    };

    public static create(value: string): Result<Name> {
        if(value.trim().length === 0) return Result.fail(new ValidationError("Name can't be empty"));
        if(value.trim().length > 255 || value.trim().length < 1) {
            return Result.fail(new ValidationError("Name must be between 2 and 255 characters"));
        }
        return Result.ok(new Name(value.trim()));
    }

    get name(): string {
        return this._value;
    }
}