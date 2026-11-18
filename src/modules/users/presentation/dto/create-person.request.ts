import { IsEmail, IsEnum, IsLowercase, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { DOB_PATTERN } from "./dob";
import { Country, Gender, NigeriaState } from "../../domain/enums";
import { TitleCase } from "src/shared/presentation/transform";

export class CreatePersonRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    lastName!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    middleName?: string;

    @Matches(DOB_PATTERN, { message: 'dob must be in the format "YYYY-MM-DD"' })
    dob!: string;

    @IsNotEmpty()
    @MaxLength(255)
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber!: string;

    @IsEnum(Gender)
    gender!: Gender;

    @TitleCase()
    @IsEnum(Country)
    country!: Country;

    @TitleCase()
    @IsEnum(NigeriaState)
    state!: NigeriaState;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    addressLine1!: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    postalCode?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    password!: string;
}
