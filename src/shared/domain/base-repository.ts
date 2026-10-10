import { Result } from './result';
import { BaseEntity } from './base-entity';
import { UniqueId } from './unique-id';

/**
 * Base Repository Interface
 * All repositories should extend this interface
 */
export interface IBaseRepository<T extends BaseEntity> {
  /**
   * Save a new entity
   */
  save(entity: T): Promise<Result<T>>;

  /**
   * Find entity by ID
   */
  findById(id: UniqueId): Promise<Result<T>>;

  /**
   * Update existing entity
   */
  update(entity: T): Promise<Result<T>>;

  /**
   * Delete entity by ID
   */
  delete(id: UniqueId): Promise<Result<void>>;

  /**
   * Check if entity exists by ID
   */
  exists(id: UniqueId): Promise<boolean>;
}
