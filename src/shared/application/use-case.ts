import { Result } from "../domain/result";

/**
 * One use case = one thing a user of the system can do.
 * Input and output are plain data (no entities, no value objects), so the
 * presentation layer never has to know what the domain looks like.
 * A use case NEVER throws for expected failures: it returns Result.fail(AppError).
 */
export interface UseCase<TInput, TOutput> {
    execute(dto: TInput): Promise<Result<TOutput>>
}