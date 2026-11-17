import { Injectable } from "@nestjs/common";
import { IPasswordHasherService } from "../../domain/services/password-hasher.port";
import { ConfigService } from "@nestjs/config";
import { Result } from "src/shared/domain/result";
import { Password, PasswordHash } from "../../domain/value-objects";
import crypto from 'crypto';

@Injectable()
export class HmacPasswordHasher implements IPasswordHasherService {
    private readonly _pepper: string;

    constructor(config: ConfigService) {
        this._pepper = config.getOrThrow<string>("PASSWORD_PEPPER");
    }

    public hash(password: Password): Result<PasswordHash> {
        const passwordValue = password.value;
        const hashValue = crypto.createHmac('sha256', this._pepper).update(passwordValue).digest('hex');
        const result = PasswordHash.create(hashValue);
        if (result.isFailure) {
            return Result.fail(result.error);
        }
        return Result.ok(result.value);
    }
}
