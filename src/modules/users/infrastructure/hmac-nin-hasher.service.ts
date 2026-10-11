import { Injectable } from "@nestjs/common";
import { NINHasher } from "../domain/services/nin-hasher.port";
import { ConfigService } from "@nestjs/config";
import { Result } from "src/shared/domain/result";
import { NIN, NINHash } from "../domain/value-objects";
import crypto from 'crypto';

/**
 * NIN hasher using crypto hmac algorithm
 */
@Injectable()
export class HmacNINHasher implements NINHasher{
    private readonly _pepper: string;

    constructor(config: ConfigService){
        this._pepper = config.getOrThrow<string>("NIN_PEPPER");
    }

    public hash(nin: NIN): Result<NINHash> {
        const ninValue = nin.unwrap();
        const hashValue = crypto.createHmac('sha256', this._pepper).update(ninValue).digest('hex');
        const result = NINHash.create(hashValue);
        if(result.isFailure) {
            return Result.fail(result.error);
        }
        return Result.ok(result.value);
    }
}