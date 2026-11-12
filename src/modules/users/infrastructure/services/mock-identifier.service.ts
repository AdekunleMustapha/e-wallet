import { Injectable, Logger } from "@nestjs/common";
import { IIdentificationService, VerificationResponse } from "../../domain/services";
import { Result } from "src/shared/domain/result";

/**
 * Mock identifier that returns true all the time for any form of verification
 * Not external call, just returns the input value. CAn be adjusted to mock failures
 */
@Injectable()
export class MockIdentifier implements IIdentificationService {
    private readonly logger = new Logger(MockIdentifier.name);

    public async verifyBVN(bvn: string): Promise<Result<VerificationResponse>> {
        this.logger.log("Verify bvn mock service hit!");

        return Result.ok({
            age: 20,
            firstName: "",
            lastName: "",
            middleName: "",
        });
    }

    public async verifyNIN(nin: string): Promise<Result<VerificationResponse>> {
        this.logger.log("Verify nin mock service hit!");

        return Result.ok({
            age: 20,
            firstName: "",
            lastName: "",
            middleName: "",
        });
    }
}