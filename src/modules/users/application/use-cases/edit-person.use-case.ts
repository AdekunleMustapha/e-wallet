import { Injectable, Logger, Inject } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput } from "../dtos";
import { ADDRESS_REPOSITORY, IAddressRepository, IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { BVN, BVNHash, Email, NIN, NINHash } from "../../domain/value-objects";
import { Address } from "../../domain/entities";

export type EditPersonCommand = {
    id: string,
    email: string,
    addressId?: string,
    nin?: string,
    bvn?: string
}

@Injectable()
export class EditPersonUseCase implements UseCase<EditPersonCommand, PersonOutput> {
    private readonly logger = new Logger(EditPersonUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject
    ){}

    public async execute(dto: EditPersonCommand): Promise<Result<PersonOutput>> {
        this.logger.log("Execute edit person use case");

        const id = UniqueId.createFromString(dto.id);

        // get person record
        const personResult = await this.personRepository.getById(id);
        if(personResult.isFailure) return Result.fail(personResult.error);
        const person = personResult.value;

        // validation
        let email: Email | undefined;
        if(dto.email) {
            const emailResult = Email.create(dto.email);
            if(emailResult.isFailure) return Result.fail(emailResult.error);
            email = emailResult.value;
        }

        let addressId: UniqueId | undefined;
        let address: Address | undefined;
        if(dto.addressId) {
            const id = UniqueId.createFromString(dto.addressId);
            const addressResult = await this.addressRepository.getById(id);
            if(addressResult.isFailure) return Result.fail(addressResult.error);
            address = addressResult.value;
            addressId = address.id;
        }

        let ninHash: NINHash | undefined; 
        if(dto.nin) {
            const ninResult = NIN.create(dto.nin);
            if(ninResult.isFailure) return Result.fail(ninResult.error);
            const ninHashResult = this.ninHasher.hash(ninResult.value);
            if(ninHashResult.isFailure) return Result.fail(ninHashResult.error);
            ninHash = ninHashResult.value;
        }

        let bvnHash: BVNHash | undefined;
        if(dto.bvn) {
            const bvnResult = BVN.create(dto.bvn);
            if(bvnResult.isFailure) return Result.fail(bvnResult.error);
            const bvnHashResult = this.bvnHasher.hash(bvnResult.value);
            if(bvnHashResult.isFailure) return Result.fail(bvnHashResult.error);
            bvnHash = bvnHashResult.value;
        }
    }
};