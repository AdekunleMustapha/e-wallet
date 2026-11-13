import { IsNotEmpty, IsUUID } from "class-validator";

export class IdParamRequest {
    @IsUUID()
    @IsNotEmpty()
    id!: string;
}
