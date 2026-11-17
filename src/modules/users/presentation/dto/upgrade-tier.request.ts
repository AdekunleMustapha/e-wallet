import { IsEnum, IsNotEmpty } from "class-validator";
import { Tier } from "../../domain/enums";

export class UpgradeTierRequest {
    @IsNotEmpty()
    @IsEnum(Tier)
    tier!: Tier;
}
