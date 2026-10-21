import { Logger } from "@nestjs/common";
import { AppError, ConflictError, InternalError } from "src/shared/domain/errors";
import { QueryFailedError } from "typeorm";

const logger = new Logger('Database');

/**
 * Turns anything thrown by TypeORM/MySQL (or by a mapper) into
 * AppErrors, so repositories can return Result.fail(...) instead of throwing.
 *
 * - Duplicate key (unique index)  -> ConflictError (409)
 * - Everything else               -> InternalError (500), logged with the stack.
 *   The SQL / driver message is never put in the error that travels upward,
 *   because it can contain table names and values.
 */
export function translateDBErrors (error: unknown, action: string): AppError {
    if(error instanceof QueryFailedError) {
        const code = (error.driverError as { code?: string } | undefined)?.code;
        if (code === 'ER_DUP_ENTRY') {
            return new ConflictError(`Could not ${action}: a record with the same unique value already exists`);
        }
    }
    logger.error(`Failed to ${action}`, error instanceof Error ? error.stack : String(error));
    return new InternalError(`Failed to ${action}`);
}
