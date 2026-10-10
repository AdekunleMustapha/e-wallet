import { UniqueId } from './unique-id';

/**
 * Base Entity class
 * All domain entities should extend this class
 */
export abstract class BaseEntity<T = any> {
  protected readonly _id: UniqueId;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  private _domainEvents: any[] = [];

  constructor(props: { id?: UniqueId; createdAt?: Date; updatedAt?: Date }) {
    this._id = props.id ?? UniqueId.create();
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get id(): UniqueId {
    return this._id;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  protected updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  /**
   * Add domain event
   */
  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  /**
   * Get all domain events
   */
  public getDomainEvents(): any[] {
    return this._domainEvents;
  }

  /**
   * Clear domain events
   */
  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Check equality based on ID
   */
  public equals(entity?: BaseEntity<T>): boolean {
    if (!entity) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id.equals(entity._id);
  }
}
