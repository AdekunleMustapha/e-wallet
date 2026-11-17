import { Result } from "src/shared/domain/result";
import { Password, PasswordHash } from "../value-objects";

export const PASSWORD_HASHER = Symbol("PASSWORD_HASHER");

export interface IPasswordHasherService {

    hash(password: Password): Result<PasswordHash>
}