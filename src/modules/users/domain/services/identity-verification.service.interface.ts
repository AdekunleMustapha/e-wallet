import { Result } from "src/shared/domain/result";

type verificationDetails = {
    nin: string,
    dob: string,
    firstName: string,
    lastName: string
}

type verificationResponse = {
    firstName: string,
    lastName: string 
}

export const IDENTITY_VERIFICATION_SERVICE = Symbol("IDENTITY_VERIFICATION_SERVICE");

export interface IIdentificationService {

    /**
     * Result.ok()                  -> the provider confirmed the NIN belongs to this person 
     * and returns proper legal user arranged name
     * Result.fail(ValidationError) -> the provider answered and the details do NOT match
     * Result.fail(InternalError)   -> the provider was unreachable / timed out / errored
     */
    verifyNIN(props: verificationDetails): Promise<Result<verificationResponse>>;

    verifyBVN(props: verificationDetails): Promise<Result<verificationResponse>>;
}