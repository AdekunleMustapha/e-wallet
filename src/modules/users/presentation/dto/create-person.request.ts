import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from "class-validator"
import { DOB_PATTERN } from "./dob";

export class CreatePersonRequest {
    @IsString() @IsNotEmpty() @MaxLength(255)
    firstName!: string;

    @IsString() @IsNotEmpty() @MaxLength(255)
    lastName!: string;

    @Matches(DOB_PATTERN, { message: 'dob must be in the format "YYYY-MM-DD'})
    dob!: string;

    @IsNotEmpty() @MaxLength(255) @IsEmail()
    email!: string;

    @IsUUID() @IsNotEmpty()
    genderId!:string;

    @IsUUID()
    addressId?: string
}