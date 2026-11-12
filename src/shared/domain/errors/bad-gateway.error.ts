import { AppError } from "./app-error";

export class BadGatewayError extends AppError {
    constructor(message: string = "Bad gateway") {
        super(message, 502);
    }
}