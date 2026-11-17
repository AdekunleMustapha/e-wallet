import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";

export class PhoneNumber {
    private readonly _phoneNumber: string;

    private constructor(phoneNumber: string) {
        this._phoneNumber = phoneNumber;
    }

    public static create(raw: string): Result<PhoneNumber> {
        const cleaned = raw.trim().replace(/[\s\-().]/g, "");
        if (cleaned.length === 0) return Result.fail(new ValidationError("Phone number can't be empty"));

        let national: string;                         // the 10 digits after the country code
        if (/^\+234\d{10}$/.test(cleaned)) national = cleaned.slice(4);
        else if (/^234\d{10}$/.test(cleaned)) national = cleaned.slice(3);
        else if (/^0\d{10}$/.test(cleaned)) national = cleaned.slice(1);
        else if (/^\d{10}$/.test(cleaned)) national = cleaned;
        else return Result.fail(new ValidationError("Invalid phone number format"));

        // Nigerian mobile numbers start with 7, 8 or 9 (e.g. 701, 802, 903, 811)
        if (!/^[789]\d{9}$/.test(national)) {
            return Result.fail(new ValidationError("Invalid Nigerian mobile number"));
        }

        return Result.ok(new PhoneNumber(`+234${national}`));
    }

    get value(): string {
        return this._phoneNumber;
    }
}
