/**
 * Result Pattern Implementation
 * Used for elegant error handling without throwing exceptions
 * Encapsulates success/failure states with type safety
 */

export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _error?: Error;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: Error, value?: T) {
    if (isSuccess && error) {
      throw new Error('Invalid operation: A successful result cannot contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('Invalid operation: A failed result must contain an error');
    }

    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;

    Object.freeze(this);
  }

  /**
   * Create a successful result
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  /**
   * Create a failed result
   */
  public static fail<U>(error: Error): Result<U> {
    return new Result<U>(false, error);
  }

  /**
   * Combine multiple results - fails if any result fails
   */
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok();
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from a failed result. Use error instead.');
    }
    return this._value as T;
  }

  public get error(): Error {
    if (this._isSuccess) {
      throw new Error('Cannot get error from a successful result. Use value instead.');
    }
    return this._error as Error;
  }

  /**
   * Get value or default if failed
   */
  public getValueOrDefault(defaultValue: T): T {
    return this._isSuccess ? (this._value as T) : defaultValue;
  }

  /**
   * Get value or null if failed
   */
  public getValueOrNull(): T | null {
    return this._isSuccess ? (this._value as T) : null;
  }

  /**
   * Map the value if successful
   */
  public map<U>(fn: (value: T) => U): Result<U> {
    if (this._isSuccess) {
      return Result.ok(fn(this._value as T));
    }
    return Result.fail<U>(this._error as Error);
  }

  /**
   * Map the error if failed
   */
  public mapError(fn: (error: Error) => Error): Result<T> {
    if (this.isFailure) {
      return Result.fail<T>(fn(this._error as Error));
    }
    return Result.ok<T>(this._value as T);
  }

  /**
   * Chain result operations (flatMap)
   */
  public async bind<U>(fn: (value: T) => Promise<Result<U>>): Promise<Result<U>> {
    if (this._isSuccess) {
      return fn(this._value as T);
    }
    return Result.fail<U>(this._error as Error);
  }
}
