import { Result } from "src/shared/domain/result";
import { NIN, NINHash } from "../value-objects";

export const NIN_HASHER = Symbol("NIN_HASHER");

/**
 * NIN Hasher interface
 */
export interface NINHasher {
    hash(nin: NIN): Result<NINHash>;
}