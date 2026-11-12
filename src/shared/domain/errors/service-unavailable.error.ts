import { AppError } from "./app-error";

export class ServiceUnavailable extends AppError {
    constructor(message: string = "Service unavailable") {
        super(message, 503);
    }
}