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

    public static create(raw: { year: string, month: string, day: string }): Result<DOB> {
        const { year, month, day } = raw;
        if (!year.length || !month.length || !day.length) {
            return Result.fail(new ValidationError("Can't pass in empty date"));
        }
        if (!/^\d{4}$/.test(year)) return Result.fail(new ValidationError("Invalid year"));
        if (!/^\d{2}$/.test(month)) return Result.fail(new ValidationError("Invalid month"));
        if (!/^\d{2}$/.test(day)) return Result.fail(new ValidationError("Invalid day"));

        const y = Number(year);
        const m = Number(month);
        const d = Number(day);

        if (m < 1 || m > 12) return Result.fail(new ValidationError("Month must be between 01 and 12"));
        if (d < 1 || d > 31) return Result.fail(new ValidationError("Day must be between 01 and 31"));

        // days in this month; day 0 of the next month = last day of this month (handles leap years)
        const daysInMonth = new Date(y, m, 0).getDate();
        if (d > daysInMonth) {
            return Result.fail(new ValidationError(`Day must be between 01 and ${daysInMonth} for month ${month} of ${year}`));
        }

        const date = new Date(y, m - 1, d); // local midnight, same as before
        date.setFullYear(y);                // years 0000-0099 would otherwise be read as 1900-1999

        const today = new Date();
        if (date > today) return Result.fail(new ValidationError("Date of birth can't be in the future"));
        if (y < 1900) return Result.fail(new ValidationError("Year must be 1900 or later"));

        return Result.ok(new DOB(date));
    }

    get value(): Date {
        return this._value;
    }

    /**
     * 'YYYY-MM-DD' for storing in a DATE column.
     * Uses LOCAL getters on purpose: the Date above is local midnight, so
     * toISOString() (UTC) would shift the day back by one in timezones ahead of UTC
     * (e.g. Lagos, UTC+1).
     */
    public toDateString(): string {
        const y = String(this._value.getFullYear()).padStart(4, '0');
        const m = String(this._value.getMonth() + 1).padStart(2, '0');
        const d = String(this._value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}