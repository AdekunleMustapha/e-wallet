import { Injectable } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { NigeriaState } from "../../domain/enums";
import { Result } from "src/shared/domain/result";

@Injectable()
export class GetStateUseCase implements UseCase<void, {states: string[]}> {
    
    public async execute(dto: void): Promise<Result<{states: string[]}>> {
        const states = Object.values(NigeriaState);
        return Result.ok({states});
    }
}