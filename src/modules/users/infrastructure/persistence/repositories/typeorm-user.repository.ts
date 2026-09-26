import { Repository } from "typeorm";
import { User } from "../../../domain/entities/user.entity.js";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface.js";
import { UserORMEntity } from "../entities/user.orm-entity.js";


/**
 * Repository that is used by application use cases while it ties down to entities
 * and possibly sql scripts for operation, implements user repository interface
 */
export class TypeOrmUserRepository implements IUserRepository {

    constructor(
        private readonly repository: Repository<UserORMEntity>
    ){}

    public async save(user: User): Promise<void> {

        console.log("Testing... Save user");

        return;
    }

    public async update(user: User): Promise<void> {
        
        console.log("Testing... updating user");

        return;
    }
}