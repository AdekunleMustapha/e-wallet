import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { Password } from "../../domain/value-objects";
import { IPasswordHasherService, PASSWORD_HASHER } from "../../domain/services";
import { UnauthorizedError } from "src/shared/domain/errors";

export type ChangePasswordCommand = {
    id: string;
    newPassword: string;
    currentPassword?: string;
};

@Injectable()
export class ChangePasswordUseCase implements UseCase<ChangePasswordCommand, void> {
    private readonly logger = new Logger(ChangePasswordUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasherService,
    ) {}

    public async execute(dto: ChangePasswordCommand): Promise<Result<void>> {
        this.logger.log(`Executing change password use case for person: ${dto.id}`);

        const id = UniqueId.createFromString(dto.id);
        const personResult = await this.personRepository.getById(id);
        if (personResult.isFailure) return Result.fail(personResult.error);
        const person = personResult.value;

        if (dto.currentPassword) {
            const currentPasswordResult = Password.create(dto.currentPassword);
            if (currentPasswordResult.isFailure) return Result.fail(currentPasswordResult.error);

            const currentHashResult = this.passwordHasher.hash(currentPasswordResult.value);
            if (currentHashResult.isFailure) return Result.fail(currentHashResult.error);

            if (!person.passwordHash.compareHash(currentHashResult.value.hash)) {
                return Result.fail(new UnauthorizedError("Current password is incorrect"));
            }
        }

        const newPasswordResult = Password.create(dto.newPassword);
        if (newPasswordResult.isFailure) return Result.fail(newPasswordResult.error);

        const newHashResult = this.passwordHasher.hash(newPasswordResult.value);
        if (newHashResult.isFailure) return Result.fail(newHashResult.error);

        const changeResult = person.changePassword(newHashResult.value);
        if (changeResult.isFailure) return Result.fail(changeResult.error);

        const updateResult = await this.personRepository.update(person);
        if (updateResult.isFailure) return Result.fail(updateResult.error);

        return Result.ok();
    }
}
