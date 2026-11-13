import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LinkNinRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'nin must be 11 digits' })
    nin!: string;
}
