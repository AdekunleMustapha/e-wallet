import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LinkBvnRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'bvn must be 11 digits' })
    bvn!: string;
}
