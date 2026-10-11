import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

/**
 * Date of Birth value object for validation
 */
export class DOB {
    private readonly _value: Date

    private constructor(value: Date) {
        this._value = value;
    }

    public static create(raw: {year: string, month: string, day: string}): Result<DOB> {
        const {year, month, day} = raw;
        if(!year.length || !month.length || !day.length){
            return Result.fail(new ValidationError("Can't pass in empty date"));
        }
        if(!/^\d{4}$/.test(year)) return Result.fail(new ValidationError("Invalid year"));
        if(!/^\d{2}$/.test(month)) return Result.fail(new ValidationError("Invalid month"));
        if(!/^\d{2}$/.test(day)) return Result.fail(new ValidationError("Invalid day"));

        // the T00:00:00 fixes the local time issue for js servers in different UTC places, needs to be done better
        return Result.ok(new DOB(new Date(`${year}-${month}-${day}T00:00:00`)));
    }
}