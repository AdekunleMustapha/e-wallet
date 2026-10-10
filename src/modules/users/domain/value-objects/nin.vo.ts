import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

/**
 * NIN vo that checks if nin is 11 digits and can either 
 * unwrap or send wrapped data
 */
export class NIN {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
    }

    public static create(raw: string): Result<NIN> {
        const value = raw.trim();
        if(!/^\d{11}$/.test(value)) return Result.fail(new ValidationError("Nin must be 11 digits"));
        return Result.ok(new NIN(value));
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