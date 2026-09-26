import { User } from "../entities/user.entity.js";

/**
 * User Repository Interface
 */
export interface IUserRepository {
    
    save(user: User): Promise<void>;

    update(user: User): Promise<void>;
}