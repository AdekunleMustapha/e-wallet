import { Injectable } from "@nestjs/common";
import { bvnHasher } from "../../domain/services/bvn-hasher.port";
import { ConfigService } from "@nestjs/config";
import { Result } from "src/shared/domain/result";
import { BVN, BVNHash } from "../../domain/value-objects";
import crypto from 'crypto';

@Injectable()
export class HmacBVNHasher implements bvnHasher {
    private readonly _pepper: string;

    constructor(config: ConfigService) {
        this._pepper = config.getOrThrow<string>('BVN_PEPPER')
    }

    public hash(bvn: BVN): Result<BVNHash> {
        const bvnValue = bvn.unwrap();
        const bvnHash = crypto.createHmac('sha256', this._pepper).update(bvnValue).digest('hex');
        const result = BVNHash.create(bvnHash);
        if(result.isFailure) return Result.fail(result.error);
        return Result.ok(result.value);
    }
}