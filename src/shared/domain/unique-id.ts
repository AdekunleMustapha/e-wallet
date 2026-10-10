import { randomUUID } from 'crypto';

/**
 * UniqueId Value Object
 * Represents a unique identifier (UUID)
 */
export class UniqueId {
  private readonly _value: string;

  protected constructor(value: string) {
    this._value = value;
  }

  /**
   * Create a new unique ID
   */
  public static create(id?: string): UniqueId {
    return new UniqueId(id ?? randomUUID());
  }

  /**
   * Create from existing ID string
   */
  public static createFromString(id: string): UniqueId {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid UUID format: ${id}`);
    }

    return new UniqueId(id);
  }

  public get value(): string {
    return this._value;
  }

  public equals(id?: UniqueId): boolean {
    if (!id) {
      return false;
    }
    return this._value === id._value;
  }

  public toString(): string {
    return this._value;
  }
}
