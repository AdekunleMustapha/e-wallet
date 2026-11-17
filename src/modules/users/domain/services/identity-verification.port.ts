import { Result } from "src/shared/domain/result";

export type VerificationResponse = {
    firstName: string,
    middleName: string,
    lastName: string,
    age: number,
    dob?: string,
    address?: string
}

export const IDENTITY_VERIFICATION_SERVICE = Symbol("IDENTITY_VERIFICATION_SERVICE");

export interface IIdentificationService {

    /**
     * Result.ok()                  -> the provider confirmed the NIN belongs to this person 
     * and returns proper legal user arranged name
     * Result.fail(ValidationError) -> the provider answered and the details do NOT match
     * Result.fail(InternalError)   -> the provider was unreachable / timed out / errored
     */
    verifyNIN(nin: string): Promise<Result<VerificationResponse>>;

    verifyBVN(bvn: string): Promise<Result<VerificationResponse>>;
}