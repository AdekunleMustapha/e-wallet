import { Result } from "src/shared/domain/result";
import { Gender } from "../entities";
import { UniqueId } from "src/shared/domain/unique-id";

export interface IGenderRepository {

    save(gender: Gender): Promise<Result<Gender>>;

    update(gender: Gender): Promise<Result<Gender>>;

    getById(id: UniqueId): Promise<Result<Gender>>;

    getAll(): Promise<Result<Gender[]>>;

    delete(id: UniqueId): Promise<Result<void>>;
}