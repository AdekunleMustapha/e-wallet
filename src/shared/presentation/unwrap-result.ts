import { HttpException, HttpStatus } from "@nestjs/common";
import { AppError, BadGatewayError, ConflictError, ForbiddenError, ServiceUnavailable, UnauthorizedError, UnprocessableEntityError, ValidationError } from "../domain/errors";
import { NotFoundError } from "rxjs";
import { Result } from "../domain/result";

function forStatus(error: AppError): HttpStatus {
    if(error instanceof ValidationError) return HttpStatus.BAD_REQUEST;
    if(error instanceof BadGatewayError) return HttpStatus.BAD_GATEWAY;
    if(error instanceof ServiceUnavailable) return HttpStatus.SERVICE_UNAVAILABLE;
    if(error instanceof ConflictError) return HttpStatus.CONFLICT;
    if(error instanceof ForbiddenError) return HttpStatus.FORBIDDEN;
    if(error instanceof NotFoundError) return HttpStatus.NOT_FOUND;
    if(error instanceof UnauthorizedError) return HttpStatus.UNAUTHORIZED;
    if(error instanceof UnprocessableEntityError) return HttpStatus.UNPROCESSABLE_ENTITY;
    return HttpStatus.INTERNAL_SERVER_ERROR;
}

export function unwrap<T>(result: Result<T>): T {
    if(result.isFailure) {
        const statusCode = forStatus(result.error);
        throw new HttpException({ statusCode, message: result.error.message}, statusCode);
    }
    return result.value;
}