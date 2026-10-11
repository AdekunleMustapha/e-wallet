import { Result } from "src/shared/domain/result";
import { BVN, BVNHash } from "../value-objects";

export const BVN_HASHER = Symbol("BVN_HASHER");

/**
 * BVN hasher interface
 */
export interface bvnHasher {
    hash(bvn: BVN): Result<BVNHash>;
}