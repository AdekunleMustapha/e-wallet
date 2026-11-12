import { Inject, Injectable, Logger } from "@nestjs/common";
import { IIdentificationService, VerificationResponse } from "../../domain/services";
import { Result } from "src/shared/domain/result";
import identityConfig from "../config/identity.config";
import { ConfigType } from "@nestjs/config";
import axios from "axios";
import { BadGatewayError, NotFoundError, ServiceUnavailable } from "src/shared/domain/errors";

type RequestBody = {
    idType: "nin" | "bvn",
    mode: "lookup" | "verify",
    idNumber: string,
    level: "basic" | "advanced"
}

@Injectable()
export class NinjaIdentifierService implements IIdentificationService {
    private readonly logger = new Logger(NinjaIdentifierService.name);

    constructor(
        @Inject(identityConfig.KEY)
        private readonly config: ConfigType<typeof identityConfig>
    ) {}

    public async verifyBVN(bvn: string): Promise<Result<VerificationResponse>> {
        try {
            const reference = crypto.randomUUID();
            const requestBody: RequestBody = {
                idType: "bvn",
                idNumber: bvn,
                level: "basic",
                mode: "lookup"
            };

            const response = await axios.post(`${this.config.baseUrl}/api/identity/identify`, requestBody, {
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-Reference': reference
                }}
            );
            if(response.status == 404 || response.data.status != "found") return Result.fail(new NotFoundError("BVN not found"));
            if(response.headers["x-reference"] !== reference) return Result.fail(new BadGatewayError("Invalid x-reference signature"));

            const data = response.data.data;
            return Result.ok({
                firstName: data.first_name,
                middleName: data.middle_name,
                lastName: data.last_name,
                age: Number(data.age),
                address: data.address_line,
                dob: data.date_of_birth
            });
        } catch (error) {
            this.logger.error("Error verifying user identity by bvn", 
                error instanceof Error? error.message : String(error)
            );
            return Result.fail(new ServiceUnavailable("Identifier service unavailable"));
        } 
    }

    public async verifyNIN(nin: string): Promise<Result<VerificationResponse>> {
        try {
            const reference = crypto.randomUUID();
            const requestBody: RequestBody = {
                idType: "nin",
                idNumber: nin,
                level: "basic",
                mode: "lookup"
            };

            const response = await axios.post(`${this.config.baseUrl}/api/identity/identify`, requestBody, {
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-Reference': reference
                }}
            );
            if(response.status == 404 || response.data.status != "found") return Result.fail(new NotFoundError("BVN not found"));
            if(response.headers["x-reference"] !== reference) return Result.fail(new BadGatewayError("Invalid x-reference signature"));

            const data = response.data.data;
            return Result.ok({
                firstName: data.first_name,
                middleName: data.middle_name,
                lastName: data.last_name,
                age: Number(data.age),
                address: data.address_line,
                dob: data.date_of_birth
            });
        } catch (error) {
            this.logger.error("Error verifying user identity by nin", 
                error instanceof Error? error.message : String(error)
            );
            return Result.fail(new ServiceUnavailable("Identifier service unavailable"));
        } 
    }
}